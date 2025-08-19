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
		duration = 300
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
	import { onMount } from 'svelte';
	import { OverlayScrollbars, type PartialOptions } from 'overlayscrollbars';

	const {
		children,
		onScroll = () => {},
		shadowOnScroll = false,
		class: className = '',
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

	const handleWheel = (e: WheelEvent) => {
		if (e.deltaY !== 0) {
			const parent = getElement(osID);
			if (!parent) return;
			parent.scrollLeft += e.deltaY / 4;
			e.preventDefault();
		}
	};

	onMount(() => {
		if (!element) return;
		osInstance[osID] = OverlayScrollbars(
			element,
			{ scrollbars: { theme: 'os-theme-dark' } },
			{ scroll: onscroll }
		);

		// convert vertical wheel -> horizontal scroll
		if (!horizontal) return;
		const viewport = osInstance[osID].elements().viewport;
		viewport.addEventListener('wheel', handleWheel, { passive: false });
	});

	$effect(() => () => {
		if (!osInstance) return;
		if (!horizontal) return;
		const viewport = osInstance[osID].elements().viewport;
		viewport.removeEventListener('wheel', handleWheel);
		osInstance[osID].destroy();
	});
</script>

<div class="size-full {className}" id={osID} bind:this={element}>
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
		.os-scrollbar-vertical .os-scrollbar-track {
			@apply relative;
			&::after {
				content: '';
				@apply bg-amber-900 rounded-none top-0 left-1/2 -translate-x-1/2 h-full w-[2px] absolute -z-1;
			}
		}

		.os-scrollbar-horizontal .os-scrollbar-track {
			@apply relative;
			&::after {
				content: '';
				@apply bg-amber-900 rounded-none top-1/2 left-0 -translate-y-1/2 w-full h-[2px] absolute -z-1;
			}
		}

		.os-scrollbar-handle {
			--os-handle-max-size: 4rem;
			@apply rounded-none bg-amber-900;
		}
	}
</style>
