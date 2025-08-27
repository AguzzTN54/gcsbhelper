<script lang="ts">
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
	import { onDestroy, untrack } from 'svelte';

	const { milestones, completeCourses } = $derived($arcadeStats || {});
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

		const key = `m${milestones?.length || 1}`;
		const { game, skill, trivia, labfree } = facilMilestones[region]?.[key] || {};
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
		const { game, trivia, skill, labfree } = completeCourses || {};
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
		if (chartContent) {
			chartContent.data.labels = Object.keys(maxValues);
			chartContent.data.datasets[0].data = normalizedData(milestoneStandard);
			chartContent.data.datasets[1] = {
				label: 'Your Data',
				data: normalizedData(dataValues),
				fill: true,
				clip: false,
				backgroundColor: 'RGBA(254, 154, 0, 0.1)',
				borderColor: 'RGB(254, 154, 0)',
				pointBackgroundColor: 'RGB(254, 154, 0)'
			};
			delete chartContent.options.plugins?.tooltip?.enabled;
			chartContent.update();
			return;
		}

		chart = new Chart(canvas, {
			type: 'radar',
			data: {
				labels: ['Loading', 'Loading', 'Loading'],
				datasets: [
					{
						label: 'std',
						data: normalizedData(milestoneStandard),
						fill: true,
						backgroundColor: 'transparent',
						borderColor: 'rgba(0, 0, 0, 0.2)',
						pointBackgroundColor: 'rgba(0, 0, 0, 0.2)',
						borderWidth: 2
					}
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
					duration: 2000,
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

<canvas class="size-full" bind:this={canvas}></canvas>
