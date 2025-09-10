<script lang="ts">
	import { goto } from '$app/navigation';
	import { loadProfileAndBadges } from '$lib/helpers/arcade-loader';
	import { isValidUUID } from '$lib/helpers/uuid';
	import { arcadeRegion } from '$lib/stores/app.svelte';
	import { localAccounts } from '$lib/helpers/localstorage';
	import Button from '$reusable/Button.svelte';
	// import Checkbox from '$reusable/Checkbox.svelte';
	import Loading from '$reusable/Loading.svelte';

	const isGCSBUrl = (url: string) => /cloudskillsboost.google\/public_profiles\//.test(url);
	const validateURL = (url: string) => {
		const pattern = new RegExp(
			'^([a-zA-Z]+:\\/\\/)?' + // protocol
				'((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
				'((\\d{1,3}\\.){3}\\d{1,3}))' + // OR IP (v4) address
				'(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
				'(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
				'(\\#[-a-z\\d_]*)?$', // fragment locator
			'i'
		);
		return pattern.test(url);
	};

	let loading = $state(false);
	let fetchError = $state(false);
	let value = $state('');
	let typed = $state(false);
	// let submitGlobal = $state(true);
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

	const fetchProfile = async () => {
		try {
			loading = true;
			fetchError = false;
			const facilitator = $arcadeRegion;
			const res = await loadProfileAndBadges({ profileUUID, program: 'arcade', facilitator });
			const userinfo = res?.user || {};
			localAccounts.put({ ...userinfo, facilitator });
			goto('/arcade/dash');
		} catch (e) {
			console.error(e);
			loading = false;
			fetchError = true;
		}
	};
</script>

<div class="flex w-full py-5 flex-col h-full items-center justify-center">
	{#if loading}
		<Loading />
		<span class="inline-block mt-5"> Hang tight! We’re grabbing your data… </span>
	{:else}
		{#if fetchError}
			<div class="text-center text-red-600">Unable to load your data. Please try again!</div>
		{/if}
		<div class="input relative rounded-full w-10/12 sm:w-[60%]">
			<input
				bind:value
				oninput={() => {
					typed = true;
					fetchError = false;
				}}
				type="text"
				class:!border-red-600={fetchError || (!profileUUID && typed)}
				class:!text-red-600={fetchError || (!profileUUID && typed)}
				class="brutal-border !border-[4px] bg-gray-100 rounded-full h-16 px-5 placeholder:font-medium w-full outline-0"
				placeholder="Input Public Profile URL"
			/>
			<span
				class="absolute top-0 right-0 text-[1.75rem] md:text-[2.5rem] translate-x-2/3 -translate-y-1/2"
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
		@apply absolute top-0 left-0 size-full bg-indigo-400 block -z-1 skew-y-[2deg] rounded-full;
	}
	.input::after {
		@apply skew-y-[1.5deg] bg-amber-300;
	}
</style>
