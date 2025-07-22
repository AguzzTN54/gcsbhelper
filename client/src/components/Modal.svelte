<script lang="ts">
	import { getContext } from 'svelte';
	import { self } from 'svelte/legacy';
	import { fade } from 'svelte/transition';

	const { persist = false, large = false, children } = $props();
	const modalHandle = getContext('modalHandle') as () => void;

	const dismiss = () => {
		if (persist) return;
		modalHandle();
	};
</script>

<section class:large onmousedown={self(dismiss)} role="button" tabindex="0" transition:fade>
	<div class="container" transition:fade>
		{@render children()}
	</div>
</section>

<style>
	section {
		position: fixed;
		width: var(--screen-width);
		height: var(--screen-height);
		z-index: +10;
		/* background-color: rgba(0, 0, 0, 0.1); */
		backdrop-filter: blur(15px);
		background-color: rgba(239, 241, 247, 0.5);
		box-shadow: var(--inner-shadow);
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.container {
		width: 600px;
		max-width: 90%;
		background-color: var(--color-bg);
		padding: 1rem;
		border-radius: 0.5rem;
		/* box-shadow: 0 0 1rem rgba(0, 0, 0, 0.1); */
		box-shadow: var(--outer-shadow);
		transition: width 0.5s;
	}
	.large .container {
		width: 80%;
	}
</style>
