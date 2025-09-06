<script>
	import dayjs from '$lib/helpers/dateTime';
	import { arcadeRegion } from '$lib/stores/app-store';
	import { facilitatorPeriode, arcadeSeason } from '$lib/data/config';

	const { small = false } = $props();

	let days = $state(0);
	let hours = $state(0);
	let minutes = $state(0);
	let seconds = $state(0);
	let timer = $state();

	const endDate = $derived.by(() => {
		const validRegions = ['india', 'indonesia'];
		if (!validRegions.includes($arcadeRegion)) return arcadeSeason.end;
		const endIn = facilitatorPeriode[$arcadeRegion]?.end;
		return endIn || arcadeSeason.end;
	});

	const countdown = $derived([
		{ time: days, text: 'd' },
		{ time: hours, text: 'h' },
		{ time: minutes, text: 'm' },
		{ time: seconds, text: 's' }
	]);

	const updateCountdown = () => {
		const now = dayjs();
		const end = dayjs(endDate);
		const diff = end.diff(now);

		if (diff <= 0) {
			clearInterval(timer);
			days = hours = minutes = seconds = 0;
			return;
		}

		const dur = dayjs.duration(diff);
		days = dur.days() + dur.months() * 30 + dur.years() * 365;
		hours = dur.hours();
		minutes = dur.minutes();
		seconds = dur.seconds();
	};

	$effect(() => {
		updateCountdown();
		timer = setInterval(updateCountdown, 1000);
		return () => clearInterval(timer);
	});
</script>

{#if ['india', 'indonesia'].includes($arcadeRegion)}
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
