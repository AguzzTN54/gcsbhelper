<script>
	import { getContext } from 'svelte';
	import { fade, fly } from 'svelte/transition';

	export let persist = false;
	export let large = false;
	const modalHandle = getContext('modalHandle');

	const dismiss = () => {
		if (persist) return;
		modalHandle();
	};
</script>

<section class:large on:mousedown|self={dismiss} role="button" tabindex="0" transition:fade>
	<div class="container" transition:fly={{ y: 20 }}>
		<slot />
	</div>
</section>

<style>
	section {
		position: fixed;
		width: var(--screen-width);
		height: var(--screen-height);
		z-index: +10;
		background-color: rgba(0, 0, 0, 0.1);
		backdrop-filter: blur(8px);
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.container {
		width: 600px;
		max-width: 90%;
		background-color: #fff;
		padding: 1rem;
		border-radius: 0.5rem;
		box-shadow: 0 0 1rem rgba(0, 0, 0, 0.1);
	}
	.large .container {
		width: 80%;
	}
</style>
