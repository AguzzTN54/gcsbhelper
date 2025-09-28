<script lang="ts">
	import { activeProfile } from '$lib/stores/app.svelte';
	import { createQuery } from '$lib/stores/query-store';
	import { loadJuaraProfile } from '$lib/helpers/loader.juaragcp';
	import { isGCSBUrl, validateURL } from '$lib/helpers/loader.profile';
	import { localAccounts } from '$lib/helpers/localstorage';
	import { isValidUUID } from '$lib/helpers/uuid';
	import PulseLoading from './comp/PulseLoading.svelte';

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

	const q = $derived.by(() => {
		return createQuery({
			enabled: false,
			queryKey: profileUUID,
			queryFn: async () => {
				const res = await loadJuaraProfile({ profileUUID, program: 'juaragcp' });
				const userinfo = res?.user || {};
				localAccounts.put({ ...userinfo }, 'juaragcp');
				return res;
			}
		});
	});

	$effect(() => {
		if (!$activeProfile?.uuid) return;
		value = `https://www.cloudskillsboost.google/public_profiles/${$activeProfile.uuid}`;
		$q.refetch();
	});
</script>

{#if $q.isLoading}
	<div class="flex h-[170px] w-full flex-col items-center justify-center">
		<PulseLoading dark />
	</div>
{:else}
	<div class="my-5 text-center sm:mt-10">
		{#if $q.error && profileUUID}
			<span class="text-red-600"> Failed to resolve profile url! </span>
		{/if}
		<div class="relative mx-auto w-full rounded-full sm:min-w-[500px] md:w-2/5">
			<input
				bind:value
				type="text"
				oninput={() => (typed = true)}
				class:error={($q.error && profileUUID) || (!profileUUID && typed)}
				class="h-16 w-full rounded-full border-[4px] border-[var(--color-secondary)] bg-[var(--color-primary)]/90 pr-15 pl-8 font-bold outline-0 backdrop-blur-xs transition-colors duration-300 placeholder:font-semibold focus:border-amber-600"
				placeholder="Input Public Profile URL"
			/>
			<span class="absolute top-1/2 right-0 -translate-1/2 -translate-x-1/2 text-2xl opacity-50">
				<i class="fasds fa-link"></i>
			</span>
		</div>
	</div>

	<div class="flex rounded-full bg-[var(--color-primary)]">
		<button
			onclick={() => $q.refetch()}
			class="duo submit rounded-full bg-[var(--color-secondary)] px-6 py-3 font-semibold text-[var(--color-primary)] uppercase transition-all duration-300 hover:bg-amber-800 active:scale-97"
			disabled={!profileUUID}
		>
			Check my Profile <i class="fasds fa-rocket-launch"></i>
		</button>
	</div>
{/if}

<style lang="postcss">
	@import 'tailwindcss/theme' theme(reference);

	.submit:disabled {
		@apply cursor-not-allowed opacity-40 hover:bg-[var(--color-secondary)] active:scale-100;
	}

	input.error {
		@apply border-red-600 bg-red-100 text-red-600;
	}
</style>
