<script lang="ts">
	import noimage from '$img/no-image.webp';
	type Props = { badgeurl?: string; type: string; isgame?: boolean; label: string };
	const { badgeurl, type, isgame = false, label }: Props = $props();
</script>

<div
	class="size-full flex items-center justify-center bg-[#f1f1f1] {type}"
	class:p-2={isgame && badgeurl}
>
	{#if badgeurl}
		<img
			src={badgeurl}
			alt="Badge"
			class="h-full"
			class:object-cover={!isgame}
			class:w-full={!isgame}
		/>
	{:else}
		<div class="w-2/12 aspect-square rounded-full overflow-hidden">
			<img src={noimage} alt={label} class="size-full object-cover opacity-50" />
		</div>
		<div class="font-medium uppercase text-gray-400 pt-1 text-xl">
			<span> {label} </span>
		</div>
	{/if}
</div>

<style>
	.wmp {
		background-image: linear-gradient(to top, #1a6260, #202124);
	}
	.game {
		background-image: linear-gradient(to top, #162a43, #202124);
	}
	.trivia {
		background-image: linear-gradient(to top, #51364b, #202124);
	}
</style>
