<script lang="ts">
	import { getContext } from 'svelte';
	import { self } from 'svelte/legacy';
	import { fade, fly } from 'svelte/transition';
	import Leaves from '../illustration/Leaves.svelte';
	import Gapura1 from '../illustration/Gapura1.svelte';

	const { persist = false, children, hideclosebutton = false } = $props();
	const modalHandle = getContext('modalHandle') as () => void;

	const dismiss = () => {
		if (persist) return;
		modalHandle();
	};
</script>

<section
	class="fixed top-0 left-0 z-99999 flex size-full items-center justify-center backdrop-blur-sm backdrop-brightness-90 backdrop-grayscale-100"
	onmousedown={self(dismiss)}
	role="button"
	tabindex="0"
	transition:fade={{ duration: 100 }}
>
	<div class="wrapper relative w-[600px] max-w-[85%]" transition:fly={{ y: 100, duration: 300 }}>
		{#if !hideclosebutton}
			<button
				onclick={modalHandle}
				class="absolute top-0 right-0 z-10 flex size-10 translate-x-1/3 -translate-y-1/3 items-center justify-center rounded-full border-4 border-[var(--color-secondary)] bg-amber-300 text-lg hover:bg-red-300 active:bg-red-400"
				aria-label="close"
			>
				<i class="fasds fa-xmark"></i>
			</button>
		{/if}

		<div class="relative size-full rounded-3xl bg-[var(--color-secondary)] p-2">
			<div
				class="absolute top-0 left-0 aspect-[4/7] w-16 -translate-x-1/6 -translate-y-3/5 overflow-hidden"
			>
				<Gapura1 fit />
			</div>
			<div class="absolute right-0 bottom-0 w-1/3 translate-x-1/2 translate-y-1/2 rotate-135">
				<Leaves />
			</div>

			<div class="relative z-1 min-h-20 w-full rounded-2xl bg-[var(--color-primary)]">
				{@render children()}
			</div>
		</div>
	</div>
</section>

<style lang="postcss">
	@import 'tailwindcss/theme' theme(reference);

	/* .wrapper {
		&::before {
			content: '';
			@apply absolute top-0 left-0 -z-1 size-full -translate-x-5 translate-y-1 scale-95 -skew-x-5 -skew-y-1 rounded-tl-3xl bg-indigo-300;
		}
	} */
</style>
