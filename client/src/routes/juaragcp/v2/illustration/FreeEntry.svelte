<script>
	let clientHeight = $state(0);
	import bg from '$img/badge.png';
</script>

<div
	class="free-entry absolute top-0 right-0 z-10 flex aspect-square w-[10%] min-w-[100px] items-center justify-center leading-[120%] font-bold uppercase"
	bind:clientHeight
	style="--content:{clientHeight}px; --bg:url('{bg}')"
>
	<span> Free Entry </span>
</div>

<style>
	.free-entry {
		color: var(--color-primary);
		font-size: calc(0.15 * var(--content));
		transform: translate(23%, -23%);
		&::after {
			content: '';
			background-image: var(--bg);
			background-position: center;
			background-repeat: no-repeat;
			background-size: 115%;
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			z-index: -1;
			animation: rotate infinite 20s linear;
		}
	}

	span {
		width: 80%;
		text-align: center;
		transform: rotate(20deg);
	}

	@media all and (max-width: 850px) {
		.free-entry {
			width: 23%;
		}
	}

	@keyframes rotate {
		0% {
			transform: rotate(0deg);
		}

		100% {
			transform: rotate(360deg);
		}
	}
</style>
