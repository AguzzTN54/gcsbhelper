<script>
	const { flip = false } = $props();
</script>

<div class="leaves" class:flip>
	<svg version="1.2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 95 255">
		<g class="path">
			<path
				class="leaf"
				d="m33.9 20.9c7.1 12.2 16 40.6 15 38.9-8.1-13.5-15.6-25.5-25-38-0.9-1.1-20-24.5-9.8-20.5 9.3 4.3 14.7 10.8 19.8 19.6z"
			/>
			<path
				class="leaf"
				d="m12.1 44.4c10.8 3.7 19.1 7.9 27.7 15.2 0.1 0.1 28.1 27.5 16.1 19.5-11.7-7.9-21.8-13.6-34.2-20.3-5.6-3-38.3-23.7-9.6-14.4z"
			/>
			<path
				d="m70.1 18.9c3.9-1.1 0.9 5.3 0.1 7.8-6.5 19.6-7.7 27.8-11.3 47.3-2.7 14.3-2.1-24.8-2.1-24.9 1.1-12.7 4.6-20.5 13.3-30.2z"
			/>
			<path
				class="leaf"
				d="m25.8 67.3c13 6.8 33.2 24.5 39.6 37.9 0.9 1.9 3.9 6.1-0.6 1.9-12.8-12.1-28.8-21.5-42.7-33-1.8-1.5-12.1-9.1-7.7-10.4 4.5 0.7 7.3 1.7 11.4 3.6z"
			/>
			<path
				d="m86.2 50.1c2.4 1.7-4.1 13.1-5 15.3-6.3 13.9-9.3 23-13.5 37.5-2.8 9.7 0.9-22.4 0.9-22.5 1.8-10.5 6.6-23.4 16.1-29.8z"
			/>
			<path
				class="leaf"
				d="m22.3 90.6c14.7 4.1 30.7 18.1 39.3 30.2 0.4 0.7 14.4 23.8 6.5 14.9-13.1-14.8-24.8-21.1-39.3-33.3-1.2-1.1-17.2-14.8-6.5-11.8z"
			/>
			<path
				d="m69.7 135.8c4.3-12.2 5.9-19.3 11.9-31.5 1.9-3.8 12.3-20.2 10-22.6-17 8-22.1 38.2-21.9 54.1z"
			/>
			<path
				class="leaf"
				d="m23.6 114.3c18.1 6.8 38.1 35.9 40 55.8-13.4-24.5-27-30.3-41.2-50.1-1.5-2.3-5.5-8.2 1.2-5.7z"
			/>
			<path
				d="m63.8 169.2c6-12.1 8.7-19.8 16.5-31.7 2.5-3.9 14.9-19.2 13.7-22.2-18.3 5-28 37.9-30.2 53.9z"
			/>
			<path
				d="m27.5 147.7c16.7 14 28.8 38.1 28.1 61.3-4.5-14.6-11.9-26.4-20.4-38.6-0.7-1-23.4-35.9-7.7-22.7z"
			/>
			<path
				d="m85.5 165.8c-12.2 13.5-20.2 23.3-29.1 39.3 6.1-18 14.9-40.3 33.5-49.2 11.8-5.6-2.7 8.1-4.4 9.9z"
			/>
			<path
				d="m59.8 193.1c16.4-67 15.2-88.3-14.1-147.2-4.8-9.3-13.5-20-4.1-1.5l1.5 2.8c7.3 14.5 15.7 32.4 20.4 48.2 14.7 50.1-7 82.4-11.7 129.7-0.7 10.7 1.4 17.3 5.9 28.5 0.2 0.6 0.8 0.8 1.3 0.5 0.6-0.2 0.8-0.9 0.6-1.4-4.4-11-6.5-17.3-5.7-27.7 1.1-11 3.3-21 5.9-31.9z"
			/>
		</g>
	</svg>
</div>

<style>
	.leaves {
		position: absolute;
		bottom: 0;
		right: 65%;
		width: 5%;
		min-width: 5vh;
		transform: translate(-10%, 10%);
		fill: #50734d;
	}

	.flip .leaf {
		--duration: 6.4s;
		animation-direction: normal;
	}
	.leaf {
		--duration: 6.8s;
		transform-origin: right bottom;
		transform-box: fill-box;
		animation-duration: var(--duration);
		animation-name: leaf;
		animation-timing-function: ease-in-out;
		animation-iteration-count: infinite;
		animation-direction: alternate-reverse;
	}

	.leaves.flip {
		right: unset;
		left: 0;
		transform: translate(-40%, 20%) rotateY(180deg);
	}

	.leaves:not(.flip) svg {
		width: 100%;
		transform-origin: bottom;
		animation: leaves 3.4s alternate infinite ease-in-out;
	}

	.flip svg {
		width: 120%;
		transform-origin: bottom;
		animation: leafFlip 3.2s alternate infinite ease-in-out;
	}

	@keyframes leafFlip {
		0% {
			transform: rotate(-20deg) scale(1);
		}
		100% {
			transform: rotate(-40deg) scale(0.95);
		}
	}

	@keyframes leaves {
		0% {
			transform: rotate(-20deg) scale(1);
		}
		100% {
			transform: rotate(0deg) scale(0.95);
		}
	}

	@keyframes leaf {
		0% {
			transform: rotate(20deg);
		}
		45% {
			transform: rotate(-20deg);
		}
		50% {
			transform: rotate(-20deg);
		}
		90% {
			transform: rotate(20deg);
		}
		100% {
			transform: rotate(20deg);
		}
	}

	@media all and (max-width: 570px) {
		.flip {
			display: none;
		}
	}
</style>
