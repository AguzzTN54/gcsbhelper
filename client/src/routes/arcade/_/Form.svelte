<script lang="ts">
	import { goto } from '$app/navigation';
	import { loadProfileAndBadges } from '$lib/helpers/loader.arcade';
	import { isValidUUID } from '$lib/helpers/uuid';
	import { arcadeRegion } from '$lib/stores/app.svelte';
	import { localAccounts } from '$lib/helpers/localstorage';
	import { isGCSBUrl, validateURL } from '$lib/helpers/loader.profile';
	import Button from '$reusable/Button.svelte';
	import Loading from '$reusable/Loading.svelte';

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

<div class="flex h-full w-full flex-col items-center justify-center py-5">
	{#if loading}
		<Loading />
		<span class="mt-5 inline-block"> Hang tight! We’re grabbing your data… </span>
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
