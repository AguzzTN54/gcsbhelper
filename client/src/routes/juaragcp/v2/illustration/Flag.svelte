<div class="flag">
	<svg version="1.2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 422 1043">
		<style>
			.av {
				fill: #563327;
			}
		</style>
		<path
			class="av"
			d="m1 1018.9c47.3-579.3 96.1-967 224.1-1010.5 128.1-43.5 179.1 117.7 179.1 117.7 0 0 28 74.6 13.4 96.2-14.6 21.6-39.5 17.7-43.3 52.1-3.9 34.5 37.6 44.3 37.1 77.7-0.5 33.4-31.8 39.6-31.8 39.6 0 0 33.3-9.1 12.1-36.4-21.1-27.2-63.8-49.9-57.1-91.9 6.6-42 39.2-86.3-14.7-128.3-54-42.1-84.8-48.6-107.8 126.4-23 174.9-52.6 462-59.3 494.4-6.8 32.4-85.9-51.9-106.2-4.1-7.5 17.6-23.7 209.7-30.9 253.4-12.3 75.2-14.7 13.7-14.7 13.7z"
		/>
	</svg>
</div>

<style>
	.flag {
		width: 10%;
		position: absolute;
		right: 0;
		bottom: 0;
		transform: translate(-150%, 0%);
	}
	/* :global(.landscape) .flag {
		width: 7%;
		transform: translate(-50%, 0%);
	} */

	svg {
		width: 100%;
		transform: rotateY(180deg);
	}

	@media all and (max-width: 1200px) {
		.flag {
			transform: translate(-200%, 0%);
		}
	}

	@media all and (max-width: 800px) {
		.flag {
			width: 15%;
			transform: translate(-90%, 0%);
		}
	}

	@media all and (max-width: 400px) {
		.flag {
			width: 20%;
		}
	}
</style>
