<script lang="ts">
	import { getContext } from 'svelte';
	import { OverlayScrollbarsComponent } from 'overlayscrollbars-svelte';
	import { arcadeProfile, juaraProfile } from '$lib/stores/app-store';
	import { accounts } from '$lib/helpers/localstorage';
	import Modal from '$comp/Modal.svelte';
	import Button from '$comp/Button.svelte';

	const { target = 'arcade' } = $props();
	const profile = target === 'arcade' ? arcadeProfile : juaraProfile;

	const modalHandle = getContext('modalHandle') as () => void;
	let myAccounts = $state(accounts.getAll(target).filter(({ profileID }) => !!profileID));

	const { profileID: activeProfile } = $profile;
	const selectAccount = (profileID: string) => {
		modalHandle();
		if (profileID === activeProfile) return;
		profile.set({ profileID, name: '' });
	};

	const deleteAccount = (profileID: string) => {
		myAccounts = myAccounts.filter(({ profileID: id }) => profileID !== id);
		accounts.delete(profileID, target);
	};

	const addNew = () => {
		profile.set({ name: '', profileID: '' });
		modalHandle();
	};
</script>

<Modal>
	<h1 class="header">Your {target === 'arcade' ? 'Arcade' : 'JuaraGCP'} Accounts</h1>
	<div class="body">
		{#if myAccounts.length < 1}
			<div class="iete" style="text-align: center;">No Data</div>
		{:else}
			<div class="scroll">
				<OverlayScrollbarsComponent options={{ scrollbars: { theme: 'os-theme-dark' } }} defer>
					<div class="list">
						{#each myAccounts as { name, profileID }}
							<div class="item" class:active={activeProfile === profileID}>
								<button class="name" onclick={() => selectAccount(profileID)}>
									{name}
								</button>
								<div class="delete">
									<button
										class="delete"
										aria-label="Delete"
										onclick={() => deleteAccount(profileID)}
									>
										<i class="gc-trash"></i>
									</button>
								</div>
							</div>
						{/each}
					</div>
				</OverlayScrollbarsComponent>
			</div>
		{/if}
	</div>
	<div class="footer">
		<Button onclick={addNew}>Check Another Account</Button>
	</div>
</Modal>

<style>
	.header {
		font-size: 1.2rem;
		text-align: center;
		margin-bottom: 1rem;
		font-weight: 600;
	}
	.body {
		padding: 0 0 1rem;
	}

	.list {
		max-height: calc(0.3 * var(--screen-height));
		padding: 0 0.5rem;
	}

	.item {
		display: flex;
		border-top: 1px solid #ccc;
		justify-content: space-between;
		align-items: center;
		transition: background 0.25s;
		position: relative;

		&.active {
			background-color: #f8fbff;
		}

		&:hover {
			box-shadow: var(--outer-shadow);
			background-color: #fff;
			z-index: +2;
		}

		&:first-child {
			border-top: unset;
		}
	}

	.scroll {
		border-bottom: 1px solid #ccc;
		border-top: 1px solid #ccc;
	}

	.name {
		padding: calc(0.0125 * var(--screen-height)) calc(0.025 * var(--screen-height));
		background-color: transparent;
		border: 0;
		font-size: initial;
		font-weight: 500;
		display: block;
		width: 100%;
		text-align: left;
	}

	button.delete {
		height: calc(0.06 * var(--screen-height));
		border: 0;
		aspect-ratio: 1/1;
		transition: all 0.25s;
		font-size: large;
		display: flex;
		justify-content: center;
		align-items: center;
		box-shadow: var(--outer-shadow);
	}
	button.delete:hover {
		background-color: rgb(243, 59, 59);
		color: #fff;
	}

	.footer {
		text-align: center;
		margin-bottom: 0.5rem;
	}
</style>
