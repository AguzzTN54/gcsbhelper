<script lang="ts">
	import { getContext } from 'svelte';
	import { activeProfile, profileReady } from '$lib/stores/app-store';
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
		if ($profileReady) return $activeProfile || {};
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

<svelte:head>
	<title>{name} - Arcade Tracker</title>
</svelte:head>

<div class="size-full flex flex-col sm:flex-row pr-2 sm:pr-0">
	<!-- left -->
	<div
		class="lg:w-140 sm:w-1/2 w-full max-w-full sm:border-r-4 border-[color:var(--stroke)] flex flex-col py-2 sm:pr-6 sm:pl-2 relative"
	>
		<div class="sm:px-5 px-2">
			<div
				class="flex sm:pt-2 pb-5 sm:pl-2 text-center sm:text-left"
				id="profile-id"
				use:observeOutOfView
			>
				<div class="w-20 scale-105 sm:block hidden">
					<ProfilePic src={avatar} />
				</div>
				<div class="ml-auto w-full pl-5 flex flex-col justify-center items-center sm:items-start">
					<a href="/arcade" class="relative w-fit">
						{#if $profileReady}
							<h1 class="font-semibold text-2xl mb-1 text-overflow">{name}</h1>
						{:else}
							<Skeleton class="w-30 max-w-full h-7 mb-2" />
						{/if}
					</a>
					<NavMenu action />
				</div>
			</div>

			<PointCard />
		</div>

		<div class="px-2 pt-8 pb-12 md:pt-5 md:pb-10 sm:px-5 h-full">
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

		<div class="mt-auto sm:px-5 px-2 pt-5">
			<div class="brutal-border p-2 w-full rounded-xl bg-amber-200 flex justify-center">
				<div class="flex flex-col items-center relative z-1">
					<Countdown />
				</div>
			</div>
		</div>

		<!-- Navigation -->
		<div
			class="absolute z-10 top-1/2 right-0 -translate-y-1/2 translate-x-[calc(50%+2px)] hidden sm:block"
		>
			<NavMenu />
		</div>
	</div>

	<!-- Right -->

	<div class="w-full sm:w-1/2 lg:w-full">
		<ScrollArea id="rightpane" class="sm:py-2 sm:px-10 px-2">
			<div id="content-stats"></div>
			<Stats />
			<Reward />
			<div id="content-badges"></div>
			<Badges />
		</ScrollArea>
	</div>
</div>
