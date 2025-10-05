<script lang="ts">
	import { juaraBadges } from '$lib/stores/app.svelte';
	import { fade } from 'svelte/transition';
	import ListColumnItem from './_list-column-item.svelte';
	// import ListRowItem from './_list-row-item.svelte';

	let activeType = $state<App.JuaraBadge['type']>('skill');
	const dataToShow = $derived.by(() => $juaraBadges.filter((j) => j.type === activeType));
	const selectType = (type: App.JuaraBadge['type']) => {
		if (activeType === type) return;
		activeType = type;
	};
</script>

<section class="relative z-10 -mt-1 bg-[var(--color-primary)]">
	<div
		class="sticky top-0 left-0 z-10 flex justify-center border-b-12 border-[var(--color-primary)] bg-[var(--color-secondary)] pt-1"
	>
		<button
			onclick={() => selectType('skill')}
			class:active={activeType === 'skill'}
			class="duo w-full rounded-tr-3xl border-b-4 border-[var(--color-secondary)] bg-[var(--color-secondary)] py-3 text-sm font-semibold text-[var(--color-primary)] uppercase transition-colors duration-300 sm:w-fit sm:rounded-tl-3xl sm:px-10 sm:text-base"
		>
			Skill Badges <i class="fasds fa-flask"></i>
		</button>
		<button
			onclick={() => selectType('completion')}
			class:active={activeType === 'completion'}
			class="duo ml-1 w-full rounded-tl-3xl border-b-4 border-[var(--color-secondary)] bg-[var(--color-secondary)] py-3 text-sm font-semibold text-[var(--color-primary)] uppercase transition-colors duration-300 sm:w-fit sm:rounded-tr-3xl sm:px-10 sm:text-base"
		>
			Regular Badges <i class="fasds fa-puzzle"></i>
		</button>
	</div>
	<div class="px-10 py-5 sm:px-8 md:px-12 md:py-10 lg:px-15 xl:px-20">
		<!-- <div class="w-full">
			{#each Array(10) as _, i (i)}
				<ListRowItem {i} />
        {/each}
      </div> -->

		<div class="grid w-full gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 lg:gap-7 xl:gap-10">
			{#each dataToShow as data, i (data)}
				<div class="size-full" in:fade={{ delay: i * 25 + 150 }}>
					<ListColumnItem {data} />
				</div>
			{/each}
		</div>
	</div>
</section>

<style lang="postcss">
	@import 'tailwindcss/theme' theme(reference);
	button {
		&.active,
		&:hover {
			@apply bg-[var(--color-primary)] text-[var(--color-secondary)];
		}
		&.active {
			@apply border-transparent;
		}
	}
</style>
