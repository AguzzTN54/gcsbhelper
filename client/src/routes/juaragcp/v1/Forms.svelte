<script lang="ts">
	import { getContext } from 'svelte';
	import { preventDefault } from 'svelte/legacy';
	import type { EventHandler } from 'svelte/elements';
	import { fade } from 'svelte/transition';

	import { isValidUUID } from '$lib/helpers/uuid';
	import { localAccounts } from '$lib/helpers/localstorage';
	import { isGCSBUrl, loadProfile, validateURL } from '$lib/helpers/loader.profile';
	import Loading from '$comp/LoaderAnimation.svelte';
	import Button from '$comp/Button.svelte';
	import { juaraProfile } from '$lib/stores/app.svelte';

	let typed = $state(false);
	let loading = $state(false);
	let isError = $state(false);
	let errorMSG = $state('');

	const modalHandle = getContext('modalHandle') as EventHandler;

	let value = $state<string>('');
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
			isError = false;
			const data = await loadProfile({ profileUUID, program: 'juaragcp' });
			const { avatar, name, uuid } = data?.user || {};
			localAccounts.put({ avatar, name, uuid, active: true }, 'juaragcp');
			juaraProfile.set({ profileID: uuid, name });
		} catch (e) {
			console.error(e);
			loading = false;
			isError = true;
		}
	};
</script>

<div class="absolute flex size-full items-center justify-center" in:fade={{ delay: 500 }}>
	{#if loading}
		<div class="loading" transition:fade>
			<div class="icon">
				<Loading />
			</div>
			<span class="loading-text">Waiting for Profile</span>
		</div>
	{:else}
		<form
			class="absolute -translate-y-[10%]"
			onsubmit={preventDefault(fetchProfile)}
			transition:fade
		>
			<div class="group">
				<div class="input relative mx-auto h-16 w-[700px] max-w-[85%]">
					<input
						bind:value
						oninput={() => {
							typed = true;
							isError = false;
						}}
						class:!border-red-600={isError || (!profileUUID && typed)}
						class:!text-red-600={isError || (!profileUUID && typed)}
						class:isError
						type="text"
						class="gcsb-profile block size-full rounded-full p-[2%_5%] text-lg text-gray-700 shadow-[var(--inner-shadow)] outline-0 placeholder:text-slate-400/70 focus:shadow-[0]"
						style="transition: box-shadow 0.25s;"
						placeholder="Your GCSB Profile URL"
						onblur={() => (isError = false)}
					/>
					<div
						style="transition: box-shadow 0.25s;"
						class="shdow pointer-events-none absolute top-0 left-0 z-10 block size-full rounded-full"
					></div>
				</div>
				{#if isError}
					<div class="flex items-center justify-center pt-1">
						<span class="inline-block text-red-500">
							{errorMSG || 'Failed to Load Profile, Please Try Again!'}
						</span>
					</div>
				{/if}

				<div class="mt-8 text-lg">
					<Button>Check Profile</Button>
				</div>
			</div>
		</form>
	{/if}

	{#if localAccounts.getAll('juaragcp').length > 0 && !loading}
		<button
			class="accounts primary_hover_after"
			aria-label="Accounts"
			onclick={modalHandle}
			out:fade
		>
			<i class="gc-user"></i>
		</button>
	{/if}
</div>

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

	.loading {
		position: absolute;
		z-index: +1;
		width: 100%;
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

	button {
		&.accounts {
			position: fixed;
			right: 5%;
			bottom: 7.5%;
			width: calc(0.07 * var(--screen-height));
			border-radius: 100%;
			aspect-ratio: 1/1;
			outline: 0;
			background-color: transparent;
			font-size: x-large;
			border: 0;
			box-shadow: var(--outer-shadow);
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
</style>
