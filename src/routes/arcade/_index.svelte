<script>
	import { formatTime, arcadeDate, timeZone } from '$lib/helpers/dateTime';
	import UrlForm from './_URLForm.svelte';

	const { end, start } = arcadeDate;
	const startDate = formatTime(start);
	const endDate = formatTime(end);
</script>

<section class="hero">
	<div class="top">
		<h1>Arcade Point Counter</h1>
		<span> {startDate} - {endDate} ({timeZone})</span>
	</div>

	<div class="profile-container">
		<UrlForm />
	</div>
</section>

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

	.profile-container {
		width: 100%;
		height: calc(0.7 * var(--screen-height));
		margin-bottom: auto;
		display: flex;
		justify-content: center;
		align-items: center;
		position: relative;
	}
</style>
