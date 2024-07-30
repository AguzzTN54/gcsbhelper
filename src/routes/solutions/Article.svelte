<script>
	import { fade } from 'svelte/transition';
	import { marked } from 'marked';
	import dbSolutions from '$lib/data/solutions.json';
	import Loading from '$comp/Loading.svelte';
	import YouTube from './YouTube.svelte';

	export let labID = '';

	let pageTitle = '';
	let article;
	let videoID = '';
	let loading = false;
	let githubSource = '';

	const loadSolution = async (labID = '') => {
		loading = true;
		const labid = labID.toLowerCase();
		const solution = dbSolutions.find(({ labID: id }) => id.toLowerCase() === labid);
		const { sources, title } = solution || {};
		const { post, github = '', youtube } = sources || {};
		if (!solution || !(post || github || youtube)) return noSolution();

		pageTitle = title;
		videoID = youtube;
		const [user, folder] = github.split(/blob\/main\/|blob\/master\//);
		githubSource = github;

		const githubResource = 'https://cdn.jsdelivr.net/gh/' + user + folder;
		const postResource = `/resources/solutions/${labid}.md`;
		const resourceURL = post ? postResource : githubResource;

		await loadResources(resourceURL);
		lineBlock(article);
		newTabLink(article);
		loading = false;
	};
	$: loadSolution(labID);

	const loadResources = async (url) => {
		console.log(url);
		if (!url) return;
		try {
			const resource = await fetch(url);
			const markdown = await resource.text();
			article.innerHTML = marked.parse(markdown);
		} catch (e) {
			console.error(e);
			article.innerHTML = 'Failed to load Resource';
			return 'error';
		}
	};

	const noSolution = () => {
		console.log('no solution');
		loading = false;
		videoID = '';
		githubSource = '';
		if (!article) return;
		article.innerHTML = `<h1>No Solution found for ${labID}</h1>`;
	};

	const newTabLink = (el) => {
		const links = el.querySelectorAll('a');
		links.forEach((l) => l.setAttribute('target', '_blank'));
	};

	const lineBlock = (el) => {
		const pre = el.querySelectorAll('pre');
		pre.forEach((preBlock) => {
			insertCopyButton(preBlock);
			insertNumOfLine(preBlock);
		});
	};

	const insertCopyButton = (pre) => {
		const copywrapper = document.createElement('div');
		copywrapper.classList.add('copy');
		const btn = document.createElement('button');
		btn.innerHTML = `<i class="gc-clone"></i>`;
		btn.addEventListener('click', (e) => copy(e, pre));
		copywrapper.append(btn);
		pre.appendChild(copywrapper);
	};

	const insertNumOfLine = (preBlock) => {
		const codeBlock = preBlock.querySelector('code');
		const str = codeBlock.textContent;
		const lineNumber = str.split(/\n/).length - 1;
		const numberBlock = document.createElement('div');
		numberBlock.classList.add('line-block');
		let lines = '';

		for (let i = 1; i <= lineNumber; i++) lines += `<span>${i}</span>`;
		numberBlock.innerHTML = lines;
		preBlock.insertBefore(numberBlock, codeBlock);
	};

	const copy = (e, target) => {
		try {
			const code = target.querySelector('code');
			const text = code.textContent;
			navigator.clipboard.writeText(text);

			e.target.innerHTML = '<i class="gc-check"></i>';
			const t = setTimeout(() => {
				e.target.innerHTML = '<i class="gc-clone"></i>';
				clearTimeout(t);
			}, 1000);
		} catch (e) {
			console.error(e);
		}
	};
</script>

<svelte:head>
	{#if pageTitle}
		<title>{pageTitle}</title>
	{/if}
</svelte:head>

{#if loading}
	<div class="loading-wrapper" transition:fade={{ duration: 500 }}>
		<Loading />
	</div>
{/if}

<YouTube {videoID} />
<article class="marked" bind:this={article}>
	<!-- <h1>No Solution found for {labID}</h1> -->
</article>

{#if githubSource && !loading}
	<div class="source">
		<a href="https://github.com/{githubSource}" target="_blank">
			<span class="sc">Source <i class="gc-external-link"></i> </span>
			<span class="gh">github@{githubSource.split('/')[0]}</span>
		</a>
	</div>
{/if}

<style>
	.loading-wrapper {
		width: 100%;
		height: calc(0.8 * var(--screen-height));
		position: absolute;
		z-index: +1;
		top: 0;
		left: 50%;
		transform: translate(-50%, 0);
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.source {
		margin: 1rem 0;
	}
	.source a {
		border: 1px solid #333;
		width: fit-content;
		padding: 0.5rem 2rem;
		border-radius: 0.5rem;
		display: flex;
		flex-direction: column;
		transition: all 0.25s;
	}

	a .sc {
		font-size: larger;
		font-weight: 700;
	}
	a .sc i {
		font-size: small;
	}
	a .gh {
		color: rgba(0, 0, 0, 0.45);
		font-size: smaller;
	}

	.source a:hover {
		text-decoration: none;
		border-color: var(--theme-color-1);
		box-shadow: 0 0 0.5rem rgba(88, 177, 255, 0.45);
	}
</style>
