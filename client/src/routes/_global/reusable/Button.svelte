<script lang="ts">
	const { children, onclick: click = null, disabled = false, class: className = '' } = $props();
	const onclick = () => click?.();
</script>

<button
	{onclick}
	{disabled}
	class:disabled
	class="brutal-shadow-soft brutal-border mt-5 rounded-xl !border-[3px] bg-amber-300 px-10 py-2 text-lg hover:bg-amber-400/80 active:shadow-none {className ||
		''}"
>
	{@render children()}
</button>

<style lang="postcss">
	@import 'tailwindcss/theme' theme(reference);

	.disabled {
		@apply cursor-not-allowed opacity-40 shadow-none;
	}
</style>
