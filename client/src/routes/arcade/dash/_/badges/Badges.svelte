<script lang="ts">
	import Fuse from 'fuse.js';
	import { untrack } from 'svelte';
	import { arcadeRegion, initData, profileReady } from '$lib/stores/app-store';
	import Checkbox from '$reusable/Checkbox.svelte';
	import Skeleton from '$reusable/Skeleton.svelte';
	import BadgeItem from './BadgeItem.svelte';

	let activeGroup = $state('all');
	const grouped = $derived.by(() => {
		return $initData.reduce<Record<string, App.CourseItem[]>>((acc, course) => {
			const gameType = ['trivia', 'wmp', 'arcade'].includes(course.type || '');
			const type = gameType ? 'game' : course.type || 'unknown';
			if (!acc[type]) acc[type] = [];
			acc[type].push(course);
			return acc;
		}, {});
	});

	const labeltxt: Record<string, string> = {
		all: 'All',
		game: 'Arcade Games',
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

		let init = untrack(() => $initData);
		if ($arcadeRegion !== 'india') init = init.filter((s) => s.type !== 'labfree');
		const fasttrack = init.filter(({ fasttrack }) => fasttrack);
		const data = [
			...fromGrouped,
			{ type: 'all', label: 'All', length: init.length },
			{ type: 'fasttrack', label: 'Fast Track', length: fasttrack.length }
		];
		const sorted = data.sort((a, b) => labelKey.indexOf(a.type) - labelKey.indexOf(b.type));
		if ($arcadeRegion !== 'india') return sorted.filter((s) => s.type !== 'labfree');
		return sorted;
	});

	const getData = (data: App.CourseItem[]): App.CourseItem[] => {
		if (activeGroup === 'all') return data;
		if (activeGroup === 'fasttrack') return data.filter((d) => d.fasttrack);
		const groupedData = untrack(() => grouped);
		return groupedData[activeGroup];
	};

	let showEarned = $state(true);
	let maxCourseToShow = $state(12);
	let query = $state('');

	const list: App.CourseItem[] = $derived.by(() => {
		let data = getData($initData);
		if ($arcadeRegion !== 'india') data = data.filter((d) => d.type !== 'labfree');
		data = data.sort((a, b) => {
			return labelKey.indexOf(a.type || 'unknown') - labelKey.indexOf(b.type || 'unknown');
		});
		if (showEarned) return data;
		return data.filter((d) => !d.earned);
	});

	const fuse = $derived(new Fuse(list, { keys: ['title', 'courseid', 'badgeid'] }));
	const dataToShow = $derived.by<App.CourseItem[]>(() => {
		const cleanQuery = query.trim();
		if (!cleanQuery) return list;
		const result = fuse.search(query);
		return result.map((r) => r.item);
	});
</script>

<div class="mt-10 lg:mt-15 text-center mb-3">
	<h2 class="font-semibold text-2xl px-2">BADGES</h2>
</div>
<div
	class="w-full sticky z-90 top-0 left-0 -translate-y-2 flex justify-between lg:flex-row flex-col-reverse px-2 py-2 items-start gap-3
	after:bg-gray-100 after:scale-x-105 after:absolute after:top-0 after:left-0 after:size-full after:-z-1"
>
	<div class="w-full mt-2 h-18 flex lg:mt-0 relative">
		<div class="whitespace-nowrap overflow-auto w-full lg:pr-2 absolute top-0 left-0">
			{#if $profileReady}
				{#each labels as { label, length, type }}
					<button
						onclick={() => (activeGroup = type)}
						class:active={activeGroup === type}
						class:bg-amber-200={activeGroup === type}
						class:pointer-events-none={activeGroup === type}
						class="brutal-border py-2 px-3 rounded-full mr-2 text-xs leading-0 !border-[3px] hover:bg-indigo-200 active:bg-indigo-300 group"
					>
						<span>{label}</span>
						<span
							class="inline-block rounded-full bg-indigo-100 py-2 px-0.5 group-[.active]:bg-amber-300"
						>
							{length}
						</span>
					</button>
				{/each}
			{:else}
				{#each Array(4) as _}
					<Skeleton class="h-9 w-28 inline-block rounded-full mr-3" />
				{/each}
			{/if}
		</div>
		<div
			class="mt-auto w-full scale-90 origin-bottom-left flex justify-center lg:justify-start leading-[100%]"
		>
			<Checkbox
				checked={showEarned}
				onchange={(e) => (showEarned = (e.target as HTMLInputElement).checked)}
				>Show Completed Badges</Checkbox
			>
		</div>
	</div>

	<div class="h-14 w-100 max-w-full brutal-border rounded-full overflow-hidden relative">
		<input
			class="size-full pr-5 pl-10 outline-0 rounded-full"
			placeholder="Search Badge"
			bind:value={query}
		/>
		<span
			class="absolute top-0 left-0 z-1 text-indigo-100 text-lg h-full flex justify-center items-center aspect-square opacity-50"
		>
			<i class="fasds fa-magnifying-glass"></i>
		</span>
	</div>
</div>

{#if activeGroup === 'unknown'}
	<div
		class="bg-amber-200 w-full mb-10 text-sm px-5 py-2 text-amber-800 relative after:bg-indigo-300 after:absolute after:top-0 after:left-0 after:size-full after:-z-1 after:scale-x-[100.5%] after:-skew-y-[0.5deg] after:-skew-x-2"
	>
		All badges below are ones you've earned but are not yet included in our system's calculation. If
		you believe any of them should be counted, you can adjust it yourself by changing the <span
			class="bg-gray-100 text-xs py-0.5 px-1 text-black">Unknown</span
		> label to the relevant one.
	</div>
{/if}

<div class="min-h-[calc(var(--screen-height)-11rem)] w-full px-5 sm:px-2 pb-10">
	{#if $profileReady}
		{@const courses = dataToShow.filter((_, i) => i <= maxCourseToShow - 1)}
		{#if courses.length < 1}
			<div class="flex justify-center text-center w-full">No data to show!</div>
		{:else}
			<div class="w-full grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 md:gap-10 pb-5">
				{#each courses as data (data)}
					<BadgeItem {data} />
				{/each}
			</div>
		{/if}
	{:else}
		<div class="w-full grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 md:gap-10 pb-5">
			{#each Array(12) as _, i}
				<BadgeItem loading />
			{/each}
		</div>
	{/if}

	<div class="flex justify-center flex-col items-center mt-5">
		{#if dataToShow.length > maxCourseToShow}
			<button
				onclick={() => (maxCourseToShow = maxCourseToShow + 12)}
				class="brutal-border !border-[3.5px] py-2 px-4 text-sm rounded-full bg-amber-300 hover:bg-amber-400 active:bg-amber-500"
			>
				Show More
			</button>
		{:else if $profileReady}
			<span class="font-light text-amber-700"> That's All! </span>
			<div class="w-10/12 h-1 bg-amber-700 eol"></div>
		{/if}
	</div>
</div>

<style lang="postcss">
	@import 'tailwindcss/theme' theme(reference);

	.eol {
		position: relative;
		&::after,
		&::before {
			content: '';
			@apply size-3 aspect-square absolute top-1/2 -translate-y-1/2 bg-amber-700;
		}
		&::before {
			left: 0;
		}
		&::after {
			right: 0;
		}
	}
</style>
