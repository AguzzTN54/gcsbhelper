<script lang="ts">
	import { calculatePoints } from '$lib/helpers/calculator-arcade';
	import {
		ARCADECONFIG,
		arcadeRegion,
		arcadeStats,
		initData,
		loadSteps,
		profileReady
	} from '$lib/stores/app.svelte';
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

	const pointSummary = $derived(calculatePoints($initData, $ARCADECONFIG?.facilitator));
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

<div class="flex flex-col pb-5 lg:flex-row lg:gap-10">
	{#if $arcadeRegion && $arcadeRegion !== 'unset'}
		<div class="w-full pt-5 md:pt-0 lg:w-1/3">
			<Milestone />
		</div>
	{/if}

	<!-- Activity -->
	<div
		class="w-full pt-15 md:pt-0"
		class:lg:w-[66.66%]={$arcadeRegion && $arcadeRegion !== 'unset'}
	>
		<div
			class="flex items-center justify-between"
			class:justify-center={!$arcadeRegion || $arcadeRegion === 'unset'}
		>
			<h2 class="my-3 text-lg">Activity Chart</h2>
		</div>
		<div class="flex justify-center">
			<div class="h-50 w-full">
				<Activities />
			</div>
			<!--  -->
		</div>
	</div>
</div>

<div
	class="brutal-border brutal-shadow my-5 flex flex-col items-center rounded-tl-3xl rounded-br-3xl !border-[3px] p-2 md:my-0 lg:scale-85 lg:flex-row"
>
	<div class="w-full text-center lg:w-25 lg:text-left">
		<h2 class="mt-2 pb-2 text-2xl leading-[110%] font-bold md:text-lg lg:pl-2 xl:text-2xl">
			POINT DETAILS
		</h2>
	</div>
	<div class="ml-2 grid w-full grid-cols-3 gap-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
		{#snippet column({ key, number }: { key: string; number: number })}
			<div class="py-1 text-center hover:bg-orange-100">
				<h3 class="brutal-text text-md after:!bg-purple-200">{texts[key as keyof typeof texts]}</h3>
				{#if $profileReady && loadSteps.enrollmentdata && loadSteps.courselist}
					<span class="block text-2xl font-bold">{key === 'total' ? '' : '+'}{number}</span>
				{:else}
					<div class="flex justify-center pt-2">
						<Skeleton class="h-6 w-12" />
					</div>
				{/if}
			</div>
		{/snippet}

		{#each statContent as item (item)}
			{@render column(item)}
		{/each}
	</div>
</div>
