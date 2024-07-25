<script>
	import { onMount, setContext } from 'svelte';
	import { pointList, profile } from '$lib/stores/app-store';
	import { accounts } from '$lib/helpers/localstorage';
	import { arcadeDate, timeZone } from '$lib/helpers/dateTime';
	import Modal from '$comp/Modal.svelte';
	import Summary from './Summary.svelte';
	import Details from './Details.svelte';
	import Forms from './Forms.svelte';

	$: ({ name: user } = $profile);
	const { end, start } = arcadeDate;
	const startDate = start.format('DD MMMM YYYY, HH:mm');
	const endDate = end.format('DD MMMM YYYY, HH:mm');

	let isLoaded = false;
	onMount(() => {
		if (isLoaded) return;
		isLoaded = true;
		const savedAccounts = accounts.getAll();
		if (savedAccounts.length < 1) return;
		const { profileID } = savedAccounts[0];
		profile.set({ profileID });
	});

	let showModal = false;
	const modalHandle = () => (showModal = !showModal);
	setContext('modalHandle', modalHandle);
</script>

{#if showModal && isLoaded}
	<Modal />
{/if}

<section class="hero">
	<div class="top">
		<h1 class="press">Arcade Progress Tracker</h1>
		<span> {startDate} - {endDate} ({timeZone})</span>
	</div>

	<div class="info-container">
		{#if !!user}
			<Summary {user} points={$pointList} />
		{:else if isLoaded}
			<Forms />
		{/if}
	</div>
</section>

{#if user}
	<Details />
{/if}

<style>
	.hero {
		width: var(--screen-width);
		min-height: var(--screen-height);
		text-align: center;
		padding: 2% 5%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	h1 {
		text-transform: uppercase;
		font-size: x-large;
		line-height: 150%;
		padding-bottom: 0.5rem;
	}

	@media screen and (max-width: 700px) {
		h1 {
			font-size: large;
		}
	}

	.top {
		margin-top: 5%;
		margin-bottom: auto;
	}

	.info-container {
		width: 100%;
		height: calc(0.7 * var(--screen-height));
		margin-bottom: auto;
		display: flex;
		justify-content: center;
		align-items: center;
		position: relative;
	}
</style>
