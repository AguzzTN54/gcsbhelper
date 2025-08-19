<script lang="ts">
	import type { Dayjs } from 'dayjs';
	import dayjs from '$lib/helpers/dateTime';
	import ScrollArea, {
		getTargetPosition,
		smoothScroll
	} from '../../../_global/reusable/ScrollArea.svelte';
	import { onMount } from 'svelte';

	let timelineW = $state(0);
	let timelineH = $state(0);
	const offset = 2;
	const startDate = dayjs('05 Aug 2025', 'DD MMM YYYY');
	const endDate = dayjs('31 Aug 2025', 'DD MMM YYYY');

	interface DateList {
		month: string;
		dates: { date: number; day: string }[];
	}
	const getDateList = (): DateList[] => {
		const extendedStart = startDate.subtract(offset, 'day');
		const extendedEnd = endDate.add(offset, 'day');
		const grouped: DateList[] = [];
		let current = extendedStart;

		while (current.isBefore(extendedEnd) || current.isSame(extendedEnd, 'day')) {
			const monthKey = current.format('MMMM');
			let monthGroup = grouped.find((g) => g.month === monthKey);
			if (!monthGroup) {
				monthGroup = { month: monthKey, dates: [] };
				grouped.push(monthGroup);
			}

			monthGroup.dates.push({
				date: current.date(),
				day: current.format('dd')
			});
			current = current.add(1, 'day');
		}

		return grouped;
	};

	let timeNow = $state(dayjs(new Date()));
	setInterval(() => {
		timeNow = dayjs(new Date());
	}, 1000);

	const timeNowPosition = (timenow: Dayjs): number => {
		const now = dayjs(timenow);
		const daysDiff = now.diff(startDate.startOf('day'), 'day');
		const secondsInDay = 24 * 60 * 60;
		const secondsToday = now.diff(now.startOf('day'), 'second');
		const fractionToday = secondsToday / secondsInDay;
		return daysDiff + fractionToday;
	};

	const scroll = () => {
		const { x: xpos, y } = getTargetPosition('timeline', '#nowindicator');
		const x = xpos - (timelineW / 7) * 2.75;
		const targetPosition = { x, y };
		smoothScroll({ id: 'timeline', targetPosition });
	};
	onMount(() => {
		const t = setTimeout(() => {
			scroll();
			clearTimeout(t);
		}, 500);
	});
</script>

<div
	class="size-full overflow-hidden mt-2 min-h-[calc(var(--tm-height)+1.5rem)] sm:min-h-auto"
	bind:clientWidth={timelineW}
	style="--tm-width:{timelineW}px;--tm-height:{timelineH}px;--dtw:calc(var(--tm-width)/7)"
>
	<ScrollArea horizontal id="timeline">
		<div
			class="relative h-[98%] w-0.5 bg-red-500 z-21 flex"
			style="transform: translateX(
				calc(var(--dtw)/2
				+ var(--dtw)*{offset}
				+ var(--dtw)*{timeNowPosition(timeNow)})
			);"
		>
			<span
				id="nowindicator"
				class="inline-block text-xs bg-red-500 py-1 px-2 rounded-full leading-[110%] text-white mt-auto mb-2 -translate-x-1/2"
			>
				{timeNow.format('HH:mm:ss')}
			</span>
		</div>

		<div class="absolute top-0 left-0 h-full min-h-fit" id="timeline-grid">
			<div class="h-full absolute flex top-0 left-0 z-10">
				{#each getDateList() as { dates, month }}
					<div class="flex h-full">
						<div class="w-0 sticky left-0 top-0">
							<span
								class="h-fit inline-block text-sm px-2 bg-purple-200 text-purple-800 font-bold -translate-y-1/5"
							>
								{month}
							</span>
						</div>
						{#each dates as { date, day }}
							<div class="w-[var(--dtw)] flex flex-col">
								<div class="head flex flex-col text-center text-sm">
									<span class="text-gray-600 font-light">{day}</span>
									<span class="font-semibold inline-block mt-0.5"> {date} </span>
								</div>
								<span class="line h-[calc(100%-3rem)] bg-gray-400 w-[1px] mx-auto"> </span>
							</div>
						{/each}
					</div>
				{/each}
			</div>

			<!-- Strip -->
			<div
				class="mt-14 pb-5 text-sm translate-x-[calc(var(--dtw)/2)] relative z-20"
				bind:clientHeight={timelineH}
			>
				<button
					class="my-2 w-[calc(20*var(--dtw))] bg-indigo-200 text-indigo-900 !border-[3px] py-2 px-4 rounded-lg relative flex brutal-border"
				>
					<span class="sticky left-0 top-0"> Arcade </span>
				</button>

				<button
					class="my-2 w-[calc(20*var(--dtw))] ml-[calc(var(--dtw)*7)] bg-indigo-200 text-indigo-900 brutal-border !border-[3px] py-2 px-4 rounded-lg relative flex"
				>
					<span class="sticky left-0 top-0"> Arcade </span>
				</button>
			</div>
		</div>
	</ScrollArea>
</div>
