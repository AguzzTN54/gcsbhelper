<script lang="ts">
	import { goto } from '$app/navigation';
	import { loadProfileAndBadges } from '$lib/helpers/loader.arcade';
	import { isValidUUID } from '$lib/helpers/uuid';
	import { localAccounts } from '$lib/helpers/localstorage';
	import { checkProfileEntities, isGCSBUrl, validateURL } from '$lib/helpers/loader.profile';
	import Button from '$reusable/Button.svelte';
	import Loading from '$reusable/Loading.svelte';
	import { arcadeSeason } from '$lib/data/config';
	import Modal from '$reusable/Modal.svelte';
	import Portal from '$reusable/Portal/Portal.svelte';
	import { fly } from 'svelte/transition';
	import { onMount } from 'svelte';

	let checking = $state(false);
	let loading = $state(false);
	let fetchError = $state(false);
	let value = $state('');
	let typed = $state(false);

	const profileUUID = $derived.by<string>(() => {
		const profileLink = value.trim();
		const isgcsb = isGCSBUrl(profileLink);
		if (!isgcsb) return '';
		if (!validateURL(profileLink)) return '';
		try {
			const { pathname } = new URL(profileLink);
			const [, , uuid] = pathname.split('/');
			if (!isValidUUID(uuid)) return '';
			return uuid;
		} catch {
			return '';
		}
	});

	let enrolledEvents = $state([]);
	let showModalSeasonPicker = $state(false);
	let showModalDropdown = $state(false);
	const dropdownToggle = (e: Event) => {
		e.preventDefault();
		const target = e.target as HTMLElement;
		if (target.closest('.dropdown')) return;
		showModalDropdown = false;
	};
	onMount(() => {
		window.addEventListener('click', dropdownToggle);
		return () => window.removeEventListener('click', dropdownToggle);
	});

	const seasonPicker = async (action: 'check' | 'new', prog?: string) => {
		showModalSeasonPicker = false;
		const program = action === 'check' && prog ? prog : arcadeSeason.seasonid;
		const res = await loadProfileAndBadges({ profileUUID, program });
		const userinfo = res?.user || {};
		localAccounts.put({ ...userinfo, program });
		goto('/arcade/dash');
	};

	const fetchProfile = async () => {
		try {
			loading = true;
			fetchError = false;
			checking = true;
			const { status, enrolled = [] } = await checkProfileEntities(
				profileUUID,
				arcadeSeason.seasonid
			);

			enrolledEvents = enrolled.filter((v: any) => (v.identifier as string).startsWith('arcade'));
			checking = false;

			// Check if has older enrollments
			if (status === 'NOT_ENROLLED' || enrolled?.length > 2) {
				if (enrolled.length > 0) {
					showModalSeasonPicker = true;
					return;
				}
			}
		} catch (e) {
			console.error(e);
			loading = false;
			checking = false;
			fetchError = true;
		}
	};
</script>

<Portal target="#main">
	{#if showModalSeasonPicker}
		<Modal persist onclose={() => (showModalSeasonPicker = false)} hideclosebutton>
			<h1 class="text-center text-xl font-bold">Hang On!</h1>
			<p class="mt-5 text-center">
				Looks like this account has already enrolled in a previous Arcade event!
			</p>

			<div class="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
				<div class="dropdown relative">
					<Button
						class="mt-0! rounded-lg! px-4! py-1! text-sm"
						onclick={() => (showModalDropdown = !showModalDropdown)}
					>
						Check Previous Progress <i class="fasdl fa-caret-down"></i>
					</Button>
					{#if showModalDropdown}
						<div
							transition:fly={{ y: 20, duration: 100 }}
							class="absolute bottom-full left-0 mb-1 w-full rounded-lg border-2 border-black bg-indigo-300 p-0.5 text-xs"
						>
							{#each enrolledEvents as { title, identifier }}
								<button
									onclick={() => seasonPicker('check', identifier)}
									class="block w-full rounded border-b px-1.5 py-1.5 last:border-0! hover:bg-indigo-400"
								>
									{title}
								</button>
							{/each}
						</div>
					{/if}
				</div>
			</div>
			<div class="mt-5 flex justify-center text-xs">
				<button
					class="text-yellow-700 hover:text-yellow-500 hover:underline"
					onclick={() => seasonPicker('new')}
				>
					Check this profile for current event
				</button>
			</div>
		</Modal>
	{/if}
</Portal>

<div class="flex h-full w-full flex-col items-center justify-center py-5">
	{#if loading}
		<Loading />
		{#if checking}
			<span class="mt-5 inline-block"> Checking Our System… </span>
		{:else}
			<span class="mt-5 inline-block"> Hang tight! We’re grabbing your data… </span>
		{/if}
	{:else}
		{#if fetchError}
			<div class="text-center text-red-600">Unable to load your data. Please try again!</div>
		{/if}
		<div class="input relative w-10/12 rounded-full sm:w-[60%]">
			<input
				bind:value
				oninput={() => {
					typed = true;
					fetchError = false;
				}}
				type="text"
				class:!border-red-600={fetchError || (!profileUUID && typed)}
				class:!text-red-600={fetchError || (!profileUUID && typed)}
				class="brutal-border h-16 w-full rounded-full !border-[4px] bg-gray-100 px-5 outline-0 placeholder:font-medium"
				placeholder="Input Public Profile URL"
			/>
			<span
				class="absolute top-0 right-0 translate-x-2/3 -translate-y-1/2 text-[1.75rem] md:text-[2.5rem]"
			>
				<i class="fasdl fa-sparkles text-indigo-400"></i>
			</span>
		</div>

		<!-- <Checkbox
			checked={submitGlobal}
			onchange={(e) => (submitGlobal = (e.target as HTMLInputElement).checked)}
		>
			Submit to global analytics
		</Checkbox> -->

		<Button onclick={fetchProfile} disabled={!profileUUID}>
			Calculate Points <i class="fasdl fa-stars text-rose-300"></i>
		</Button>
	{/if}
</div>

<style lang="postcss">
	@import 'tailwindcss/theme' theme(reference);

	.input::after,
	.input::before {
		content: '';
		@apply absolute top-0 left-0 -z-1 block size-full skew-y-[2deg] rounded-full bg-indigo-400;
	}
	.input::after {
		@apply skew-y-[1.5deg] bg-amber-300;
	}
</style>
