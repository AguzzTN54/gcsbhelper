<script>
	const { children, onclick = () => null } = $props();
</script>

<button class="check primary_hover_after" type="submit" {onclick}>
	{@render children()}
</button>

<style>
	.check {
		background-image: var(--color-gradient);
		background-size: 200%;
		background-position: 100%;
		font-size: inherit;
		border: 0;
		outline: 0;
		padding: 0.75rem 2rem;
		color: #fff;
		border-radius: 99rem;
		transition:
			transform 0.1s,
			background 0.3s,
			box-shadow 0.25s;
		position: relative;

		&:hover {
			background-position: 0;
			box-shadow: var(--outer-shadow);
		}
	}
</style>
