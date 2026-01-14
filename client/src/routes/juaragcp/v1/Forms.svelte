<script lang="ts">
	import { untrack } from 'svelte';
	import { fade } from 'svelte/transition';
	import { isValidUUID } from '$lib/helpers/uuid';
	import { localAccounts } from '$lib/helpers/localstorage';
	import { isGCSBUrl, validateURL } from '$lib/helpers/loader.profile';
	import Loading from '$comp/LoaderAnimation.svelte';
	import Button from '$comp/Button.svelte';
	import { activeProfile } from '$lib/stores/app.svelte';
	import { juaraSeason, skillbase } from '$lib/data/config';
	import { createQuery } from '$lib/stores/query-store';
	import { loadJuaraProfile } from '$lib/helpers/loader.juaragcp';
	import { modalHandle } from '../v2/ModalProfile.svelte';

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

	const program = juaraSeason.seasonid;
	const q = $derived.by(() => {
		return createQuery({
			enabled: false,
			queryKey: profileUUID,
			queryFn: async () => {
				const res = await loadJuaraProfile({ profileUUID, program });
				const userinfo = res?.user || {};
				localAccounts.put({ ...userinfo, program }, 'juaragcp');
				return res;
			}
		});
	});

	$effect(() => {
		if (!$activeProfile?.uuid) return window.__opr?.setUserID('');
		window.__opr?.setUserID($activeProfile.name.slice(0, 4).padEnd(10, '*'));
		value = `${skillbase}/public_profiles/${$activeProfile.uuid}`;
		untrack(() => $q.refetch());
	});
</script>

{#if $q.isLoading}
	<div class="flex h-[170px] w-full flex-col items-center justify-center" in:fade>
		<div class="icon">
			<Loading />
		</div>
		<span class="loading-text">Waiting for Profile</span>
	</div>
{:else}
	<div class="my-5 text-center sm:mt-10">
		{#if $q.error && profileUUID}
			<span class="text-red-600"> Failed to resolve profile url! </span>
		{/if}
		<div class="input relative mx-auto h-16 w-full rounded-full sm:min-w-[500px] md:w-2/5">
			<input
				bind:value
				oninput={() => (typed = true)}
				class:isError={($q.error && profileUUID) || (!profileUUID && typed)}
				class:focus:border-red-500={($q.error && profileUUID) || (!profileUUID && typed)}
				type="text"
				class="gcsb-profile group block size-full rounded-full border-2 border-transparent bg-white py-[2%] pr-18 pl-5 text-lg text-gray-700 shadow-[var(--inner-shadow)] outline-0 transition-[box-shadow,border-color] duration-200 placeholder:text-slate-400/70 focus:shadow-[0]"
				placeholder="Your GCSB Profile URL"
			/>
			{#if localAccounts.getAll('juaragcp').length > 0}
				<button class="accounts primary_hover_after" aria-label="Accounts" onclick={modalHandle}>
					<i class="gc-user"></i>
				</button>
			{:else}
				<span aria-label="Accounts">
					<i class="fasds fa-link"></i>
				</span>
			{/if}
			<div
				style="transition: box-shadow 0.25s;"
				class="shdow pointer-events-none absolute top-0 left-0 z-10 block size-full rounded-full"
			></div>
		</div>

		<div class="mt-8 text-lg">
			<Button onclick={() => $q.refetch()} disabled={!profileUUID} class="font-semibold uppercase">
				Check My Profile
			</Button>
		</div>
	</div>
{/if}

<style lang="postcss">
	@import 'tailwindcss/theme' theme(reference);

	.input {
		& .gcsb-profile {
			&:focus ~ .shdow {
				box-shadow: var(--outer-shadow);
			}
			&.isError {
				box-shadow: var(--inner-error);
			}
		}
	}

	.gcsb-profile.isError:focus {
		box-shadow: 0 0 1rem rgba(255, 0, 0, 0.25);
	}

	.loading-text {
		position: relative;
	}
	.loading-text::after {
		content: '';
		animation: dots 2s infinite;
	}
	@keyframes dots {
		0% {
			content: '';
		}
		25% {
			content: '.';
		}
		50% {
			content: '..';
		}
		75% {
			content: '...';
		}
		100% {
			content: '...';
		}
	}

	.input {
		button,
		span {
			@apply absolute top-1/2 right-2 flex aspect-square h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white;
			font-size: x-large;
			box-shadow: var(--outer-shadow);

			&.accounts {
				transition:
					background 0.25s,
					color 0.25s,
					border 0.25s,
					transform 0.1s;

				&:hover {
					background-color: var(--color-theme-1);
					color: #fff;
				}
			}
		}
	}
</style>
