<script>
	import { onMount, setContext } from 'svelte';
	import { juaraProfile } from '$lib/stores/app-store';
	import { accounts } from '$lib/helpers/localstorage';
	import { juaraDate, timeZone } from '$lib/helpers/dateTime';
	import Forms from './Forms.svelte';
	import Summary from './Summary.svelte';
	import ModalProfile from '../_global/ModalProfile.svelte';
	import Details from './Details.svelte';

	const { end, start } = juaraDate;
	const startDate = start.format('DD MMMM YYYY, HH:mm');
	const endDate = end.format('DD MMMM YYYY, HH:mm');

	$: ({ name: user } = $juaraProfile);
	let showModal = false;
	let isLoaded = false;
	setContext('modalHandle', () => (showModal = !showModal));

	onMount(() => {
		if (isLoaded) return;
		isLoaded = true;
		if ($juaraProfile.profileID) return;
		const savedAccounts = accounts.getAll('juaragcp');
		const savedLength = savedAccounts.length;
		if (savedLength < 1) return;
		if (savedLength > 1) return (showModal = true);
		const { profileID } = savedAccounts[0];
		juaraProfile.set({ profileID });
	});
</script>

<svelte:head>
	<title>JuaraGCP Progress Tracker</title>
</svelte:head>

{#if showModal && isLoaded}
	<ModalProfile target="juaragcp" />
{/if}

<section>
	<div class="hero">
		<div class="top">
			<h1>JuaraGCP Progress Tracker</h1>
			<span> {startDate} - {endDate} ({timeZone})</span>
		</div>

		<div class="info-container">
			{#if !!user}
				<Summary />
			{:else if isLoaded}
				<Forms />
			{/if}
		</div>
	</div>
</section>

{#if user}
	<Details />
{/if}

<style>
	.hero {
		padding: 2% 5%;
		width: var(--screen-width);
		min-height: var(--screen-height);
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	h1 {
		text-transform: uppercase;
		font-size: xx-large;
		line-height: 150%;
		padding-bottom: 0.5rem;
		text-align: center;
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
