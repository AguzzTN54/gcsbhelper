<script lang="ts">
	const { children, onclick: click = null } = $props();
	const onclick = () => click?.();
</script>

<button
	{onclick}
	class="bg-amber-300 hover:bg-amber-400/80 px-10 py-2 text-lg mt-5 brutal-shadow-soft brutal-border !border-[3px] active:shadow-none rounded-xl"
>
	{@render children()}
</button>
