<script>
	import { fade } from 'svelte/transition';
	import { profile } from '$lib/stores/app-store';
	import { loadProfile } from '$lib/helpers/arcade/profile-parser';
	import { pointCounter } from '$lib/helpers/arcade/calculator';
	import Loading from '$comp/loading.svelte';

	// prettier-ignore
	let profileURL ='https://www.cloudskillsboost.google/public_profiles/eb24c815-5b47-4afb-ac14-8fc51e876c6a';
	let loading = false;
	let isError = false;

	const checkMyProfile = async () => {
		loading = true;
		const { error, data = {} } = await loadProfile(profileURL);
		if (error) {
			isError = error;
			loading = false;
			return;
		}

		const { user, courses: badges } = data;
		const points = pointCounter(badges);
		profile.set({ user, points, badges });
	};
</script>

<div class="wrapper" in:fade>
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
				<button class="check" type="submit"> Check My Points </button>
			</div>
		</form>
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

	.check {
		/* background-color: var(--color-theme-1); */
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
</style>
