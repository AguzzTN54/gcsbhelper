<script>
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();
	const click = () => {
		dispatch('click');
	};
</script>

<button class="check" type="submit" on:click={click}>
	<slot />
</button>

<style>
	.check {
		background-image: var(--color-gradient);
		background-size: 200%;
		background-position: 80%;
		font-size: inherit;
		border: 0;
		outline: 0;
		padding: 0.5rem 1.5rem;
		color: #fff;
		border-radius: 5px;
		transition:
			transform 0.1s,
			background 0.3s;
	}

	.check:hover {
		background-position: 0;
	}
	.check:active {
		transform: scale(0.95);
	}
</style>
