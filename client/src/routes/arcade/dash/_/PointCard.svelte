<script lang="ts">
	import { setContext } from 'svelte';
	import { arcadeRegion, arcadeStats, loadSteps, profileReady } from '$lib/stores/app.svelte';
	import ModalSelectRegion from '../../_/ModalSelectRegion.svelte';
	import Portal from '$reusable/Portal/Portal.svelte';
	import Skeleton from '$reusable/Skeleton.svelte';

	const { complete, milestones = [], tier, total } = $derived($arcadeStats || {});
	const regions: Record<string, string> = {
		indonesia: 'Facilitator Indonesia',
		india: 'Facilitator India',
		unset: 'Regular Participant'
	};

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

<div class="brutal-border rounded-br-3xl rounded-tl-3xl bg-amber-100">
	<div
		class="flex border-r-2 border-b-2 border-[color:var(--stroke)] rounded-br-3xl rounded-tl-3xl overflow-hidden bg-gray-100"
	>
		<div
			class="h-20 w-fit p-2 min-w-20 scale-105 border-r-2 border-b-2 overflow-hidden rounded-br-3xl flex items-center justify-center bg-indigo-100"
		>
			<div class="text-center translate-y-1/5">
				{#if ready}
					<h1 class="font-bold text-3xl leading-[70%]">{total}</h1>
				{:else}
					<Skeleton class="h-7 w-10 rounded-md -translate-y-1/5" />
				{/if}
				<span class="text-[size:10px] block"> points</span>
			</div>
		</div>
		<div class="flex flex-col py-1 w-[calc(100%-5rem)] text-center items-center">
			{#if ready}
				<h1 class="font-semibold text-lg brutal-text after:!bg-sky-200/80 w-fit capitalize">
					{tier !== 'start' ? 'Arcade ' + tier : 'No Tier'}
				</h1>
			{:else}
				<Skeleton class="w-7/12 h-6" />
			{/if}
			<div class="grid grid-cols-2 text-sm mt-2 gap-1">
				<div class="text-center">
					<span class="font-light text-xs block">Valid Badges</span>
					{#if ready}
						<span class="font-extrabold">
							{complete.arcade}
						</span>
					{:else}
						<Skeleton class="w-10 h-4 inline-block -mb-1" />
					{/if}
				</div>
				<div class="">
					<span class="font-light text-xs block">Milestone</span>
					{#if ready}
						<span class="font-extrabold">
							{[...(milestones || [])].reverse()[0] || '-'}
						</span>
					{:else}
						<Skeleton class="w-15 h-4 inline-block -mb-1" />
					{/if}
				</div>
			</div>
		</div>
	</div>

	<div class="flex text-sm px-2 py-1 justify-center">
		<button class="underline text-amber-900" onclick={() => handleFacilitatorSelector?.()}>
			{regions[$arcadeRegion]} <i class="fasdl fa-caret-down text-amber-800"></i>
		</button>
	</div>
</div>
