<script module>
	const osInstance = $state<Record<string, OverlayScrollbars>>({});
	export const setOptions = (id: string, opt: PartialOptions) => osInstance[id]?.options(opt);
	export const getScrollContainer = (id: string) => osInstance[id]?.elements().viewport;

	const lenisInstance = $state<Record<string, Lenis>>({});
	export const getLenis = (id: string) => lenisInstance[id];

	export const getTargetPosition = (
		id: string,
		targetSelector: string
	): { x: number; y: number } => {
		if (!id) return { x: 0, y: 0 };

		const targetEl = document.querySelector(targetSelector) as HTMLElement;
		const scrollEl = getScrollContainer(id);
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
</script>

<script lang="ts">
	import { onMount } from 'svelte';
	import Lenis from 'lenis';
	import { OverlayScrollbars, type PartialOptions } from 'overlayscrollbars';

	const {
		children,
		onScroll = () => {},
		shadowOnScroll = false,
		class: className = '',
		style = '',
		horizontal = false,
		id = '',
		onLenisLoaded = () => {},
		wrapperClass = ''
	} = $props();

	let element = $state<HTMLElement>();
	let inner = $state<HTMLElement>();
	let scrolled = $state(false);
	const propid = $props.id();
	const osID = $derived(id || propid);

	const onscroll = (_: never | OverlayScrollbars, e: Event): null => {
		const { scrollTop } = e.target as HTMLElement;
		scrolled = scrollTop > 0;
		onScroll(e);
		return null;
	};

	// save & restore Scroll Postion
	// const getKey = (url: URL) => `scroll-pos:${osID}:${url.pathname}`;
	// let currentKey = $state<string>();
	// let firstload = $state<boolean>(true);

	onMount(() => {
		if (!element) return;
		osInstance[osID] = OverlayScrollbars(
			element,
			{ scrollbars: { theme: 'os-theme-dark' } },
			{ scroll: onscroll }
		);

		const viewport = osInstance[osID].elements().viewport;
		lenisInstance[osID] = new Lenis({
			wrapper: viewport,
			smoothWheel: true,
			lerp: 0.1,
			duration: 1.2,
			easing: (e) => Math.min(1, 1.001 - Math.pow(2, -10 * e)),
			syncTouch: false,
			orientation: horizontal ? 'horizontal' : 'vertical',
			gestureOrientation: 'vertical',
			wheelMultiplier: 1,
			touchMultiplier: 1,
			infinite: false,
			anchors: true,
			autoResize: true,
			overscroll: false,
			autoRaf: false
		});

		const raf = (time: number) => {
			lenisInstance[osID].raf(time);
			requestAnimationFrame(raf);
		};
		requestAnimationFrame(raf);

		if (inner) {
			const ro = new ResizeObserver(() => {
				requestAnimationFrame(() => {
					lenisInstance[osID].resize();
				});
			});
			ro.observe(inner);
		}

		onLenisLoaded?.();
		return () => {
			osInstance[osID]?.destroy();
			lenisInstance[osID]?.destroy();
		};
	});
</script>

<div class="size-full {className}" {style} id={osID} bind:this={element}>
	{#if shadowOnScroll}
		<div
			class:opacity-0={!scrolled}
			class="sticky top-0 left-0 -my-1 h-3 w-full bg-gradient-to-b from-black/15 to-transparent transition-opacity duration-300"
		></div>
	{/if}

	<div bind:this={inner} class="{wrapperClass} w-full">
		{@render children?.()}
	</div>
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
