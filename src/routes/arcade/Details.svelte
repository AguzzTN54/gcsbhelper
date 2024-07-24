<script>
	import { detailPoints } from '$lib/helpers/arcade/calculator';
	import { profile } from '$lib/stores/app-store';
	import Tablepoint from './_tablepoint.svelte';

	const { user, badges } = $profile;
	const { games, skillbadges } = detailPoints(badges);

	const points = {};
	const getPoint = (arr) => arr.map(({ point }) => point).reduce((pv = 0, cur) => pv + cur);
	Object.keys(games).forEach((key) => (points[key] = getPoint(games[key])));
	Object.keys(skillbadges).forEach((key) => (points[key] = getPoint(skillbadges[key])));
</script>

{#if user}
	<Tablepoint {points} />
{/if}
