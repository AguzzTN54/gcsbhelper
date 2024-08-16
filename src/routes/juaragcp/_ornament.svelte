<script>
	let clientWidth;
</script>

<div class="container">
	<div class="wrapper" bind:clientWidth style="--width: {clientWidth}px">
		<div class="row left" style="--duration: 12s">
			<div class="long green"></div>
			<div class="circle green"></div>
			<div class="circle red"></div>
			<div class="long red"></div>
			<div class="long green"></div>
			<div class="circle green"></div>
			<div class="circle red"></div>
			<div class="long red"></div>
		</div>
		<div class="row right" style="--duration: 15s">
			<div class="long blue"></div>
			<div class="circle blue"></div>
			<div class="circle orange"></div>
			<div class="long orange"></div>
			<div class="long blue"></div>
			<div class="circle blue"></div>
			<div class="circle orange"></div>
			<div class="long orange"></div>
		</div>

		<div class="row left" style="--duration: 15s">
			<div class="long green"></div>
			<div class="circle green"></div>
			<div class="circle red"></div>
			<div class="long red"></div>
			<div class="long green"></div>
			<div class="circle green"></div>
			<div class="circle red"></div>
			<div class="long red"></div>
		</div>
		<div class="row right" style="--duration: 8s">
			<div class="long blue"></div>
			<div class="circle blue"></div>
			<div class="circle orange"></div>
			<div class="long orange"></div>
			<div class="long blue"></div>
			<div class="circle blue"></div>
			<div class="circle orange"></div>
			<div class="long orange"></div>
		</div>
	</div>
</div>

<style>
	.container {
		width: calc(0.4 * var(--screen-width));
		position: absolute;
		top: 0;
		right: 0;
	}

	.wrapper {
		width: var(--screen-width);
		transform: rotate(45deg);
		transform-origin: 35%;
	}

	.row {
		width: max-content;
		height: calc(0.04 * var(--width));
		margin: calc(0.01 * var(--width)) 0;
	}

	.row > div {
		display: inline-block;
	}
	.right {
		animation: marquee-reverse linear infinite;
		animation-duration: var(--duration);
	}
	.left {
		animation: marquee linear infinite;
		animation-duration: var(--duration);
	}

	.circle {
		height: 100%;
		aspect-ratio: 1/1;
		position: relative;
	}

	.long {
		position: relative;
		height: 100%;
		width: calc(0.2 * var(--width));
	}

	.long::after,
	.circle::after {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
	}

	.circle::after {
		aspect-ratio: 1/1;
		border-radius: 100%;
		background-color: #fff;
		transform: scale(0.85);
	}

	.long::after {
		height: 100%;
		background-color: #fff;
		transform: scaleY(0.85) scaleX(0.97);
		border-radius: calc(var(--width) * 0.1);
	}

	/* Color */
	.orange::after {
		background-image: linear-gradient(to right, #fbbc04, #f89701);
	}
	.blue::after {
		background-image: linear-gradient(to right, #4285f4, #2367d8);
	}
	.red::after {
		background-image: linear-gradient(to right, #ff6c4b, #d22b1d);
	}
	.green::after {
		background-image: linear-gradient(to right, #34a853, #178935);
	}

	@keyframes marquee {
		0% {
			transform: translateX(-36%);
		}
		100% {
			transform: translateX(14%);
		}
	}

	@keyframes marquee-reverse {
		0% {
			transform: translateX(1%);
		}
		100% {
			transform: translateX(-49%);
		}
	}
</style>
