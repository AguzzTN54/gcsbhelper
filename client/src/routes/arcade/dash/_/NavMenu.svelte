<script lang="ts">
	import { getContext, onMount, setContext, tick } from 'svelte';
	import { getLenis } from '$reusable/ScrollArea.svelte';
	import { localAccounts } from '$lib/helpers/localstorage';
	import { profileReady } from '$lib/stores/app.svelte';
	import Skeleton from '$reusable/Skeleton.svelte';
	import Portal from '$reusable/Portal';
	import ModalProfile from '../../_/ModalProfile.svelte';
	import ModalNotify from '../../_/ModalNotify.svelte';
	import { skillbase } from '$lib/data/config';

	const { action = false } = $props();

	let active = $state('stats');
	let showModalProfile = $state(false);
	setContext('modalHandle', () => (showModalProfile = !showModalProfile));
	const loadProfile = getContext('loadDashProfile') as (u: string, r: string) => Promise<void>;

	let showModalNotif = $state(false);
	setContext('modalNotifHandler', (val?: boolean) => {
		showModalNotif = typeof val === 'boolean' ? val : !showModalNotif;
	});

	const links = [
		{ slug: 'stats', icon: 'chart-line', text: 'Statistics' },
		{ slug: 'badges', icon: 'badge-check', text: 'Badge List' },
		{ slug: 'leaderboard', icon: 'web-awesome', text: 'Leaderboard' }
	];

	const actions = [
		{ slug: 'profile', icon: 'arrow-up-right-from-square', text: 'Open Cloudskillboost Profile' },
		{ slug: 'reload', icon: 'rotate-right', text: 'Reload Calculation' },
		{ slug: 'notify', icon: 'bell', text: 'Push Notification' },
		{ slug: 'accounts', icon: 'users', text: 'Accounts' }
	];

	const actionClick = (slug: string) => {
		if (slug === 'accounts') return (showModalProfile = true);
		if (slug === 'profile') {
			const active = localAccounts.getActive();
			if (!active?.uuid) return;
			const url = skillbase + '/public_profiles/' + active.uuid;
			window.open(url, '_blank')?.focus();
			return;
		}

		if (slug === 'notify') {
			showModalNotif = true;
			return;
		}

		if (slug === 'reload') {
			const { uuid, facilitator } = localAccounts.getActive() || {};
			loadProfile?.(uuid || '', facilitator || 'unset');
			return;
		}
	};

	const buttonClick = (slug: string) => {
		if (action) return actionClick(slug);

		// ToC panel
		const lenis = getLenis('rightpane');
		lenis.scrollTo('#content-' + slug);
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

	onMount(() => {
		if (action) return;
		const lenis = getLenis('rightpane');
		tick().then(() => {
			updateActive();
			lenis?.on('scroll', updateActive);
		});
		return () => lenis?.off('scroll', updateActive);
	});
</script>

<Portal target="#main">
	{#if action && showModalProfile}
		<ModalProfile />
	{/if}
</Portal>

<Portal target="#main">
	{#if action && showModalNotif}
		<ModalNotify />
	{/if}
</Portal>

<div class="flex gap-3" class:!gap-2={action} class:flex-col={!action}>
	{#if !$profileReady && action}
		{#each Array(4) as _}
			<Skeleton class="size-8 rounded-full" />
		{/each}
	{:else}
		{#each action ? actions : links as { icon, slug, text }}
			<button
				id={action ? 'action-' + slug : slug}
				onclick={() => buttonClick(slug)}
				class:active={active === slug}
				aria-label={text}
				title={text}
				class:!size-8={action}
				class:!border-[.125rem]={action}
				class:!border-[3px]={!action}
				class="brutal-border relative flex size-11 items-center justify-center rounded-full bg-gray-100 hover:bg-indigo-200 active:bg-indigo-300"
			>
				<i class="fasdl fa-{icon} text-xl text-amber-400" class:!text-sm={action}></i>
				{#if active !== slug && !action}
					<span
						class="brutal-border pointer-events-none absolute top-1/2 left-[calc(100%+.5rem)] flex h-10/12 -translate-y-1/2 items-center justify-center rounded-full !border-[3px] bg-gray-100 px-5 text-sm whitespace-nowrap opacity-0 transition-opacity"
					>
						{text}
					</span>
				{/if}
			</button>
		{/each}
	{/if}
</div>

<style lang="postcss">
	@import 'tailwindcss/theme' theme(reference);

	button.active {
		@apply pointer-events-none bg-amber-200 opacity-100;
		i {
			@apply !text-indigo-200;
		}
	}

	button:hover span {
		@apply opacity-100;
	}
</style>
