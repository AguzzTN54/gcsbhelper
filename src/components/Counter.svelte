<script>
	import { createEventDispatcher, onMount } from 'svelte';

	export let max = 0;
	export let float = false;
	export let interval = 20;

	const maxNum = float ? parseFloat(max) : parseInt(max);
	const step = float ? 0.5 : 1;

	let pointToShow = 0.0;
	const dispatch = createEventDispatcher();

	onMount(() => {
		const t = setInterval(() => {
			if (pointToShow < maxNum) return (pointToShow += step);
			dispatch('end');
			return clearInterval(t);
		}, interval);
	});
</script>

<span> {float ? pointToShow.toFixed(1) : pointToShow} </span>
