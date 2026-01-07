<script lang="ts">
	import Fuse from 'fuse.js';
	import { untrack } from 'svelte';
	import { ARCADECONFIG, arcadeRegion, initData, profileReady } from '$lib/stores/app.svelte';
	import dayjs from '$lib/helpers/dateTime';
	import Checkbox from '$reusable/Checkbox.svelte';
	import Skeleton from '$reusable/Skeleton.svelte';
	import ScrollArea from '$reusable/ScrollArea.svelte';
	import Portal from '$reusable/Portal';
	import { initTour } from '../_tour.svelte';
	import BadgeItem from './BadgeItem.svelte';
	import ModalLabs from '../../../_/ModalLabs.svelte';

	let activeGroup = $state('all');
	const grouped = $derived.by(() => {
		let data = $initData || [];
		if ($arcadeRegion !== 'india') {
			data = data
				.filter((d) => d.type !== 'labfree' || (d.type === 'labfree' && !!d.earned))
				.map((d) => (d.type !== 'labfree' ? d : { ...d, type: null }));
		}
		return data.reduce<Record<string, App.CourseItem[]>>((acc, course) => {
			const gameType = ['wmp', 'arcade'].includes(course.type || '');
			const invalid =
				dayjs(course.enddate).isBefore($ARCADECONFIG?.arcade?.start) && course.type != 'skill';
			if (invalid) course.type = null;
			const type = invalid ? 'unknown' : gameType ? 'game' : course.type || 'unknown';
			if (!acc[type]) acc[type] = [];
			acc[type].push(course);
			return acc;
		}, {});
	});

	const labeltxt: Record<string, string> = {
		all: 'All',
		game: 'Games',
		trivia: 'Trivia',
		skill: 'Skill Badge',
		fasttrack: 'Fast Track',
		labfree: 'Lab-Free',
		unknown: 'Unlisted'
	};

	const labelKey = Object.keys(labeltxt);
	const labels = $derived.by(() => {
		const fromGrouped = Object.entries(grouped).map(([type, arr]) => ({
			type,
			label: labeltxt[type],
			length: arr.length
		}));

		const init = untrack(() => $initData);
		const fasttrack = init.filter(({ fasttrack }) => fasttrack);
		const data = [
			...fromGrouped,
			{ type: 'all', label: 'All', length: init.length },
			{ type: 'fasttrack', label: 'Fast Track', length: fasttrack.length }
		];
		const sorted = data.sort((a, b) => labelKey.indexOf(a.type) - labelKey.indexOf(b.type));
		return sorted;
	});

	const getData = (data: App.CourseItem[]): App.CourseItem[] => {
		if (activeGroup === 'all') return data;
		if (activeGroup === 'fasttrack') return data.filter((d) => d.fasttrack);
		return grouped[activeGroup];
	};

	let showEarned = $state(true);
	let maxCourseToShow = $state(12);
	let query = $state('');

	const list: App.CourseItem[] = $derived.by(() => {
		let dt = getData($initData || []) || [];
		// Remove Unearned labfree for specific facilicator
		if ($arcadeRegion !== 'india') dt = dt.filter((d) => d.type !== 'labfree');
		const game = dt
			.filter((d) => d.type?.match(/game|trivia|wmp/))
			.sort((a, b) => {
				const now = dayjs();

				const aDate = a.enddate ? dayjs(a.enddate) : null;
				const bDate = b.enddate ? dayjs(b.enddate) : null;

				const aValid = aDate?.isValid() ?? false;
				const bValid = bDate?.isValid() ?? false;

				// Sorting priority:
				// 0 = valid, not expired, not earned
				// 1 = valid, earned
				// 2 = valid, expired (not earned)
				// 3 = invalid
				const aPriority = aValid ? (aDate!.isAfter(now) ? (a.earned ? 1 : 0) : 2) : 3;
				const bPriority = bValid ? (bDate!.isAfter(now) ? (b.earned ? 1 : 0) : 2) : 3;
				if (aPriority !== bPriority) return aPriority - bPriority;

				// same group → sort by enddate ascending if valid
				if (aValid && bValid) {
					return aDate!.valueOf() - bDate!.valueOf();
				}
				return 0; // both invalid
			});

		const notGame = dt
			.filter((d) => !d.type?.match(/game|wmp|trivia/))
			.sort((a, b) => Number(a.earned) - Number(b.earned))
			.sort((a, b) => {
				return labelKey.indexOf(a.type || 'unknown') - labelKey.indexOf(b.type || 'unknown');
			});
		if (showEarned) return [...game, ...notGame];
		return [...game, ...notGame].filter((d) => !d.earned);
	});

	const fuse = $derived(new Fuse(list, { keys: ['title', 'courseid', 'badgeid'] }));
	const dataToShow = $derived.by<App.CourseItem[]>(() => {
		const cleanQuery = query.trim();
		if (!cleanQuery) return list;
		const result = fuse.search(query);
		return result.map((r) => r.item);
	});

	$effect(() => initTour(labels.map((l) => l.type)));
</script>

<Portal target="#main">
	<ModalLabs />
</Portal>

<div class="mt-10 mb-3 text-center lg:mt-5">
	<h2 class="font-press px-2 text-2xl font-semibold">BADGES</h2>
</div>
<div
	class="sticky top-0 left-0 z-90 flex w-full -translate-y-2 flex-col-reverse items-start justify-between gap-3 px-2 py-2 after:absolute
	after:top-0 after:left-0 after:-z-1 after:size-full after:scale-x-105 after:bg-gray-100 lg:flex-row"
>
	<div class="relative mt-2 flex h-18 w-full lg:mt-0" id="labelpicker">
		<div class="absolute top-0 left-0 w-full lg:pr-2">
			<ScrollArea>
				<div class="labelwrapper whitespace-nowrap">
					{#if $profileReady}
						{#each labels as { label, length, type } (label)}
							<button
								id="label-{type}"
								onclick={() => (activeGroup = type)}
								class:active={activeGroup === type}
								class:bg-amber-200={activeGroup === type}
								class:pointer-events-none={activeGroup === type}
								class="brutal-border group mr-2 rounded-full !border-[3px] px-2 py-1.5 text-xs leading-0 hover:bg-indigo-200 active:bg-indigo-300"
							>
								<span>{label}</span>
								<span
									class="inline-block rounded-full bg-indigo-100 px-0.5 py-2 group-[.active]:bg-amber-300"
								>
									{length}
								</span>
							</button>
						{/each}
					{:else}
						{#each Array(4) as _}
							<Skeleton class="mr-3 inline-block h-9 w-28 rounded-full" />
						{/each}
					{/if}
				</div>
			</ScrollArea>
		</div>
		<div
			class="mt-auto flex w-full origin-bottom-left scale-90 justify-center leading-[100%] lg:justify-start"
		>
			<Checkbox
				checked={showEarned}
				onchange={(e) => (showEarned = (e.target as HTMLInputElement).checked)}
			>
				Show Completed Badges
			</Checkbox>
		</div>
	</div>

	<div class="brutal-border relative h-14 w-100 max-w-full overflow-hidden rounded-full">
		<input
			class="size-full rounded-full pr-5 pl-10 outline-0"
			placeholder="Search Badge"
			bind:value={query}
		/>
		<span
			class="absolute top-0 left-0 z-1 flex aspect-square h-full items-center justify-center text-lg text-indigo-100 opacity-50"
		>
			<i class="fasds fa-magnifying-glass"></i>
		</span>
	</div>
</div>

{#if activeGroup === 'unknown'}
	<div
		class="relative mb-10 w-full bg-amber-200 px-5 py-2 text-sm text-amber-800 after:absolute after:top-0 after:left-0 after:-z-1 after:size-full after:scale-x-[100.5%] after:-skew-x-2 after:-skew-y-[0.5deg] after:bg-indigo-300"
	>
		All badges below are ones you've earned but are not yet included in our system's calculation. If
		you believe any of them should be counted, you can adjust it yourself by changing the <span
			class="bg-gray-100 px-1 py-0.5 text-xs text-black">Unknown</span
		> label to the relevant one.
	</div>
{/if}

<div class="min-h-[calc(var(--screen-height)-11rem)] w-full px-5 pb-10 sm:px-2">
	{#if $profileReady}
		{@const courses = (dataToShow || []).filter((_, i) => i <= maxCourseToShow - 1)}
		{#if courses.length < 1}
			<div class="flex w-full justify-center text-center">No data to show!</div>
		{:else}
			<div
				class="grid w-full grid-cols-1 gap-8 pb-5 md:gap-5 lg:grid-cols-2 lg:gap-7 xl:grid-cols-3 xl:gap-10"
			>
				{#each courses as data (data)}
					<BadgeItem {data} />
				{/each}
			</div>
		{/if}
	{:else}
		<div
			class="grid w-full grid-cols-1 gap-8 pb-5 md:gap-5 lg:grid-cols-2 lg:gap-7 xl:grid-cols-3 xl:gap-10"
		>
			{#each Array(12) as _, i (i)}
				<BadgeItem loading />
			{/each}
		</div>
	{/if}

	<div class="mt-5 flex flex-col items-center justify-center">
		{#if dataToShow.length > maxCourseToShow}
			<button
				onclick={() => (maxCourseToShow = maxCourseToShow + 12)}
				class="brutal-border rounded-full !border-[3.5px] bg-amber-300 px-4 py-2 text-sm hover:bg-amber-400 active:bg-amber-500"
			>
				Show More
			</button>
		{:else if $profileReady}
			<span class="font-light text-amber-700"> That's All! </span>
			<div class="eol h-0.75 w-10/12 bg-amber-700"></div>
		{/if}
	</div>
</div>

<style lang="postcss">
	@import 'tailwindcss/theme' theme(reference);

	#labelpicker :global(.os-scrollbar-visible) {
		@apply hidden sm:block;
	}

	#labelpicker:has(:global(.os-scrollbar-visible)) {
		@apply sm:h-20;
		.labelwrapper {
			@apply sm:mb-3;
		}
	}

	.eol {
		position: relative;
		&::after,
		&::before {
			content: '';
			@apply absolute top-1/2 aspect-square size-2.5 -translate-y-1/2 bg-amber-700;
		}
		&::before {
			left: 0;
		}
		&::after {
			right: 0;
		}
	}
</style>
