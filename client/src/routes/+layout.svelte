<script lang="ts">
	import { page } from '$app/state';
	import { onMount, setContext } from 'svelte';
	import { MetaTags, deepMerge } from 'svelte-meta-tags';
	import 'overlayscrollbars/overlayscrollbars.css';
	import 'swiper/css';
	import '../app.css';
	import { screenSize } from '$lib/stores/app.svelte';
	import Loading from '$reusable/Loading.svelte';
	import Toasts from '$reusable/Toast/Toasts.svelte';
	import Tour from '$reusable/Tour.svelte';
	import Footer from './_global/Footer.svelte';
	import Loader from './juaragcp/v2/comp/Loader.svelte';
	import Modal from '$reusable/Modal.svelte';

	const { children, data } = $props();
	let innerHeight = $state(0);
	let innerWidth = $state(0);
	const screenHeight = $derived(innerHeight ? `${innerHeight}px` : '100vh');
	$effect(() => screenSize.set({ width: innerWidth, height: innerHeight }));
	const id = $derived(page.route.id?.includes('/juaragcp') ? 'juaragcp' : 'arcade');
	const metaTags = $derived(deepMerge(data.baseMetaTags, page.data.pageMetaTags));

	$effect(() => {
		const gevent = page.url.pathname.split('/')[1] || 'unknown';
		window.__opr?.setMetadata('skillboost', gevent);
	});

	let loaded = $state(false);
	setContext('loaded', () => (loaded = true));
	onMount(() => {
		if (!('serviceWorker' in navigator)) {
			console.error('Service workers are not supported.');
			return;
		}
		navigator.serviceWorker.register('/sw.js');
		if (!page.url.pathname.match(/\/arcade|\/juaragcp/)) {
			loaded = true;
		}
	});
</script>

<svelte:window bind:innerHeight bind:innerWidth />

<MetaTags {...metaTags} />

{#if id === 'juaragcp'}
	<Loader {loaded} />
{:else if !loaded}
	<div class="fixed z-150 flex size-full flex-col items-center justify-center bg-white">
		<Loading />
		<span class="mt-4 block text-sm text-slate-600"> Wait for a second.. </span>
	</div>
{/if}

<Toasts />
<Tour />

<Modal hideclosebutton persist>
	<div class="text-center">
		<h1 class="text-2xl font-bold">UNDER MAINTENANCE!</h1>
		<p>Please Come Back Later!</p>
	</div>
</Modal>

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
