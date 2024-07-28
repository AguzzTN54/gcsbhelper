<script>
	import { getContext, setContext } from 'svelte';
	import { OverlayScrollbarsComponent } from 'overlayscrollbars-svelte';
	import dbSolutions from '$lib/data/solutions.json';
	import Modal from '$comp/Modal.svelte';
	import Article from '../solutions/Article.svelte';
	import { fade } from 'svelte/transition';

	export let labs = [];
	let persist = false;
	let large = false;

	const modalHandle = getContext('handleModalSol');
	setContext('modalHandle', modalHandle);

	const filtered = dbSolutions.filter(({ labID }) => {
		const labList = labs.map(({ labID: l }) => l.toLowerCase());
		return labList.includes(labID.toLowerCase());
	});

	const courseMaterial = labs.map(({ hasSolution, labID: id }) => {
		const l = filtered.find(({ labID }) => labID.toLowerCase() === id.toLowerCase());
		l.hasSolution = hasSolution;
		return l;
	});

	let solutionID = '';
	const showSolution = (labID) => {
		solutionID = labID;
		persist = true;
		large = true;
	};

	const back = () => {
		solutionID = '';
		persist = false;
		large = false;
	};
</script>

<Modal {persist} {large}>
	<h1 class="header">
		{#if solutionID}
			<button class="back" on:click={back}><i class="gc-arrow-left"></i></button>
		{/if}
		<span> Quick Solutions </span>
		<button class="close" on:click={modalHandle}><i class="gc-close"></i></button>
	</h1>
	<div class="body">
		<div class="scroll">
			<OverlayScrollbarsComponent options={{ scrollbars: { theme: 'os-theme-dark' } }} defer>
				{#if solutionID}
					<div class="solution" in:fade>
						<Article labID={solutionID} />
					</div>
				{:else}
					<div class="list" in:fade>
						{#each courseMaterial as { title, est, hasSolution, labID }}
							<div class="item">
								<span class="name">
									{title}
									<small> {est || ''}</small>
								</span>
								<div class="read">
									{#if hasSolution}
										<button class="read" title="Show Solution" on:click={() => showSolution(labID)}>
											<i class="gc-book-open"></i>
										</button>
									{:else}
										<span> 🗿 </span>
									{/if}
								</div>
							</div>
						{/each}
					</div>
				{/if}
			</OverlayScrollbarsComponent>
		</div>
	</div>
</Modal>

<style>
	.header {
		font-size: 1.2rem;
		text-align: center;
		margin-bottom: 1rem;
		position: relative;
	}
	.header button {
		position: absolute;
		background-color: transparent;
		border: none;
		font-size: x-large;
		transition: transform 0.15s;
	}
	.header button:hover {
		transform: scale(1.2);
	}
	.header button:active {
		transform: scale(1);
	}

	.header .close {
		top: 0;
		right: 0;
	}

	.header .back {
		top: 0;
		left: 0;
	}

	.body {
		padding: 0 0 1rem;
	}

	.list {
		max-height: calc(0.4 * var(--screen-height));
		padding: 0 0.5rem;
	}

	.solution {
		height: calc(0.8 * var(--screen-height));
		padding: 5%;
	}

	.item {
		display: flex;
		border-top: 1px solid #ccc;
		justify-content: space-between;
		align-items: center;
		transition: background 0.25s;
	}

	.item:hover {
		background-color: #f0f0f0;
	}

	.item:first-child {
		border-top: unset;
	}
	.scroll {
		border-bottom: 1px solid #ccc;
		border-top: 1px solid #ccc;
	}

	.name {
		padding: calc(0.0125 * var(--screen-height)) calc(0.025 * var(--screen-height));
		background-color: transparent;
		border: 0;
		font-size: initial;
		font-weight: 500;
		display: block;
		width: 100%;
		text-align: left;
	}

	.name small {
		color: blue;
		opacity: 0.5;
	}

	button.read {
		height: calc(0.06 * var(--screen-height));
		border: 0;
		aspect-ratio: 1/1;
		transition: all 0.25s;
		font-size: large;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	button.read:hover {
		background-color: var(--color-theme-1);
		color: #fff;
	}
</style>
