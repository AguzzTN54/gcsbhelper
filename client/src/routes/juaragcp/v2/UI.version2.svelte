<script lang="ts">
	import { page } from '$app/state';
	import { fade } from 'svelte/transition';
	import { getContext, onMount } from 'svelte';
	import { MetaTags } from 'svelte-meta-tags';
	import { useQuery } from '$lib/stores/query-store';
	import { localAccounts } from '$lib/helpers/localstorage';
	import { juaraSeason } from '$lib/data/config';
	import dayjs from '$lib/helpers/dateTime';
	import { activeProfile, juaraBadges, screenSize } from '$lib/stores/app.svelte';
	import { createCountdown } from '$lib/stores/countdown.svelte';
	import particleConfig from '$lib/data/particle.config';
	import ScrollArea from '$reusable/ScrollArea.svelte';
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
	import Timeline from './Timeline/Timeline.svelte';
	import Badges from './Badges';
	import Form from './Form.svelte';
	import Summary from './Summary.svelte';
	import ModalProfile from './ModalProfile.svelte';

	const q = $derived(useQuery($activeProfile?.uuid || ''));
	const profileLoaded = $derived($q.data && !$q.isLoading);
	const loaded = getContext('loaded') as () => void;
	$effect(() => juaraBadges.set((($q.data as App.InitData)?.courses as App.JuaraBadge[]) || []));
	const title = $derived.by(() => {
		const { name } = $activeProfile || {};
		return `${name ? name + ' - ' : ''} ${page.data.pageMetaTags.title}`;
	});

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

		// Check Local Profile
		const profile = localAccounts.getActive('juaragcp');
		if (profile?.uuid) activeProfile.set(profile);
	});

	const onScroll = (e: Event) => {
		const target = e.target as HTMLElement;
		const scrollTop = target.scrollTop;
		const elements = document.querySelectorAll<HTMLElement>('[data-parallax]');
		elements.forEach((el) => {
			const speed = parseFloat(el.dataset.parallax || '0.5');
			el.style.transform = `translateY(${scrollTop * speed}px)`;
		});
	};

	const scrollToTimeline = () => {
		const timeline = document.getElementById('timeline');
		timeline?.scrollIntoView({ behavior: 'smooth' });
	};

	const enddate = dayjs(new Date()).isBefore(juaraSeason.start)
		? juaraSeason.start
		: juaraSeason.end;
	const timer = createCountdown(enddate);
	const countdown = $derived.by(() => {
		const { d, h, m, s } = $timer;
		const time = `${d}d ${h}h ${m}m ${s}s`;
		return time;
	});
</script>

<MetaTags {title} />

<ScrollArea id="juaragcp" class="relative bg-(--color-primary)" {onScroll}>
	<ModalProfile />

	<div
		id="particle"
		class="h-(--screen-height)w-full pointer-events-none fixed top-0 left-0 -z-1"
	></div>
	<section
		class="sticky top-0 left-0 h-[calc(var(--screen-height)-2rem)] max-h-full w-full text-(--color-secondary)"
	>
		<header class="relative z-50 flex items-start p-2 font-bold sm:p-[2%]">
			{#if typeof $activeProfile === 'object'}
				<h1 class="font-fancy text-stroke p-2 text-center sm:p-0" in:fade>
					<span class="text-2xl font-bold sm:text-3xl">JuaraGCP</span>
					<span class="ml-2 inline-block -translate-y-1/2">S12</span>
				</h1>
			{:else}
				<a
					in:fade={{ delay: 2000 }}
					href="/arcade"
					class="rounded-full border-4 border-transparent px-2 text-sm text-[var(--color-secondary)] uppercase transition-colors duration-300 hover:border-[var(--color-secondary)] sm:text-lg"
					data-sveltekit-preload-data="off"
				>
					<i class="fasds fa-gamepad-modern" style="--fa-primary-color:var(--color-primary)"></i> Google
					Arcade
				</a>
			{/if}

			<nav class="none mr-30 ml-auto hidden whitespace-nowrap sm:block">
				<span class="text-stroke px-2 text-lg text-[var(--color-secondary)]" title={enddate}>
					{countdown}
				</span>
				<a
					href="https://rsvp.withgoogle.com/events/juaragcp-s12"
					target="_blank"
					rel="noreferrer"
					class="rounded-full bg-[var(--color-secondary)] px-6 py-2 text-lg !font-semibold text-[var(--color-primary)] uppercase transition-colors duration-300 hover:bg-amber-800"
				>
					Join
				</a>
			</nav>
		</header>

		<div
			class="bg relative z-20 flex h-full w-full -translate-y-1/9 flex-col items-center justify-center md:-translate-y-1/6"
		>
			{#if !profileLoaded}
				<span
					class="mx-auto mb-2 block w-50 rounded-full border-4 border-[var(--color-primary)] bg-[var(--color-secondary)] py-1.5 text-center text-sm font-semibold text-[var(--color-primary)] sm:hidden"
					style="word-spacing: .5rem;"
				>
					{countdown}
				</span>

				<div class="font-fancy text-stroke text-center">
					<h1 class="block">
						<span class="text-6xl font-bold sm:text-[5rem]"> JuaraGCP </span>
						<span class="ml-2 inline-block -translate-y-full text-3xl">S12</span>
					</h1>
					<h2 class="block text-3xl sm:text-4xl">
						Progress
						<span class="text-[var(--color-third)]">Tracker</span>
					</h2>
				</div>
			{/if}

			{#if profileLoaded}
				<Summary />
			{:else}
				<Form />
				<a
					href="/#"
					class="text-stroke relative mt-4 inline-block text-xs font-semibold uppercase after:absolute after:top-1/2 after:left-1/2 after:-z-10 after:h-0.5 after:w-full after:-translate-x-1/2 after:-translate-y-1/2 after:scale-x-150 after:bg-[var(--color-secondary)] sm:hidden"
				>
					Daftar Sekarang!
				</a>
			{/if}
		</div>

		{#if profileLoaded}
			<button
				in:fade
				onclick={scrollToTimeline}
				aria-label="Scroll Down"
				class="group group absolute bottom-[10%] left-1/2 z-50 flex aspect-[1/1.75] w-8 -translate-x-1/2 justify-center rounded-full border-2 pt-2 text-3xl duration-300 hover:bg-[var(--color-secondary)]"
			>
				<span
					class="block h-4 w-1 animate-bounce rounded-full bg-[var(--color-secondary)] group-hover:bg-[var(--color-primary)]"
					style="animation-duration: 2s;"
				>
				</span>
				<!-- <i class="fasds fa-chevrons-down animate-bounce" style="animation-duration: 1500ms"></i> -->
			</button>
		{/if}
	</section>

	{#if profileLoaded}
		<Timeline />
		<Badges />
	{/if}

	<div class="pointer-events-none fixed top-0 left-0 -z-1 size-full overflow-hidden">
		<div class="max-h-[] absolute right-0 bottom-0 translate-x-1/2 md:translate-x-0">
			<Gapura1 />
		</div>
		<SunMoon />
		<Gapura2 />
		<Janur />
		<Flag />
		<FreeEntry />
		<Ground />
	</div>

	<div
		class="pointer-events-none fixed bottom-0 left-0 z-50 size-full overflow-hidden"
		data-parallax="0.3"
	>
		<Leaf1 />
		<Leaf2 />
		<Leaf2 flip />
		<div class="absolute right-1/2 bottom-0 w-[35%] min-w-[300px] translate-y-[15%]">
			<Leaves />
		</div>
	</div>
</ScrollArea>

<style lang="postcss">
	@import 'tailwindcss/theme' theme(reference);

	:global {
		:root {
			--color-primary: #f5efdd;
			--color-secondary: #553327;
			--color-third: #e4ab5e;
		}

		.duo {
			--fa-primary-color: currentColor;
			--fa-secondary-color: var(--color-third);
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
