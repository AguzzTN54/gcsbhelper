<script lang="ts">
	import dayjs from '$lib/helpers/dateTime';
	import { arcadeFacil } from '$lib/stores/app.svelte';
	import { facilitatorPeriode, arcadeSeason } from '$lib/data/config';
	import { createCountdown } from '$lib/stores/countdown.svelte';

	const { small = false } = $props();

	const isFacil = $derived.by(() => {
		const validRegions = ['india', 'indonesia'];
		return validRegions.includes($arcadeFacil);
	});

	const endIn = $derived(facilitatorPeriode[$arcadeFacil]?.end);
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
		class="brutal-text mb-0.5 text-xs text-white after:!bg-sky-900 sm:text-sm"
		class:!mb-2={!small}
		class:sm:text-sm={!small}
	>
		Arcade Facilitator ends in
	</span>
{:else}
	<span
		class="brutal-text mb-0.5 text-xs text-white after:!bg-amber-600"
		class:!mb-2={!small}
		class:sm:text-sm={!small}
	>
		Time Remaining
	</span>
{/if}

<div class="flex gap-1 font-mono text-lg">
	{#each countdown as { text, time }}
		<div
			class="brutal-border min-w-10 rounded-xl !border-[4px] bg-gray-100 px-1 py-0.5 text-center text-sm sm:min-w-12 sm:p-1 sm:text-base"
		>
			<span class="text-base font-bold sm:text-xl">{time}</span>{text}
		</div>
	{/each}
</div>
