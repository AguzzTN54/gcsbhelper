<script lang="ts">
	import { setContext } from 'svelte';
	import { arcadeRegion } from '$lib/stores/app-store';
	import ModalSelectRegion from '../../_/ModalSelectRegion.svelte';
	import Portal from '$reusable/Portal/Portal.svelte';

	const regions: Record<string, string> = {
		indonesia: 'Facilitator Indonesia',
		global: 'Global Facilitator',
		unset: 'Regular Participan'
	};

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
				<h1 class="font-bold text-3xl leading-[70%]">100</h1>
				<span class="text-[size:10px] block"> points</span>
			</div>
		</div>
		<div class="flex flex-col py-1 w-[calc(100%-5rem)] text-center items-center">
			<h1 class="font-semibold text-lg brutal-text after:!bg-sky-200/80 w-fit">Arcade Ranger</h1>
			<div class="grid grid-cols-2 text-sm mt-2">
				<div class="">
					<span class="font-light text-xs block">Badges</span>
					<span class="font-extrabold">50</span>
				</div>
				<div class="">
					<span class="font-light text-xs block">Milestone</span>
					<span class="font-extrabold">milestone.2</span>
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
