<script lang="ts">
	import bg from '$img/paper.webp';
	import ScrollArea from '../_global/reusable/ScrollArea.svelte';
	const { children } = $props();
</script>

<div class="flex items-end justify-center size-full">
	<div
		class="w-[95%] md:w-9/12 bg-gray-100 h-[90%] relative rounded-t-3xl overflow-hidden !border-b-0 brutal-border brutal-shadow"
	>
		<img
			src={bg}
			alt="Paper Bg"
			class="absolute top-0 right-0 size-full object-cover opacity-30 grayscale pointer-events-none"
		/>
		<ScrollArea>
			{@render children()}
		</ScrollArea>
	</div>
</div>
