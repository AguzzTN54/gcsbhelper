<script lang="ts">
	import { page } from '$app/state';
	import { onMount, setContext } from 'svelte';
	import 'overlayscrollbars/overlayscrollbars.css';
	import 'swiper/css';
	import '../app.css';
	import { screenSize } from '$lib/stores/app.svelte';
	import Loading from '$reusable/Loading.svelte';
	import Footer from './_global/Footer.svelte';

	const { children } = $props();
	let innerHeight = $state(0);
	let innerWidth = $state(0);
	const screenHeight = $derived(innerHeight ? `${innerHeight}px` : '100vh');
	$effect(() => screenSize.set({ width: innerWidth, height: innerHeight }));
	const id = $derived(page.route.id?.includes('/arcade') ? 'arcade' : 'juaragcp');

	let loaded = $state(false);
	setContext('loaded', () => (loaded = true));
	onMount(() => {
		if (!('serviceWorker' in navigator)) {
			console.error('Service workers are not supported.');
			return;
		}
		navigator.serviceWorker.register('/sw.js');
		if (!page.url.pathname.startsWith('/arcade')) {
			loaded = true;
		}
	});
</script>

<svelte:head>
	<title>CloudSkillBoost Helper Tools</title>
</svelte:head>

<svelte:window bind:innerHeight bind:innerWidth />

{#if !loaded}
	<div class="fixed z-150 flex size-full flex-col items-center justify-center bg-white">
		<Loading />
		<span class="mt-4 block text-sm text-slate-600"> Wait for a second.. </span>
	</div>
{/if}

<main
	{id}
	class="relative flex h-[var(--screen-height)] w-screen flex-col
	font-{id === 'arcade' ? 'brutal' : 'main'}"
	style="--screen-height:{screenHeight};--screen-width:{innerWidth}px;"
>
	<div id="main" class="relative flex size-full translate-0 overflow-hidden">
		{@render children()}
	</div>
	<Footer />
</main>
