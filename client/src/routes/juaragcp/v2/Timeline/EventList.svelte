<script lang="ts">
	import { timeZone } from '$lib/helpers/dateTime';
	import { events } from '$lib/helpers/timeline.juaragcp';
	import ScrollArea from '$reusable/ScrollArea.svelte';
	import dayjs from 'dayjs';
	import { fade } from 'svelte/transition';

	const eventList = events.map(({ enddate, startdate, ...rest }) => ({
		...rest,
		startdate: dayjs(startdate),
		enddate: dayjs(enddate)
	}));
	const upcoming = eventList.filter((e) => dayjs(e.startdate).isAfter(new Date()));
	const previous = eventList.filter((e) => dayjs(e.enddate).isBefore(new Date()));
	const current = eventList.filter(({ startdate, enddate }) => {
		const start = dayjs(startdate);
		const end = dayjs(enddate);
		return !start.isAfter(new Date()) && !end.isBefore(new Date());
	});

	let activeTab = $state(upcoming.length > 0 ? 'upcoming' : 'previous');
	const tabData = $derived(activeTab === 'upcoming' ? upcoming : previous);
</script>

<div class="size-full">
	{#if current.length > 0}
		<h3 class="pb-4 font-semibold uppercase">Sedang Berlangsung</h3>
		{#each current as { description, enddate, startdate, title }}
			<div class="mb-2 w-full rounded-xl bg-amber-100 px-5 py-2 text-[var(--color-secondary)]">
				<h4 class="text-lg leading-[120%] font-bold">{title}</h4>
				<div class="mt-1 flex items-center text-xs font-semibold">
					<span class="w-3/12 max-w-10">Start:</span>
					<span class="w-9/12">{startdate.format('D MMMM YYYY, HH:mm')} {timeZone}</span>
				</div>
				<div class="flex items-center text-xs font-semibold">
					<span class="w-3/12 max-w-10">End:</span>
					<span class="w-9/12">{enddate.format('D MMMM YYYY, HH:mm')} {timeZone}</span>
				</div>
				<p class="mt-2 mb-2 text-sm leading-[120%]">
					{description}
				</p>
			</div>
		{/each}
		<div class="mb-8"></div>
	{/if}

	<div class="flex items-center justify-between pb-4">
		<button
			class={activeTab === 'upcoming' ? 'activeTab' : 'inactiveTab'}
			onclick={() => (activeTab = 'upcoming')}
		>
			Upcoming
		</button>
		<button
			class={activeTab === 'previous' ? 'previousTab' : 'inactiveTab'}
			onclick={() => (activeTab = 'previous')}
		>
			Previous Event
		</button>
	</div>

	<div class="h-[280px] overflow-auto">
		<ScrollArea>
			{#if tabData.length > 0}
				{#each tabData as { description, startdate, title }, i (title)}
					<div
						in:fade|global={{ delay: Math.sqrt(i) * 50 }}
						class="mb-3 flex w-full items-center rounded-xl bg-amber-300 py-2 pr-5 pl-3 text-[var(--color-secondary)]"
					>
						<div class="flex flex-col items-center whitespace-nowrap">
							<span class="text-3xl font-bold">{startdate.format('D')}</span>
							<span class="text-xs">{startdate.format('MMM YYYY')}</span>
						</div>
						<div class="pl-4">
							<h4 class="text-lg leading-[120%] font-bold">{title}</h4>
							<p class="mt-1 mb-2 text-sm leading-[120%]">{description}</p>
						</div>
					</div>
				{/each}
			{:else}
				<div class="flex w-full items-center justify-center py-10 text-sm font-semibold">
					Tidak ada event!
				</div>
			{/if}
		</ScrollArea>
	</div>
</div>

<style lang="postcss">
	@import 'tailwindcss/theme' theme(reference);

	button {
		&.activeTab {
			@pply font-semibold uppercase;
		}
		&.inactiveTab {
			@apply text-sm opacity-50 hover:opacity-100;
		}
	}
</style>
