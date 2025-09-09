<script lang="ts">
	import { profileReady } from '$lib/stores/app.svelte';
	import anonym from '$img/avatar.webp';
	import Skeleton from '$reusable/Skeleton.svelte';
	const { src: avatar = '' } = $props();
	const src = $derived(avatar || anonym);
</script>

<div class="size-20 bg-amber-300 rounded-full p-0.5">
	<div class="size-full bg-indigo-300 rounded-full overflow-hidden object-cover p-1">
		{#if $profileReady}
			<img
				{src}
				onerror={(e) => ((e.target as HTMLImageElement).src = anonym)}
				alt="Profile"
				class="rounded-full brutal-border !border-[3px]"
			/>
		{:else}
			<Skeleton class="size-full rounded-full" />
		{/if}
	</div>
</div>
