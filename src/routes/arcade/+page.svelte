<script>
	import { arcadeDate, timeZone } from '$lib/helpers/dateTime';
	import { pointList, profile } from '$lib/stores/app-store';
	import Summary from './Summary.svelte';
	import Details from './Details.svelte';
	import Forms from './Forms.svelte';

	$: ({ name: user } = $profile);
	const { end, start } = arcadeDate;
	const startDate = start.format('DD MMMM YYYY, HH:mm');
	const endDate = end.format('DD MMMM YYYY, HH:mm');
</script>

<section class="hero">
	<div class="top">
		<h1>Arcade Progress Tracker</h1>
		<span> {startDate} - {endDate} ({timeZone})</span>
	</div>

	<div class="info-container">
		{#if !!user}
			<Summary {user} points={$pointList} />
		{:else}
			<Forms />
		{/if}
	</div>
</section>

{#if user}
	<Details />
{/if}

<style>
	.hero {
		width: var(--screen-width);
		min-height: var(--screen-height);
		text-align: center;
		padding: 2% 5%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	h1 {
		text-transform: uppercase;
		font-size: xx-large;
	}

	.top {
		margin-top: 5%;
		margin-bottom: auto;
	}

	.info-container {
		width: 100%;
		height: calc(0.7 * var(--screen-height));
		margin-bottom: auto;
		display: flex;
		justify-content: center;
		align-items: center;
		position: relative;
	}
</style>
