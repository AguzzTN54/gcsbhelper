<script lang="ts">
	import { type Snippet } from 'svelte';
	import { fly } from 'svelte/transition';
	import Portal from '$reusable/Portal';

	interface Props {
		popup?: Snippet;
		children?: Snippet;
		class?: string;
		offset?: number;
		tailwindbg?: string;
	}
	const { popup, children, class: className, tailwindbg, offset = 100 }: Props = $props();

	const bgColor = $derived(tailwindbg || 'bg-gray-800');
	let triggerEl = $state<HTMLElement | null>(null);
	let tooltipEl = $state<HTMLElement | null>(null);
	let isVisible = $state(false);
	let side = $state<'top' | 'bottom' | 'left' | 'right'>('top');
	let position = $state({ x: 0, y: 0 });

	const OFFSET = offset;

	const updatePosition = () => {
		if (!triggerEl || !tooltipEl || !isVisible) return;

		const triggerRect = triggerEl.getBoundingClientRect();
		const tooltipRect = tooltipEl.getBoundingClientRect();
		const vw = window.innerWidth;
		const vh = window.innerHeight;

		// Default to top
		let x = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2;
		let y = triggerRect.top - tooltipRect.height - 8;
		side = 'top';

		// Decide best position based on available space + OFFSET
		const canTop = triggerRect.top > tooltipRect.height + OFFSET;
		const canBottom = triggerRect.bottom < vh - OFFSET - tooltipRect.height;
		const canLeft = triggerRect.left > tooltipRect.width + OFFSET;
		const canRight = triggerRect.right < vw - OFFSET - tooltipRect.width;

		// Prefer top > bottom > right > left
		if (!canTop && canBottom) {
			x = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2;
			y = triggerRect.bottom + 8;
			side = 'bottom';
		} else if (!canTop && !canBottom && canRight) {
			x = triggerRect.right + 8;
			y = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2;
			side = 'right';
		} else if (!canTop && !canBottom && !canRight && canLeft) {
			x = triggerRect.left - tooltipRect.width - 8;
			y = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2;
			side = 'left';
		}
		// If none fit, fall back to top (clipped is better than hidden)

		// Constrain to viewport
		x = Math.max(4, Math.min(x, vw - tooltipRect.width - 4));
		y = Math.max(4, Math.min(y, vh - tooltipRect.height - 4));

		position = { x, y };
	};

	const hide = () => (isVisible = false);
	const show = () => {
		isVisible = true;
		setTimeout(updatePosition, 0); // defer to allow tooltip render
	};
	$effect(() => {
		if (!window?.innerWidth) return;
		updatePosition();
	});
</script>

<div
	tabindex="-1"
	role="dialog"
	class={className}
	onmouseenter={show}
	onmouseleave={hide}
	bind:this={triggerEl}
>
	{@render children?.()}

	<Portal target="body">
		{#if isVisible}
			<div
				bind:this={tooltipEl}
				class="pointer-events-none fixed z-50 origin-center"
				style="left: {position.x}px; top: {position.y}px;"
				transition:fly={{
					x: side === 'left' ? -4 : side === 'right' ? 4 : 0,
					y: side === 'top' ? -4 : side === 'bottom' ? 4 : 0,
					duration: 150
				}}
			>
				<div class="relative max-w-xs rounded {bgColor} px-2 py-1 text-xs text-white shadow-md">
					{@render popup?.()}

					<!-- Tail: dynamically positioned -->
					{#if side === 'top'}
						<div
							class="absolute top-full left-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rotate-45 {bgColor}"
						></div>
					{:else if side === 'bottom'}
						<div
							class="absolute bottom-full left-1/2 h-2 w-2 -translate-x-1/2 translate-y-1/2 rotate-45 {bgColor}"
						></div>
					{:else if side === 'left'}
						<div
							class="absolute top-1/2 right-full h-2 w-2 translate-x-1/2 -translate-y-1/2 rotate-45 {bgColor}"
						></div>
					{:else}
						<div
							class="absolute top-1/2 left-full h-2 w-2 -translate-x-1/2 -translate-y-1/2 rotate-45 {bgColor}"
						></div>
					{/if}
				</div>
			</div>
		{/if}
	</Portal>
</div>
