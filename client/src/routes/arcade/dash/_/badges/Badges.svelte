<script>
	import Checkbox from '../../../../_global/reusable/Checkbox.svelte';
	import BadgeItem from './BadgeItem.svelte';
</script>

<div class="mt-10 lg:mt-15 text-center mb-3">
	<h2 class="font-semibold text-2xl px-2">BADGES</h2>
</div>
<div
	class="w-full bg-gray-100 sticky z-90 top-0 left-0 -translate-y-2 flex justify-between lg:flex-row flex-col-reverse px-2 py-2 items-start gap-3"
>
	<div class="w-full mt-2 h-18 flex lg:mt-0 relative">
		<div class="whitespace-nowrap overflow-auto w-full lg:pr-2 absolute top-0 left-0">
			{#each ['All', 'Arcade Games', 'Skill Badge', 'Fast Track', 'Lab-Free'] as c, i}
				<button
					class:active={i === 2}
					class:bg-amber-200={i === 2}
					class:pointer-events-none={i === 2}
					class="brutal-border py-2 px-3 rounded-full mr-2 text-xs leading-0 !border-[3px] hover:bg-indigo-200 active:bg-indigo-300 group"
				>
					<span>{c}</span>
					<span
						class="inline-block rounded-full bg-indigo-100 py-2 px-0.5 group-[.active]:bg-amber-300"
					>
						9
					</span>
				</button>
			{/each}
		</div>
		<div
			class="mt-auto w-full scale-90 origin-bottom-left flex justify-center lg:justify-start leading-[100%]"
		>
			<Checkbox>Show Completed Badges</Checkbox>
		</div>
	</div>

	<div class="h-14 w-100 max-w-full brutal-border rounded-full overflow-hidden relative">
		<input class="size-full pr-5 pl-10 outline-0 rounded-full" placeholder="Search Badge" />
		<span
			class="absolute top-0 left-0 z-1 text-indigo-100 text-lg h-full flex justify-center items-center aspect-square opacity-50"
		>
			<i class="fasds fa-magnifying-glass"></i>
		</span>
	</div>
</div>

<div class="min-h-[calc(var(--screen-height)-11rem)] w-full px-5 sm:px-2">
	<div
		class="w-full grid grid-cols-1 lg:grid-cols-3 2xl:grid-cols-4 gap-8 md:gap-10 xl:gap-12 pb-10"
	>
		{#each Array(12) as _, i}
			<BadgeItem />
		{/each}
	</div>
</div>
