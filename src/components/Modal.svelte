<script>
	import { getContext } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import { OverlayScrollbarsComponent } from 'overlayscrollbars-svelte';
	import { profile } from '$lib/stores/app-store';
	import { accounts } from '$lib/helpers/localstorage';

	const modalHandle = getContext('modalHandle');
	let myAccounts = accounts.getAll();

	const { profileID: activeProfile } = $profile;
	const selectAccount = (profileID) => {
		modalHandle();
		if (profileID === activeProfile) return;
		profile.set({ profileID });
	};

	const deleteAccount = (profileID) => {
		myAccounts = myAccounts.filter(({ profileID: id }) => profileID !== id);
		accounts.delete(profileID);
	};

	const addNew = () => {
		profile.set({});
		modalHandle();
	};
</script>

<section on:mousedown|self={modalHandle} role="button" tabindex="0" transition:fade>
	<div class="container" transition:fly={{ y: 20 }}>
		<h1 class="header">Your Arcade Accounts</h1>
		<div class="body">
			{#if myAccounts.length < 1}
				<div class="iete" style="text-align: center;">No Data</div>
			{:else}
				<div class="scroll">
					<OverlayScrollbarsComponent options={{ scrollbars: { theme: 'os-theme-dark' } }} defer>
						<div class="list">
							{#each myAccounts as { name, profileID }}
								<div class="item" class:active={activeProfile === profileID}>
									<button class="name" on:click={() => selectAccount(profileID)}>
										{name}
									</button>
									<div class="delete">
										<button class="delete" on:click={() => deleteAccount(profileID)}>
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
			<button class="more-account" on:click={addNew}> Track Different Account </button>
		</div>
	</div>
</section>

<style>
	section {
		position: fixed;
		width: var(--screen-width);
		height: var(--screen-height);
		z-index: +10;
		background-color: rgba(0, 0, 0, 0.1);
		backdrop-filter: blur(8px);
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.container {
		width: 600px;
		max-width: 90%;
		background-color: #fff;
		padding: 1rem;
		border-radius: 0.5rem;
		box-shadow: 0 0 1rem rgba(0, 0, 0, 0.1);
	}

	.header {
		font-size: 1.2rem;
		text-align: center;
		margin-bottom: 1rem;
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
	}
	.item.active {
		background-color: #f6f6f6;
	}

	.item:hover {
		background-color: #f0f0f0;
	}

	.item:first-child {
		border-top: unset;
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
	}
	button.delete:hover {
		background-color: rgb(243, 59, 59);
		color: #fff;
	}

	.footer {
		text-align: center;
		margin-bottom: 0.5rem;
	}

	.more-account {
		background-image: var(--color-gradient);
		background-size: 200%;
		background-position: 80%;
		font-size: 1rem;
		border: 0;
		outline: 0;
		padding: 0.5rem;
		color: #fff;
		width: 200px;
		border-radius: 5px;
		transition:
			transform 0.1s,
			background 0.3s;
	}

	.more-account:hover {
		background-position: 0;
	}
	.more-account:active {
		transform: scale(0.95);
	}
</style>
