<script lang="ts">
	import { getContext } from 'svelte';
	import { activeProfile, loadSteps, profileReady } from '$lib/stores/app.svelte';
	import Skeleton from '$reusable/Skeleton.svelte';
	import ScrollArea from '$reusable/ScrollArea.svelte';
	import Countdown from '../_/Countdown.svelte';
	import ProfilePic from '../_/ProfilePic.svelte';
	import NavMenu from './_/NavMenu.svelte';
	import PointCard from './_/PointCard.svelte';
	import Stats from './_/stats/Stats.svelte';
	import Reward from './_/reward/Reward.svelte';
	import Badges from './_/badges/Badges.svelte';
	import Timeline from './_/Timeline.svelte';

	const { data } = $props();
	const { avatar, name } = $derived.by(() => {
		if ($profileReady || loadSteps.profile) return $activeProfile || {};
		return data || {};
	});
	const scrolled = getContext('scrolled') as (val: boolean) => void;

	let firstRender = true;
	const observeOutOfView = (node: HTMLElement) => {
		const observer = new IntersectionObserver(
			(entries) => {
				if (firstRender) return (firstRender = false);
				const entry = entries[0];
				scrolled(entry.intersectionRatio === 0);
			},
			{ threshold: [0, 1] }
		);
		observer.observe(node);
		return { destroy: () => observer.disconnect() };
	};
</script>

<div class="flex size-full flex-col pr-2 sm:flex-row sm:pr-0">
	<!-- left -->
	<div
		class="relative flex w-full max-w-full flex-col border-[color:var(--stroke)] py-2 sm:w-1/2 sm:border-r-4 sm:pr-6 sm:pl-2 lg:w-120"
	>
		<div class="px-2 sm:px-5">
			<div
				class="flex pb-5 text-center sm:pt-2 sm:pl-2 sm:text-left"
				id="profile-id"
				use:observeOutOfView
			>
				<div class="hidden w-20 scale-105 sm:block">
					<ProfilePic src={avatar} />
				</div>
				<div class="ml-auto flex w-full flex-col items-center justify-center pl-5 sm:items-start">
					<a href="/arcade" class="relative w-fit">
						{#if $profileReady || loadSteps.profile}
							<h1 class="text-overflow mb-1 text-2xl font-semibold">{name}</h1>
						{:else}
							<Skeleton class="mb-2 h-7 w-30 max-w-full" />
						{/if}
					</a>
					<NavMenu action />
				</div>
			</div>

			<PointCard />
		</div>

		<div class="h-full px-2 pt-8 pb-12 sm:px-5 md:pt-5 md:pb-10">
			<div class="text-center sm:text-left">
				<span class="inline-block">
					Don’t miss out on the games!
					<button
						aria-label="Turn On Notification"
						title="Turn On Notification"
						class="ml-2 inline"
					>
						<i class="fasdl fa-bell text-amber-200"></i>
					</button>
				</span>
			</div>
			<Timeline />
		</div>

		<div class="mt-auto px-2 pt-2 sm:px-5">
			<div class="brutal-border flex w-full justify-center rounded-xl bg-amber-200 p-2">
				<div class="relative z-1 flex flex-col items-center">
					<Countdown />
				</div>
			</div>
		</div>

		<!-- Navigation -->
		<div
			class="absolute top-1/2 right-0 z-10 hidden translate-x-[calc(50%+2px)] -translate-y-1/2 sm:block"
		>
			<NavMenu />
		</div>
	</div>

	<!-- Right -->

	<div class="w-full sm:w-1/2 lg:w-3/5 xl:w-full">
		<ScrollArea id="rightpane" class="px-4 sm:px-10 sm:py-2">
			<div id="content-stats"></div>
			<Stats />
			<Reward />
			<div id="content-badges"></div>
			<Badges />
		</ScrollArea>
	</div>
</div>
