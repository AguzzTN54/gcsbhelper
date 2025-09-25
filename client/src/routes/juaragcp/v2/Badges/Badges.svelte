<script>
	import ListColumnItem from './_list-column-item.svelte';
	// import ListRowItem from './_list-row-item.svelte';
</script>

<section class="-mt-1">
	<div
		class="sticky top-0 left-0 z-10 flex justify-center border-b-12 border-[var(--color-primary)] bg-[var(--color-secondary)] pt-1"
	>
		<button
			class="duo w-full rounded-tr-3xl border-r-4 border-b-4 border-transparent bg-[var(--color-primary)] pt-3.5 pb-2.5 text-sm font-semibold uppercase sm:w-fit sm:rounded-tl-3xl sm:px-10 sm:text-base"
		>
			Skill Badges <i class="fasds fa-puzzle"></i>
		</button>
		<button
			class="duo w-full rounded-tl-3xl border-b-4 border-l-4 border-[var(--color-secondary)] bg-[var(--color-secondary)] py-3 text-sm font-semibold text-[var(--color-primary)] uppercase transition-colors duration-300 hover:bg-[var(--color-primary)] hover:text-[var(--color-secondary)] sm:w-fit sm:rounded-tr-3xl sm:px-10 sm:text-base"
		>
			Regular Badges <i class="fasds fa-book-open-cover"></i>
		</button>
	</div>
	<div class="px-2 py-2 md:px-20 md:py-10">
		<!-- <div class="w-full">
			{#each Array(10) as _, i (i)}
				<ListRowItem {i} />
        {/each}
      </div> -->

		<div class="grid w-full grid-cols-4 gap-10">
			{#each Array(10) as _, i (i)}
				<ListColumnItem />
			{/each}
		</div>
	</div>
</section>
