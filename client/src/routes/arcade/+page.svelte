<script lang="ts">
	import { setContext } from 'svelte';
	// import { arcadeFacil } from '$lib/stores/app.svelte';
	import Portal from '$reusable/Portal/Portal.svelte';
	import ModalSelectRegion from './_/ModalSelectRegion.svelte';
	import Form from './_/Form.svelte';

	// const regions: Record<string, string> = {
	// 	indonesia: 'Indonesia',
	// 	india: 'India - Global',
	// 	unset: 'Regular Participan'
	// };

	let showModal = $state(false);
	const handleFacilitatorSelector = (val?: boolean) => {
		showModal = typeof val === 'boolean' ? val : !showModal;
	};
	setContext('handleFacilitatorSelector', handleFacilitatorSelector);
</script>

<Portal target="#main">
	<ModalSelectRegion {showModal} />
</Portal>

<section class="flex h-full flex-col p-2 font-extrabold">
	<h1 class="mt-5 p-3 text-center text-2xl sm:mt-10 sm:p-5 sm:text-3xl md:text-4xl">
		<span class="brutal-text font-press text-2xl text-amber-300 after:!bg-sky-900"> Arcade </span> Progress
		Tracker 2026
	</h1>
	<div class="-mt-2 text-center text-2xl font-medium">
		<span> Cohort 1 </span>
	</div>

	<Form />

	<!-- <div class="mb-5 text-center text-sm">
		<span>Arcade Facilitator</span>
		<div class="flex justify-center">
			<button
				onclick={() => handleFacilitatorSelector?.()}
				class="brutal-border !border-[4px] py-1 pr-3 pl-5 text-xs hover:bg-indigo-200 active:bg-indigo-300"
			>
				{regions[$arcadeFacil]} <i class="fasdl fa-caret-down text-amber-200"></i>
			</button>
		</div>
	</div> -->

	<!-- <article class="mb-5 px-[2%] text-center text-xs sm:text-sm md:text-base">
		<span class="brutal-text after:!bg-green-300">Privacy First</span> — This site does not collect
		any personally identifiable data unless you want it to. We will only create a
		<span class="brutal-text after:!bg-indigo-200">unique ID</span> solely to help us analyze course
		progress.
	</article> -->
</section>
