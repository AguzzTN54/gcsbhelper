<script lang="ts">
	import { juaraBadges } from '$lib/stores/app.svelte';
	import ProgressBadges from './_progress-badges.svelte';
</script>

<section>
	<h2># Progress Details</h2>

	{#each $juaraBadges as { list, group }}
		<h3 class={group}>
			<!-- {title} -->
		</h3>
		<ProgressBadges badgeType="skillbadges" data={list} page="juaragcp" />
	{/each}
</section>

<style>
	section {
		margin: 0 5%;
		padding-bottom: calc(0.05 * var(--screen-height));
		border-top: 1px solid #ccc;
	}

	h2 {
		text-transform: uppercase;
		font-weight: 800;
		padding: calc(0.025 * var(--screen-height)) 0 0;
	}

	h3 {
		text-transform: uppercase;
		margin: 2rem 0 1rem;
	}
</style>
