<script>
	import { onNavigate } from '$app/navigation';
	import { setContext } from 'svelte';
	import 'overlayscrollbars/overlayscrollbars.css';
	import { OverlayScrollbarsComponent } from 'overlayscrollbars-svelte';
	import '../app.css';
	import Footer from './_global/Footer.svelte';
	import Header from './_global/Header.svelte';
	import ModalSolution from './_global/ModalSolution.svelte';

	let innerHeight, innerWidth;
	let footerheight;
	$: screenH = innerHeight - footerheight;
	$: screenHeight = screenH ? `${screenH}px` : '100vh';

	let showModalSolution = false;
	let labs = [];
	setContext('handleModalSol', (labList = []) => {
		labs = labList;
		showModalSolution = !showModalSolution;
	});

	let isTop = true;
	const scrolled = ({ detail }) => {
		const { viewport } = detail[0].elements();
		const { scrollTop } = viewport;
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
</script>

<svelte:window bind:innerHeight bind:innerWidth />

<main>
	<OverlayScrollbarsComponent
		options={{ scrollbars: { theme: 'os-theme-dark' } }}
		on:osScroll={scrolled}
		defer
	>
		<div style="--screen-height: {screenHeight};--screen-width: {innerWidth}px;">
			{#if showModalSolution}
				<ModalSolution {labs} />
			{/if}
			<Header {isTop} />
			<slot />
		</div>
	</OverlayScrollbarsComponent>

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
