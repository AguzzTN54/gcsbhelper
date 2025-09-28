<script module>
	let showModal = $state(false);
	export const modalHandle = () => (showModal = !showModal);
</script>

<script lang="ts">
	import Portal from '$reusable/Portal';
	import { setContext } from 'svelte';
	import { localAccounts } from '$lib/helpers/localstorage';
	import { activeProfile } from '$lib/stores/app.svelte';
	import { pushToast } from '$reusable/Toast/Toasts.svelte';
	import img from '$img/avatar.webp';
	import Modal from './comp/Modal.svelte';
	setContext('modalHandle', modalHandle);

	const { uuid: activeuuid } = $derived($activeProfile || {});
	const allAccounts = () => localAccounts.getAll('juaragcp');

	const selectAccount = (uuid: string) => {
		modalHandle();
		const targetProfile = localAccounts.getByID(uuid, 'juaragcp');
		if (!targetProfile) return pushToast({ type: 'error', message: 'Invalid Account' });
		activeProfile.set(targetProfile);
	};

	const deleteAccount = (uuid: string) => {
		localAccounts.delete(uuid, 'juaragcp');
		modalHandle();

		if (activeuuid !== uuid) return;
		activeProfile.set({ name: '', uuid: '', avatar: '' });
	};

	const addAccount = () => {
		activeProfile.set({ name: '', uuid: '', avatar: '' });
		modalHandle();
	};

	let imageErrorAttempt = 0;
	const onImageError = (e: Event) => {
		if (imageErrorAttempt > 1) return;
		imageErrorAttempt++;
		const el = e.target as HTMLImageElement;
		el.src = img;
	};
</script>

<Portal target="#main">
	{#if showModal}
		<Modal>
			<div
				class="bg-[var(--color-secondary)] pt-2 pb-4 text-center font-bold text-[var(--color-primary)] uppercase"
			>
				Switch Account
			</div>
			<div class="px-5 pt-4 pb-5">
				<div class="max-h-50 overflow-auto">
					{#each allAccounts() as { avatar, name, uuid }, i}
						{@const active = uuid === activeuuid}
						<div
							class="flex w-full items-center border-t-1 border-[var(--color-secondary)]/40 transition-colors duration-300 hover:bg-[var(--color-secondary)]/10"
							class:!border-t-0={i === 0}
							class:bg-amber-200={active}
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
								<span class="ml-2 inline-block" class:font-semibold={active}>{name}</span>
							</button>
							<button
								aria-label="Delete"
								class="aspect-square w-12 hover:bg-red-200"
								onclick={() => deleteAccount(uuid)}
							>
								<i class="fasds fa-trash-can text-rose-600"></i>
							</button>
						</div>
					{/each}
				</div>

				<div class="pt-4 text-center">
					<button
						onclick={addAccount}
						class="rounded-full bg-amber-300 px-5 py-2 text-sm transition-colors duration-300 hover:bg-amber-400"
					>
						Add Account <i class="fasds fa-user-plus"></i>
					</button>
				</div>
			</div>
		</Modal>
	{/if}
</Portal>
