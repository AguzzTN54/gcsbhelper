<script>
	import 'overlayscrollbars/overlayscrollbars.css';
	import { OverlayScrollbarsComponent } from 'overlayscrollbars-svelte';
	import '../app.css';

	let innerHeight, innerWidth;
	$: screenHeight = innerHeight ? `${innerHeight}px` : '100vh';
</script>

<svelte:window bind:innerHeight bind:innerWidth />
<OverlayScrollbarsComponent
	options={{ scrollbars: { theme: 'os-theme-dark' } }}
	element="main"
	defer
>
	<div style="--screen-height: {screenHeight};--screen-width: {innerWidth}px;">
		<slot />
	</div>
</OverlayScrollbarsComponent>

<style>
	div {
		width: var(--screen-width);
		height: var(--screen-height);
	}
</style>
