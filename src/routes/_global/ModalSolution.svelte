<script>
	import { getContext, setContext } from 'svelte';
	import { fade } from 'svelte/transition';
	import { OverlayScrollbarsComponent } from 'overlayscrollbars-svelte';
	import { localConfig } from '$lib/helpers/localstorage';
	import dbSolutions from '$lib/data/solutions.json';
	import Modal from '$comp/Modal.svelte';
	import Article from '../solutions/Article.svelte';
	import Button from '$comp/Button.svelte';
	import CheckBox from '$comp/CheckBox.svelte';

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

	// Accept Consequences
	let isChecked = localConfig.get('exposeSolution');
	let exposed = isChecked;
	$: localConfig.set('exposeSolution', isChecked);
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
				{#if !exposed}
					<div class="disclaimer">
						<p>
							<b>I strongly recommend you to follow the lab instructions</b> and avoid using the following
							shortcuts tricks!
						</p>
						<p>
							The purpose of this program is to familiarize you with Google Cloud Platform
							infrastructure, which can be highly beneficial for your career development. You should
							Take this opportunity to enhance your knowledges & skills
						</p>
						<div class="hide">
							<CheckBox id="hide" on:change={({ detail }) => ({ checked: isChecked } = detail)}>
								Dont show this message again
							</CheckBox>
						</div>
						<div class="confirm">
							<Button on:click={() => (exposed = true)}>I don't care, show me the solution!</Button>
						</div>
					</div>
				{:else if solutionID}
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

	.disclaimer {
		max-height: calc(0.4 * var(--screen-height));
		padding: 1rem 1rem;
		font-size: 100%;
	}

	.disclaimer .confirm {
		margin-top: 1rem;
		text-align: center;
		font-size: 0.9rem;
	}
	.hide {
		margin-top: 2rem;
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
