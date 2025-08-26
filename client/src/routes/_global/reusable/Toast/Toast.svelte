<script lang="ts">
	import { fade, fly } from 'svelte/transition';

	const {
		type = 'info',
		dismissible = false,
		timeout = 0,
		autoclose = true,
		children,
		onclose
	} = $props();
	const duration = timeout ? `${timeout / 1000}s` : '0s';
	const typeClasses: Record<string, string> = {
		info: 'bg-sky-300 border-sky-900 text-sky-900',
		success: 'bg-green-300 border-green-900 text-green-900',
		error: 'bg-red-300 border-red-900 text-red-900',
		warning: 'bg-yellow-300 border-yellow-900 text-yellow-900'
	};
</script>

<div
	in:fly|local={{ y: -20 }}
	out:fade={{ duration: 200 }}
	role="alert"
	style="--duration: {duration}"
	class:autoclose={autoclose && timeout > 0}
	class="
    {typeClasses[type]} relative flex items-center gap-2 px-4 py-2
    rounded-md border-4 pointer-events-auto font-bold tracking-wide
  "
>
	<div class="text-sm">
		{@render children?.()}
	</div>

	{#if dismissible}
		<button class="ml-auto p-1 text-inherit hover:scale-110 transition" onclick={() => onclose?.()}>
			✕
		</button>
	{/if}

	{#if autoclose && timeout > 0}
		<div class="absolute bottom-0 left-0 h-0.75 w-full bg-black indicator"></div>
	{/if}
</div>

<style>
	.indicator {
		transform-origin: 0%;
		animation: shrinkX forwards linear;
		animation-duration: var(--duration);
	}
	@keyframes shrinkX {
		0% {
			transform: scaleX(100%);
		}
		100% {
			transform: scaleX(0%);
		}
	}
</style>
