<script lang="ts">
	import { onMount } from 'svelte';
	import {
		Chart,
		LineController,
		LineElement,
		PointElement,
		LinearScale,
		Title,
		CategoryScale,
		Tooltip,
		Legend
	} from 'chart.js';

	// Register chart.js components
	Chart.register(
		LineController,
		LineElement,
		PointElement,
		LinearScale,
		Title,
		CategoryScale,
		Tooltip,
		Legend
	);

	let canvas = $state<HTMLCanvasElement>();

	// Example data: last 7 days
	const today = new Date();
	const labels: string[] = [];
	const dataValues: number[] = [];

	for (let i = 6; i >= 0; i--) {
		const date = new Date(today);
		date.setDate(today.getDate() - i);
		labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));

		// Fake random number of games completed
		dataValues.push(Math.floor(Math.random() * 10) + 1);
	}

	onMount(() => {
		if (!canvas) return;
		new Chart(canvas, {
			type: 'line',
			data: {
				labels,
				datasets: [
					{
						label: 'Games Completed',
						data: dataValues,
						borderColor: 'rgb(75, 192, 192)',
						backgroundColor: 'rgba(75, 192, 192, 0.2)',
						tension: 0.3, // curve
						fill: true,
						pointRadius: 5,
						pointHoverRadius: 7
					}
				]
			},
			options: {
				responsive: true,
				maintainAspectRatio: false,
				animation: {
					onComplete: () => {
						// Optional: callback when animation finishes
					},
					delay: (context) => {
						// Delay each point for a "draw" effect
						return context.type === 'data' && context.mode === 'default'
							? context.dataIndex * 200
							: 0;
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
					}
				},
				scales: {
					y: {
						beginAtZero: true,
						ticks: {
							stepSize: 1
						}
					}
				}
			}
		});
	});
</script>

<canvas bind:this={canvas} class="size-full"></canvas>
