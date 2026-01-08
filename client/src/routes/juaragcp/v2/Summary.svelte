<script lang="ts">
	import { fade } from 'svelte/transition';
	import confetti from 'canvas-confetti';
	import { activeProfile, juaraBadges } from '$lib/stores/app.svelte';
	import { useQuery } from '$lib/stores/query-store';
	import { modalHandle } from './ModalProfile.svelte';
	import { analyzeBadges, whatIsMyTier } from '$lib/helpers/calculator-juaragcp';

	const { tier, isvalid, ...tierdata } = $derived(whatIsMyTier($juaraBadges || []));
	const potential = $derived(analyzeBadges($juaraBadges || []));
	const earned = $derived.by(() => {
		const { completion, skill, total } = tierdata;
		return [
			{ title: 'Skill Badges', points: skill },
			{ title: 'Regular Badges', points: completion },
			{ title: 'Total', points: total }
		];
	});

	const { uuid, name } = $derived($activeProfile);
	const q = $derived(useQuery(uuid));

	// Confetti
	const randomInRange = (min: number, max: number) => {
		return Math.random() * (max - min) + min;
	};

	const colors = ['fbbc04', 'f89701', '4285f4', '2367d8', 'ff6c4b', 'd22b1d', '178935', '34a853'];
	const normalTierConfetti = () => {
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

	$effect(() => {
		if (!tier.match(/tier1|tier2/)) return;
		const duration = 3 * 1000;
		const animationEnd = Date.now() + duration;
		const interval = setInterval(() => {
			const timeLeft = animationEnd - Date.now();
			if (timeLeft <= 0) return clearInterval(interval);
			if (earned[2].points <= 16) return normalTierConfetti();
			specialConfetti(duration, timeLeft);
		}, 200);
	});
</script>

<div
	class="-mt-10 flex w-[600px] max-w-10/12 flex-col items-center justify-center text-center"
	in:fade
>
	<button
		onclick={modalHandle}
		class="w-fit rounded-full bg-[var(--color-secondary)] px-5 py-1.5 font-semibold text-[var(--color-primary)] transition-colors duration-300 hover:bg-amber-900"
	>
		{name}
		<div class="fasds fa-caret-down text-[var(--color-third)]"></div>
	</button>
	{#if !isvalid || potential.tier === 'notier'}
		<h1 class="text-stroke py-4 text-[2rem] font-black sm:text-[3rem]">##NotEligible!</h1>
	{:else}
		<h1 class="text-stroke py-4 text-[3.5rem] leading-[120%] font-black uppercase sm:text-[6rem]">
			{tier}
		</h1>
	{/if}

	<div
		class="relative grid w-full grid-cols-2 gap-y-2 rounded-2xl border-4 bg-[var(--color-primary)] py-2 sm:grid-cols-3"
	>
		<button
			onclick={() => $q.refetch()}
			class="absolute top-0 right-0 flex translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-[var(--color-secondary)] bg-[var(--color-primary)] p-2 text-sm hover:bg-[var(--color-secondary)] hover:text-[var(--color-primary)]"
			style="--fa-primary-color:var(--color-pimary)"
			aria-label="Refetch"
		>
			<i class="fasds fa-arrow-rotate-right"></i>
		</button>
		{#each earned as { points, title }, i}
			<div
				class="flex w-full flex-col items-center p-1 sm:col-span-1 sm:w-full sm:border-t-0 sm:p-2 sm:px-5"
				class:sm:border-r-2={i < 2}
				class:border-r-2={i === 0}
				class:col-span-2={i === 2}
				class:border-t-2={i === 2}
			>
				<div class="w-max text-sm font-semibold sm:text-base">{title}</div>
				<div class="text-3xl font-black">{points}</div>
			</div>
		{/each}
	</div>

	<p class="mt-2 w-full text-sm">
		Jangan lupa untuk mengisi <span class="font-semibold">Completion Form</span>
		<span class="bg-[var(--color-third)]/20"> setelah mencapai target Tier</span>!
	</p>
</div>
