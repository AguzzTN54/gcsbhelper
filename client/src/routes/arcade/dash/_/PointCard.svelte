<script lang="ts">
	import { setContext } from 'svelte';
	import { ARCADECONFIG, arcadeStats, loadSteps, profileReady } from '$lib/stores/app.svelte';
	import ModalSelectRegion from '../../_/ModalSelectRegion.svelte';
	import Portal from '$reusable/Portal/Portal.svelte';
	import Skeleton from '$reusable/Skeleton.svelte';
	// import { createQuery } from '$lib/stores/query-store';
	// import pb from '$lib/helpers/pocketbase';

	const { complete, milestones = [], tier, total } = $derived($arcadeStats || {});

	const facils = $derived.by(() => {
		if (!$ARCADECONFIG?.facilitator) return null;
		const { title, identifier } = $ARCADECONFIG.facilitator;
		return { title, facilId: identifier };
	});

	const ready = $derived($profileReady && loadSteps.enrollmentdata && loadSteps.enrollmentdata);
	let showModal = $state(false);
	const handleFacilitatorSelector = (val?: boolean) => {
		showModal = typeof val === 'boolean' ? val : !showModal;
	};
	setContext('handleFacilitatorSelector', handleFacilitatorSelector);
</script>

<Portal target="#main">
	<ModalSelectRegion {showModal} />
</Portal>

<div class="brutal-border rounded-tl-3xl rounded-br-3xl bg-amber-100">
	<div
		class="flex overflow-hidden rounded-tl-3xl rounded-br-3xl border-r-2 border-b-2 border-[color:var(--stroke)] bg-gray-100"
	>
		<div
			class="flex h-20 w-fit min-w-20 scale-105 items-center justify-center overflow-hidden rounded-br-3xl border-r-2 border-b-2 bg-indigo-100 p-2"
		>
			<div class="translate-y-1/5 text-center">
				{#if ready}
					<h1 class="text-3xl leading-[70%] font-bold">{total}</h1>
				{:else}
					<Skeleton class="h-7 w-10 -translate-y-1/5 rounded-md" />
				{/if}
				<span class="block text-[size:10px]"> points </span>
			</div>
		</div>
		<div class="flex w-[calc(100%-5rem)] flex-col items-center py-1 text-center">
			{#if ready}
				<h1 class="brutal-text w-fit text-lg font-semibold capitalize after:!bg-sky-200/80">
					{tier !== 'start' ? 'Arcade ' + tier : 'No Tier'}
				</h1>
			{:else}
				<Skeleton class="h-6 w-7/12" />
			{/if}
			<div class="mt-2 grid grid-cols-2 gap-1 text-sm">
				<div class="text-center">
					<span class="block text-xs font-light">Valid Badges</span>
					{#if ready}
						<span class="font-extrabold">
							{complete.arcade}
						</span>
					{:else}
						<Skeleton class="-mb-1 inline-block h-4 w-10" />
					{/if}
				</div>
				<div class="">
					<span class="block text-xs font-light">Milestone</span>
					{#if ready}
						<span class="font-extrabold">
							{[...(milestones || [])].reverse()[0] || '-'}
						</span>
					{:else}
						<Skeleton class="-mb-1 inline-block h-4 w-15" />
					{/if}
				</div>
			</div>
		</div>
	</div>

	<div class="flex justify-center px-2 py-1 text-sm">
		<button class="text-amber-900 underline" onclick={() => handleFacilitatorSelector?.()}>
			{facils?.title?.split('-')?.[0] || 'unset'} <i class="fasdl fa-caret-down text-amber-800"></i>
		</button>
	</div>
</div>
