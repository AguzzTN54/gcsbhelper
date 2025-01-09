<script>
	import { getContext } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import { juaraBadges, juaraProfile } from '$lib/stores/app-store';
	import { checkTier } from '$lib/helpers/calculator-juaragcp';
	import Tier from './Tier.svelte';
	import Tablepoint from './_tablepoint.svelte';

	const modalHandle = getContext('modalHandle');
	const tierData = checkTier($juaraBadges);
</script>

<div class="summary" in:fade>
	<button class="user" on:click={modalHandle}>
		<h2><i class="gc-triangle-down"></i> {$juaraProfile.name}</h2>
	</button>

	<Tier {tierData} />

	<Tablepoint />
	<div class="detail-btn" in:fly={{ y: -20, delay: 500 }}>
		<span>
			<i class="gc-double-left"></i>
		</span>
	</div>
</div>

<style>
	.summary {
		width: 100%;
		margin-top: -2rem;
	}
	h2 {
		position: relative;
		font-size: larger;
	}

	h2::after {
		content: '';
		position: absolute;
		width: 100%;
		bottom: -25%;
		left: 0;
		border-bottom: 1px solid #aaa;
	}
	button.user {
		background-color: transparent;
		border: none;
		font-size: inherit;
		position: relative;
	}

	button.user i {
		position: absolute;
		left: 0;
		top: 50%;
		transform: translate(-100%, -50%);
		font-size: medium;
		line-height: 0;
	}

	/*  */
	.detail-btn {
		position: absolute;
		bottom: 0.5rem;
		left: 50%;
		transform: translate(-50%, 100%);
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.detail-btn span {
		display: block;
		animation: translateY 1.5s infinite ease-in-out;
	}

	.gc-double-left {
		display: block;
		transform: rotate(-90deg) scaleY(1.5);
		font-size: calc(0.04 * var(--screen-height));
		opacity: 0.6;
	}

	@keyframes translateY {
		0% {
			transform: translateY(-40%);
		}
		50% {
			transform: translateY(-60%);
		}
		100% {
			transform: translateY(-40%);
		}
	}
</style>
