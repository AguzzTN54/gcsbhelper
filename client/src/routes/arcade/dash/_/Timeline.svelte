<script lang="ts">
	import { onMount, tick } from 'svelte';
	import dayjs, { delay, type Dayjs } from '$lib/helpers/dateTime';
	import ScrollArea, { getLenis } from '$reusable/ScrollArea.svelte';
	import { getTimelineContents } from '$lib/helpers/timeline.arcade';
	import { arcadeFacil, initData } from '$lib/stores/app.svelte';
	import { sha256 } from '$lib/helpers/crypto';

	let timelineW = $state(0);
	let timelineH = $state(0);
	const offset = 2;
	const calendar = $derived(getTimelineContents($initData, $arcadeFacil));

	const scroll = () => {
		const lenis = getLenis('timeline');
		lenis.resize();
		lenis?.scrollTo('#nowindicator', { offset: -100 });
	};

	let timelineHash = $state('');
	$effect(() => {
		if (calendar.timeline.length > 0) {
			sha256(calendar?.timeline?.toString()).then(async (hash) => {
				if (hash === timelineHash) return;
				timelineHash = hash;
				await delay(500);
				scroll();
			});
		}
	});

	interface DateList {
		month: string;
		dates: { date: number; day: string }[];
	}
	const getDateList = (): DateList[] => {
		const extendedStart = calendar.startrange.subtract(offset, 'day');
		const extendedEnd = calendar.endrange.add(offset, 'day');
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
		const daysDiff = now.diff(calendar.startrange.startOf('day'), 'day');
		const secondsInDay = 24 * 60 * 60;
		const secondsToday = now.diff(now.startOf('day'), 'second');
		const fractionToday = secondsToday / secondsInDay;
		return daysDiff + fractionToday;
	};
</script>

<div
	class="mt-2 size-full min-h-[calc(var(--tm-height)+1.5rem)] overflow-hidden sm:min-h-auto"
	bind:clientWidth={timelineW}
	style="--tm-width:{timelineW}px;--tm-height:{timelineH}px;--dtw:calc(var(--tm-width)/7)"
>
	<ScrollArea horizontal id="timeline">
		<div
			class="pointer-event-none absolute top-0 left-0 z-21 flex h-[98%] w-0.5 bg-red-500"
			style="transform: translateX(
				calc(var(--dtw)/2
				+ var(--dtw)*{offset}
				+ var(--dtw)*{timeNowPosition(timeNow)})
			);"
		>
			<span
				id="nowindicator"
				class="mt-auto mb-1 inline-block -translate-x-1/2 rounded-full bg-red-500 px-2 py-1 text-xs leading-[110%] text-white"
			>
				{timeNow.format('HH:mm:ss')}
			</span>
		</div>

		<div class="absolute top-0 left-0 h-full min-h-fit" id="timeline-grid">
			<div class="absolute top-0 left-0 z-10 flex h-full">
				{#each getDateList() as { dates, month }}
					<div class="flex h-full">
						<div class="sticky top-0 left-0 w-0">
							<span
								class="inline-block h-fit -translate-y-1/5 bg-purple-200 px-2 text-sm font-bold text-purple-800"
							>
								{month}
							</span>
						</div>
						{#each dates as { date, day }}
							<div class="flex w-[var(--dtw)] flex-col">
								<div class="head flex flex-col text-center text-sm">
									<span class="font-light text-gray-600">{day}</span>
									<span class="mt-0.5 inline-block font-semibold"> {date} </span>
								</div>
								<span class="line mx-auto h-[calc(100%-3rem)] w-[1px] bg-gray-400"> </span>
							</div>
						{/each}
					</div>
				{/each}
			</div>

			<!-- Strip -->
			<div
				class="relative z-20 mt-12 translate-x-[calc(var(--dtw)/2)] pb-5 text-sm"
				bind:clientHeight={timelineH}
			>
				{#each calendar.timeline as itemperrow (itemperrow)}
					{@const { startdate } = itemperrow[0]}
					<div
						style="--offset:{dayjs(startdate).diff(calendar.startrange, 'day', true) + offset}"
						class="my-1 ml-[calc(var(--dtw)*var(--offset))] flex"
					>
						{#each itemperrow as { enddate, startdate, title, type, image }, i (title)}
							<button
								style="--w:{dayjs(enddate).diff(startdate, 'day', true)};
									--ml:{dayjs(startdate).diff(itemperrow[i - 1]?.enddate || startdate, 'day', true)}"
								class="relative ml-[calc(var(--dtw)*var(--ml))] inline-flex w-[calc(var(--w)*var(--dtw))] justify-between rounded-lg bg-indigo-200 text-indigo-900 {type}"
							>
								<span
									class="text-overflow sticky top-0 -left-6 z-1 my-2 inline-block rounded-full px-4 text-left"
									style="--line-number:1"
								>
									{title}
								</span>
								{#if image}
									<div class="sticky top-0 right-5 flex h-full w-25 overflow-hidden rounded-r-lg">
										<img src={image} alt="Arcade" class="absolute top-0 right-0 -translate-y-2/5" />
									</div>
								{/if}
							</button>
						{/each}
					</div>
				{/each}
			</div>
		</div>
	</ScrollArea>
</div>

<style lang="postcss">
	@import 'tailwindcss/theme' theme(reference);
	button {
		&.wmp {
			span {
				@apply bg-[#202124];
			}
			@apply text-white/80;
			background-image: linear-gradient(to left, #1a6260, #202124);
		}
		&.game,
		&.special,
		&.cert {
			span {
				@apply bg-[#202124];
			}
			@apply text-white/80;
			background-image: linear-gradient(to left, #162a43, #202124);
		}
		&.trivia {
			span {
				@apply bg-[#202124];
			}
			@apply text-white/80;
			background-image: linear-gradient(to left, #51364b, #202124);
		}
		&.expected {
			span {
				@apply bg-[#202124];
			}
			@apply bg-[#202124] text-white/80;
		}
	}
</style>
