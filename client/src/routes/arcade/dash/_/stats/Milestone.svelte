<script lang="ts">
	import { onDestroy, onMount, untrack } from 'svelte';
	import {
		Chart,
		RadarController,
		RadialLinearScale,
		PointElement,
		LineElement,
		Filler,
		Tooltip,
		Legend
	} from 'chart.js';
	import { arcadeRegion, arcadeStats, profileReady } from '$lib/stores/app-store';
	import { facilMilestones } from '$lib/config';
	import Skeleton from '$reusable/Skeleton.svelte';

	const { milestones, complete } = $derived($arcadeStats || {});
	let showSelectMilestone = $state(false);
	let activeMilestone = $derived.by(() => {
		const region = $arcadeRegion;
		if (!region || region === 'unset') return null;
		const key = `m${milestones?.length || 1}`;
		return facilMilestones[region]?.[key] || null;
	});

	onMount(() => {
		window.addEventListener('click', () => (showSelectMilestone = false));
	});

	let canvas = $state<HTMLCanvasElement>();
	Chart.register(
		RadialLinearScale,
		RadarController,
		PointElement,
		LineElement,
		Filler,
		Tooltip,
		Legend
	);

	const milestoneStandard = $derived.by(() => {
		const region = $arcadeRegion;
		if (!$profileReady) {
			return {
				Games: 10,
				Trivia: 10,
				Skill: 10,
				...(region === 'india' ? { 'Lab Free': 10 } : {})
			};
		}

		if (!region || region === 'unset') {
			return {
				Games: 0,
				Trivia: 0,
				Skill: 0
			};
		}

		const { game, skill, trivia, labfree } = activeMilestone || {};
		return {
			Games: game || 0,
			Trivia: trivia || 0,
			Skill: skill || 0,
			...(region === 'india' ? { 'Lab Free': labfree || 0 } : {})
		};
	});

	// Real maximums for each category
	const maxValues = $derived.by(() => {
		const { Games, Skill, Trivia, 'Lab Free': labfree } = milestoneStandard;
		return {
			Games: Games * 1.25,
			Trivia: Trivia * 1.25,
			Skill: Skill * 1.25,
			...($arcadeRegion === 'india' ? { 'Lab Free': (labfree || 0) * 1.25 } : {})
		};
	});

	// Current values
	const dataValues = $derived.by(() => {
		const { game, trivia, skill, labfree } = complete?.facil || {};
		return {
			Games: game || 0,
			Trivia: trivia || 0,
			Skill: skill || 0,
			...($arcadeRegion === 'india' ? { 'Lab Free': labfree || 0 } : {})
		};
	});

	// Normalize to 0–100
	const normalizedData = (values: Record<string, number>) => {
		return Object.keys(values).map((key) => {
			const value = values[key as keyof typeof values];
			const maxVal = maxValues[key as keyof typeof maxValues];
			const normalized = maxVal ? (value / maxVal) * 100 : 0;
			return normalized;
		});
	};

	let chart = $state<Chart>();
	onDestroy(() => chart?.destroy());

	$effect(() => {
		if (!canvas) return;
		const chartContent = untrack(() => chart);

		const userDataValues = {
			label: 'Your Data',
			data: normalizedData(dataValues),
			fill: true,
			backgroundColor: 'RGBA(254, 154, 0, 0.1)',
			borderColor: 'RGB(254, 154, 0)',
			pointBackgroundColor: 'RGB(254, 154, 0)'
		};

		if (!$profileReady && chartContent) {
			chartContent.data.labels = Object.keys(maxValues).map(() => 'loading');
			chartContent.data.datasets[1].data = [];
			chartContent.update();
			return;
		}

		if (chartContent) {
			chartContent.data.labels = Object.keys(maxValues);
			chartContent.data.datasets[1] = userDataValues;
			chartContent.update();
			return;
		}

		chart = new Chart(canvas, {
			type: 'radar',
			data: {
				labels: $profileReady
					? Object.keys(maxValues)
					: Object.keys(maxValues).map(() => 'loading'),
				datasets: [
					{
						label: 'std',
						data: normalizedData(milestoneStandard),
						fill: true,
						backgroundColor: 'transparent',
						borderColor: 'rgba(0, 0, 0, 0.2)',
						pointBackgroundColor: 'rgba(0, 0, 0, 0.2)',
						borderWidth: 2
					},
					userDataValues
				]
			},
			options: {
				maintainAspectRatio: false,
				responsive: true,
				layout: {
					padding: {
						top: 10
					}
				},
				animation: {
					duration: 1000,
					easing: 'easeOutQuart',
					delay: (context) => context.dataIndex * 200
				},
				scales: {
					r: {
						min: 0,
						// max: 100,
						suggestedMax: 100,
						pointLabels: {
							color: 'black',
							font: { weight: 600 }
						},
						ticks: {
							display: false,
							stepSize: 40
						},
						grid: { color: 'lightgrey' }
					}
				},
				interaction: {
					mode: 'nearest',
					axis: 'xy',
					intersect: false
				},
				plugins: {
					legend: {
						display: false
					},
					tooltip: {
						callbacks: {
							title: (context) => {
								const label = context[0].dataset.label || '';
								const index = context[0].dataIndex;
								const chart = context[0].chart;
								const datasets = chart.data.datasets;

								const datasetA = datasets.find((d) => d.label === 'std');
								const datasetB = datasets.find((d) => d.label !== 'std');
								if (datasetA && datasetB && datasetA.data[index] === datasetB.data[index]) {
									if (label === 'std') {
										return 'Your Badges';
									} else {
										return '';
									}
								}

								if (context[0].dataset.label === 'std') {
									return 'Badge Needed';
								}
								return 'Your Badges';
							},
							label: (context) => {
								const label = context.dataset.label || '';
								const index = context.dataIndex;
								const chart = context.chart;
								const datasets = chart.data.datasets;

								const datasetA = datasets.find((d) => d.label === 'std');
								const datasetB = datasets.find((d) => d.label !== 'std');

								const percentage = context.parsed.r;
								const realValue = Math.round(
									(percentage / 100) * (maxValues[context.label as keyof typeof maxValues] || 0)
								);

								if (datasetA && datasetB && datasetA.data[index] === datasetB.data[index]) {
									if (label !== 'std') {
										return `${context.label}: ${realValue}`;
									} else {
										return '';
									}
								}
								return `${context.label}: ${realValue}`;
							}
						}
					}
				}
			}
		});
	});
</script>

<div class="flex justify-between items-center">
	<h2 class="text-lg my-3">Milestone</h2>
	{#if !$profileReady}
		<Skeleton class="w-25 h-6" />
	{:else}
		<div class="relative">
			<button
				onclick={(e) => {
					e.preventDefault();
					e.stopPropagation();
					showSelectMilestone = !showSelectMilestone;
				}}
				class="text-xs brutal-border px-2 py-1 !border-[2px] capitalize relative z-20 bg-gray-100 hover:bg-amber-200 active:bg-amber-300 whitespace-nowrap"
			>
				{#if milestones?.includes(activeMilestone?.displayname || '')}
					<i class="fasdl fa-check"></i>
				{/if}
				{activeMilestone?.displayname || ''}
				<i class="fasdl fa-caret-down"></i>
			</button>

			{#if showSelectMilestone}
				{@const mlist = facilMilestones[$arcadeRegion as Exclude<App.FacilitatorRegion, 'unset'>]}
				<div
					style="--item-length:{Object.keys(dataValues).length}"
					class="absolute top-[calc(100%+2px)] right-0 lg:left-0 text-xs bg-gray-100 w-[calc(var(--item-length)*100%)] sm:w-[200%] lg:w-[calc(var(--item-length)*100%)] max-w-[87vw] z-10"
				>
					{#each Object.keys(mlist) as key (key)}
						{@const m = mlist[key]}
						{@const completed = milestones?.includes(m.displayname)}
						<button
							onclick={() => {
								activeMilestone = m;
								showSelectMilestone = false;
							}}
							class:completed
							class:bg-green-100={m.displayname === activeMilestone?.displayname}
							class="px-2 py-2 border-2 w-full text-left hover:bg-indigo-200 capitalize active:bg-indigo-200 whitespace-nowrap relative"
						>
							<div class="flex">
								<i class="fasdl fa-check opacity-0" class:opacity-100={completed}></i>
								<span class="uppercase font-semibold">{m.displayname} </span>
								<span class="ml-auto text-lime-700 bg-lime-100"> +{m.bonus} </span>
							</div>

							<div
								class="grid grid-cols-[var(--col)] sm:grid-cols-2 lg:grid-cols-[var(--col)] gap-2 mt-1"
								style="--col:repeat(var(--item-length), minmax(0, 1fr))"
							>
								{#snippet milestoneSnippet(label: string, earned: number, needed: number)}
									{@const percentage = (earned / needed) * 100}
									{@const colors: Record<string, string> ={Games: 'bg-purple-800', Trivia:'bg-indigo-700', Skill:'bg-amber-400', 'Lab Free':'bg-sky-400'}}
									<div class="col w-full">
										<div class="flex justify-between">
											<span>{label}</span>
											<span class="opacity-70">
												{earned}/{needed}
											</span>
										</div>
										<div
											class="relative h-1 w-full bg-slate-400/70"
											style="--proggress:{percentage > 100 ? 100 : percentage}%"
										>
											<div class="{colors[label]} h-full w-[var(--proggress)]"></div>
										</div>
									</div>
								{/snippet}
								{#each Object.keys(dataValues) as k (k)}
									{@const earned = dataValues[k as keyof typeof dataValues] || 0}
									{@const neededKey = Object.keys(m).find((m) =>
										k.match(new RegExp(m.split('').join('\\s*'), 'i'))
									) as keyof typeof m | undefined}
									{@const needed = neededKey ? (mlist[key][neededKey] as number) : 0}
									{@render milestoneSnippet(k, earned, needed)}
								{/each}
							</div>
						</button>
					{/each}
				</div>
			{/if}
		</div>
	{/if}
</div>
<div class="flex justify-center">
	<div class="size-40 xl:size-50 aspect-square flex items-center justify-center">
		<div class="scale-120 xl:scale-110">
			{#if milestones}
				<canvas class="size-full" bind:this={canvas}></canvas>
			{/if}
		</div>
	</div>
</div>

<style lang="postcss">
	@import 'tailwindcss/theme' theme(reference);

	.completed::after {
		content: '';
		@apply absolute top-0 h-full left-0 w-1 bg-green-500;
	}
</style>
