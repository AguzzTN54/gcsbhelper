<script>
	import { fade } from 'svelte/transition';
	import LoaderIcon from './PulseLoading.svelte';
	const { loaded = false } = $props();
</script>

<div class="loader" class:clip={loaded} out:fade={{ delay: 1000 }}>
	<LoaderIcon />
</div>

<style>
	.loader {
		position: fixed;
		z-index: 9999;
		top: 0;
		left: 0;
		width: 100%;
		height: 100vh;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		background-color: var(--color-secondary);
		transition: opacity 1s;
		clip-path: ellipse(150% 150% at 0% 0%);
		transition: all 1s cubic-bezier(0.645, 0.045, 0.355, 1);
	}

	.loader.clip {
		clip-path: ellipse(0% 0% at 0 0%);
	}
</style>
