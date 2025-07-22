<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';

	interface Props {
		max?: number;
		interval?: number;
		float?: boolean;
		onEnd?: () => void;
	}

	const { max = 0, float = false, interval = 20, onEnd = () => null }: Props = $props();

	const maxNum = float ? max.toFixed(1) : max.toFixed(0);
	const step = float ? 0.5 : 1;

	let pointToShow = $state(0.0);

	onMount(() => {
		const t = setInterval(() => {
			if (pointToShow < parseFloat(maxNum)) return (pointToShow += step);
			if (typeof onEnd === 'function') onEnd();
			return clearInterval(t);
		}, interval);
	});
</script>

<span> {float ? pointToShow.toFixed(1) : pointToShow} </span>
