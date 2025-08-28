<script lang="ts">
	import { setContext } from 'svelte';
	import { arcadeRegion } from '$lib/stores/app-store';
	import Form from './_/Form.svelte';
	import ModalSelectRegion from './_/ModalSelectRegion.svelte';

	const regions: Record<string, string> = {
		indonesia: 'Indonesia',
		india: 'India - Global',
		unset: 'Regular Participan'
	};

	let showModal = $state(false);
	const handleFacilitatorSelector = (val?: boolean) => {
		showModal = typeof val === 'boolean' ? val : !showModal;
	};
	setContext('handleFacilitatorSelector', handleFacilitatorSelector);
</script>

<svelte:head>
	<title>CloudSkillBoost Arcade Progress Tracker</title>
</svelte:head>

<ModalSelectRegion {showModal} />

<section class="font-extrabold p-2 flex flex-col h-full">
	<h1 class="text-2xl sm:text-3xl md:text-4xl text-center p-3 mt-5 sm:mt-10 sm:p-5">
		<span class="brutal-text after:!bg-sky-600 text-white italic"> Arcade </span> Progress Tracker
	</h1>

	<Form />

	<div class="text-sm mb-5 text-center">
		<span>Arcade Facilitator</span>
		<div class="flex justify-center">
			<button
				onclick={() => handleFacilitatorSelector?.()}
				class="brutal-border pl-5 pr-3 py-1 !border-[4px] hover:bg-indigo-200 active:bg-indigo-300 text-xs"
			>
				{regions[$arcadeRegion]} <i class="fasdl fa-caret-down text-amber-200"></i>
			</button>
		</div>
	</div>

	<article class="mb-5 px-[2%] text-center sm:text-sm md:text-base text-xs">
		<span class="brutal-text after:!bg-green-300">Privacy First</span> — This site does not collect
		any personally identifiable data unless you want it to. We will only create a unique
		<span class="brutal-text after:!bg-indigo-200">Hashed ID</span> solely to help us analyze course
		progress.
	</article>
</section>
