<script lang="ts">
	import Fuse from 'fuse.js';
	import { untrack } from 'svelte';
	import { initData, profileReady } from '$lib/stores/app-store';
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
		unknown: 'Unknown'
	};

	const labels = $derived.by(() => {
		const labelKey = Object.keys(labeltxt);
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
		const groupedData = untrack(() => grouped);
		return groupedData[activeGroup];
	};

	let query = $state('');
	const list: App.CourseItem[] = $derived(getData($initData));
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
	class="w-full bg-gray-100 sticky z-90 top-0 left-0 -translate-y-2 flex justify-between lg:flex-row flex-col-reverse px-2 py-2 items-start gap-3"
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
			<Checkbox>Show Completed Badges</Checkbox>
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

<div class="min-h-[calc(var(--screen-height)-11rem)] w-full px-5 sm:px-2">
	<div class="w-full grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 md:gap-10 pb-10">
		{#if $profileReady}
			{#each dataToShow as data (data)}
				<BadgeItem {data} />
			{/each}
		{:else}
			{#each Array(12) as _, i}
				<BadgeItem loading />
			{/each}
		{/if}
	</div>
</div>
