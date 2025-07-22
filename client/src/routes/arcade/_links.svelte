<script>
	import { localConfig } from '$lib/helpers/localstorage';
	import { arcadeProfile as profile } from '$lib/stores/app-store';

	const { isOfficial, profileID } = $profile;
	const loadOfficial = () => {
		const to = !isOfficial;
		localConfig.set('isOfficial', to);
		profile.update(({ profileID }) => ({ profileID }));
	};
</script>

<div class="links">
	<button on:click={loadOfficial}>
		{isOfficial ? 'Check my Public Profile' : 'Official Records'}
	</button>
	<a href="https://cloudskillsboost.google/public_profiles/{profileID}" target="_blank">
		Open Profile <small><i class="gc-external-link"></i></small>
	</a>
</div>

<style>
	.links {
		margin-top: calc(0.05 * var(--screen-height));
		display: flex;
		width: 650px;
		max-width: calc(0.9 * var(--screen-width));
		justify-content: space-between;
		margin-left: auto;
		margin-right: auto;
	}

	.links button,
	.links a {
		background-color: transparent;
		border: 0;
		border-bottom: 0.05rem solid var(--color-theme-1);
		padding: 1% 2%;
		font-size: inherit;
		color: var(--color-theme-1);
		position: relative;
		transition:
			all 0.5s,
			transform 0.1s;
	}

	.links button:hover,
	.links a:hover {
		background-color: var(--color-theme-1);
		border-color: transparent;
		color: #fff;
		border-radius: 2rem;
	}

	.links button:active,
	.links a:active {
		transform: scale(0.9);
	}

	.links a:hover {
		text-decoration: none;
	}
</style>
