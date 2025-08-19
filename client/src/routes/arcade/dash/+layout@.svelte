<script lang="ts">
	import { setContext } from 'svelte';
	import bg from '$img/paper.webp';
	import ScrollArea from '$reusable/ScrollArea.svelte';
	import ProfilePic from '../_/ProfilePic.svelte';
	import NavMenu from './_/NavMenu.svelte';

	const { children } = $props();
	let scrolled = $state(false);
	setContext('scrolled', (val: boolean) => (scrolled = val));
</script>

<section
	class="sm:p-4 p-2 pt-4 !pb-0 size-full relative overflow-hidden bg flex flex-col justify-end"
>
	<div
		style="--bg:url({bg})"
		class="-skew-1 h-[calc(100%-3rem)] sm:h-full w-[calc(100%-1rem)] sm:w-[calc(100%-2rem)] z-1 absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-[1rem] brutal-border rounded-tl-3xl overflow-hidden bg-indigo-300 after:top-0 after:left-0 after:skew-1 after:-z-10 after:absolute after:size-full after:bg-gray-100"
	></div>

	<div
		class="sm:hidden relative z-10 skew-1 rounded-bl-3xl rounded-tr-3xl overflow-hidden"
		class:active={scrolled}
		class:brutal-border={scrolled}
	>
		<div class="-skew-1 flex justify-center pb-3">
			<div class="flex" class:scale-90={scrolled} class:-translate-y-[8%]={scrolled}>
				<ProfilePic />
			</div>

			{#if scrolled}
				<div class="ml-4 w-full flex flex-col">
					<a href="/arcade" class="relative w-fit">
						<h1 class="font-semibold text-lg mb-1 text-overflow">Agus Sedunia Agus Sedunia</h1>
					</a>
					<NavMenu action />
				</div>
			{/if}
		</div>
	</div>

	<div class="w-full h-[calc(100%-5rem)] sm:h-full rounded-t-3xl relative z-2 p-2 pt-2 sm:pt-5">
		<ScrollArea id="dash">
			{@render children()}
		</ScrollArea>
	</div>
</section>

<style lang="postcss">
	@import 'tailwindcss/theme' theme(reference);

	.active {
		@apply bg-gray-100 w-10/12 mx-auto;
	}
</style>
