<script lang="ts">
	import { fly } from 'svelte/transition';
	import { generateCalendarsByMonth } from '$lib/helpers/timeline.juaragcp';
	import Ground from '../illustration/Ground.svelte';
	import Calendar from './Calendar.svelte';
	import EventList from './EventList.svelte';
	import dayjs from '$lib/helpers/dateTime';

	const { calendar, currentMonth } = generateCalendarsByMonth();
	const dateRange = Object.entries(calendar);
	const calendarrange = dateRange.map(([month, date]) => [dayjs(month).format('MMMM'), date]);

	let clientWidth = $state(0);
	let activeMonth = $state(currentMonth);
	let direction = $state<'left' | 'right'>('right');
</script>

<div
	class="relative z-9 bg-[var(--color-secondary)] pb-10 text-[var(--color-primary)] sm:pb-15 md:pt-20 md:pb-25"
>
	<div class="ground pointer-events-none absolute top-0 left-0 -z-1 w-full">
		<Ground />
	</div>

	<h2
		class="pt-20 pb-7 text-center text-xl font-semibold uppercase sm:pt-10 sm:pb-10 sm:text-3xl"
		id="timeline"
	>
		Calendar
	</h2>
	<div class="flex size-full flex-col justify-center px-10 md:flex-row md:px-15 xl:px-50">
		<div class="w-full sm:pr-5 md:w-8/12 md:pr-10 lg:pr-15">
			<div class="flex items-center">
				<h2 class="pb-4 capitalize sm:text-xl lg:text-2xl">{calendarrange[activeMonth][0]}</h2>
				<nav class="ml-auto">
					<button
						onclick={() => {
							if (activeMonth > 0) {
								direction = 'left';
								activeMonth -= 1;
							}
						}}
						aria-label="Previous Month"
						class="duo mr-2 text-xl hover:text-amber-300"
						class:opacity-50={activeMonth === 0}
						disabled={activeMonth === 0}
					>
						<i class="fasdl fa-arrow-left-long"></i>
					</button>
					<button
						onclick={() => {
							if (activeMonth < calendarrange.length - 1) {
								direction = 'right';
								activeMonth += 1;
							}
						}}
						aria-label="Next Month"
						class="duo text-xl hover:text-amber-300"
						class:opacity-50={activeMonth === calendarrange.length - 1}
						disabled={activeMonth === calendarrange.length - 1}
					>
						<i class="fasdl fa-arrow-right-long"></i>
					</button>
				</nav>
			</div>

			<!-- Animated calendar with fly transitions -->
			<div
				class="relative aspect-square h-full w-full overflow-hidden md:aspect-[6/4.1]"
				bind:clientWidth
				style="--w:{clientWidth}px"
			>
				{#key activeMonth}
					<div
						class="absolute top-0 left-0 size-full"
						in:fly={{
							x: direction === 'right' ? 300 : -300,
							duration: 400,
							opacity: 0
						}}
						out:fly={{
							x: direction === 'right' ? -300 : 300,
							duration: 400,
							opacity: 0
						}}
					>
						<Calendar date={dateRange[activeMonth][1]} />
					</div>
				{/key}
			</div>
		</div>

		<div class="mt-10 flex w-full py-2 md:mt-0 md:w-4/12">
			<EventList />
		</div>
	</div>
</div>
