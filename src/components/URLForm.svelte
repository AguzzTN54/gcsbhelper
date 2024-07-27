<script>
	import { createEventDispatcher, getContext } from 'svelte';
	import { fade } from 'svelte/transition';
	import { profile } from '$lib/stores/app-store';
	import { accounts } from '$lib/helpers/localstorage';
	import { loadProfile } from '$lib/helpers/profile-parser';
	import Loading from '$comp/Loading.svelte';

	let profileURL = '';
	let loading = false;
	let isError = false;
	let errorMSG = '';

	const modalHandle = getContext('modalHandle');
	const dispatch = createEventDispatcher();

	const isGCSBUrl = (url) => /cloudskillsboost.google\/public_profiles/.test(url);
	const validateURL = (url) => {
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

	const throwError = (msg) => {
		errorMSG = msg;
		isError = true;
		loading = false;
		profile.set({});
	};

	const checkMyProfile = async (url) => {
		const userURL = typeof url === 'string' ? url : profileURL;
		if (!validateURL(userURL)) return throwError('Invalid URL');
		if (!isGCSBUrl(userURL)) return throwError('Please enter your GCSB Profile URL');

		loading = true;
		const { error, data = {} } = await loadProfile(userURL + '?' + Math.random());
		if (error) return throwError();

		const { user } = data;
		if (user === 'Google Cloud Skills Boost') return throwError();
		dispatch('response', data);
	};

	const gcsb = 'https://www.cloudskillsboost.google/public_profiles/';
	$: ({ profileID } = $profile);
	$: !profileID || checkMyProfile(gcsb + profileID);
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
		<form class="field" on:submit={checkMyProfile} transition:fade>
			<div class="group">
				<input
					type="text"
					class:isError
					class="gcsb-profile"
					placeholder="Your GCSB Profile URL"
					bind:value={profileURL}
					on:blur={() => (isError = false)}
				/>
				{#if isError}
					<span class="error"> {errorMSG || 'Failed to Load Profile, Please Try Again!'} </span>
				{/if}
				<button class="check" type="submit"> Check My Profile </button>
			</div>
		</form>
	{/if}

	{#if accounts.getAll().length > 0 && !loading}
		<button class="accounts" on:click={modalHandle} out:fade>
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

	span.error {
		display: block;
		color: red;
	}

	.check {
		background-image: var(--color-gradient);
		background-size: 200%;
		background-position: 80%;
		font-size: large;
		border: 0;
		outline: 0;
		padding: 0.5rem 1.5rem;
		color: #fff;
		width: 200px;
		border-radius: 5px;
		margin: 1.5rem;
		transition:
			transform 0.1s,
			background 0.3s;
	}

	.check:hover {
		background-position: 0;
	}
	.check:active {
		transform: scale(0.95);
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
