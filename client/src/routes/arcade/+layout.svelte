<script lang="ts">
	import { arcadeRegion } from '$lib/stores/app-store';
	import bg from '$img/paper.webp';
	import ScrollArea from '$reusable/ScrollArea.svelte';
	import Countdown from './_/Countdown.svelte';
	import NavMenu from './_/NavMenu.svelte';

	const { children } = $props();
</script>

<div class="flex items-end justify-center size-full">
	<div
		class="w-[95%] md:w-9/12 bg-gray-100 h-[calc(90%-2rem)] sm:h-[90%] relative rounded-t-3xl rounded-tr-none !border-b-0 brutal-border-lg brutal-shadow"
	>
		<!-- Countdown -->
		{#if $arcadeRegion && $arcadeRegion !== 'unset'}
			<div
				class="absolute top-0 left-0 z-1 -translate-y-[calc(100%+2.5rem)] sm:-translate-y-full flex justify-center sm:justify-start w-full sm:w-fit"
			>
				<div class="flex flex-col items-center sm:items-start mb-2">
					<Countdown small />
				</div>
			</div>
		{/if}

		<!-- Menu -->
		<div
			class="absolute rounded-tr-3xl bottom-full right-0 translate-y-[1.2rem] pb-3 brutal-shadow brutal-border-lg translate-x-[6px] overflow-hidden"
		>
			<NavMenu />
		</div>

		<!-- Paper Background -->
		<div
			class="absolute top-0 right-0 size-full bg-gray-100 pointer-events-none rounded-tl-3xl overflow-hidden"
		>
			<img
				src={bg}
				alt="Paper Bg"
				class="object-cover opacity-30 size-full"
				style="mask-image: linear-gradient(to bottom, transparent 5%, black 20%);"
			/>
		</div>
		<ScrollArea>
			{@render children()}
		</ScrollArea>
	</div>
</div>
