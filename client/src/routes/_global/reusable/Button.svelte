<script lang="ts">
	const { children, onclick: click = null, disabled = false } = $props();
	const onclick = () => click?.();
</script>

<button
	{onclick}
	{disabled}
	class:disabled
	class="bg-amber-300 hover:bg-amber-400/80 px-10 py-2 text-lg mt-5 brutal-shadow-soft brutal-border !border-[3px] active:shadow-none rounded-xl"
>
	{@render children()}
</button>

<style lang="postcss">
	@import 'tailwindcss/theme' theme(reference);

	.disabled {
		@apply opacity-40 cursor-not-allowed shadow-none;
	}
</style>
