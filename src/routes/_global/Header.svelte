<script>
	import { page } from '$app/stores';

	export let isTop = true;
	$: ({ url } = $page);
	$: ({ pathname } = url);
</script>

<header class:scrolled={!isTop}>
	<nav>
		<a href="/arcade" class:active={/arcade/.test(pathname)}> Arcade </a>
		<a href="/juaragcp" class:active={/juaragcp/.test(pathname)}> JuaraGCP </a>
	</nav>
</header>

<style>
	header {
		position: fixed;
		left: 0;
		top: 0;
		display: block;
		width: 100%;
		z-index: 1;
		transition: all 0.5s;
		padding: 0 5%;
		view-transition-name: header;
	}
	header.scrolled {
		background-color: #fff;
		box-shadow: 0 0 0.5rem #ccc;
	}

	nav {
		display: flex;
	}

	a {
		padding: 1rem;
		text-decoration: none;
		text-transform: uppercase;
		color: #555;
		font-weight: bolder;
		position: relative;
	}

	a::after {
		content: '';
		position: absolute;
		bottom: 0;
		left: 50%;
		width: 90%;
		transform: translateX(-50%) scaleX(0);
		border-bottom: 0.1rem solid var(--color-theme-1);
		transition: all 0.25s;
	}

	a.active::after,
	a:hover::after {
		transform: translateX(-50%) scaleX(1);
	}
</style>
