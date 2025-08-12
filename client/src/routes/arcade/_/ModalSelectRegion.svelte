<script lang="ts">
	import { getContext, onMount, setContext } from 'svelte';
	import Modal from '../../_global/reusable/Modal.svelte';
	import lstorage from '$lib/helpers/localstorage';
	import { arcadeRegion } from '$lib/stores/app-store';
	import { FacilitatorRegions } from '$lib/config';

	const { showModal } = $props();

	let persist = $state(false);
	const modalHandle = getContext('handleFacilitatorSelector') as (val: boolean) => void;

	const selectRegion = (region: App.FacilitatorRegion) => {
		modalHandle(false);
		persist = false;
		arcadeRegion.set(region);
		lstorage.set('facilitator', region);
	};
	setContext('modalHandle', () => {
		modalHandle(!showModal);
		persist = false;
	});

	onMount(() => {
		const facilitator = lstorage.get('facilitator');
		if (!facilitator) {
			modalHandle(true);
			persist = true;
			return;
		}

		const isValid = FacilitatorRegions.includes(facilitator);
		modalHandle(!isValid);
		console.log(isValid);
		persist = !isValid;
		if (!isValid) return;
		arcadeRegion.set(facilitator);
	});
</script>

{#if showModal}
	<Modal {persist}>
		<div class="sm:pt-5 sm:pb-1">
			<h1 class="text-center font-extrabold sm:text-xl">
				Please choose <span class="brutal-text after:!bg-indigo-100">facilitator program</span> you're
				participated!
			</h1>

			<div class="text-center">
				<div class="flex w-full justify-center gap-3 mt-5 mb-2">
					<button
						onclick={() => selectRegion('global')}
						class="px-2 py-1 brutal-border bg-amber-200 hover:bg-amber-300 active:bg-amber-400"
					>
						Global (India)
					</button>
					<button
						onclick={() => selectRegion('indonesia')}
						class="px-2 py-1 brutal-border bg-rose-200 hover:bg-rose-300 active:bg-rose-400"
					>
						Indonesia
					</button>
				</div>
				<button class="text-sm underline" onclick={() => selectRegion('unset')}>
					I'm not participated to any facilitator program.
				</button>
			</div>

			<div class="mt-5 text-xs text-center text-gray-600">
				Do not see your Region? Please let me know <a
					href="https://github.com/AguzzTN54/gcsbhelper"
					class="brutal-text text-white after:!bg-gray-700">here</a
				>!
			</div>
		</div>
	</Modal>
{/if}
