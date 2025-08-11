<script lang="ts">
	import bg from '$img/paper.webp';
	import ScrollArea from '../_global/reusable/ScrollArea.svelte';
	import NavMenu from './_/NavMenu.svelte';
	const { children } = $props();
</script>

<div class="flex items-end justify-center size-full">
	<div
		class="w-[95%] md:w-9/12 bg-gray-100 h-[90%] relative rounded-t-3xl rounded-tr-none !border-b-0 brutal-border brutal-shadow"
	>
		<div
			class="absolute rounded-tr-3xl bottom-full right-0 translate-y-[1.2rem] pb-3 brutal-shadow brutal-border translate-x-[6px] overflow-hidden"
		>
			<NavMenu />
		</div>

		<div
			class="absolute top-0 right-0 size-full bg-gray-100 pointer-events-none rounded-tl-3xl overflow-hidden"
		>
			<img
				src={bg}
				alt="Paper Bg"
				class="object-cover opacity-30"
				style="mask-image: linear-gradient(to bottom, transparent 5%, black 20%);"
			/>
		</div>
		<ScrollArea>
			{@render children()}
		</ScrollArea>
	</div>
</div>
