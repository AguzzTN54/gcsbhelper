<script lang="ts">
	import { fade } from 'svelte/transition';
	import { setContext } from 'svelte';
	import confetti from 'canvas-confetti';
	import { activeProfile, juaraBadges, JUARACONFIG } from '$lib/stores/app.svelte';
	import { useQuery } from '$lib/stores/query-store';
	import { modalHandle } from './ModalProfile.svelte';
	import { analyzeBadges, whatIsMyTier } from '$lib/helpers/calculator-juaragcp';
	import Tooltip from '$reusable/Tooltip';
	import Portal from '$reusable/Portal';
	import Modal from './comp/Modal.svelte';
	import lstorage from '$lib/helpers/localstorage';
	import Rank from './Rank.svelte';
	import { submitRank } from '$lib/helpers/loader.profile';
	import { juaraSeason } from '$lib/data/config';

	const { tier, isvalid, ...tierdata } = $derived(whatIsMyTier($juaraBadges || []));

	const potential = $derived(analyzeBadges($juaraBadges || []));
	const earned = $derived.by(() => {
		const p = $JUARACONFIG.sum === 'point';
		const data = p ? tierdata.points : tierdata;
		const { completion, skill, total } = data;
		return [
			{ title: `Skill ${p ? 'Points' : 'Badges'}`, points: skill },
			{ title: `Completion ${p ? 'Points' : 'Badges'}`, points: completion },
			{ title: 'Total', points: total }
		];
	});

	const { uuid, name } = $derived($activeProfile);
	const q = $derived(useQuery(uuid));

	let tmpPoints = $state<number | undefined>();
	let pointReady = $state(false);

	$effect(() => {
		if (tmpPoints === tierdata?.points?.total || !isvalid || potential.tier === 'notier') {
			pointReady = true;
			return () => (pointReady = false);
		}

		tmpPoints = tierdata?.points?.total;
		submitRank(uuid, juaraSeason.seasonid, tmpPoints).then(() => (pointReady = true));
		return () => (pointReady = false);
	});

	let showModalRank = $state(false);
	setContext('modalHandle', () => (showModalRank = !showModalRank));

	let skipDisclaimer = $state<boolean>(!!lstorage.get('jRankDisclaimer'));
	$effect(() => {
		lstorage.set('jRankDisclaimer', skipDisclaimer);
	});

	const showRank = () => {
		JUARACONFIG.update(({ sum, ...s }) => ({ sum: 'rank', ...s }));
		showModalRank = false;
	};

	const toggleModalRank = () => {
		if ($JUARACONFIG.sum === 'rank') return;
		if (skipDisclaimer) return showRank();
		showModalRank = !showModalRank;
	};

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
		if (!tier.match(/tier1|tier2|tier3/)) return;
		const duration = 3 * 1000;
		const animationEnd = Date.now() + duration;
		const interval = setInterval(() => {
			const timeLeft = animationEnd - Date.now();
			if (timeLeft <= 0) return clearInterval(interval);
			if (tier !== 'tier3') return normalTierConfetti();
			specialConfetti(duration, timeLeft);
		}, 200);
	});
</script>

<Portal target="#main">
	{#if showModalRank}
		<Modal>
			<div
				class="bg-(--color-secondary) pt-2 pb-4 text-center font-bold text-(--color-primary) uppercase"
			>
				Disclaimer
			</div>
			<div class="px-5 pt-4 pb-5">
				<p>
					Peringkat kamu di platform ini
					<span class="font-bold"> tidak mencerminkan peringkat resmi </span>
					dari tim JuaraGCP. Sehingga platform ini tidak dapat digunakan sebagai dasar untuk mengajukan
					banding, mengingat adanya perbedaan variabel pengolahan data yang tidak terlacak.
				</p>
				<div class="mt-4 text-center text-sm">
					<input type="checkbox" bind:checked={skipDisclaimer} id="skipdisclaimer" />
					<label for="skipdisclaimer"> Don't show again </label>
				</div>
				<div class="flex items-center justify-center pt-4">
					<button
						class="rounded-full bg-amber-300 px-5 py-2 text-sm transition-colors duration-300 hover:bg-amber-400"
						onclick={showRank}
					>
						<i class="fasds fa-ranking-star"></i>
						<span>Lihat Ranking</span>
					</button>
				</div>
			</div>
		</Modal>
	{/if}
</Portal>

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

	<div class="relative mt-5 w-full rounded-2xl border-4 bg-[var(--color-primary)] md:mt-0">
		<div
			class="absolute top-0 right-0 flex translate-x-2.5 -translate-y-2/3 overflow-hidden rounded-full border-2 border-[var(--color-secondary)]"
			style="--fa-primary-color:var(--color-pimary)"
		>
			<Tooltip>
				{#snippet popup()}
					{#if $JUARACONFIG.sum === 'point'}
						<span> Perolehan Badges </span>
					{:else}
						<span> Perolehan Point </span>
					{/if}
				{/snippet}

				<button
					onclick={() =>
						JUARACONFIG.update(({ sum, ...s }) => ({
							sum: sum !== 'point' ? 'point' : 'badge',
							...s
						}))}
					class="flex size-full items-center justify-center bg-[var(--color-primary)] p-2 text-sm transition-colors duration-300 hover:bg-[var(--color-secondary)] hover:text-[var(--color-primary)]"
					aria-label="Points"
				>
					{#if $JUARACONFIG.sum === 'point'}
						<i class="fasds fa-badge-check" style="--fa-primary-color:var(--color-third)"></i>
					{:else}
						<i class="fasds fa-binary-circle-check"></i>
					{/if}
				</button>
			</Tooltip>

			<Tooltip>
				{#snippet popup()}
					<span> Ranking Kamu </span>
				{/snippet}
				<button
					onclick={toggleModalRank}
					class:bg-[var(--color-secondary)]={$JUARACONFIG.sum === 'rank'}
					class:text-white={$JUARACONFIG.sum === 'rank'}
					class="flex items-center justify-center bg-[var(--color-primary)] p-2 text-sm transition-colors duration-300 hover:bg-(--color-secondary) hover:text-(--color-primary)"
					aria-label="Peringkat"
				>
					<i class="fasds fa-ranking-star"></i>
				</button>
			</Tooltip>

			<Tooltip>
				{#snippet popup()}
					<span> Refresh </span>
				{/snippet}
				<button
					onclick={() => $q.refetch()}
					class="flex items-center justify-center bg-[var(--color-primary)] p-2 text-sm transition-colors duration-300 hover:bg-[var(--color-secondary)] hover:text-[var(--color-primary)]"
					aria-label="Refetch"
				>
					<i class="fasds fa-arrow-rotate-right"></i>
				</button>
			</Tooltip>
		</div>

		{#if $JUARACONFIG.sum !== 'rank'}
			<div class="grid w-full grid-cols-2 gap-y-2 py-2 sm:grid-cols-3">
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
		{:else}
			{#key uuid}
				<Rank
					{uuid}
					isEligible={!(!isvalid || potential.tier === 'notier')}
					points={pointReady && !(!isvalid || potential.tier === 'notier')
						? tierdata?.points?.total
						: undefined}
				/>
			{/key}
		{/if}
	</div>

	<p class="mt-2 w-full text-sm">
		Jangan lupa untuk mengisi <a href={completionFormUrl} target="_blank" rel="noopener noreferrer" class="font-semibold">Completion Form</a>
		<span class="bg-[var(--color-third)]/20"> setelah mencapai target Tier</span>!
	</p>
</div>