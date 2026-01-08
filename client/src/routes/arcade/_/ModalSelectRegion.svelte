<script lang="ts">
	import { getContext, onMount, setContext } from 'svelte';
	import { activeProfile, ARCADECONFIG, arcadeFacil, initData } from '$lib/stores/app.svelte';
	import { localAccounts } from '$lib/helpers/localstorage';
	import { shortShaId } from '$lib/helpers/crypto';
	import { validateBadge } from '$lib/helpers/loader.arcade';
	import { pushToast } from '$reusable/Toast/Toasts.svelte';
	import pb from '$lib/helpers/pocketbase';
	import Modal from '$reusable/Modal.svelte';
	import { createQuery } from '$lib/stores/query-store';

	const { showModal } = $props();
	let persist = $state(false);
	const modalHandle = getContext('handleFacilitatorSelector') as (val: boolean) => void;

	const facils = $derived.by(() => {
		return createQuery({
			queryKey: ['facils', $ARCADECONFIG?.arcade?.identifier || 'unset'],
			enabled: !!$ARCADECONFIG?.arcade.identifier,
			queryFn: async () => {
				const filter = pb.filter(`identifier={:idf}`, { idf: $ARCADECONFIG?.arcade.identifier });
				const data = await pb.collection('events').getFirstListItem(filter, { expand: 'events' });
				const events = (data.expand?.events || []) as App.FacilMetadata[];
				return events;
			}
		});
	});

	const switchFacilitator = async (facil: string, uuid: string) => {
		const program = $ARCADECONFIG?.arcade.identifier;
		const activeFacil = $ARCADECONFIG?.facilitator?.identifier;
		if (activeFacil === facil) return;
		if (!program) {
			pushToast({ message: 'Failed to update system!, Missing Program!', type: 'warning' });
			return;
		}

		const facilId = facil === 'unset' || !facil ? null : facil;
		const region = facilId?.split('_')?.[1] || 'unset';

		try {
			const target = $facils.data?.find((f) => f?.identifier?.match(new RegExp(region, 'i')));
			const { id: targetFacilId } = target || {};
			const removedId = $facils.data?.filter((f) => f?.id !== targetFacilId).map((f) => f?.id);

			const newConfig = {
				arcade: $ARCADECONFIG.arcade,
				facilitator: target
			};
			const metadata: App.InitData['metadata'] = newConfig;
			ARCADECONFIG.set(newConfig);

			initData.update((courses) => {
				const updated = courses.map((c) => {
					const validity = validateBadge(c.earndate, metadata);
					return { ...c, validity };
				});
				return updated;
			});

			const pid = await shortShaId(uuid);
			const eventProfileid = await shortShaId(`${uuid}-${program}`);
			const batch = pb.createBatch();
			batch.collection('profiles').update(pid, { 'events+': targetFacilId, 'events-': removedId });
			batch
				.collection('event_profiles')
				.update(eventProfileid, { facilitator: region === 'unset' ? null : region });
			await batch.send();

			localAccounts.put({
				...$activeProfile,
				program,
				facilitator: region
			});
			arcadeFacil.set(facilId || 'unset');
			pushToast({ message: 'Facilitator Updated!', type: 'success' });
		} catch (e) {
			console.error(e);
			pushToast({ message: 'Error Occured!', type: 'error' });
		}
	};

	const selectRegion = async (identifier: string) => {
		modalHandle(false);
		persist = false;
		const currentActive = $activeProfile;
		if (!currentActive?.uuid) return;

		try {
			await switchFacilitator(identifier, currentActive.uuid);
		} catch (e) {
			console.error(e);
			pushToast({ message: 'Error Occurred!', type: 'error' });
		}
	};

	setContext('modalHandle', () => {
		modalHandle(!showModal);
		persist = false;
	});

	// onMount(() => {
	// 	const { facilitator } = localAccounts.getActive() || {};
	// 	if (!facilitator) {
	// 		modalHandle(true);
	// 		persist = true;
	// 		return;
	// 	}

	// 	const isValid = facilitatorRegions.includes(facilitator);
	// 	modalHandle(!isValid);
	// 	persist = !isValid;
	// 	if (!isValid) return;
	// 	arcadeFacil.set(facilitator);
	// });
</script>

{#if showModal}
	<Modal {persist}>
		<div class="sm:pt-5 sm:pb-1">
			<h1 class="text-center font-extrabold sm:text-xl">
				Please choose <span class="brutal-text after:!bg-indigo-100">facilitator program</span> you're
				participated!
			</h1>

			<div class="text-center">
				<div class="mt-5 mb-2 flex w-full justify-center gap-3">
					{#each $facils.data as { identifier, title }}
						<button
							onclick={() => selectRegion(identifier || 'unset')}
							class="brutal-border px-2 py-1 {identifier.match('indonesia')
								? 'bg-rose-200  hover:bg-rose-300 active:bg-rose-400'
								: 'bg-amber-200 hover:bg-amber-300 active:bg-amber-400'}"
						>
							{title?.split('-')?.[0].replace(/Facilitator/i, '') || 'unset'}
						</button>
					{/each}
				</div>
				<button class="text-sm underline" onclick={() => selectRegion('unset')}>
					I'm not participated to any facilitator program.
				</button>
			</div>

			<div class="mt-5 text-center text-xs text-gray-600">
				Do not see your Region? Please let me know <a
					href="https://github.com/AguzzTN54/gcsbhelper"
					class="brutal-text text-white after:!bg-gray-700">here</a
				>!
			</div>
		</div>
	</Modal>
{/if}
