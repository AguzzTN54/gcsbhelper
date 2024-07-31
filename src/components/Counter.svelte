<script>
	import { createEventDispatcher, onMount } from 'svelte';

	export let max = 0;
	let pointToShow = 0.0;
	const dispatch = createEventDispatcher();

	onMount(() => {
		const t = setInterval(() => {
			if (pointToShow < parseFloat(max)) return (pointToShow += 0.5);
			dispatch('end');
			return clearInterval(t);
		}, 20);
	});
</script>

<span> {pointToShow.toFixed(1)} </span>
