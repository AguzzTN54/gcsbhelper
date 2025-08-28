<script lang="ts">
	import {
		Chart,
		BarController,
		BarElement,
		CategoryScale,
		LinearScale,
		Title,
		Tooltip,
		Legend
	} from 'chart.js';
	import dayjs from '$lib/helpers/dateTime';
	import { arcadeRegion, initData, profileReady } from '$lib/stores/app-store';
	import Skeleton from '$reusable/Skeleton.svelte';

	let canvas = $state<HTMLCanvasElement>();
	Chart.register(BarController, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

	const typeMap = $derived({
		game: { label: 'Games', backgroundColor: '#59168b' },
		skill: { label: 'Skill', backgroundColor: '#ffb900' },
		...($arcadeRegion === 'india'
			? { labfree: { label: 'Lab-Free', backgroundColor: '#a3b3ff' } }
			: {}),
		unknown: { label: 'Unknown', backgroundColor: '#d1d5dc' }
	});

	const aggregateCourses = (data: App.CourseItem[]) => {
		const dayOffset = $arcadeRegion === 'unset' ? 14 : 7;
		const today = dayjs().startOf('day');
		const days = Array.from({ length: dayOffset }, (_, i) =>
			today.subtract(dayOffset - 1 - i, 'day').format('YYYY-MM-DD')
		);
		const labels = days.map((d) => dayjs(d).format('DD MMM'));
		const datasets = Object.entries(typeMap).map(([_, { label, backgroundColor }]) => ({
			label,
			data: Array(dayOffset).fill(0),
			backgroundColor
		}));

		data.forEach((item) => {
			const isGame = ['wmp', 'trivia', 'game'].includes(item.type || '');
			const type = (isGame ? 'game' : item.type || 'unknown') as keyof typeof typeMap;
			const earnDate = item.earndate ? dayjs(item.earndate).startOf('day') : null;

			if (!earnDate) return;

			const idx = days.findIndex((d) => earnDate.isSame(d, 'day'));
			if (idx !== -1) {
				const dataset = datasets.find((r) => r.label === typeMap[type]?.label);
				if (dataset) {
					dataset.data[idx] += 1;
				}
			}
		});
		return { labels, datasets };
	};

	$effect(() => {
		if (!canvas) return;

		const chart = new Chart(canvas, {
			type: 'bar',
			data: aggregateCourses($initData),
			options: {
				responsive: true,
				maintainAspectRatio: false,
				animation: {
					delay: (context) => {
						return context.type === 'data' && context.mode === 'default'
							? context.dataIndex * 200
							: 0;
					}
				},
				plugins: {
					tooltip: {
						mode: 'index',
						intersect: false
					}
				},
				interaction: {
					mode: 'nearest',
					axis: 'x',
					intersect: false
				},
				scales: {
					x: {
						stacked: true
					},
					y: {
						stacked: true,
						beginAtZero: true
					}
				}
			}
		});

		return () => chart?.destroy();
	});
</script>

{#if $profileReady}
	<canvas bind:this={canvas} class="size-full bg-indig"></canvas>
{:else}
	<div class="size-full items-end flex gap-[5%] px-5">
		<Skeleton class="h-full w-full" />
		<Skeleton class="h-5/12 w-full" />
		<Skeleton class="h-10/12 w-full" />
		<Skeleton class="h-10/12 w-full" />
		<Skeleton class="h-full w-full" />
		<Skeleton class="h-5/12 w-full" />
		<Skeleton class="h-11/12 w-full" />
	</div>
{/if}
