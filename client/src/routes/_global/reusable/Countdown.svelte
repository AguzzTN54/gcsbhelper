<script>
	import { onDestroy, onMount } from 'svelte';
	import dayjs from 'dayjs';
	import duration from 'dayjs/plugin/duration';
	dayjs.extend(duration);

	const eventDate = dayjs('2025-08-17T00:00:00+07:00');

	let days = $state(0);
	let hours = $state(0);
	let minutes = $state(0);
	let seconds = $state(0);
	let timer = $state();

	const countdown = $derived([
		{ time: days, text: 'd' },
		{ time: hours, text: 'h' },
		{ time: minutes, text: 'm' },
		{ time: seconds, text: 's' }
	]);

	const updateCountdown = () => {
		const now = dayjs();
		const diff = eventDate.diff(now);

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

	onMount(() => {
		updateCountdown();
		timer = setInterval(updateCountdown, 1000);
	});

	onDestroy(() => clearInterval(timer));
</script>

<div class="flex flex-col items-center sm:items-start">
	<span class="brutal-text after:!bg-amber-600 text-white text-xs mb-0.5">Time Remaining</span>
	<div class="flex gap-1 text-lg font-mono mb-2">
		{#each countdown as { text, time }}
			<div
				class="bg-gray-100 brutal-border !border-[4px] px-1 py-0.5 sm:p-1 rounded-xl min-w-10 sm:min-w-12 text-center text-sm sm:text-base"
			>
				<span class="text-base sm:text-xl font-bold">{time}</span>{text}
			</div>
		{/each}
	</div>
</div>
