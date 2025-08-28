<script lang="ts">
	import { goto } from '$app/navigation';
	import { getContext } from 'svelte';
	import { arcadeRegion } from '$lib/stores/app-store';
	import { localAccounts } from '$lib/helpers/localstorage';
	import img from '$img/avatar.webp';
	import Modal from '$reusable/Modal.svelte';
	const allAccounts = localAccounts.getAll();

	const regions: Record<string, string> = {
		indonesia: 'Indonesia',
		india: 'India - Global',
		unset: 'Regular'
	};
	const modalHandle = getContext('modalHandle') as () => void;
	const loadProfile = getContext('loadDashProfile') as (u: string, r: string) => Promise<void>;

	const active = localAccounts.getActive();
	const selectAccount = async (profileUUID: string) => {
		modalHandle();
		if (profileUUID === active?.uuid) return;
		const { facilitator } = localAccounts.getByID(profileUUID) || {};
		await loadProfile?.(profileUUID, facilitator || 'unset');
	};

	const deleteAccount = (uuid: string) => {
		localAccounts.delete(uuid);
		arcadeRegion.set('unset');
		modalHandle();
		goto('/arcade');
	};
</script>

<Modal>
	<h1 class="text-center font-semibold uppercase text-xl">Switch Account</h1>
	<div class="mt-5"></div>
	<div class="overflow-auto max-h-50">
		{#each allAccounts as { avatar, facilitator, name, uuid, active }, i}
			<div
				class="flex w-full items-center border-t-2 hover:bg-gray-200"
				class:!border-t-0={i === 0}
				class:bg-indigo-100={active}
			>
				<button
					class="w-full text-left flex items-center py-0.5 text-sm"
					onclick={() => selectAccount(uuid)}
				>
					<img
						onerror={(e) => ((e.target as HTMLImageElement).src = img)}
						src={avatar || img}
						alt={name}
						class="rounded-full object-cover aspect-square size-10"
					/>
					<span class="inline-block ml-2">{name}</span>
					<span
						class="inline-block ml-2 text-xs"
						class:bg-sky-200={facilitator === 'india'}
						class:bg-orange-200={facilitator === 'indonesia'}
						class:bg-violet-200={facilitator === 'unset'}
					>
						{regions[facilitator]}
					</span>
				</button>
				<button
					aria-label="Delete"
					class="aspect-square w-12 bg-red-200 hover:bg-rose-400"
					onclick={() => deleteAccount(uuid)}
				>
					<i class="fasdl fa-trash-can text-rose-300"></i>
				</button>
			</div>
		{/each}
	</div>
	<div class="mt-5 flex justify-center">
		<a class="py-2 px-5 bg-amber-300 border-4" href="/arcade?new"> Add New Account</a>
	</div>
</Modal>
