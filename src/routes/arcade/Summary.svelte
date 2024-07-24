<script>
	import { profile } from '$lib/stores/app-store';
	import { onMount } from 'svelte';
	import { fade, fly } from 'svelte/transition';

	export let points = 0;
	export let user = '';

	let showBtn = false;
	let pointToShow = 0.0;
	onMount(() => {
		const t = setInterval(() => {
			if (pointToShow < points) return (pointToShow += 0.5);
			showBtn = true;
			return clearInterval(t);
		}, 20);
	});

	const revoke = () => profile.set({});
</script>

<div class="wrapper" transition:fade>
	<div class="info">
		<h1 class="point">
			<span class="numeric">
				{pointToShow.toFixed(1)}
			</span>
			<span class="pts">pts</span>

			{#if showBtn}
				<button class="revoke" title="Revoke" on:click={revoke} in:fade>
					<i class="gc-cw"></i>
				</button>
			{/if}
		</h1>
		<h2>{user}</h2>
	</div>

	{#if showBtn}
		<div class="detail-btn" in:fly={{ y: 20 }}>
			<button class="scroll"></button>
			<span class="scroll-txt">Details</span>
		</div>
	{/if}
</div>

<style>
	.wrapper {
		text-align: center;
	}
	.info {
		transform: translateY(-30%);
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
	h1.point {
		font-size: calc(0.175 * var(--screen-height));
		font-weight: 900;
		position: relative;
		width: fit-content;
		width: -moz-fit-content;
	}

	h1 span.pts {
		font-size: calc(0.05 * var(--screen-height));
		font-weight: initial;
		position: absolute;
		top: 0;
		right: 0;
		transform: translateX(100%);
	}

	button.revoke {
		width: calc(0.06 * var(--screen-height));
		background-color: transparent;
		border-radius: 100%;
		aspect-ratio: 1/1;
		display: flex;
		justify-content: center;
		align-items: center;
		position: absolute;
		bottom: 0;
		right: 0;
		line-height: 0;
		transform: translateX(100%);
		font-size: calc(0.03 * var(--screen-height));
		border: 1px solid rgba(0, 0, 0, 0.7);
		transition:
			background 0.5s,
			transform 0.1s,
			color 0.5s,
			border 0.5s;
	}
	button.revoke:active {
		transform: translateX(100%) scale(0.9);
	}

	button.revoke:hover {
		background-color: var(--color-theme-1);
		color: #fff;
		border-color: transparent;
	}

	@media screen and (max-width: 540px) {
		h1.point {
			font-size: calc(0.1 * var(--screen-height));
		}
		h1 span.pts {
			font-size: calc(0.04 * var(--screen-height));
		}

		button.revoke {
			width: calc(0.04 * var(--screen-height));
			font-size: calc(0.02 * var(--screen-height));
		}
	}

	h2 {
		position: relative;
	}

	h2::after {
		content: '';
		position: absolute;
		width: 100%;
		bottom: -25%;
		left: 0;
		border-bottom: 1px solid #aaa;
	}

	.detail-btn {
		position: absolute;
		bottom: 5%;
		left: 50%;
		transform: translateX(-50%);
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	button.scroll {
		display: block;
		width: 2rem;
		aspect-ratio: 1/2;
		border: 1px solid #333;
		border-radius: 30px;
		position: relative;
		background-color: transparent;
		transition:
			background 0.5s,
			border 0.5s,
			transform 0.1s;
	}
	button.scroll::after {
		content: '';
		width: 0.08rem;
		height: 40%;
		background-color: #333;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		border-radius: 100%;
		animation: scaleY 2s infinite ease-in-out;
	}
	button.scroll:hover {
		color: #fff;
		border-color: transparent;
		background-color: var(--color-theme-1);
	}
	button.scroll:active {
		transform: scale(0.9);
	}
	button.scroll:hover::after {
		background-color: #fff;
	}

	span.scroll-txt {
		padding: 10%;
	}

	@keyframes scaleY {
		0% {
			transform: translate(-50%, -40%);
		}
		50% {
			transform: translate(-50%, -60%);
		}
		100% {
			transform: translate(-50%, -40%);
		}
	}
</style>
