<script lang="ts">
	import bg from '$img/paper.webp';
	import ScrollArea from '../../_global/reusable/ScrollArea.svelte';
	import ProfilePic from '../_/ProfilePic.svelte';

	const { children } = $props();
</script>

<section
	class="sm:p-4 p-2 pt-4 !pb-0 size-full relative overflow-hidden flex flex-col justify-end"
	id="dash"
>
	<div
		style="--bg:url({bg})"
		class="-skew-1 h-[calc(100%-3rem)] sm:h-full w-[calc(100%-1rem)] sm:w-[calc(100%-2rem)] z-1 absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-[1rem] brutal-border rounded-tl-3xl overflow-hidden bg-indigo-300 after:top-0 after:left-0 after:skew-1 after:-z-10 after:absolute after:size-full after:bg-gray-100"
	>
		<img
			src={bg}
			alt="Paper Bg"
			class="object-cover opacity-30 size-full absolute top-0 right-0 pointer-events-none rounded-tl-3xl"
			style="mask-image: linear-gradient(to bottom, transparent 5%, black 20%);"
		/>
	</div>

	<div class="flex justify-center sm:hidden">
		<ProfilePic />
	</div>
	<div class="w-full h-[calc(100%-5rem)] sm:h-full rounded-t-3xl relative z-2 p-2 pt-2 sm:pt-5">
		<ScrollArea>
			{@render children()}
		</ScrollArea>
	</div>
</section>
