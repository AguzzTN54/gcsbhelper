<script>
	import { onMount, setContext } from 'svelte';
	import { juaraProfile } from '$lib/stores/app-store';
	import { accounts } from '$lib/helpers/localstorage';
	import { juaraDate } from '$lib/helpers/dateTime';
	import ModalProfile from '../_global/ModalProfile.svelte';
	import Ornament from './_ornament.svelte';
	import Forms from './Forms.svelte';
	import Details from './Details.svelte';
	import Summary from './Summary.svelte';

	const { end, start } = juaraDate;
	const startDate = start.format('DD MMMM YYYY, HH:mm');
	const endDate = end.format('DD MMMM YYYY, HH:mm');

	const { name: user } = $derived($juaraProfile);
	let showModal = $state(false);
	let isLoaded = $state(false);
	setContext('modalHandle', () => (showModal = !showModal));

	onMount(() => {
		if (isLoaded) return;
		isLoaded = true;
		if ($juaraProfile.profileid) return;
		const savedAccounts = accounts.getAll('juaragcp');
		const savedLength = savedAccounts.length;
		if (savedLength < 1) return;
		if (savedLength > 1) return (showModal = true);
		const { profileid } = savedAccounts[0];
		juaraProfile.set({ profileid });
	});
</script>

<svelte:head>
	<title>GCPBoleh Progress Tracker</title>
</svelte:head>

{#if showModal && isLoaded}
	<ModalProfile target="juaragcp" />
{/if}

<section>
	<Ornament />
	<div class="hero">
		<div class="top">
			<h1>GCPBoleh Progress Tracker</h1>
			<span> {startDate} - {endDate} (GMT+8)</span>
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
	section {
		overflow: hidden;
		width: var(--screen-width);
		position: relative;
	}

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

	span {
		color: #0095df;
	}

	@media screen and (max-width: 700px) {
		h1 {
			font-size: large;
		}
	}

	.top {
		margin-top: calc(0.075 * var(--screen-height));
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
