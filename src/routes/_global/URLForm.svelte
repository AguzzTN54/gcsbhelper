<script lang="ts">
	import { getContext } from 'svelte';
	import { preventDefault } from 'svelte/legacy';
	import type { EventHandler } from 'svelte/elements';
	import { fade } from 'svelte/transition';

	import { arcadeProfile, juaraProfile } from '$lib/stores/app-store';
	import { accounts } from '$lib/helpers/localstorage';
	import { loadProfile } from '$lib/helpers/profile-parser';
	import Loading from '$comp/LoaderAnimation.svelte';
	import Button from '$comp/Button.svelte';

	interface Props {
		target: string;
		onResponse: (data: App.ProfileData) => void;
	}
	const { target, onResponse }: Props = $props();

	const profile = target === 'arcade' ? arcadeProfile : juaraProfile;
	let profileURL = $state('');
	let loading = $state(false);
	let isError = $state(false);
	let errorMSG = $state('');

	const modalHandle = getContext('modalHandle') as EventHandler;

	const isGCSBUrl = (url: string) => /cloudskillsboost.google\/public_profiles/.test(url);
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

	const throwError = (msg?: string) => {
		errorMSG = msg || '';
		isError = true;
		loading = false;
		profile.set({ profileID: '', name: '' });
	};

	const checkMyProfile = async (publicID: string | Event) => {
		const gcsb = 'https://www.cloudskillsboost.google/public_profiles/';
		const userURL = typeof publicID === 'string' ? gcsb + publicID : profileURL;

		const msg = 'Please enter a valid GCSB Public Profile URL!';
		if (!validateURL(userURL)) return throwError(msg);
		if (!isGCSBUrl(userURL)) return throwError(msg);

		loading = true;

		const { error, data } = await loadProfile(userURL + '?' + Math.random());
		if (error || !data) return throwError();

		const { user } = data;
		if (user === 'Google Cloud Skills Boost') return throwError();
		onResponse(data);
	};

	const { profileID } = $derived($profile);
	$effect(() => {
		if (!profileID) return;
		checkMyProfile(profileID);
	});
</script>

<div class="wrapper" in:fade={{ delay: 500 }}>
	{#if loading}
		<div class="loading" transition:fade>
			<div class="icon">
				<Loading />
			</div>
			<span class="loading-text">Waiting for Profile</span>
		</div>
	{:else}
		<form class="field" onsubmit={preventDefault(checkMyProfile)} transition:fade>
			<div class="group">
				<input
					type="text"
					class:isError
					class="gcsb-profile"
					placeholder="Your GCSB Profile URL"
					bind:value={profileURL}
					onblur={() => (isError = false)}
				/>
				{#if isError}
					<div class="error">
						<span> {errorMSG || 'Failed to Load Profile, Please Try Again!'} </span>
					</div>
				{/if}

				<div class="checkbox">
					<!-- {#if target === 'arcade'}
						<CheckBox
							id="use_official"
							checked={isOfficial}
							on:change={({ detail }) => ({ checked: isOfficial } = detail)}
						>
							Find me in the official data records
						</CheckBox>
					{/if} -->
				</div>

				<div class="check">
					<Button>Check Profile</Button>
				</div>
			</div>
		</form>
	{/if}

	{#if accounts.getAll(target).length > 0 && !loading}
		<button class="accounts" aria-label="Accounts" onclick={modalHandle} out:fade>
			<i class="gc-user"></i>
		</button>
	{/if}
</div>

<style>
	.wrapper {
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		position: absolute;
	}

	.field {
		position: absolute;
	}

	.gcsb-profile {
		border: 1px solid #ccc;
		outline: 0;
		width: 700px;
		max-width: calc(0.85 * var(--screen-width));
		display: block;
		height: calc(0.085 * var(--screen-height));
		padding: 2% 5%;
		font-size: large;
		border-radius: 100px;
		background-color: #f9f9f9;
		transition: box-shadow 0.25s;
	}
	.gcsb-profile:focus {
		box-shadow: 0 0 1rem #ddd;
	}
	.gcsb-profile::placeholder {
		color: #999;
	}
	.gcsb-profile.isError {
		border-color: red;
	}
	.gcsb-profile.isError:focus {
		box-shadow: 0 0 1rem rgba(255, 0, 0, 0.25);
	}

	.error {
		display: flex;
		align-items: center;
		justify-content: center;
		padding-top: 0.25rem;
	}
	.error span {
		display: inline-block;
		color: red;
	}

	.checkbox {
		margin-top: 1.5rem;
	}
	.check {
		font-size: larger;
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

	button.accounts {
		position: fixed;
		right: 5%;
		bottom: 7.5%;
		width: calc(0.07 * var(--screen-height));
		border-radius: 100%;
		aspect-ratio: 1/1;
		outline: 0;
		background-color: transparent;
		font-size: x-large;
		border: 1px solid #333;
		transition:
			background 0.5s,
			color 0.5s,
			border 0.5s,
			transform 0.1s;
	}
	button.accounts:hover {
		background-color: var(--color-theme-1);
		color: #fff;
		border: 0;
	}
	button.accounts:active {
		transform: scale(0.9);
	}
</style>
