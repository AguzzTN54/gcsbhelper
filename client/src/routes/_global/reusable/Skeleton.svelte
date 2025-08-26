<script lang="ts">
	const { class: className } = $props();
</script>

<div class="load-placeholder bg-slate {className}"></div>

<style>
	.load-placeholder {
		background-image: linear-gradient(to right, #e7ebf4 0%, #fafafa 18%, #e7ebf4 33%);
		background-size: 300%;
		background-position: 100%;
		animation: placeholder 1.3s linear infinite forwards;
		box-shadow: 2px 2px 0 #d1d5db;
		outline: 1px solid rgba(0, 0, 0, 0.02);
	}

	@keyframes placeholder {
		0% {
			background-position: 100%;
		}
		100% {
			background-position: -100%;
		}
	}
</style>
