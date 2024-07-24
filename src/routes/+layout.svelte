<script>
	import 'overlayscrollbars/overlayscrollbars.css';
	import { OverlayScrollbarsComponent } from 'overlayscrollbars-svelte';
	import '../app.css';
	import Footer from '$comp/Footer.svelte';

	let innerHeight, innerWidth;
	let footerheight;
	$: screenH = innerHeight - footerheight;
	$: screenHeight = screenH ? `${screenH}px` : '100vh';
</script>

<svelte:window bind:innerHeight bind:innerWidth />

<main>
	<OverlayScrollbarsComponent options={{ scrollbars: { theme: 'os-theme-dark' } }} defer>
		<div style="--screen-height: {screenHeight};--screen-width: {innerWidth}px;">
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
