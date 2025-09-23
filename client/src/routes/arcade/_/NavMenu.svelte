<script lang="ts">
	import { page } from '$app/state';
	import { setContext } from 'svelte';
	import { localAccounts } from '$lib/helpers/localstorage';
	import Portal from '$reusable/Portal';
	import ModalNotify from './ModalNotify.svelte';

	const active = $derived.by(() => {
		const [, r] = (page.route.id || '')?.split('/arcade/');
		return r || '#';
	});
	const links = [
		{ slug: 'notify', icon: 'bell' },
		{ slug: 'leaderboard', icon: 'web-awesome', text: 'Leaderboard' },
		{ slug: 'badges', icon: 'books', text: 'Badge List' },
		{ slug: '', icon: 'id-card', text: 'Tracker' }
	];

	let showModal = $state(false);
	setContext('modalNotifHandler', (val?: boolean) => {
		showModal = typeof val === 'boolean' ? val : !showModal;
	});
</script>

<Portal target="#main">
	{#if showModal}
		<ModalNotify />
	{/if}
</Portal>

<div class="flex bg-indigo-100">
	{#each links as { slug, icon, text } (slug)}
		{#if slug === 'notify'}
			<button
				onclick={() => (showModal = true)}
				class="group px-3 py-2 whitespace-nowrap opacity-65 hover:bg-indigo-200 hover:opacity-100"
			>
				<i class="fasdl fa-{icon} text-amber-400"></i>
				<span class="hidden group-[.active]:inline-block lg:inline-block"> {text} </span>
			</button>
		{:else}
			<a
				class:active={(slug || '#') === active}
				class="group px-3 py-2 whitespace-nowrap opacity-65 hover:bg-indigo-200 hover:opacity-100"
				href="/arcade/{localAccounts.getActive()?.uuid && !slug ? 'dash' : slug}"
			>
				<i class="fasdl fa-{icon} text-amber-400"></i>
				<span class="hidden group-[.active]:inline-block lg:inline-block"> {text} </span>
			</a>
		{/if}
	{/each}
</div>

<style lang="postcss">
	@import 'tailwindcss/theme' theme(reference);

	a.active {
		@apply pointer-events-none bg-gray-100 opacity-100;
	}
</style>
