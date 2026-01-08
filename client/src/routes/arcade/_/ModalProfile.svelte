<script lang="ts">
	import { goto } from '$app/navigation';
	import { getContext } from 'svelte';
	import { activeProfile, arcadeFacil } from '$lib/stores/app.svelte';
	import { localAccounts } from '$lib/helpers/localstorage';
	import img from '$img/avatar.webp';
	import Modal from '$reusable/Modal.svelte';

	const regions: Record<string, string> = {
		indonesia: 'Indonesia',
		india: 'India - Global',
		unset: 'Regular'
	};
	const modalHandle = getContext('modalHandle') as () => void;
	const loadProfile = getContext('loadDashProfile') as (u: string, r: string) => Promise<void>;

	let allAccounts = $state(localAccounts.getAll());
	const active = $derived($activeProfile);
	const selectAccount = async (profileUUID: string) => {
		modalHandle();
		if (profileUUID === active?.uuid) return;
		const { facilitator } = localAccounts.getByID(profileUUID) || {};
		await loadProfile?.(profileUUID, facilitator || 'unset');
	};

	const deleteAccount = (uuid: string) => {
		localAccounts.delete(uuid);
		arcadeFacil.set('unset');
		allAccounts = localAccounts.getAll();
		if (active?.uuid !== uuid) return;
		// redirect if deleting the current active account
		modalHandle();
		goto('/arcade');
	};

	let imageErrorAttempt = 0;
	const onImageError = (e: Event) => {
		if (imageErrorAttempt > 1) return;
		imageErrorAttempt++;
		const el = e.target as HTMLImageElement;
		el.src = img;
	};
</script>

<Modal>
	<h1 class="text-center text-xl font-semibold uppercase">Switch Account</h1>
	<div class="mt-5"></div>
	<div class="max-h-50 overflow-auto">
		{#each allAccounts as { avatar, facilitator, name, uuid, active }, i}
			<div
				class="flex w-full items-center border-t-2 hover:bg-gray-200"
				class:!border-t-0={i === 0}
				class:bg-indigo-100={active}
			>
				<button
					class="flex w-full items-center py-0.5 text-left text-sm"
					onclick={() => selectAccount(uuid)}
				>
					<img
						onerror={onImageError}
						src={avatar || img}
						alt={name}
						class="aspect-square size-10 rounded-full object-cover"
					/>
					<span class="ml-2 inline-block">{name}</span>
					<span
						class="ml-2 inline-block text-xs"
						class:bg-sky-200={facilitator === 'india'}
						class:bg-orange-200={facilitator === 'indonesia'}
						class:bg-violet-200={facilitator === 'unset'}
					>
						{regions[facilitator || 'unset']}
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
		<a class="border-4 bg-amber-300 px-5 py-2" href="/arcade?new"> Add New Account</a>
	</div>
</Modal>
