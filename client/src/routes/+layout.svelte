<script lang="ts">
	import { onMount } from 'svelte';
	import 'overlayscrollbars/overlayscrollbars.css';
	import '../app.css';
	import splash from '$img/splash5.webp';
	import Footer from './_global/Footer.svelte';
	import ScrollArea from './_global/reusable/ScrollArea.svelte';

	const { children } = $props();
	let innerHeight = $state(0);
	let innerWidth = $state(0);
	const screenHeight = $derived(innerHeight ? `${innerHeight}px` : '100vh');

	onMount(() => {
		if (!('serviceWorker' in navigator)) {
			console.error('Service workers are not supported.');
			return;
		}
		navigator.serviceWorker.register('/sw.js');
	});
</script>

<svelte:window bind:innerHeight bind:innerWidth />

<main
	class="h-[var(--screen-height)] w-screen flex flex-col relative"
	style="--screen-height:{screenHeight};--screen-width:{innerWidth}px;"
>
	<img
		src={splash}
		alt="splash"
		class="size-full object-cover absolute left-0 top-0 pointer-events-none"
	/>
	<ScrollArea>
		{@render children()}
	</ScrollArea>
	<Footer />
</main>
