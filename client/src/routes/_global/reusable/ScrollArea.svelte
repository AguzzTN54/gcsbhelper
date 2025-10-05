<script module>
	const osInstance = $state<Record<string, OverlayScrollbars>>({});
	export const setOptions = (id: string, opt: PartialOptions) => osInstance[id]?.options(opt);
	export const getElement = (id: string) => osInstance[id]?.elements().viewport;

	export const getTargetPosition = (
		id: string,
		targetSelector: string
	): { x: number; y: number } => {
		if (!id) return { x: 0, y: 0 };

		const targetEl = document.querySelector(targetSelector) as HTMLElement;
		const scrollEl = getElement(id);
		if (!(targetEl && scrollEl)) return { x: 0, y: 0 };

		const { top: areaTop, left: areaLeft } = scrollEl.getBoundingClientRect();
		const { top: targetTop, left: targetLeft } = targetEl.getBoundingClientRect();
		const x = targetLeft - areaLeft;
		const y = targetTop - areaTop;
		return { x, y };
	};

	interface Position {
		isVisible: boolean;
		intersectionRatio: number;
	}

	type Callback = (
		pos: Position,
		observer: IntersectionObserver,
		entry: IntersectionObserverEntry
	) => void;

	export function watchTargetPosition(
		selector: string | HTMLElement,
		options: IntersectionObserverInit = {},
		callback: Callback
	): {
		observer: IntersectionObserver;
		stop: () => void;
		getPosition: () => Position;
	} {
		const target = typeof selector !== 'string' ? selector : document.querySelector(selector);
		if (!target) throw new Error('Target element not found');

		const currentPosition: Position = {
			isVisible: false,
			intersectionRatio: 0
		};

		const observer = new IntersectionObserver((entries) => {
			entries.forEach((entry) => {
				currentPosition.isVisible = entry.isIntersecting;
				currentPosition.intersectionRatio = entry.intersectionRatio;
				callback(currentPosition, observer, entry);
			});
		}, options);

		observer.observe(target);

		return {
			observer,
			stop: () => observer.unobserve(target!),
			getPosition: () => ({ ...currentPosition })
		};
	}

	type SmoothScrollParams = {
		id: string;
		targetPosition: { x: number; y: number };
		duration?: number;
		startPosition?: { x: number; y: number };
	};

	export const smoothScroll = ({
		id,
		targetPosition,
		startPosition,
		duration = 500
	}: SmoothScrollParams) => {
		const scrollArea = getElement(id);
		const start = startPosition || { x: scrollArea.scrollLeft, y: scrollArea.scrollTop };
		const distance = {
			x: targetPosition.x - start.x,
			y: targetPosition.y - start.y
		};
		let startTime: number | null = null;

		const animation = (currentTime: number) => {
			if (startTime === null) startTime = currentTime;
			const timeElapsed = currentTime - startTime;
			const progress = Math.min(timeElapsed / duration, 1);

			const ease = progress < 0.5 ? 2 * progress * progress : -1 + (4 - 2 * progress) * progress;
			const newX = start.x + distance.x * ease;
			const newY = start.y + distance.y * ease;
			scrollArea.scrollTo({ left: newX, top: newY });
			if (timeElapsed < duration) {
				requestAnimationFrame(animation);
			}
		};

		requestAnimationFrame(animation);
	};
</script>

<script lang="ts">
	import { page } from '$app/state';
	import { onMount } from 'svelte';
	import { OverlayScrollbars, type PartialOptions } from 'overlayscrollbars';

	const {
		children,
		onScroll = () => {},
		shadowOnScroll = false,
		class: className = '',
		style = '',
		horizontal = false,
		id = ''
	} = $props();

	let element = $state<HTMLElement>();
	let scrolled = $state(false);
	const osID = id || Object.keys(osInstance || {}).length.toString();

	const onscroll = (_: never | OverlayScrollbars, e: Event): null => {
		const { scrollTop } = e.target as HTMLElement;
		scrolled = scrollTop > 0;
		onScroll(e);
		return null;
	};

	let currentPos = $state(0);
	let targetPos = $state(0);
	let isAnimating = $state(false);
	const ease = $state(0.12); // smoothness factor

	const animateWheelScroll = (scrollArea: HTMLElement, horizontal: boolean) => {
		if (!isAnimating) {
			isAnimating = true;
			const step = () => {
				currentPos += (targetPos - currentPos) * ease;

				if (horizontal) {
					scrollArea.scrollLeft = currentPos;
				} else {
					scrollArea.scrollTop = currentPos;
				}

				// only stop when really close to target (or at edges)
				if (Math.abs(targetPos - currentPos) > 0.5) {
					requestAnimationFrame(step);
				} else {
					currentPos = targetPos; // snap final small gap
					if (horizontal) scrollArea.scrollLeft = currentPos;
					else scrollArea.scrollTop = currentPos;
					isAnimating = false;
				}
			};
			requestAnimationFrame(step);
		}
	};

	const handleWheel = (e: WheelEvent) => {
		e.preventDefault();
		const parent = getElement(osID);
		if (!parent) return;

		// init if fresh
		if (!isAnimating) {
			currentPos = horizontal ? parent.scrollLeft : parent.scrollTop;
			targetPos = currentPos;
		}

		let delta = 0;

		if (horizontal) {
			// allow both vertical wheel (deltaY) and real horizontal wheel (deltaX)
			delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
		} else {
			delta = e.deltaY;
		}

		// accumulate target
		targetPos += delta;

		// Clamp target within scroll bounds
		const maxScroll = horizontal
			? parent.scrollWidth - parent.clientWidth
			: parent.scrollHeight - parent.clientHeight;

		targetPos = Math.max(0, Math.min(targetPos, maxScroll));

		animateWheelScroll(parent, horizontal);
	};

	let touchStart = $state(0);
	let lastTime = 0;
	let isTouching = false;
	let velocitySamples: number[] = [];
	const fingerStopThreshold = 0.2;

	const handleTouchStart = (e: TouchEvent) => {
		const parent = getElement(osID);
		if (!parent) return;

		currentPos = horizontal ? parent.scrollLeft : parent.scrollTop;
		targetPos = currentPos;

		touchStart = horizontal ? e.touches[0].clientX : e.touches[0].clientY;
		lastTime = performance.now();
		velocitySamples = [];
		isTouching = true;
	};

	const handleTouchMove = (e: TouchEvent) => {
		const parent = getElement(osID);
		if (!parent) return;

		e.preventDefault();

		const now = performance.now();
		const dt = now - lastTime || 16;
		lastTime = now;

		const pos = horizontal ? e.touches[0].clientX : e.touches[0].clientY;
		const delta = touchStart - pos;
		touchStart = pos;

		const v = delta / dt;
		velocitySamples.push(v);
		if (velocitySamples.length > 5) velocitySamples.shift(); // keep last 5

		// follow finger
		targetPos += delta;

		const maxScroll = horizontal
			? parent.scrollWidth - parent.clientWidth
			: parent.scrollHeight - parent.clientHeight;
		targetPos = Math.max(0, Math.min(targetPos, maxScroll));

		if (horizontal) parent.scrollLeft = targetPos;
		else parent.scrollTop = targetPos;
	};

	const handleTouchEnd = () => {
		isTouching = false;

		const parent = getElement(osID);
		if (!parent) return;

		currentPos = horizontal ? parent.scrollLeft : parent.scrollTop;

		// ✅ Check the last movement: if the finger stopped, do not apply inertia
		const lastMovement = velocitySamples[velocitySamples.length - 1] || 0;
		if (Math.abs(lastMovement) < fingerStopThreshold) return; // finger already stopped

		// Average velocity from recent samples
		const avgVelocity = velocitySamples.reduce((a, b) => a + b, 0) / velocitySamples.length || 0;
		if (Math.abs(avgVelocity) < 0.05) return; // too small, ignore

		let velocity = avgVelocity * 35; // scale factor
		const decay = 0.95;

		const step = () => {
			if (isTouching) return;

			velocity *= decay;
			if (Math.abs(velocity) < 0.2) return;

			const maxScroll = horizontal
				? parent.scrollWidth - parent.clientWidth
				: parent.scrollHeight - parent.clientHeight;

			targetPos = Math.max(0, Math.min(targetPos + velocity, maxScroll));

			animateWheelScroll(parent, horizontal);
			requestAnimationFrame(step);
		};

		requestAnimationFrame(step);
	};

	onMount(() => {
		if (!element) return;
		osInstance[osID] = OverlayScrollbars(
			element,
			{
				scrollbars: {
					theme: 'os-theme-dark',
					autoHide: page.route.id?.includes('/juaragcp') ? 'scroll' : undefined
				}
			},
			{ scroll: onscroll }
		);

		const viewport = osInstance[osID].elements().viewport;
		viewport.addEventListener('wheel', handleWheel, { passive: false });
		viewport.addEventListener('touchstart', handleTouchStart, { passive: false });
		viewport.addEventListener('touchmove', handleTouchMove, { passive: false });
		viewport.addEventListener('touchend', handleTouchEnd, { passive: false });
		viewport.addEventListener('touchcancel', handleTouchEnd, { passive: false });
	});

	$effect(() => () => {
		if (!osInstance) return;
		if (!horizontal) return;
		const viewport = osInstance[osID].elements().viewport;
		viewport.removeEventListener('wheel', handleWheel);
		viewport.removeEventListener('touchstart', handleTouchStart);
		viewport.removeEventListener('touchmove', handleTouchMove);
		viewport.removeEventListener('touchend', handleTouchEnd);
		viewport.removeEventListener('touchcancel', handleTouchEnd);
		osInstance[osID].destroy();
	});
</script>

<div class="size-full {className}" {style} id={osID} bind:this={element}>
	{#if shadowOnScroll}
		<div
			class:opacity-0={!scrolled}
			class="sticky top-0 left-0 -my-1 h-3 w-full bg-gradient-to-b from-black/15 to-transparent transition-opacity duration-300"
		></div>
	{/if}

	{@render children?.()}
</div>

<style lang="postcss">
	@import 'tailwindcss/theme' theme(reference);

	:global {
		#arcade .os-scrollbar-vertical .os-scrollbar-track {
			@apply relative;
			&::after {
				content: '';
				@apply absolute top-0 left-1/2 -z-1 h-full w-[2px] -translate-x-1/2 rounded-none bg-amber-900;
			}
		}

		#arcade .os-scrollbar-horizontal .os-scrollbar-track {
			@apply relative;
			&::after {
				content: '';
				@apply absolute top-1/2 left-0 -z-1 h-[2px] w-full -translate-y-1/2 rounded-none bg-amber-900;
			}
		}

		.os-scrollbar-handle {
			--os-handle-max-size: 4rem;
			@apply rounded-none bg-amber-900;
		}
	}
</style>
