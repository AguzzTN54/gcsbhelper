<script lang="ts">
	import { getContext } from 'svelte';
	import { self } from 'svelte/legacy';
	import { fade, fly } from 'svelte/transition';

	const { persist = false, children, hideclosebutton = false } = $props();
	const modalHandle = getContext('modalHandle') as () => void;

	const dismiss = () => {
		if (persist) return;
		modalHandle();
	};
</script>

<section
	class="fixed size-full z-99999 top-0 left-0 flex items-center justify-center bg-amber-50/80 backdrop-blur-xs"
	onmousedown={self(dismiss)}
	role="button"
	tabindex="0"
	transition:fade={{ duration: 100 }}
>
	<div
		class="w-[600px] max-w-[85%] wrapper relative"
		in:fly={{ y: Math.random() < 0.5 ? -200 : 200, duration: 200 }}
		out:fly={{ y: Math.random() < 0.5 ? -200 : 200, duration: 200 }}
	>
		{#if !hideclosebutton}
			<button
				onclick={modalHandle}
				class="absolute top-0 right-0 rounded-full flex items-center justify-center size-10 bg-gray-100 text-lg z-10 brutal-border translate-x-1/2 -translate-y-1/2 hover:bg-red-300 active:bg-red-400"
				aria-label="close"
			>
				<i class="fasds fa-xmark"></i>
			</button>
		{/if}

		<div
			class="bg-amber-300 brutal-border-lg size-full -skew-y-2 -skew-x-3 rounded-tl-3xl overflow-hidden"
		>
			<div class="w-full skew-y-2 skew-x-3 p-5 bg-gray-100">
				{@render children()}
			</div>
		</div>
	</div>
</section>

<style lang="postcss">
	@import 'tailwindcss/theme' theme(reference);

	.wrapper {
		&::before {
			content: '';
			@apply size-full bg-indigo-300 -skew-y-1 -skew-x-5 absolute top-0 left-0 scale-95 -z-1 -translate-x-5 rounded-tl-3xl translate-y-1;
		}
	}
</style>
