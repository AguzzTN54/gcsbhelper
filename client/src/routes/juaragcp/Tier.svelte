<script lang="ts">
	import { onMount } from 'svelte';
	import confetti from 'canvas-confetti';

	interface Tier {
		tier: number;
		status: string;
		badgeCount?: number;
	}
	const { tierData }: { tierData: Tier } = $props();
	const { tier, status, badgeCount } = tierData || {};

	const randomInRange = (min: number, max: number) => {
		return Math.random() * (max - min) + min;
	};

	const colors = ['fbbc04', 'f89701', '4285f4', '2367d8', 'ff6c4b', 'd22b1d', '178935', '34a853'];

	const tier1Confetti = () => {
		confetti({
			particleCount: 120,
			spread: 100,
			origin: { y: 1 },
			colors
		});
	};

	const tier2Confetti = () => {
		const tier2Config = { particleCount: 20, spread: 55, colors: colors };
		confetti({ ...tier2Config, angle: 60, origin: { x: 0, y: 1 } });
		confetti({ ...tier2Config, angle: 120, origin: { x: 1, y: 1 } });
	};

	const specialConfetti = (duration: number, timeLeft: number) => {
		const defaults = {
			startVelocity: 25,
			spread: 360,
			ticks: 500,
			zIndex: 0,
			particleCount: 50 * (timeLeft / duration),
			colors
		};

		confetti({
			...defaults,
			origin: { x: randomInRange(0.1, 0.5), y: Math.random() - 0.2 }
		});
		confetti({
			...defaults,
			origin: { x: randomInRange(0.6, 0.9), y: Math.random() - 0.2 }
		});
	};

	const runConfetti = () => {
		if (tier < 2) return tier1Confetti();

		const duration = 2 * 1000;
		const animationEnd = Date.now() + duration;
		const interval = setInterval(() => {
			const timeLeft = animationEnd - Date.now();
			if (timeLeft <= 0) return clearInterval(interval);
			if (tier === 2 && (!badgeCount || badgeCount <= 16)) return tier2Confetti();
			specialConfetti(duration, timeLeft);
		}, 200);
	};

	onMount(() => {
		if (!tier || status === 'incomplete') return;
		runConfetti();
	});
</script>

<div class="tier">
	{#if tier === 0 || status === 'incomplete'}
		<h3>NO TIER</h3>
	{:else}
		<h3>TIER {tier}</h3>

		<div class="info">
			<button class="primary_hover_after"> ? </button>
			<div class="tooltip">
				Badge baru yang diperoleh setelah mengisi submission tidak akan digunakan dalam perhitungan
				point!
			</div>
		</div>
	{/if}
</div>

{#if status === 'incomplete' && tier > 0}
	<div class="notes warn">
		<p>
			Badge(s) dengan label "<b>Mandatory</b>" wajib diselesaikan dalam periode event!
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
		position: relative;
		padding: calc(0.01 * var(--screen-height));
		width: fit-content;
		margin: auto;
	}
	.tier h3 {
		font-size: calc(0.1 * var(--screen-height));
		font-weight: 800;
		width: fit-content;
		display: inline-block;
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

	.info {
		position: relative;
		right: 0;
		bottom: 0;
		display: inline flex;

		button {
			box-shadow: var(--outer-shadow);
			background-color: var(--color-bg);
			outline: 0;
			border: 0;
			width: 35px;
			aspect-ratio: 1/1;
			border-radius: 100%;
			justify-content: center;
			align-items: center;
			font-size: larger;
			transition: all 0.2s;

			&:hover {
				background-color: var(--color-theme-1);
				color: white;
			}
			&:hover ~ .tooltip {
				opacity: 1;
			}
		}

		.tooltip {
			opacity: 0;
			transition: all 0.5s;
			position: absolute;
			left: 50%;
			bottom: 110%;
			transform: translateX(-50%);
			display: block;
			width: 400px;
			max-width: 50vw;
			background-color: var(--color-bg);
			box-shadow: var(--outer-shadow);
			font-size: small;
			line-height: 1.3;
			padding: 0.5rem 1rem;
			text-align: left;
			color: var(--color-theme-1);
		}
	}
</style>
