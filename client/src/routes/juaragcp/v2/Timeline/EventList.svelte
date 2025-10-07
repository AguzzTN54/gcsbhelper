<script>
	import ScrollArea from '$reusable/ScrollArea.svelte';
</script>

<ScrollArea>
	<h3 class="pb-4 font-semibold uppercase">Sedang Berlangsung</h3>
	<div class="mb-2 w-full rounded-xl bg-amber-100 px-5 py-2 text-[var(--color-secondary)]">
		<h4 class="text-lg leading-[120%] font-bold">JUARAGCP Learning Periode</h4>
		<div class="mt-1 flex items-center text-xs font-semibold">
			<span class="w-3/12 max-w-10">Start:</span>
			<span class="w-9/12">29 Oktober 2025, 10:00 WIB</span>
		</div>
		<div class="flex items-center text-xs font-semibold">
			<span class="w-3/12 max-w-10">End:</span>
			<span class="w-9/12">29 November 2025, 23:59 WIB</span>
		</div>
		<p class="mt-2 mb-2 text-sm leading-[120%]">
			Kumpulkan badge dan submit completion form setelah mencapai tier
		</p>
	</div>

	<div class="mt-2 flex items-center justify-between py-4">
		<button class="font-semibold uppercase">Upcoming</button>
		<button class="text-sm opacity-50 hover:opacity-100">Previous Event</button>
	</div>

	{#each Array(3) as _}
		<div
			class="mb-3 flex w-full items-center rounded-xl bg-amber-300 py-2 pr-5 pl-3 text-[var(--color-secondary)]"
		>
			<div class="flex flex-col items-center whitespace-nowrap">
				<span class="text-3xl font-bold">20</span>
				<span class="text-xs">Jan 2024</span>
			</div>
			<div class="pl-4">
				<h4 class="text-lg leading-[120%] font-bold">Kick Start Session</h4>
				<p>hubla</p>
			</div>
		</div>
	{/each}
</ScrollArea>
