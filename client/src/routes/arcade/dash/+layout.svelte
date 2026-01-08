<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { getContext, onMount, setContext } from 'svelte';
	import { MetaTags } from 'svelte-meta-tags';
	import {
		arcadeFacil,
		incompleteCalculation,
		initData,
		loadSteps,
		profileReady
	} from '$lib/stores/app.svelte';
	import { loadProfileAndBadges } from '$lib/helpers/loader.arcade';
	import { localAccounts } from '$lib/helpers/localstorage';
	import bg from '$img/paper.webp';
	import ScrollArea from '$reusable/ScrollArea.svelte';
	import Modal from '$reusable/Modal.svelte';
	import Skeleton from '$reusable/Skeleton.svelte';
	import ProfilePic from '../_/ProfilePic.svelte';
	import NavMenu from './_/NavMenu.svelte';
	import { arcadeSeason } from '$lib/data/config';

	const { children, data } = $props();
	let tmp = $state<{ uuid: string }>();
	const { avatar, name, uuid, program } = $derived.by(() => {
		if (tmp && $profileReady) return localAccounts.getActive() || data || {};
		return data;
	});
	const title = $derived(`${name ? name + ' - ' : ''} ${page.data?.pageMetaTags?.title}`);

	let scrolled = $state(false);
	setContext('scrolled', (val: boolean) => (scrolled = val));

	let isFetchError = $state(false);
	const loadDashProfile = async (profileUUID: string) => {
		try {
			isFetchError = false;
			incompleteCalculation.set(false);
			profileReady.set(false);
			tmp = { uuid: profileUUID };
			const res = await loadProfileAndBadges({
				profileUUID,
				program: program || arcadeSeason.seasonid
			});
			const facilitator = res.metadata?.facilitator?.identifier || 'unset';
			arcadeFacil.set(facilitator);
			localAccounts.put({ ...res?.user, program: program || arcadeSeason.seasonid, facilitator });
			profileReady.set(true);
		} catch (e) {
			console.error(e);
			isFetchError = true;
		}
	};
	setContext('loadDashProfile', loadDashProfile);

	const loaded = getContext('loaded') as () => void;
	onMount(() => loaded?.());
	onMount(async () => {
		if (!uuid) return goto('/arcade');
		if ($initData && $initData.length > 0) {
			tmp = { uuid };
			profileReady.set(true);
			return;
		}
		await loadDashProfile(uuid);
	});
</script>

<MetaTags {title} />

{#if $incompleteCalculation}
	<Modal hideclosebutton persist>
		<h2 class="text-center text-xl font-semibold">Something went wrong!</h2>
		<article class="mt-4 text-center">
			We couldn't load the calculation formula, so your progress isn't available right now. It looks
			like there is an issue on the server, please contact the <b>Author</b> as soon as possible.
		</article>
		<div class="mt-5 mb-2 flex w-full justify-center gap-3">
			<button
				onclick={() => incompleteCalculation.set(false)}
				class="brutal-border bg-amber-200 px-2 py-1 hover:bg-amber-300 active:bg-amber-400"
			>
				<i class="fasdl fa-face-smile-upside-down text-amber-400"></i> Just Show My Badges
			</button>
			<button
				onclick={() => loadDashProfile(tmp?.uuid || '')}
				class="brutal-border bg-sky-200 px-2 py-1 hover:bg-sky-300 active:bg-sky-400"
			>
				<i class="fasdl fa-arrow-rotate-right text-sky-400"></i> Try Again
			</button>
		</div>
	</Modal>
{/if}

{#if isFetchError}
	<Modal hideclosebutton persist>
		<h2 class="text-center text-xl font-semibold">ERROR!</h2>
		<article class="mt-4 text-center">We couldn't load your Cloud Skills Boost profile!</article>
		<div class="mt-5 mb-2 flex w-full justify-center gap-3">
			<a
				href="/arcade?new"
				class="brutal-border bg-amber-200 px-2 py-1 hover:bg-amber-300 active:bg-amber-400"
			>
				<i class="fasdl fa-house text-amber-400"></i> Take Me Home
			</a>
			<button
				onclick={() => loadDashProfile(tmp?.uuid || '')}
				class="brutal-border bg-sky-200 px-2 py-1 hover:bg-sky-300 active:bg-sky-400"
			>
				<i class="fasdl fa-arrow-rotate-right text-sky-400"></i> Try Again
			</button>
		</div>
	</Modal>
{/if}

<section
	class="bg relative flex size-full flex-col justify-end overflow-hidden p-2 pt-2 !pb-0 sm:p-4"
>
	<div
		style="--bg:url({bg})"
		class="brutal-border fixed bottom-0 left-1/2 z-1 h-[calc(100%-2rem)] w-[calc(100%-1rem)] -translate-x-1/2 translate-y-[1rem] -skew-1 overflow-hidden rounded-tl-3xl bg-indigo-300 after:absolute after:top-0 after:left-0 after:-z-10 after:size-full after:skew-1 after:bg-gray-100 sm:h-full sm:w-[calc(100%-2rem)]"
	></div>

	<div
		class="relative z-10 skew-1 overflow-hidden rounded-tr-3xl rounded-bl-3xl sm:hidden"
		class:active={scrolled}
		class:brutal-border={scrolled}
	>
		<div class="flex -skew-1 justify-center">
			<div class="flex" class:scale-90={scrolled} class:-translate-y-[8%]={scrolled}>
				<ProfilePic src={avatar} />
			</div>

			{#if scrolled}
				<div class="ml-4 flex w-full flex-col">
					{#if $profileReady || loadSteps.profile}
						<h1 class="text-overflow mb-1 text-lg font-semibold">{name}</h1>
					{:else}
						<Skeleton class="mb-2 h-7 w-30 max-w-full" />
					{/if}
					<NavMenu action />
				</div>
			{/if}
		</div>
	</div>

	<div class="relative z-2 h-[calc(100%-5rem)] w-full rounded-t-3xl p-2 pt-2 sm:h-full sm:pt-5">
		<ScrollArea id="dash">
			{@render children()}
		</ScrollArea>
	</div>
</section>

<style lang="postcss">
	@import 'tailwindcss/theme' theme(reference);

	.active {
		@apply mx-auto w-10/12 bg-gray-100;
	}
</style>
