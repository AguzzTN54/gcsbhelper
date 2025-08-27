<script lang="ts">
	import { facilMilestones } from '$lib/config';
	import { arcadeRegion, arcadeStats, initData, profileReady } from '$lib/stores/app-store';
	import Skeleton from '$reusable/Skeleton.svelte';
	import Activities from './Activities.svelte';
	import Milestone from './Milestone.svelte';

	const countPoint = (courses: App.CourseItem[], type: string) => {
		return courses
			.filter((c) => !!c.validity?.arcade && c.type === type)
			.reduce((sum, c) => sum + c.point, 0);
	};

	const calculatePoints = (
		courses: App.CourseItem[],
		region: App.FacilitatorRegion
	): App.ArcadeStats => {
		const wmp = courses.filter((c) => !!c.validity?.arcade && c.type === 'wmp').length;
		const wmpBonus = wmp >= 6 ? 7 : 0;
		const points = {
			game: countPoint(courses, 'game'),
			trivia: countPoint(courses, 'trivia'),
			skill: countPoint(courses, 'skill'),
			wmp: wmpBonus
		};
		if (!region || region === 'unset') return { points, completeCourses: { wmp } };

		const facilitatorCourses = courses.filter((c) => !!c.validity?.facilitator);
		const typeCounts = facilitatorCourses.reduce(
			(acc, c) => {
				if (c.type === 'game') acc.game++;
				else if (c.type === 'trivia') acc.trivia++;
				else if (c.type === 'skill') acc.skill++;
				else if (c.type === 'labfree') acc.labfree++;
				return acc;
			},
			{ game: 0, trivia: 0, skill: 0, labfree: 0 }
		);

		// bonus points from milestones
		let bonus = 0;
		const achieved: string[] = [];
		const milestones = facilMilestones[region];

		for (const key in milestones) {
			const m = milestones[key];
			if (
				typeCounts.game >= m.game &&
				typeCounts.trivia >= m.trivia &&
				typeCounts.skill >= m.skill &&
				typeCounts.labfree >= (m.labfree || 0)
			) {
				bonus += m.bonus;
				achieved.push(m.displayname);
			}
		}

		const total = Object.values(points).reduce((p, c) => p + c, 0) + bonus;
		return {
			points,
			total,
			bonus,
			completeCourses: { ...typeCounts, wmp },
			milestones: achieved
		};
	};

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
	<div class="w-full lg:w-1/3 md:pt-0 pt-5">
		<div class="flex justify-between items-center">
			<h2 class="text-lg my-3">Your Milestone</h2>
			<button class="text-xs brutal-border px-2 py-1 !border-[2px]"> More </button>
		</div>
		<div class="flex justify-center">
			<div class="size-40 xl:size-50 aspect-square flex items-center justify-center">
				<div class="scale-120 xl:scale-110">
					{#if $arcadeRegion && $arcadeRegion !== 'unset' && pointSummary?.milestones}
						<Milestone />
					{/if}
				</div>
			</div>
			<!--  -->
		</div>
	</div>
	<div class="w-full lg:w-2/3 md:pt-0 pt-15">
		<div class="flex justify-between items-center">
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
	class="flex flex-col lg:flex-row p-2 my-5 md:my-0 items-center brutal-border !border-[3px] brutal-shadow rounded-br-3xl rounded-tl-3xl -skew-y-1 lg:scale-85"
>
	<div class="w-full lg:w-25 text-center lg:text-left">
		<h2 class="font-bold text-xl pb-2 leading-[100%] mt-2 lg:pl-2">POINT DETAILS</h2>
	</div>
	<div class="grid grid-cols-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 w-full gap-1">
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
