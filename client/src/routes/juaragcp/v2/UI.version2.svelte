<script lang="ts">
	import { getContext, onMount } from 'svelte';
	import { screenSize } from '$lib/stores/app.svelte';
	import particleConfig from '$lib/data/particle.config';
	import Flag from './illustration/Flag.svelte';
	import FreeEntry from './illustration/FreeEntry.svelte';
	import Gapura1 from './illustration/Gapura1.svelte';
	import Gapura2 from './illustration/Gapura2.svelte';
	import Ground from './illustration/Ground.svelte';
	import Janur from './illustration/Janur.svelte';
	import Leaf1 from './illustration/Leaf1.svelte';
	import Leaf2 from './illustration/Leaf2.svelte';
	import Leaves from './illustration/Leaves.svelte';
	import SunMoon from './illustration/SunMoon.svelte';
	// import Loader from './illustration/Loader.svelte';

	const loaded = getContext('loaded') as () => void;
	onMount(() => {
		const script = document.createElement('script');
		script.src = 'https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js';
		document.head.appendChild(script);
		const prCount = $screenSize.width <= 640 ? 10 : 15;
		script.onload = () => {
			// @ts-ignore
			window.particlesJS?.('particle', particleConfig(prCount));
			loaded?.();
		};
	});
</script>

<!-- <Loader {loaded} /> -->

<section class="relative size-full bg-[var(--color-primary)] text-[var(--color-secondary)]">
	<div id="particle" class="pointer-events-none absolute top-0 left-0 size-full"></div>
	<header class="relative z-50 flex items-start p-2 font-bold sm:p-[2%]">
		<a
			href="/arcade"
			class="rounded-full border-4 border-transparent px-2 text-sm text-[var(--color-secondary)] uppercase transition-colors duration-300 hover:border-[var(--color-secondary)] sm:text-lg"
			data-sveltekit-preload-data="off"
		>
			<i class="fasds fa-gamepad-modern" style="--fa-primary-color:var(--color-primary)"></i> Google
			Arcade
		</a>

		<nav class="none mr-30 ml-auto hidden whitespace-nowrap sm:block">
			<span class="text-stroke px-2 text-lg text-[var(--color-secondary)]"> 10d 1h 23m 11s </span>
			<a
				href="https://docs.google.com/forms/d/1sTb9gQRgvTa101MSU1_nuEsMU7rbyzvMBEu928rKoQA"
				target="_blank"
				rel="noreferrer"
				class="rounded-full bg-[var(--color-secondary)] px-6 py-2 text-lg !font-semibold text-[var(--color-primary)] uppercase transition-colors duration-300 hover:bg-amber-800"
			>
				Join
			</a>
		</nav>
	</header>

	<div
		class="relative z-20 flex h-full w-full -translate-y-1/9 flex-col items-center justify-center md:-translate-y-1/6"
	>
		<span
			class="mx-auto mb-2 block w-50 rounded-full border-4 border-[var(--color-primary)] bg-[var(--color-secondary)] py-1.5 text-center text-sm font-semibold text-[var(--color-primary)] sm:hidden"
			style="word-spacing: .5rem;"
		>
			10d 1h 23m 11s
		</span>

		<h1 class="font-fancy text-stroke text-center">
			<span class="block text-6xl font-bold sm:text-[5rem]">JuaraGCP</span>
			<span class="block text-3xl sm:text-4xl">
				Progress
				<span class="text-[var(--color-third)]">Tracker</span>
			</span>
		</h1>

		<div class="relative my-5 w-10/12 rounded-full bg-amber-200 sm:mt-10 sm:w-2/5">
			<input
				type="text"
				class="h-16 w-full rounded-full border-[4px] border-[var(--color-secondary)] bg-[var(--color-primary)]/90 pr-12 pl-8 font-bold outline-0 backdrop-blur-xs transition-colors duration-300 placeholder:font-semibold focus:border-amber-600"
				placeholder="Input Public Profile URL"
			/>
			<span class="absolute top-1/2 right-0 -translate-1/2 -translate-x-1/2 text-2xl opacity-50">
				<i class="fasds fa-link"></i>
			</span>
		</div>

		<div class="flex">
			<button
				class="rounded-full bg-[var(--color-secondary)] px-6 py-3 font-semibold text-[var(--color-primary)] uppercase transition-all duration-300 hover:bg-amber-800 active:scale-97"
			>
				Check my Profile <i
					class="fasds fa-rocket-launch"
					style="--fa-primary-color:var(--color-primary); --fa-secondary-color:var(--color-third)"
				></i>
			</button>
		</div>

		<a
			href="/#"
			class="text-stroke relative mt-4 inline-block text-xs font-semibold uppercase after:absolute after:top-1/2 after:left-1/2 after:-z-10 after:h-0.5 after:w-full after:-translate-x-1/2 after:-translate-y-1/2 after:scale-x-150 after:bg-[var(--color-secondary)] sm:hidden"
		>
			Daftar Sekarang!
		</a>
	</div>
</section>

<FreeEntry />
<SunMoon />
<Gapura1 />
<Gapura2 />
<Janur />
<Flag />
<Ground />

<div class="leaves">
	<Leaf1 />
	<Leaf2 />
	<Leaf2 flip />
	<Leaves />
</div>

<style lang="postcss">
	@import 'tailwindcss/theme' theme(reference);

	:global {
		:root {
			--color-primary: #f5efdd;
			/* --color-primary: theme(--color-gray-100); */
			--color-secondary: #553327;
			--color-third: #e4ab5e;
		}

		.text-stroke {
			text-shadow:
				-0.2rem -0.2rem 0 var(--color-primary),
				0 -0.2rem 0 var(--color-primary),
				0.2rem -0.2rem 0 var(--color-primary),
				0.2rem 0 0 var(--color-primary),
				0.2rem 0.2rem 0 var(--color-primary),
				0 0.2rem 0 var(--color-primary),
				-0.2rem 0.2rem 0 var(--color-primary),
				-0.2rem 0 0 var(--color-primary);
		}
	}
</style>
