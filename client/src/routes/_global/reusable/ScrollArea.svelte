<script module>
	let osInstance = $state() as OverlayScrollbars;
	export const setOptions = (opt: PartialOptions) => osInstance.options(opt);
	export const getElement = () => osInstance.elements().viewport;
</script>

<script lang="ts">
	import { onMount } from 'svelte';
	import { OverlayScrollbars, type PartialOptions } from 'overlayscrollbars';

	const {
		children,
		onScroll = () => {},
		shadowOnScroll = false,
		class: className = '',
		id = ''
	} = $props();

	let element = $state() as HTMLElement;
	let scrolled = $state(false);

	const onscroll = (_: never | OverlayScrollbars, e: Event): null => {
		const { scrollTop } = e.target as HTMLElement;
		scrolled = scrollTop > 0;
		onScroll(e);
		return null;
	};

	onMount(() => {
		osInstance = OverlayScrollbars(
			element,
			{ scrollbars: { theme: 'os-theme-dark' } },
			{ scroll: onscroll }
		);
	});
</script>

<div class="size-full {className}" {id} bind:this={element}>
	{#if shadowOnScroll}
		<div
			class:opacity-0={!scrolled}
			class="sticky top-0 left-0 -my-1 h-3 w-full bg-gradient-to-b from-black/15 to-transparent transition-opacity duration-300"
		></div>
	{/if}

	{@render children()}
</div>

<style lang="postcss">
	@import 'tailwindcss/theme' theme(reference);

	:global {
		.os-scrollbar-track {
			@apply relative;
			&::after {
				content: '';
				@apply bg-amber-900 rounded-none top-0 left-1/2 -translate-x-1/2 h-full w-[2px] absolute -z-1;
			}
		}

		.os-scrollbar-handle {
			--os-handle-max-size: 4rem;
			@apply rounded-none bg-amber-900;
		}
	}
</style>
