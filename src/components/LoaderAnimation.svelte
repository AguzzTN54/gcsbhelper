<div class="load-animation main-load">
	<div class="anime">
		<div class="a-box"></div>
		<div class="a-box"></div>
		<div class="a-box"></div>
		<div class="a-box"></div>
		<div class="a-box"></div>
	</div>
</div>

<style>
	.load-animation {
		--duration: 1.25s;
		--box-border-radius: 20%;
		--main-load: 175px;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 10px;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.main-load {
		width: var(--main-load);
		height: calc(var(--main-load) * 1 / 6);
	}

	.anime {
		width: 80%;
		height: 100%;
		display: flex;
		justify-content: space-between;
		align-items: center;
		position: relative;
		/* overflow: hidden; */
	}

	.a-box {
		width: 15%;
		height: 75%;
		position: relative;
		display: block;
		-webkit-transform-origin: -50% center;
		transform-origin: -50% center;
		border-radius: var(--box-border-radius);
	}

	.a-box:after {
		content: '';
		width: 100%;
		height: 100%;
		position: absolute;
		top: 0;
		right: 0;
		border-radius: var(--box-border-radius);
	}

	.a-box:nth-child(1) {
		-webkit-animation: slide var(--duration) ease-in-out infinite alternate;
		animation: slide var(--duration) ease-in-out infinite alternate;
	}

	.a-box:nth-child(1):after {
		-webkit-animation: color-change var(--duration) ease-in-out infinite alternate;
		animation: color-change var(--duration) ease-in-out infinite alternate;
	}

	.a-box:nth-child(2) {
		-webkit-animation: flip-1 var(--duration) ease-in-out infinite alternate;
		animation: flip-1 var(--duration) ease-in-out infinite alternate;
	}

	.a-box:nth-child(2):after {
		-webkit-animation: squidge-1 var(--duration) ease-in-out infinite alternate;
		animation: squidge-1 var(--duration) ease-in-out infinite alternate;
	}

	.a-box:nth-child(3) {
		-webkit-animation: flip-2 var(--duration) ease-in-out infinite alternate;
		animation: flip-2 var(--duration) ease-in-out infinite alternate;
	}

	.a-box:nth-child(3):after {
		-webkit-animation: squidge-2 var(--duration) ease-in-out infinite alternate;
		animation: squidge-2 var(--duration) ease-in-out infinite alternate;
	}

	.a-box:nth-child(4) {
		-webkit-animation: flip-3 var(--duration) ease-in-out infinite alternate;
		animation: flip-3 var(--duration) ease-in-out infinite alternate;
	}

	.a-box:nth-child(4):after {
		-webkit-animation: squidge-3 var(--duration) ease-in-out infinite alternate;
		animation: squidge-3 var(--duration) ease-in-out infinite alternate;
	}

	.a-box:nth-child(5) {
		-webkit-animation: flip-4 var(--duration) ease-in-out infinite alternate;
		animation: flip-4 var(--duration) ease-in-out infinite alternate;
	}

	.a-box:nth-child(5):after {
		-webkit-animation: squidge-4 var(--duration) ease-in-out infinite alternate;
		animation: squidge-4 var(--duration) ease-in-out infinite alternate;
	}

	.a-box:nth-child(2):after {
		background-color: #1c9fff;
	}

	.a-box:nth-child(3):after {
		background-color: #1fb1fd;
	}

	.a-box:nth-child(4):after {
		background-color: #22c7fb;
	}

	.a-box:nth-child(5):after {
		background-color: #23d3fb;
	}

	@-webkit-keyframes slide {
		0% {
			background-color: #1795ff;
			-webkit-transform: translatex(0vw);
			transform: translatex(0vw);
		}

		100% {
			background-color: #23d3fb;
			-webkit-transform: translatex(500%);
			transform: translatex(500%);
		}
	}

	@keyframes slide {
		0% {
			background-color: #1795ff;
			-webkit-transform: translatex(0vw);
			transform: translatex(0vw);
		}

		100% {
			background-color: #23d3fb;
			-webkit-transform: translatex(500%);
			transform: translatex(500%);
		}
	}

	@-webkit-keyframes color-change {
		0% {
			background-color: #1795ff;
		}

		100% {
			background-color: #23d3fb;
		}
	}

	@keyframes color-change {
		0% {
			background-color: #1795ff;
		}

		100% {
			background-color: #23d3fb;
		}
	}

	@-webkit-keyframes flip-1 {
		0%,
		15% {
			-webkit-transform: rotate(0);
			transform: rotate(0);
		}

		35%,
		100% {
			-webkit-transform: rotate(-180deg);
			transform: rotate(-180deg);
		}
	}

	@keyframes flip-1 {
		0%,
		15% {
			-webkit-transform: rotate(0);
			transform: rotate(0);
		}

		35%,
		100% {
			-webkit-transform: rotate(-180deg);
			transform: rotate(-180deg);
		}
	}

	@-webkit-keyframes squidge-1 {
		5% {
			-webkit-transform-origin: center bottom;
			transform-origin: center bottom;
			-webkit-transform: scalex(1) scaley(1);
			transform: scalex(1) scaley(1);
		}

		15% {
			-webkit-transform-origin: center bottom;
			transform-origin: center bottom;
			-webkit-transform: scalex(1.3) scaley(0.7);
			transform: scalex(1.3) scaley(0.7);
		}

		25%,
		20% {
			-webkit-transform-origin: center bottom;
			transform-origin: center bottom;
			-webkit-transform: scalex(0.8) scaley(1.4);
			transform: scalex(0.8) scaley(1.4);
		}

		55%,
		100% {
			-webkit-transform-origin: center top;
			transform-origin: center top;
			-webkit-transform: scalex(1) scaley(1);
			transform: scalex(1) scaley(1);
		}

		40% {
			-webkit-transform-origin: center top;
			transform-origin: center top;
			-webkit-transform: scalex(1.3) scaley(0.7);
			transform: scalex(1.3) scaley(0.7);
		}
	}

	@keyframes squidge-1 {
		5% {
			-webkit-transform-origin: center bottom;
			transform-origin: center bottom;
			-webkit-transform: scalex(1) scaley(1);
			transform: scalex(1) scaley(1);
		}

		15% {
			-webkit-transform-origin: center bottom;
			transform-origin: center bottom;
			-webkit-transform: scalex(1.3) scaley(0.7);
			transform: scalex(1.3) scaley(0.7);
		}

		25%,
		20% {
			-webkit-transform-origin: center bottom;
			transform-origin: center bottom;
			-webkit-transform: scalex(0.8) scaley(1.4);
			transform: scalex(0.8) scaley(1.4);
		}

		55%,
		100% {
			-webkit-transform-origin: center top;
			transform-origin: center top;
			-webkit-transform: scalex(1) scaley(1);
			transform: scalex(1) scaley(1);
		}

		40% {
			-webkit-transform-origin: center top;
			transform-origin: center top;
			-webkit-transform: scalex(1.3) scaley(0.7);
			transform: scalex(1.3) scaley(0.7);
		}
	}

	@-webkit-keyframes flip-2 {
		0%,
		30% {
			-webkit-transform: rotate(0);
			transform: rotate(0);
		}

		50%,
		100% {
			-webkit-transform: rotate(-180deg);
			transform: rotate(-180deg);
		}
	}

	@keyframes flip-2 {
		0%,
		30% {
			-webkit-transform: rotate(0);
			transform: rotate(0);
		}

		50%,
		100% {
			-webkit-transform: rotate(-180deg);
			transform: rotate(-180deg);
		}
	}

	@-webkit-keyframes squidge-2 {
		20% {
			-webkit-transform-origin: center bottom;
			transform-origin: center bottom;
			-webkit-transform: scalex(1) scaley(1);
			transform: scalex(1) scaley(1);
		}

		30% {
			-webkit-transform-origin: center bottom;
			transform-origin: center bottom;
			-webkit-transform: scalex(1.3) scaley(0.7);
			transform: scalex(1.3) scaley(0.7);
		}

		40%,
		35% {
			-webkit-transform-origin: center bottom;
			transform-origin: center bottom;
			-webkit-transform: scalex(0.8) scaley(1.4);
			transform: scalex(0.8) scaley(1.4);
		}

		70%,
		100% {
			-webkit-transform-origin: center top;
			transform-origin: center top;
			-webkit-transform: scalex(1) scaley(1);
			transform: scalex(1) scaley(1);
		}

		55% {
			-webkit-transform-origin: center top;
			transform-origin: center top;
			-webkit-transform: scalex(1.3) scaley(0.7);
			transform: scalex(1.3) scaley(0.7);
		}
	}

	@keyframes squidge-2 {
		20% {
			-webkit-transform-origin: center bottom;
			transform-origin: center bottom;
			-webkit-transform: scalex(1) scaley(1);
			transform: scalex(1) scaley(1);
		}

		30% {
			-webkit-transform-origin: center bottom;
			transform-origin: center bottom;
			-webkit-transform: scalex(1.3) scaley(0.7);
			transform: scalex(1.3) scaley(0.7);
		}

		40%,
		35% {
			-webkit-transform-origin: center bottom;
			transform-origin: center bottom;
			-webkit-transform: scalex(0.8) scaley(1.4);
			transform: scalex(0.8) scaley(1.4);
		}

		70%,
		100% {
			-webkit-transform-origin: center top;
			transform-origin: center top;
			-webkit-transform: scalex(1) scaley(1);
			transform: scalex(1) scaley(1);
		}

		55% {
			-webkit-transform-origin: center top;
			transform-origin: center top;
			-webkit-transform: scalex(1.3) scaley(0.7);
			transform: scalex(1.3) scaley(0.7);
		}
	}

	@-webkit-keyframes flip-3 {
		0%,
		45% {
			-webkit-transform: rotate(0);
			transform: rotate(0);
		}

		65%,
		100% {
			-webkit-transform: rotate(-180deg);
			transform: rotate(-180deg);
		}
	}

	@keyframes flip-3 {
		0%,
		45% {
			-webkit-transform: rotate(0);
			transform: rotate(0);
		}

		65%,
		100% {
			-webkit-transform: rotate(-180deg);
			transform: rotate(-180deg);
		}
	}

	@-webkit-keyframes squidge-3 {
		35% {
			-webkit-transform-origin: center bottom;
			transform-origin: center bottom;
			-webkit-transform: scalex(1) scaley(1);
			transform: scalex(1) scaley(1);
		}

		45% {
			-webkit-transform-origin: center bottom;
			transform-origin: center bottom;
			-webkit-transform: scalex(1.3) scaley(0.7);
			transform: scalex(1.3) scaley(0.7);
		}

		55%,
		50% {
			-webkit-transform-origin: center bottom;
			transform-origin: center bottom;
			-webkit-transform: scalex(0.8) scaley(1.4);
			transform: scalex(0.8) scaley(1.4);
		}

		85%,
		100% {
			-webkit-transform-origin: center top;
			transform-origin: center top;
			-webkit-transform: scalex(1) scaley(1);
			transform: scalex(1) scaley(1);
		}

		70% {
			-webkit-transform-origin: center top;
			transform-origin: center top;
			-webkit-transform: scalex(1.3) scaley(0.7);
			transform: scalex(1.3) scaley(0.7);
		}
	}

	@keyframes squidge-3 {
		35% {
			-webkit-transform-origin: center bottom;
			transform-origin: center bottom;
			-webkit-transform: scalex(1) scaley(1);
			transform: scalex(1) scaley(1);
		}

		45% {
			-webkit-transform-origin: center bottom;
			transform-origin: center bottom;
			-webkit-transform: scalex(1.3) scaley(0.7);
			transform: scalex(1.3) scaley(0.7);
		}

		55%,
		50% {
			-webkit-transform-origin: center bottom;
			transform-origin: center bottom;
			-webkit-transform: scalex(0.8) scaley(1.4);
			transform: scalex(0.8) scaley(1.4);
		}

		85%,
		100% {
			-webkit-transform-origin: center top;
			transform-origin: center top;
			-webkit-transform: scalex(1) scaley(1);
			transform: scalex(1) scaley(1);
		}

		70% {
			-webkit-transform-origin: center top;
			transform-origin: center top;
			-webkit-transform: scalex(1.3) scaley(0.7);
			transform: scalex(1.3) scaley(0.7);
		}
	}

	@-webkit-keyframes flip-4 {
		0%,
		60% {
			-webkit-transform: rotate(0);
			transform: rotate(0);
		}

		80%,
		100% {
			-webkit-transform: rotate(-180deg);
			transform: rotate(-180deg);
		}
	}

	@keyframes flip-4 {
		0%,
		60% {
			-webkit-transform: rotate(0);
			transform: rotate(0);
		}

		80%,
		100% {
			-webkit-transform: rotate(-180deg);
			transform: rotate(-180deg);
		}
	}

	@-webkit-keyframes squidge-4 {
		50% {
			-webkit-transform-origin: center bottom;
			transform-origin: center bottom;
			-webkit-transform: scalex(1) scaley(1);
			transform: scalex(1) scaley(1);
		}

		60% {
			-webkit-transform-origin: center bottom;
			transform-origin: center bottom;
			-webkit-transform: scalex(1.3) scaley(0.7);
			transform: scalex(1.3) scaley(0.7);
		}

		70%,
		65% {
			-webkit-transform-origin: center bottom;
			transform-origin: center bottom;
			-webkit-transform: scalex(0.8) scaley(1.4);
			transform: scalex(0.8) scaley(1.4);
		}

		100%,
		100% {
			-webkit-transform-origin: center top;
			transform-origin: center top;
			-webkit-transform: scalex(1) scaley(1);
			transform: scalex(1) scaley(1);
		}

		85% {
			-webkit-transform-origin: center top;
			transform-origin: center top;
			-webkit-transform: scalex(1.3) scaley(0.7);
			transform: scalex(1.3) scaley(0.7);
		}
	}

	@keyframes squidge-4 {
		50% {
			-webkit-transform-origin: center bottom;
			transform-origin: center bottom;
			-webkit-transform: scalex(1) scaley(1);
			transform: scalex(1) scaley(1);
		}

		60% {
			-webkit-transform-origin: center bottom;
			transform-origin: center bottom;
			-webkit-transform: scalex(1.3) scaley(0.7);
			transform: scalex(1.3) scaley(0.7);
		}

		70%,
		65% {
			-webkit-transform-origin: center bottom;
			transform-origin: center bottom;
			-webkit-transform: scalex(0.8) scaley(1.4);
			transform: scalex(0.8) scaley(1.4);
		}

		100%,
		100% {
			-webkit-transform-origin: center top;
			transform-origin: center top;
			-webkit-transform: scalex(1) scaley(1);
			transform: scalex(1) scaley(1);
		}

		85% {
			-webkit-transform-origin: center top;
			transform-origin: center top;
			-webkit-transform: scalex(1.3) scaley(0.7);
			transform: scalex(1.3) scaley(0.7);
		}
	}
</style>
