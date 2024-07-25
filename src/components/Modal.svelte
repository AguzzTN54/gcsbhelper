<script>
	import { getContext } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import { profile } from '$lib/stores/app-store';
	import { accounts } from '$lib/helpers/localstorage';

	const modalHandle = getContext('modalHandle');
	let myAccounts = accounts.getAll();

	const selectAccount = (profileID) => {
		profile.set({ profileID });
		modalHandle();
	};

	const deleteAccount = (profileID) => {
		myAccounts = myAccounts.filter(({ profileID: id }) => profileID !== id);
		accounts.delete(profileID);
	};
</script>

<section on:mousedown|self={modalHandle} role="button" tabindex="0" transition:fade>
	<div class="container" transition:fly={{ y: 20 }}>
		<h1 class="header">Your Arcade Accounts</h1>
		<div class="body">
			{#if myAccounts.length < 1}
				<div class="iete" style="text-align: center;">No Data</div>
			{:else}
				<div class="list">
					{#each myAccounts as { name, profileID }}
						<div class="item">
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
			{/if}
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

	.item {
		display: flex;
		border-top: 1px solid #ccc;
		justify-content: space-between;
		align-items: center;
		transition: background 0.25s;
	}

	.item:hover {
		background-color: #f0f0f0;
	}

	.item:last-child {
		border-bottom: 1px solid #ccc;
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
</style>
