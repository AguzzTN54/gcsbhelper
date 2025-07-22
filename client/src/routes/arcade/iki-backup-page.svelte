<script>
	import { onMount, setContext } from 'svelte';
	import { pointList, arcadeProfile as profile } from '$lib/stores/app-store';
	import { accounts } from '$lib/helpers/localstorage';
	import { arcadeDate, timeZone } from '$lib/helpers/dateTime';

	import Modal from '$comp/Modal.svelte';
	import ModalProfile from '../_global/ModalProfile.svelte';
	import SummaryOfficial from './SummaryOfficial.svelte';
	import Summary from './Summary.svelte';
	import Details from './Details.svelte';
	import Forms from './Forms.svelte';

	$: ({ name: user, isOfficial } = $profile);
	const { end, start } = arcadeDate;
	const startDate = start.format('DD MMMM YYYY, HH:mm');
	const endDate = end.format('DD MMMM YYYY, HH:mm');

	let showModal = false;
	let modalType = 'profile';
	let noticeData = { title: '', msg: '' };
	setContext('modalHandle', (type = null, data = {}) => {
		showModal = !showModal;
		modalType = typeof type === 'string' ? type : 'profile';
		if (type === 'notice' && showModal) return (noticeData = data);
		noticeData = {};
	});

	let isLoaded = false;
	onMount(() => {
		if (isLoaded) return;
		isLoaded = true;
		if ($profile.profileID) return;
		const savedAccounts = accounts.getAll();
		const savedLength = savedAccounts.length;
		if (savedLength < 1) return;
		if (savedLength > 1) return (showModal = true);
		const { profileID } = savedAccounts[0];
		profile.set({ profileID });
	});
</script>

<svelte:head>
	<title>Arcade Progress Tracker</title>
</svelte:head>

{#if showModal && isLoaded && modalType === 'profile'}
	<ModalProfile />
{/if}
{#if showModal && isLoaded && modalType === 'notice'}
	<Modal>
		<!-- eslint-disable-next-line svelte/no-at-html-tags -->
		<p>{@html noticeData.msg}</p>
	</Modal>
{/if}

<section>
	<div class="hero">
		<div class="top">
			<h1 class="press">Arcade Progress Tracker</h1>
			<span> {startDate} - {endDate} ({timeZone})</span>
		</div>

		<div class="info-container">
			{#if isOfficial}
				<SummaryOfficial />
			{:else if !!user}
				<Summary {user} points={$pointList} />
			{:else if isLoaded}
				<Forms />
			{/if}
		</div>
	</div>

	{#if user && !isOfficial}
		<Details />
	{/if}
</section>

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
		margin-top: calc(0.085 * var(--screen-height));
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
