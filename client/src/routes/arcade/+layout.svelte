<script lang="ts">
	import { page } from '$app/state';
	import { getContext, onMount } from 'svelte';
	import { arcadeFacil } from '$lib/stores/app.svelte';
	import bg from '$img/paper.webp';
	import splash from '$img/splash5.webp';
	import ScrollArea from '$reusable/ScrollArea.svelte';
	import Countdown from './_/Countdown.svelte';
	import NavMenu from './_/NavMenu.svelte';

	const { children } = $props();
	const loaded = getContext('loaded') as () => void;
	onMount(() => loaded?.());
</script>

<img
	src={splash}
	alt="splash"
	class="pointer-events-none absolute top-0 left-0 -z-1 size-full object-cover"
/>

{#if page.route.id === '/arcade/dash'}
	<!-- Dashboard -->
	{@render children()}
{:else}
	<!-- not logged in -->
	<div class="flex size-full items-end justify-center">
		<div
			class="brutal-border-lg brutal-shadow relative h-[calc(90%-2rem)] w-[95%] rounded-t-3xl rounded-tr-none !border-b-0 bg-gray-100 sm:h-[90%] md:w-9/12"
		>
			<!-- Countdown -->
			{#if $arcadeFacil && $arcadeFacil !== 'unset'}
				<div
					class="absolute top-0 left-0 z-1 flex w-full -translate-y-[calc(100%+2.5rem)] justify-center sm:w-fit sm:-translate-y-full sm:justify-start"
				>
					<div class="mb-2 flex flex-col items-center sm:items-start">
						<Countdown small />
					</div>
				</div>
			{/if}

			<!-- Menu -->
			<div
				class="brutal-shadow brutal-border-lg absolute right-0 bottom-full translate-x-[6px] translate-y-[1.2rem] overflow-hidden rounded-tr-3xl pb-3"
			>
				<NavMenu />
			</div>

			<!-- Paper Background -->
			<div
				class="pointer-events-none absolute top-0 right-0 size-full overflow-hidden rounded-tl-3xl bg-gray-100"
			>
				<img
					src={bg}
					alt="Paper Bg"
					class="size-full object-cover opacity-30"
					style="mask-image: linear-gradient(to bottom, transparent 5%, black 20%);"
				/>
			</div>
			<ScrollArea wrapperClass="h-full">
				{@render children()}
			</ScrollArea>
		</div>
	</div>
{/if}
