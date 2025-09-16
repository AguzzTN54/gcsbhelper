<script lang="ts">
	import dayjs from '$lib/helpers/dateTime';
	import { arcadeRegion } from '$lib/stores/app.svelte';
	import { facilitatorPeriode, arcadeSeason } from '$lib/data/config';
	import { createCountdown } from '$lib/stores/countdown.svelte';

	const { small = false } = $props();

	const isFacil = $derived.by(() => {
		const validRegions = ['india', 'indonesia'];
		return validRegions.includes($arcadeRegion);
	});

	const endIn = $derived(facilitatorPeriode[$arcadeRegion]?.end);
	const endDate = $derived.by(() => {
		const arcend = arcadeSeason.end;
		if (!isFacil || dayjs(endIn).isBefore(Date.now())) return arcend;
		return endIn;
	});

	const timer = $derived(createCountdown(endDate));
	const { d: days, h: hours, m: minutes, s: seconds } = $derived($timer);

	const countdown = $derived([
		{ time: days, text: 'd' },
		{ time: hours, text: 'h' },
		{ time: minutes, text: 'm' },
		{ time: seconds, text: 's' }
	]);
</script>

{#if isFacil && dayjs(endIn).isAfter(Date.now())}
	<span
		class="brutal-text after:!bg-sky-900 text-white text-xs sm:text-sm mb-0.5"
		class:!mb-2={!small}
		class:sm:text-sm={!small}
	>
		Arcade Facilitator ends in
	</span>
{:else}
	<span
		class="brutal-text after:!bg-amber-600 text-white text-xs mb-0.5"
		class:!mb-2={!small}
		class:sm:text-sm={!small}
	>
		Time Remaining
	</span>
{/if}

<div class="flex gap-1 text-lg font-mono">
	{#each countdown as { text, time }}
		<div
			class="bg-gray-100 brutal-border !border-[4px] px-1 py-0.5 sm:p-1 rounded-xl min-w-10 sm:min-w-12 text-center text-sm sm:text-base"
		>
			<span class="text-base sm:text-xl font-bold">{time}</span>{text}
		</div>
	{/each}
</div>
