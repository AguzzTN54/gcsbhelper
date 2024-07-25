<script>
	import { badges, pointList } from '$lib/stores/app-store';
	import Tablepoint from './_tablepoint.svelte';

	const { games, skillbadges } = $badges;
	const skillName = {
		beginner: 'Beginner: Get Started with Google Cloud',
		intermediate: 'Intermediate: Dive Deeper into Google Cloud',
		advanced: 'Advanced: Take your Google Cloud Skills to Next Level',
		more: 'More Skill Badges'
	};
	let opened = [];

	const toggleAccordion = (key) => {
		const content = document.querySelector('#' + key);
		if (!opened.includes(key)) {
			opened = [...opened, key];
			content.setAttribute('style', '--height:' + content.scrollHeight + 'px');
			return;
		}
		opened = opened.filter((k) => k !== key);
		content.setAttribute('style', '--height:0px');
		return;
	};

	const completionProgress = (arr = []) => {
		const complete = arr.filter(({ point }) => point > 0).length;
		const all = arr.length;
		return { progress: `${complete}/${all}`, iscomplete: complete >= all };
	};
</script>

<Tablepoint points={$pointList} />

<section>
	<h2># Progress Details</h2>

	<h3>Games</h3>
	<div class="group">
		{#each Object.keys(games) as key}
			{@const { progress, iscomplete } = completionProgress(games[key])}
			<div class="accordion" class:open={opened.includes(key)}>
				<button on:click={() => toggleAccordion(key)}>
					<h4>{key}</h4>

					{#if iscomplete}
						<span class="complete">
							Complete <i class="gc-check"></i>
						</span>
					{:else}
						<span>{progress}</span>
					{/if}

					<div class="icon">
						<i class="gc-chevron-up"></i>
					</div>
				</button>

				<div class="list" id={key} style="--height: 0px;">
					{#each games[key] as { courseName, point, token, courseID }}
						<div class="item">
							<div>
								{#if courseID}
									<a href="https://www.cloudskillsboost.google/games/{courseID}"> {courseName}</a>
								{:else}
									<span>{courseName}</span>
								{/if}

								{#if token}
									<span> Access Token: {token}</span>
								{:else}
									<span> (Coming Soon) </span>
								{/if}
							</div>
							{#if point > 0}
								<span class="point">+{point}pts</span>
							{/if}
						</div>
					{/each}
				</div>
			</div>
		{/each}
	</div>

	<h3 style="margin-top: 2rem">Skill Badges</h3>
	<div class="group">
		{#each Object.keys(skillbadges) as key}
			{@const { progress, iscomplete } = completionProgress(skillbadges[key])}
			<div class="accordion" class:open={opened.includes(key)}>
				<button on:click={() => toggleAccordion(key)}>
					<h4>{skillName[key]}</h4>

					{#if iscomplete}
						<span class="complete">
							Complete <i class="gc-check"></i>
						</span>
					{:else}
						<span>{progress}</span>
					{/if}

					<div class="icon">
						<i class="gc-chevron-up"></i>
					</div>
				</button>

				<div class="list" id={key} style="--height:0px">
					{#each skillbadges[key] as { courseName, point, courseID, hasBonus }}
						<div class="item">
							<a href="https://www.cloudskillsboost.google/course_templates/{courseID}">
								{courseName}
							</a>
							{#if point > 0}
								<div>
									{#if hasBonus}
										<span> (July Bonus)</span>
									{/if}
									<span class="point"> +{point}pts</span>
								</div>
							{/if}
						</div>
					{/each}
				</div>
			</div>
		{/each}
	</div>
</section>

<style>
	section {
		margin: 0 5%;
		padding-bottom: calc(0.05 * var(--screen-height));
	}

	h2 {
		text-transform: uppercase;
		font-weight: 800;
		padding: 0 0 calc(0.025 * var(--screen-height)) 0;
	}

	h3 {
		text-transform: uppercase;
		margin-bottom: 1rem;
	}

	h4 {
		font-size: 1rem;
		text-transform: capitalize;
	}

	/* Accordion */
	.group {
		border: 2px solid #ddd;
		border-radius: 0.5rem;
	}

	button {
		width: 100%;
		padding: 1.25rem;
		background-color: transparent;
		border: 0;
		border-top: 2px solid #ddd;
		text-align: left;
		display: flex;
		align-items: center;
	}
	.accordion:first-child button {
		border-top: 0;
	}
	button:focus {
		outline: 2px solid var(--color-theme-1);
	}
	button span {
		font-size: 1.2rem;
		opacity: 0.7;
		margin-left: auto;
		margin-right: 2%;
	}
	button span.complete {
		font-size: 1rem;
		background-color: rgb(217, 255, 217);
		color: green;
		padding: 0 0.2rem;
	}
	button .icon {
		transform: rotate(-180deg);
		transition: transform 0.25s;
	}
	.open button .icon {
		transform: rotate(0deg);
	}

	.list {
		height: var(--height);
		overflow: hidden;
		transition: all 0.25s;
	}

	.item {
		width: 100%;
		padding: calc(0.025 * var(--screen-height));
		border-top: 1px solid #ccc;
		display: flex;
		justify-content: space-between;
		transition: background 0.25s;
	}
	.item:hover {
		background-color: #efefef;
	}
	.item .point {
		color: rgb(20, 178, 20);
		padding: 0 0.5rem;
	}
</style>
