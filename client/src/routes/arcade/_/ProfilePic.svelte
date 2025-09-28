<script lang="ts">
	import { loadSteps, profileReady } from '$lib/stores/app.svelte';
	import anonym from '$img/avatar.webp';
	import Skeleton from '$reusable/Skeleton.svelte';
	const { src: avatar = '' } = $props();
	const src = $derived(avatar || anonym);

	let imageErrorAttempt = 0;
	const onImageError = (e: Event) => {
		if (imageErrorAttempt > 1) return;
		imageErrorAttempt++;
		const el = e.target as HTMLImageElement;
		el.src = anonym;
	};
</script>

<div class="size-20 rounded-full bg-amber-300 p-0.5">
	<div class="size-full overflow-hidden rounded-full bg-indigo-300 object-cover p-1">
		{#if $profileReady || loadSteps.profile}
			{#key src}
				<img
					{src}
					onerror={onImageError}
					alt="Profile"
					class="brutal-border rounded-full !border-[3px]"
				/>
			{/key}
		{:else}
			<Skeleton class="size-full rounded-full" />
		{/if}
	</div>
</div>
