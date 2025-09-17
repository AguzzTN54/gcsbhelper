<script lang="ts">
	import { onMount, setContext } from 'svelte';
	import 'overlayscrollbars/overlayscrollbars.css';
	import 'swiper/css';
	import '../app.css';
	import { screenSize } from '$lib/stores/app.svelte';
	import splash from '$img/splash5.webp';
	import ScrollArea from '$reusable/ScrollArea.svelte';
	import Loading from '$reusable/Loading.svelte';
	import Footer from './_global/Footer.svelte';

	const { children } = $props();
	let innerHeight = $state(0);
	let innerWidth = $state(0);
	const screenHeight = $derived(innerHeight ? `${innerHeight}px` : '100vh');
	$effect(() => screenSize.set({ width: innerWidth, height: innerHeight }));

	let loaded = $state(false);
	setContext('loaded', () => (loaded = true));

	onMount(() => {
		if (!('serviceWorker' in navigator)) {
			console.error('Service workers are not supported.');
			return;
		}
		navigator.serviceWorker.register('/sw.js');
	});
</script>

<svelte:window bind:innerHeight bind:innerWidth />

{#if !loaded}
	<div class="flex justify-center flex-col items-center size-full fixed bg-white z-150">
		<Loading />
		<span class="mt-4 block text-sm text-slate-600"> Wait for a second.. </span>
	</div>
{/if}

<main
	class="h-[var(--screen-height)] w-screen flex flex-col relative"
	style="--screen-height:{screenHeight};--screen-width:{innerWidth}px;"
>
	<img
		src={splash}
		alt="splash"
		class="size-full object-cover absolute left-0 -z-1 top-0 pointer-events-none"
	/>
	<ScrollArea id="main">
		{@render children()}
	</ScrollArea>
	<Footer />
</main>
