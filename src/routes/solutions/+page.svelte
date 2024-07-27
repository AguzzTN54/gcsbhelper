<script>
	import { page } from '$app/stores';
	import Aside from './Aside.svelte';
	import Article from './Article.svelte';
	import { onMount } from 'svelte';

	let labID = '';
	onMount(() => {
		page.subscribe(({ url }) => {
			const params = url.searchParams;
			const id = params.get('lab');
			if (!id) return (labID = '');
			if (!/(arc|gsp)/.test(id)) return (labID = '');
			labID = id;
		});
	});
</script>

<svelte:head>
	<title>Google Cloud Skill Boost Quick Solution</title>
</svelte:head>

<section>
	<div class="aside">
		<Aside />
	</div>
	<div class="main">
		{#if !labID}
			<h1>Google Cloud Skill Boost Quick Solution</h1>
		{/if}

		<div class="solution">
			{#if !labID}
				<div class="list">List Of Lab</div>
			{:else}
				<Article {labID} />
			{/if}
		</div>
	</div>
</section>

<style>
	section {
		display: flex;
	}

	.aside {
		width: calc(var(--screen-width) * 0.25);
		height: var(--screen-height);
		position: sticky;
		left: 0;
		top: 0;
	}

	.main {
		width: calc(var(--screen-width) * 0.75);
		padding: 2.5% 5%;
	}

	.solution {
		position: relative;
		padding: 1rem;
	}

	@media screen and (max-width: 800px) {
		.aside {
			width: calc(var(--screen-width) * 0.4);
		}
		.main {
			width: calc(var(--screen-width) * 0.6);
		}
	}

	@media screen and (max-width: 640px) {
		.aside {
			display: none;
		}
		.main {
			width: 100%;
		}
	}
</style>
