<script lang="ts">
	import noimage from '$img/no-image.webp';
	type Props = { badgeurl?: string };
	const { badgeurl }: Props = $props();
</script>

<div class="flex size-full items-center justify-center">
	{#if badgeurl}
		<img src={badgeurl} alt="Badge" class="h-full w-full object-cover sepia-50" />
	{:else}
		<div class="aspect-square w-4/12 overflow-hidden rounded-full">
			<img src={noimage} alt="This is Course" class="size-full object-cover opacity-50" />
		</div>
	{/if}
</div>
