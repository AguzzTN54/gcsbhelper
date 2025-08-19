<script lang="ts">
	import { getElement, getTargetPosition, smoothScroll } from '$reusable/ScrollArea.svelte';
	import { onDestroy, onMount, tick } from 'svelte';

	const { action = false } = $props();

	let active = $state('stats');

	const links = [
		{ slug: 'stats', icon: 'chart-line', text: 'Statistics' },
		{ slug: 'badges', icon: 'badge-check', text: 'Badge List' },
		{ slug: 'leaderboard', icon: 'web-awesome', text: 'Leaderboard' }
	];

	const actions = [
		{ slug: 'profile', icon: 'arrow-up-right-from-square', text: 'Open Cloudskillboost Profile' },
		{ slug: 'refresh', icon: 'rotate-right', text: 'Reload Calculation' },
		{ slug: 'notify', icon: 'bell', text: 'Push Notification' },
		{ slug: 'accounts', icon: 'users', text: 'Accounts' }
	];

	const buttonClick = (slug: string) => {
		if (action) return;

		// ToC panel
		const targetPosition = getTargetPosition('rightpane', '#content-' + slug);
		smoothScroll({ id: 'rightpane', targetPosition });
	};

	const updateActive = () => {
		let current: string | null = null;
		let minDist = Infinity;

		links.forEach((h) => {
			const el = document.getElementById('content-' + h.slug);
			if (el) {
				const rect = el.getBoundingClientRect();
				const dist = Math.abs(rect.top);
				if (rect.top <= 100 && dist < minDist) {
					minDist = dist;
					current = h.slug;
				}
			}
		});

		active = current || 'stats';
	};

	onMount(async () => {
		if (action) return;
		await tick();
		updateActive();
		getElement('rightpane').addEventListener('scroll', updateActive);
	});
	onDestroy(() => {
		if (action) return;
		getElement('rightpane')?.removeEventListener('scroll', updateActive);
	});
</script>

<div class="flex gap-3" class:!gap-2={action} class:flex-col={!action}>
	{#each action ? actions : links as { icon, slug, text }}
		<button
			onclick={() => buttonClick(slug)}
			class:active={active === slug}
			aria-label={text}
			title={text}
			class:!size-8={action}
			class:!border-[.125rem]={action}
			class:!border-[3px]={!action}
			class="size-11 rounded-full brutal-border bg-gray-100 flex items-center justify-center hover:bg-indigo-200 active:bg-indigo-300 relative"
		>
			<i class="fasdl fa-{icon} text-amber-400 text-xl" class:!text-sm={action}></i>
			{#if active !== slug && !action}
				<span
					class="absolute whitespace-nowrap !border-[3px] bg-gray-100 brutal-border h-10/12 flex items-center justify-center rounded-full px-5 text-sm top-1/2 left-[calc(100%+.5rem)] -translate-y-1/2 opacity-0 transition-opacity pointer-events-none"
				>
					{text}
				</span>
			{/if}
		</button>
	{/each}
</div>

<style lang="postcss">
	@import 'tailwindcss/theme' theme(reference);

	button.active {
		@apply bg-amber-200 opacity-100 pointer-events-none;
		i {
			@apply !text-indigo-200;
		}
	}

	button:hover span {
		@apply opacity-100;
	}
</style>
