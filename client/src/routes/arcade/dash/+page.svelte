<script lang="ts">
	import ScrollArea from '../../_global/reusable/ScrollArea.svelte';
	import ProfilePic from '../_/ProfilePic.svelte';
	import Countdown from '../../_global/reusable/Countdown.svelte';
	import NavMenu from './_/NavMenu.svelte';
	import PointCard from './_/PointCard.svelte';
	import Stats from './_/stats/Stats.svelte';
	import Reward from './_/reward/Reward.svelte';
	import Badges from './_/badges/Badges.svelte';
	import Timeline from './_/Timeline.svelte';
</script>

<div class="size-full flex flex-col sm:flex-row pr-2 sm:pr-0">
	<!-- left -->
	<div
		class="lg:w-140 sm:w-1/2 w-full max-w-full sm:border-r-4 border-[color:var(--stroke)] flex flex-col py-2 sm:pr-6 sm:pl-2 relative"
	>
		<div class="sm:px-5 px-2">
			<div class="flex sm:pt-2 pb-5 sm:pl-2 text-center sm:text-left">
				<div class="w-20 brutal-drop scale-90 sm:block hidden">
					<ProfilePic />
				</div>
				<div class="ml-auto w-full pl-5 flex flex-col justify-center items-center sm:items-start">
					<a href="/arcade" class="relative w-fit">
						<h1 class="font-semibold text-2xl mb-1 text-overflow">Agus Sedunia Agus Sedunia</h1>
					</a>
					<NavMenu action />
				</div>
			</div>

			<PointCard />
		</div>

		<div class="px-2 pt-5 py-10 sm:px-5 h-full">
			<div class="flex items-center">
				<span class="inline-block"> Don’t miss out on the games! </span>
				<button aria-label="Turn On Notification" title="Turn On Notification" class="ml-2">
					<i class="fasdl fa-bell text-amber-200"></i>
				</button>
			</div>
			<Timeline />
		</div>

		<div class="mt-auto sm:px-5 px-2 pt-5">
			<div class="brutal-border p-2 w-full rounded-xl bg-amber-200 flex justify-center">
				<div class="flex flex-col items-center relative z-1">
					<span class="brutal-text after:!bg-indigo-100 text-xs sm:text-sm mb-2">
						Arcade Facilitator ends in
					</span>
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
		<ScrollArea class="sm:py-2 sm:px-10 px-2">
			<Stats />
			<Reward />
			<Badges />
		</ScrollArea>
	</div>
</div>
