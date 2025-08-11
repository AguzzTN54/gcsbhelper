<script module>
	let osInstance = $state() as OverlayScrollbars;
	export const setOptions = (opt: PartialOptions) => osInstance.options(opt);
	export const getElement = () => osInstance.elements().viewport;
</script>

<script lang="ts">
	import { onMount } from 'svelte';
	import { OverlayScrollbars, type PartialOptions } from 'overlayscrollbars';

	const { children, onScroll = () => {}, shadowOnScroll = false } = $props();

	let element = $state() as HTMLElement;
	let scrolled = $state(false);

	const onscroll = (_: never | OverlayScrollbars, e: Event): null => {
		const { scrollTop } = e.target as HTMLElement;
		scrolled = scrollTop > 0;
		onScroll(e);
		return null;
	};

	let loaded = $state(false);
	onMount(() => {
		osInstance = OverlayScrollbars(
			element,
			{ scrollbars: { theme: 'os-theme-dark', autoHide: 'scroll' } },
			{ scroll: onscroll }
		);
		loaded = true;
	});

	$effect(() => {
		if (!loaded) return;
		setOptions({ scrollbars: { autoHide: 'scroll' } });
	});
</script>

<div class="size-full" bind:this={element}>
	{#if shadowOnScroll}
		<div
			class:opacity-0={!scrolled}
			class="sticky top-0 left-0 -my-1 h-3 w-full bg-gradient-to-b from-black/15 to-transparent transition-opacity duration-300"
		></div>
	{/if}

	{@render children()}
</div>
