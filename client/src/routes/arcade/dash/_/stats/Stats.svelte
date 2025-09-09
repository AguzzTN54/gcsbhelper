<script lang="ts">
	import { calculatePoints } from '$lib/helpers/calculator-arcade';
	import { arcadeRegion, arcadeStats, initData, profileReady } from '$lib/stores/app.svelte';
	import Skeleton from '$reusable/Skeleton.svelte';
	import Activities from './Activities.svelte';
	import Milestone from './Milestone.svelte';

	const texts = {
		game: 'Games',
		trivia: 'Trivia',
		skill: 'Skill',
		bonus: 'Bonus',
		wmp: 'WMP',
		total: 'Total'
	};
	const order = Object.keys(texts);
	type PointData = { key: string; number: number };

	const pointSummary = $derived(calculatePoints($initData, $arcadeRegion));
	$effect(() => arcadeStats.set(pointSummary));

	const statContent = $derived.by<PointData[]>(() => {
		const { points, bonus, total } = pointSummary;
		const pointdata: PointData[] = Object.keys(points).map((k) => ({
			key: k,
			number: points[k as keyof typeof points]
		}));

		const bonusdata = typeof bonus !== 'number' ? null : { key: 'bonus', number: bonus };
		const totaldata = typeof total !== 'number' ? null : { key: 'total', number: total };
		const merged = [...pointdata, bonusdata, totaldata].filter(Boolean) as PointData[];
		const sorted = merged.sort((a, b) => order.indexOf(a?.key || '') - order.indexOf(b?.key || ''));
		return sorted;
	});
</script>

<div class="flex flex-col lg:flex-row lg:gap-10 pb-5">
	{#if $arcadeRegion && $arcadeRegion !== 'unset'}
		<div class="w-full lg:w-1/3 md:pt-0 pt-5">
			<Milestone />
		</div>
	{/if}

	<!-- Activity -->
	<div
		class="w-full md:pt-0 pt-15"
		class:lg:w-[66.66%]={$arcadeRegion && $arcadeRegion !== 'unset'}
	>
		<div
			class="flex justify-between items-center"
			class:justify-center={!$arcadeRegion || $arcadeRegion === 'unset'}
		>
			<h2 class="text-lg my-3">Activity Chart</h2>
		</div>
		<div class="flex justify-center">
			<div class="w-full h-50">
				<Activities />
			</div>
			<!--  -->
		</div>
	</div>
</div>

<div
	class="flex flex-col lg:flex-row p-2 my-5 md:my-0 items-center brutal-border !border-[3px] brutal-shadow rounded-br-3xl rounded-tl-3xl lg:scale-85"
>
	<div class="w-full lg:w-25 text-center lg:text-left">
		<h2 class="font-bold pb-2 leading-[110%] text-2xl mt-2 lg:pl-2">POINT DETAILS</h2>
	</div>
	<div class="grid grid-cols-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 w-full gap-1 ml-2">
		{#snippet column({ key, number }: { key: string; number: number })}
			<div class="text-center py-1 hover:bg-orange-100">
				<h3 class="brutal-text text-md after:!bg-purple-200">{texts[key as keyof typeof texts]}</h3>
				{#if $profileReady}
					<span class="font-bold text-2xl block">{key === 'total' ? '' : '+'}{number}</span>
				{:else}
					<div class="flex justify-center pt-2">
						<Skeleton class="w-12 h-6" />
					</div>
				{/if}
			</div>
		{/snippet}

		{#each statContent as item (item)}
			{@render column(item)}
		{/each}
	</div>
</div>
