<script lang="ts">
	import { page } from '$app/state';
	import { onMount, setContext, getContext } from 'svelte';
	import { MetaTags } from 'svelte-meta-tags';
	import { createCountdown } from '$lib/stores/countdown.svelte';
	import { useQuery } from '$lib/stores/query-store';
	import ScrollArea from '$reusable/ScrollArea.svelte';
	import { activeProfile, juaraBadges, screenSize } from '$lib/stores/app.svelte';
	import { localAccounts } from '$lib/helpers/localstorage';
	import dayjs from '$lib/helpers/dateTime';
	import { juaraSeason } from '$lib/data/config';
	import ModalProfile from '../v2/ModalProfile.svelte';
	import Ornament from './_ornament.svelte';
	import Forms from './Forms.svelte';
	// import Summary from './Summary.svelte';
	import Details from './Details.svelte';
	import particleConfig from '$lib/data/particle.config';
	import { fade } from 'svelte/transition';
	import bg from '$img/juaragcp-bg-theme.webp';

	const q = $derived(useQuery($activeProfile?.uuid || ''));
	const profileLoaded = $derived($q.data && !$q.isLoading);
	const loaded = getContext('loaded') as () => void;
	$effect(() => juaraBadges.set((($q.data as App.InitData)?.courses as App.JuaraBadge[]) || []));
	const title = $derived.by(() => {
		const { name } = $activeProfile || {};
		return `${name ? name + ' - ' : ''} ${page.data.pageMetaTags.title}`;
	});

	onMount(() => {
		// const script = document.createElement('script');
		// script.src = 'https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js';
		// document.head.appendChild(script);
		// const prCount = $screenSize.width <= 640 ? 10 : 15;
		// script.onload = () => {
		// 	// @ts-ignore
		// 	window.particlesJS?.('particle', particleConfig(prCount));
		// 	loaded?.();
		// };

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

<ScrollArea id="juaragcpv1" class="relative" {onScroll}>
	<ModalProfile />
	<!-- <div
		id="particle"
		class="pointer-events-none fixed top-0 left-0 -z-1 h-(--screen-height) w-full"
	></div> -->

	<section
		class="relative h-[calc(var(--screen-height)-2rem)] max-h-full w-[var(--screen-width)] overflow-hidden"
	>
		<header class="relative z-50 flex items-start p-2 font-bold sm:p-[2%]">
			{#if typeof $activeProfile === 'object'}
				<h1 class="text-stroke flex p-2 text-center sm:p-0" in:fade>
					<span class="text-xl">JuaraGCP</span>
					<span class="ml-1 inline-block text-xs">S12</span>
				</h1>
			{:else}
				<a
					in:fade={{ delay: 2000 }}
					href="/arcade"
					class="rounded-full border-4 border-transparent px-2 text-sm text-sky-500 uppercase transition-colors duration-300 hover:border-sky-500 sm:text-lg"
					data-sveltekit-preload-data="off"
				>
					<i class="fasds fa-gamepad-modern" style="--fa-primary-color:var(--color-primary)"></i> Google
					Arcade
				</a>
			{/if}

			<nav class="none mr-5 ml-auto hidden whitespace-nowrap sm:block">
				<span class="text-stroke px-2 text-lg text-sky-700" title={enddate}>
					{countdown}
				</span>
				<a
					href="https://rsvp.withgoogle.com/events/juaragcp-s12"
					target="_blank"
					rel="noreferrer"
					class="rounded-full bg-sky-600 px-6 py-2 text-lg !font-semibold text-white uppercase transition-colors duration-300 hover:bg-sky-800"
				>
					Join
				</a>
			</nav>
		</header>

		<!-- <Ornament /> -->
		<div
			class="bg relative z-20 flex h-full w-full -translate-y-1/9 flex-col items-center justify-center md:-translate-y-1/6"
		>
			{#if !profileLoaded}
				<span
					class="mx-auto mb-2 block w-50 rounded-full border-4 border-white bg-sky-500 py-1.5 text-center text-sm font-semibold text-white sm:hidden"
					style="word-spacing: .5rem;"
				>
					{countdown}
				</span>

				<div class="text-stroke mb-5 space-y-5 text-center">
					<h1 class="flex rounded-full">
						<span class="font-fancy text-7xl font-bold">#JuaraGCP</span>
						<span class="ml-4 inline-block text-xl">S12</span>
					</h1>
					<h2 class="mt-2 block text-lg font-semibold text-slate-600 sm:text-xl">
						<span class="rounded-lg bg-slate-200/75 px-2 py-1"> Progress </span>
						<span class="rounded-lg bg-slate-200/75 px-2 py-1"> Tracker </span>
					</h2>
				</div>
			{/if}

			<!-- {#if profileLoaded} -->
			<!-- <Summary /> -->
			<!-- {:else} -->
			<Forms />
			<!-- {/if} -->
		</div>
	</section>

	{#if profileLoaded}
		<Details />
	{/if}
</ScrollArea>

<style lang="postcss">
	:global {
		:root {
			--color-theme-1: #2d95f1;
			--color-theme-2: #23c2f6;
			--color-gradient: linear-gradient(70deg, var(--color-theme-1) 45%, var(--color-theme-2));
			--white: #ffffff;
			--greyLight-1: #e4ebf5;
			--greyLight-2: #c8d0e7;
		}
	}
</style>
