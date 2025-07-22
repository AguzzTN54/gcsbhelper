<script>
	import { getContext } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	// import Links from './_links.svelte';
	import Counter from '$comp/Counter.svelte';

	export let points = {};
	export let user = '';

	let showBtn = false;
	const modalHandle = getContext('modalHandle');
	const sumPoint = Object.keys(points)
		.map((key) => points[key])
		.reduce((pv = 0, cur) => pv + cur);

	const showNotes = () => {
		modalHandle('notice', {
			msg: `<p>This calculation is based on the badges earned on your profile and certain rules published by the Arcade Team.</p> <p>We do not guarantee that this is the final score you will receive. Therefore, we recommend that you carefully review the content you have completed to ensure accuracy.</p>`
		});
	};
</script>

<div class="wrapper" transition:fade>
	<div class="info">
		<h1 class="point">
			<div class="numeric">
				<Counter float max={sumPoint} on:end={() => (showBtn = true)} />
			</div>
			<span class="pts">pts</span>

			{#if showBtn}
				<button class="revoke" title="Notes, Read This!" on:click={showNotes} in:fade>
					<b>i</b>
				</button>
			{/if}
		</h1>
		<button class="user" on:click={modalHandle}>
			<h2><i class="gc-triangle-down"></i> {user}</h2>
		</button>
	</div>

	<!-- <Links /> -->
</div>

{#if showBtn}
	<div class="detail-btn" in:fly={{ y: -20 }}>
		<span>
			<i class="gc-double-left"></i>
		</span>
	</div>
{/if}

<style>
	.wrapper {
		text-align: center;
	}

	.info {
		transform: translateY(-25%);
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
		width: calc(0.05 * var(--screen-height));
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
		font-size: large;
		line-height: 0;
	}

	.detail-btn {
		position: absolute;
		bottom: 0;
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
