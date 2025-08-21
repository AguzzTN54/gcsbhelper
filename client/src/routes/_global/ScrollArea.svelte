<script lang="ts">
	import { onMount } from 'svelte';
	import { OverlayScrollbars } from 'overlayscrollbars';

	const { children, onScroll = () => {}, shadowOnScroll = false } = $props();

	let element = $state() as HTMLElement;
	let scrolled = $state(false);

	const onscroll = (_: never | OverlayScrollbars, e: Event): null => {
		const { scrollTop } = e.target as HTMLElement;
		scrolled = scrollTop > 0;
		onScroll(e);
		return null;
	};

	onMount(() => {
		OverlayScrollbars(element, { scrollbars: { theme: 'os-theme-dark' } }, { scroll: onscroll });
	});
</script>

<div class="size-full" bind:this={element}>
	{@render children()}
</div>
