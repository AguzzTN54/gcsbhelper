<script>
	import { setContext } from 'svelte';
	import 'overlayscrollbars/overlayscrollbars.css';
	import { OverlayScrollbarsComponent } from 'overlayscrollbars-svelte';
	import '../app.css';
	import Footer from '$comp/Footer.svelte';
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
</script>

<svelte:window bind:innerHeight bind:innerWidth />

<main>
	<OverlayScrollbarsComponent options={{ scrollbars: { theme: 'os-theme-dark' } }} defer>
		<div style="--screen-height: {screenHeight};--screen-width: {innerWidth}px;">
			{#if showModalSolution}
				<ModalSolution {labs} />
			{/if}
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
</style>
