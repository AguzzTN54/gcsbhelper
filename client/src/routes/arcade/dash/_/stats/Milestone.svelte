<script lang="ts">
	import { onMount } from 'svelte';
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

	// Real maximums for each category
	const maxValues = {
		Games: 10 * 1.25,
		Trivia: 8 * 1.25,
		Skill: 44 * 1.25,
		'Lab Free': 20 * 1.25
	};

	const milestoneStandard = {
		Games: 10,
		Trivia: 8,
		Skill: 44,
		'Lab Free': 20
	};

	// Current values
	const dataValues = {
		Games: 8,
		Trivia: 4,
		Skill: 44,
		'Lab Free': 18
	};

	// Normalize to 0–100
	const normalizedData = (values: Record<string, number>) => {
		return Object.keys(values).map((key) => {
			const value = values[key as keyof typeof values];
			const maxVal = maxValues[key as keyof typeof maxValues];
			const normalized = (value / maxVal) * 100;
			return normalized;
		});
	};

	onMount(() => {
		if (!canvas) return;

		new Chart(canvas, {
			type: 'radar',
			data: {
				labels: Object.keys(maxValues),
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
					{
						label: 'Your Data',
						data: normalizedData(dataValues),
						fill: true,
						backgroundColor: 'RGBA(254, 154, 0, 0.1)',
						borderColor: 'RGB(254, 154, 0)',
						pointBackgroundColor: 'RGB(254, 154, 0)'
					}
				]
			},
			options: {
				responsive: true,
				layout: {
					padding: {
						top: 10
					}
				},
				scales: {
					r: {
						min: 0,
						max: 100,
						pointLabels: {
							color: 'black',
							font: { weight: 600 }
						},
						ticks: {
							display: false,
							stepSize: 20
						},
						grid: {
							color: 'lightgrey' // Step line color
						}
					}
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
									(percentage / 100) * maxValues[context.label as keyof typeof maxValues]
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
