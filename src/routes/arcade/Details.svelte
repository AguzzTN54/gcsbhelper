<script>
	import { arcadeBadges as badges } from '$lib/stores/app-store';
	import Tablepoint from './_tablepoint.svelte';
	import ProgressBadges from './_progress-badges.svelte';
	const { games, skillbadges, bonus } = $badges;
</script>

<Tablepoint />

<section>
	<h2 class="press"># Progress Details</h2>

	<h3>Games</h3>
	<ProgressBadges badgeType="games" data={games} />

	<h3 style="margin-top: 2rem">Skill Badges</h3>
	<ProgressBadges badgeType="skillbadges" data={skillbadges} />

	<h3 style="margin-top: 2rem">Additional Bonus</h3>
	<ProgressBadges badgeType="bonus" data={bonus} />
</section>

<style>
	section {
		margin: 0 5%;
		padding-bottom: calc(0.05 * var(--screen-height));
	}

	h2 {
		font-size: initial;
		text-transform: uppercase;
		font-weight: 800;
		padding: 0 0 calc(0.025 * var(--screen-height)) 0;
	}

	h3 {
		text-transform: uppercase;
		margin-bottom: 1rem;
	}

	/* Accordion */
</style>
