<svelte:head>
	<title>UNMAINTAINED</title>
</svelte:head>

<div class="body">
	<div class="error">
		<span class="status">412</span>
		<div class="message">
			<h1>UNMAINTAINED!</h1>
		</div>
	</div>
</div>

<style>
	:global(body) {
		--bg: white;
		--fg: #222;
		--divider: #ccc;
		background: var(--bg);
		color: var(--fg);
		font-family:
			system-ui,
			-apple-system,
			BlinkMacSystemFont,
			'Segoe UI',
			Roboto,
			Oxygen,
			Ubuntu,
			Cantarell,
			'Open Sans',
			'Helvetica Neue',
			sans-serif;
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100vh;
		margin: 0;
	}

	.error {
		display: flex;
		align-items: center;
		max-width: 32rem;
		margin: 0 1rem;
	}

	.status {
		font-weight: 200;
		font-size: 3rem;
		line-height: 1;
		position: relative;
		top: -0.05rem;
	}

	.message {
		border-left: 1px solid var(--divider);
		padding: 0 0 0 1rem;
		margin: 0 0 0 1rem;
		min-height: 2.5rem;
		display: flex;
		align-items: center;
	}

	.message h1 {
		font-weight: 400;
		font-size: 1em;
		margin: 0;
	}

	@media (prefers-color-scheme: dark) {
		:global(body) {
			--bg: #222;
			--fg: #ddd;
			--divider: #666;
		}
	}
</style>
