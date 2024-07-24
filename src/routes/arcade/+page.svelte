<script>
	import { arcadeDate, timeZone } from '$lib/helpers/dateTime';
	import { profile } from '$lib/stores/app-store';
	import Summary from './Summary.svelte';
	import UrlForm from './_URLForm.svelte';
	import Details from './Details.svelte';

	$: ({ user, points } = $profile);
	const { end, start } = arcadeDate;
	const startDate = start.format('DD MMMM YYYY, HH:mm');
	const endDate = end.format('DD MMMM YYYY, HH:mm');
</script>

<section class="hero">
	<div class="top">
		<h1>Arcade Point Counter</h1>
		<span> {startDate} - {endDate} ({timeZone})</span>
	</div>

	<div class="info-container">
		{#if !!user}
			<Summary {user} {points} />
		{:else}
			<UrlForm />
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
