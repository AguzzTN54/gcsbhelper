<script>
	import { onMount, setContext } from 'svelte';
	import { juaraProfile } from '$lib/stores/app.svelte';
	import { localAccounts } from '$lib/helpers/localstorage';
	import dayjs, { timeZone } from '$lib/helpers/dateTime';
	import { juaraSeason } from '$lib/data/config';
	import ModalProfile from './ModalProfile.svelte';
	import Ornament from './_ornament.svelte';
	import Forms from './Forms.svelte';
	import Summary from './Summary.svelte';
	import Details from './Details.svelte';

	const { end, start } = juaraSeason;
	const startDate = dayjs(start).format('DD MMMM YYYY, HH:mm');
	const endDate = dayjs(end).format('DD MMMM YYYY, HH:mm');

	const { name } = $derived($juaraProfile);
	let showModal = $state(false);
	let isLoaded = $state(false);
	setContext('modalHandle', () => (showModal = !showModal));

	$inspect($juaraProfile);

	onMount(() => {
		if (isLoaded) return;
		isLoaded = true;
		if ($juaraProfile.profileID) return;
		const savedAccounts = localAccounts.getAll('juaragcp');
		const savedLength = savedAccounts.length;
		if (savedLength < 1) return;
		if (savedLength > 1) return (showModal = true);
		const { uuid: profileID } = savedAccounts[0];
		juaraProfile.set({ profileID, name });
	});
</script>

<svelte:head>
	<title>JuaraGCP Progress Tracker</title>
</svelte:head>

{#if showModal && isLoaded}
	<ModalProfile target="juaragcp" />
{/if}

<section class="relative w-[var(--screen-width)] overflow-hidden">
	<Ornament />
	<div class="flex size-full flex-col items-center justify-center p-[2%_5%] text-center">
		<div class="mt-12 mb-auto">
			<h1 class="pb-2 text-center text-3xl leading-tight font-bold uppercase">
				JuaraGCP Progress Tracker
			</h1>
			<span class="block text-sky-500">{startDate} - {endDate} ({timeZone})</span>
		</div>

		<div class="relative mb-auto flex h-[70vh] w-full items-center justify-center">
			{#if !!name}
				<Summary />
			{:else if isLoaded}
				<Forms />
			{/if}
		</div>
	</div>
</section>

{#if name}
	<Details />
{/if}

<style lang="postcss">
	:global {
		:root {
			--color-theme-1: #2d95f1;
			--color-theme-2: #23c2f6;
			--color-gradient: linear-gradient(70deg, var(--color-theme-1) 45%, var(--color-theme-2));
			--white: #ffffff;
			--greyLight-1: #e4ebf5;
			--greyLight-2: #c8d0e7;
		}
	}
</style>
