<script lang="ts">
	import { getContext, type Snippet } from 'svelte';
	import { self } from 'svelte/legacy';
	import { fade, fly } from 'svelte/transition';

	interface Props {
		children: Snippet;
		persist?: boolean;
		hideclosebutton?: boolean;
		onclose?: () => void;
	}
	const { persist = false, children, hideclosebutton = false, onclose }: Props = $props();
	const modalHandle = getContext('modalHandle') as () => void;

	const dismiss = () => {
		if (persist) return;
		modalHandle?.();
		onclose?.();
	};

	const modalOnClose = () => {
		modalHandle?.();
		onclose?.();
	};
</script>

<section
	class="fixed top-0 left-0 z-99999 flex size-full items-center justify-center bg-amber-50/80 backdrop-blur-xs"
	onmousedown={self(dismiss)}
	role="button"
	tabindex="0"
	transition:fade={{ duration: 100 }}
>
	<div
		class="wrapper relative w-[600px] max-w-[85%]"
		in:fly={{ y: Math.random() < 0.5 ? -200 : 200, duration: 200 }}
		out:fly={{ y: Math.random() < 0.5 ? -200 : 200, duration: 200 }}
	>
		{#if !hideclosebutton}
			<button
				onclick={modalOnClose}
				class="brutal-border absolute top-0 right-0 z-10 flex size-10 translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-gray-100 text-lg hover:bg-red-300 active:bg-red-400"
				aria-label="close"
			>
				<i class="fasds fa-xmark"></i>
			</button>
		{/if}

		<div
			class="brutal-border-lg size-full -skew-x-3 -skew-y-2 overflow-hidden rounded-tl-3xl bg-amber-300"
		>
			<div class="w-full skew-x-3 skew-y-2 bg-gray-100 p-5">
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
			@apply absolute top-0 left-0 -z-1 size-full -translate-x-5 translate-y-1 scale-95 -skew-x-5 -skew-y-1 rounded-tl-3xl bg-indigo-300;
		}
	}
</style>
