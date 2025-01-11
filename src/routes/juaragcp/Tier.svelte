<script lang="ts">
	import { onMount } from 'svelte';
	import confetti from 'canvas-confetti';

	interface Tier {
		tier: number;
		status: string;
	}
	const { tierData }: { tierData: Tier } = $props();
	const { tier, status } = tierData || {};

	const runConfetti = () => {
		const duration = 2.5 * 1000;
		const animationEnd = Date.now() + duration;
		const defaults = {
			startVelocity: 25,
			spread: 360,
			ticks: 500,
			zIndex: 0,
			colors: ['fbbc04', 'f89701', '4285f4', '2367d8', 'ff6c4b', 'd22b1d', '178935', '34a853']
		};

		function randomInRange(min: number, max: number) {
			return Math.random() * (max - min) + min;
		}

		const interval = setInterval(() => {
			const timeLeft = animationEnd - Date.now();

			if (timeLeft <= 0) return clearInterval(interval);

			const particleCount = 50 * (timeLeft / duration);
			confetti({
				...defaults,
				particleCount,
				origin: { x: randomInRange(0.1, 0.5), y: Math.random() - 0.2 }
			});
			confetti({
				...defaults,
				particleCount,
				origin: { x: randomInRange(0.6, 0.9), y: Math.random() - 0.2 }
			});
		}, 200);
	};
	onMount(() => {
		if (tier < 1 || status === 'incomplete') return;
		runConfetti();
	});
</script>

<div class="tier">
	{#if tier === 0 || status === 'incomplete'}
		<h3>NO TIER</h3>
	{:else}
		<h3>TIER {tier}</h3>
	{/if}
</div>

{#if status === 'incomplete' && tier > 0}
	<div class="notes warn">
		<p>
			Badge(s) dengan label "<b>Mandatory</b>" wajib diselesaikan!
		</p>
	</div>
{:else if tier > 0}
	<div class="notes">
		<p>
			Selamat! Kini kamu bisa <b>Cek Kembali Email Welcome</b> dari #JuaraGCP untuk mengisi
			<b> Completion Form </b> dan nantikan info berikutnya dari #JuaraGCP!
			<br />
			Tapi Eits... jangan stop di sini!! masih banyak materi GCP yang bisa kamu pelajari di
			<a href="https://www.cloudskillsboost.google/catalog" target="_blank">Cloud Skill Boost</a>!!
		</p>
	</div>
{/if}

<style>
	.tier {
		padding: calc(0.01 * var(--screen-height));
	}
	.tier h3 {
		font-size: calc(0.1 * var(--screen-height));
		font-weight: 800;
	}

	@media screen and (max-width: 540px) {
		.tier h3 {
			font-size: calc(0.07 * var(--screen-height));
		}
	}

	a {
		text-decoration: underline;
	}

	.notes {
		width: 750px;
		max-width: 100%;
		padding: 0.5rem 1rem 1rem;
		border: 2px dashed var(--color-theme-1);
		color: var(--color-theme-1);
		border-radius: 1rem;
		margin: auto;
	}

	.notes.warn {
		border-color: #f89701;
		color: #f89701;
	}
</style>
