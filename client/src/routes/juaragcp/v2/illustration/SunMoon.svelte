<div class="sunmoon">
	<svg version="1.2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 219 219">
		<path
			class="aa"
			d="m218 109.6c0 60-48.6 108.7-108.6 108.7-60.1 0-108.7-48.7-108.7-108.7 0-60 48.6-108.7 108.7-108.7 60 0 108.6 48.7 108.6 108.7z"
		/>
		<path
			class="bb"
			d="m104.4 66.4c52.9-10.3 50.5 10.2 96.3 5.5q5.2-0.5 10.1-1.4c4.7 12.1 7.2 25.3 7.2 39.1 0 60-48.6 108.7-108.6 108.7-60.1 0-108.7-48.7-108.7-108.7 0-15.6 3.2-30.4 9.2-43.8 27.1 11.1 50.4 9.1 94.5 0.6z"
		/>
		<path
			class="cc"
			d="m26.2 52.7c5.6-8.3 11.2-14.2 18.9-20.6 7.2-5.5 38-23.7 46.3-18.9-0.6 0.7-34.6 18.5-41.5 24.5-6.7 6.2-11.7 12-16.9 19.6-4.3 6.6-8.5 19.5-13.1 17-7.7-1.7 4.4-18.6 6.3-21.6z"
		/>
	</svg>
</div>

<style>
	.sunmoon {
		width: 10%;
		position: absolute;
		top: 0;
		left: 0;
		animation: moveDesktop forwards linear infinite 180s;
	}

	.aa {
		fill: #e7bb54;
	}
	.bb {
		fill: #e1a546;
	}
	.cc {
		fill: #f8f4e9;
	}

	@media all and (max-width: 640px) {
		.sunmoon {
			width: 20%;
			animation: moveMobile forwards linear infinite 100s;
		}
	}

	@keyframes moveDesktop {
		0% {
			transform: translate(-100%, 150%);
		}
		100% {
			transform: translate(500%, -100%);
		}
	}

	@keyframes moveMobile {
		0% {
			transform: translate(-100%, 400%);
		}
		100% {
			transform: translate(300%, -100%);
		}
	}
</style>
