<script lang="ts">
	import { Swiper } from 'swiper';
	import { generateCalendarsByMonth } from '$lib/helpers/timeline.juaragcp';
	import Ground from '../illustration/Ground.svelte';
	import Calendar from './Calendar.svelte';
	import EventList from './EventList.svelte';
	import dayjs from '$lib/helpers/dateTime';

	const { calendar, currentMonth } = generateCalendarsByMonth();
	const dateRange = Object.entries(calendar);
	const calendarrange = dateRange.map(([month, date]) => [dayjs(month).format('MMMM'), date]);

	let activeMonth = $state(currentMonth);
	let clientWidth = $state(0);
	let swiperEl = $state<HTMLElement>();
	let swiper = $state<Swiper>();

	$effect(() => {
		if (!swiperEl) return;
		swiper = new Swiper(swiperEl, {
			speed: 400,
			initialSlide: currentMonth,
			centeredSlidesBounds: true,
			allowTouchMove: false,
			slidesPerView: 'auto',
			on: {
				realIndexChange(swiper) {
					activeMonth = swiper.realIndex;
				}
			}
		});
		return () => swiper?.destroy();
	});
</script>

<div
	class="relative z-9 bg-[var(--color-secondary)] pb-10 text-[var(--color-primary)] sm:pb-15 md:pt-20 md:pb-40"
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
						onclick={() => swiper?.slidePrev()}
						aria-label="Previous Month"
						class="duo mr-2 text-xl hover:text-amber-300"
						class:opacity-50={activeMonth === 0}
						disabled={activeMonth === 0}
					>
						<i class="fasdl fa-arrow-left-long"></i>
					</button>
					<button
						onclick={() => swiper?.slideNext()}
						aria-label="Next Month"
						class="duo text-xl hover:text-amber-300"
						class:opacity-50={activeMonth === calendarrange.length - 1}
						disabled={activeMonth === calendarrange.length - 1}
					>
						<i class="fasdl fa-arrow-right-long"></i>
					</button>
				</nav>
			</div>

			<div class="swiper w-full" bind:this={swiperEl} bind:clientWidth style="--w:{clientWidth}px">
				<div class="swiper-wrapper w-full">
					{#each dateRange as [_, date] (date)}
						<div class="swiper-slide top-0 left-0 size-full">
							<Calendar {date} />
						</div>
					{/each}
				</div>
			</div>
		</div>

		<!--  -->
		<div class="mt-10 flex w-full py-2 md:mt-0 md:w-4/12">
			<EventList />
		</div>
	</div>
</div>
