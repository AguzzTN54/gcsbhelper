<script>
	const { dark = false } = $props();
</script>

<div class="loader-icon" class:dark>
	<span></span>
</div>
<div class="text" class:dark>Tunggu Sebentar..</div>

<style>
	.text {
		position: relative;
		z-index: +1;
		color: var(--color-primary);
		margin-top: 2rem;
		font-weight: 400;
	}

	.dark.text {
		color: var(--color-secondary);
	}

	.loader-icon {
		width: 35px;
		height: 35px;
		position: relative;
	}
	span {
		display: block;
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
	}
	span::before,
	span::after {
		content: '';
		display: block;
		position: absolute;
		left: 0;
		top: 0;
		margin: auto;
		width: 100%;
		height: 100%;
		border: 5px solid var(--color-primary);
		border-radius: 50%;
		opacity: 0.5;
	}

	.dark span::before,
	.dark span::after {
		border-color: var(--color-secondary);
	}

	span::before {
		animation: loaderAnim1 1.5s cubic-bezier(0.075, 0.82, 0.165, 1) infinite;
	}

	span::after {
		animation: loaderAnim2 1.5s cubic-bezier(0.075, 0.82, 0.165, 1) 0.25s infinite;
	}

	@keyframes loaderAnim1 {
		0% {
			transform: scale(0);
			opacity: 1;
		}
		20% {
			opacity: 1;
		}
		100% {
			transform: scale(1.5);
			opacity: 0;
		}
	}

	@keyframes loaderAnim2 {
		0% {
			transform: scale(0);
			opacity: 1;
		}
		20% {
			opacity: 1;
		}
		100% {
			transform: scale(1);
			opacity: 0;
		}
	}
</style>
