<script lang="ts">
	import { onNavigate } from '$app/navigation';
	import { onMount, setContext } from 'svelte';
	import 'overlayscrollbars/overlayscrollbars.css';

	import '../app.css';
	import Footer from './_global/Footer.svelte';
	import ScrollArea from './_global/ScrollArea.svelte';
	// import Header from './_global/Header.svelte';
	// import ModalSolution from './_global/ModalSolution.svelte';

	const { children } = $props();
	let innerHeight = $state(0);
	let innerWidth = $state(0);
	let footerheight = $state(0);
	const screenH = $derived(innerHeight - footerheight);
	const screenHeight = $derived(screenH ? `${screenH}px` : '100vh');

	let showModalSolution = $state(false);
	let labs = $state([]);
	setContext('handleModalSol', (labList = []) => {
		labs = labList;
		showModalSolution = !showModalSolution;
	});

	let isTop = $state(true);
	const scrolled = (e: Event) => {
		const { scrollTop } = e.target as HTMLElement;
		isTop = scrollTop <= 0;
	};

	onNavigate((navigation) => {
		if (!document.startViewTransition) return;

		// Navigation Started
		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
				// Navigation Complete
			});
		});
	});

	onMount(async () => {
		if (!('serviceWorker' in navigator)) {
			console.error('Service workers are not supported.');
			return;
		}
		navigator.serviceWorker.register('/sw.js');
	});
</script>

<svelte:window bind:innerHeight bind:innerWidth />

<main>
	<ScrollArea onScroll={scrolled}>
		<div style="--screen-height: {screenHeight};--screen-width: {innerWidth}px;">
			{#if showModalSolution}
				<!-- <ModalSolution {labs} /> -->
			{/if}
			<!-- <Header {isTop} /> -->
			{@render children()}
		</div>
	</ScrollArea>

	<footer bind:clientHeight={footerheight}>
		<Footer />
	</footer>
</main>

<style>
	main,
	div {
		width: var(--screen-width);
		height: calc(var(--screen-height));
	}

	main {
		display: flex;
		flex-direction: column;
	}

	@keyframes fade-in {
		from {
			opacity: 0;
		}
	}

	@keyframes fade-out {
		to {
			opacity: 0;
		}
	}

	@keyframes slide-from-right {
		from {
			transform: translateY(-30px);
		}
	}

	@keyframes slide-to-left {
		to {
			transform: translateY(30px);
		}
	}

	:root::view-transition-old(root) {
		animation:
			90ms cubic-bezier(0.4, 0, 1, 1) both fade-out,
			300ms cubic-bezier(0.4, 0, 0.2, 1) both slide-to-left;
	}

	:root::view-transition-new(root) {
		animation:
			210ms cubic-bezier(0, 0, 0.2, 1) 90ms both fade-in,
			300ms cubic-bezier(0.4, 0, 0.2, 1) both slide-from-right;
	}
</style>
