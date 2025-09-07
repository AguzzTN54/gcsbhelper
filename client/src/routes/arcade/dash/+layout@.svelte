<script lang="ts">
	import { onMount, setContext } from 'svelte';
	import { loadProfileAndBadges } from '$lib/helpers/arcade-loader';
	import { arcadeRegion, initData, profileReady } from '$lib/stores/app-store';
	import { localAccounts } from '$lib/helpers/localstorage';
	import bg from '$img/paper.webp';
	import ScrollArea from '$reusable/ScrollArea.svelte';
	import Modal from '$reusable/Modal.svelte';
	import Skeleton from '$reusable/Skeleton.svelte';
	import Toasts from '$reusable/Toast/Toasts.svelte';
	import ProfilePic from '../_/ProfilePic.svelte';
	import NavMenu from './_/NavMenu.svelte';

	const { children, data } = $props();
	let tmp = $state<{ facilitator: App.FacilitatorRegion; uuid: string }>();
	const { avatar, facilitator, name, uuid } = $derived.by(() => {
		if (tmp && $profileReady) return localAccounts.getActive() || {};
		return data || {};
	});

	let scrolled = $state(false);
	setContext('scrolled', (val: boolean) => (scrolled = val));

	let isFetchError = $state(false);
	let isIncompleteData = $state(false);
	const loadDashProfile = async (profileUUID: string, facilitator: App.FacilitatorRegion) => {
		try {
			isFetchError = false;
			isIncompleteData = false;
			profileReady.set(false);
			if (!profileUUID) return;
			tmp = { facilitator, uuid: profileUUID };
			const res = await loadProfileAndBadges({ profileUUID, facilitator, program: 'arcade' });
			const { name, uuid, avatar } = res.user || {};
			localAccounts.put({ name, uuid, avatar, facilitator });
			arcadeRegion.set(facilitator);
			profileReady.set(true);
			isIncompleteData = !!res.containsMissingCourse;
		} catch (e) {
			console.error(e);
			isFetchError = true;
		}
	};
	setContext('loadDashProfile', loadDashProfile);

	onMount(async () => {
		if ($initData && $initData.length > 0) return profileReady.set(true);
		if (!uuid) return;
		await loadDashProfile(uuid, facilitator);
	});
</script>

<Toasts />

{#if isIncompleteData}
	<Modal hideclosebutton persist>
		<h2 class="text-center font-semibold text-xl">Something went wrong!</h2>
		<article class="text-center mt-4">
			We couldn't load the calculation formula, so your progress isn't available right now. It looks
			like there is an issue on the server, so please contact the <b>Author</b> as soon as possible.
		</article>
		<div class="flex w-full justify-center gap-3 mt-5 mb-2">
			<button
				onclick={() => (isIncompleteData = false)}
				class="px-2 py-1 brutal-border bg-amber-200 hover:bg-amber-300 active:bg-amber-400"
			>
				<i class="fasdl fa-face-smile-upside-down text-amber-400"></i> Just Show My Badges
			</button>
			<button
				onclick={() => loadDashProfile(tmp?.uuid || '', tmp?.facilitator || 'unset')}
				class="px-2 py-1 brutal-border bg-sky-200 hover:bg-sky-300 active:bg-sky-400"
			>
				<i class="fasdl fa-arrow-rotate-right text-sky-400"></i> Try Again
			</button>
		</div>
	</Modal>
{/if}

{#if isFetchError}
	<Modal hideclosebutton persist>
		<h2 class="text-center font-semibold text-xl">ERROR!</h2>
		<article class="text-center mt-4">We couldn't load your Cloud Skills Boost profile!</article>
		<div class="flex w-full justify-center gap-3 mt-5 mb-2">
			<a
				href="/arcade?new"
				class="px-2 py-1 brutal-border bg-amber-200 hover:bg-amber-300 active:bg-amber-400"
			>
				<i class="fasdl fa-house text-amber-400"></i> Take Me Home
			</a>
			<button
				onclick={() => loadDashProfile(tmp?.uuid || '', tmp?.facilitator || 'unset')}
				class="px-2 py-1 brutal-border bg-sky-200 hover:bg-sky-300 active:bg-sky-400"
			>
				<i class="fasdl fa-arrow-rotate-right text-sky-400"></i> Try Again
			</button>
		</div>
	</Modal>
{/if}

<section
	class="sm:p-4 p-2 pt-4 !pb-0 size-full relative overflow-hidden bg flex flex-col justify-end"
>
	<div
		style="--bg:url({bg})"
		class="-skew-1 h-[calc(100%-3rem)] sm:h-full w-[calc(100%-1rem)] sm:w-[calc(100%-2rem)] z-1 absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-[1rem] brutal-border rounded-tl-3xl overflow-hidden bg-indigo-300 after:top-0 after:left-0 after:skew-1 after:-z-10 after:absolute after:size-full after:bg-gray-100"
	></div>

	<div
		class="sm:hidden relative z-10 skew-1 rounded-bl-3xl rounded-tr-3xl overflow-hidden"
		class:active={scrolled}
		class:brutal-border={scrolled}
	>
		<div class="-skew-1 flex justify-center pb-3">
			<div class="flex" class:scale-90={scrolled} class:-translate-y-[8%]={scrolled}>
				<ProfilePic src={avatar} />
			</div>

			{#if scrolled}
				<div class="ml-4 w-full flex flex-col">
					{#if $profileReady}
						<h1 class="font-semibold text-lg mb-1 text-overflow">{name}</h1>
					{:else}
						<Skeleton class="w-30 max-w-full h-7 mb-2" />
					{/if}
					<NavMenu action />
				</div>
			{/if}
		</div>
	</div>

	<div class="w-full h-[calc(100%-5rem)] sm:h-full rounded-t-3xl relative z-2 p-2 pt-2 sm:pt-5">
		<ScrollArea id="dash">
			{@render children()}
		</ScrollArea>
	</div>
</section>

<style lang="postcss">
	@import 'tailwindcss/theme' theme(reference);

	.active {
		@apply bg-gray-100 w-10/12 mx-auto;
	}
</style>
