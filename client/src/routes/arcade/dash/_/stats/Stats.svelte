<script lang="ts">
	import Activities from './Activities.svelte';
	import Milestone from './Milestone.svelte';
</script>

{#snippet heading(text: string)}
	<div class="flex justify-between items-center">
		<h2 class="text-lg my-3">{text}</h2>
		<button class="text-xs brutal-border px-2 py-1 !border-[2px]"> More </button>
	</div>
{/snippet}

<div class="flex flex-col lg:flex-row lg:gap-10 pb-5">
	<div class="w-full lg:w-1/3">
		{@render heading('Milestone Chart')}
		<div class="flex justify-center">
			<div class="size-50 aspect-square flex items-center justify-center">
				<div class="scale-110">
					<Milestone />
				</div>
			</div>
			<!--  -->
		</div>
	</div>
	<div class="w-full lg:w-2/3">
		{@render heading('Activity Chart')}
		<div class="flex justify-center">
			<div class="w-full h-50">
				<Activities />
			</div>
			<!--  -->
		</div>
	</div>
</div>

<div
	class="flex flex-col lg:flex-row p-2 items-center brutal-border !border-[3px] brutal-shadow rounded-br-3xl rounded-tl-3xl -skew-y-1 lg:scale-85"
>
	<div class="w-full lg:w-25 text-center lg:text-left">
		<h2 class="font-bold text-xl pb-2 leading-[100%] mt-2 lg:pl-2">POINT DETAILS</h2>
	</div>
	<div class="grid grid-cols-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 w-full gap-1">
		{#snippet column({ text, point }: { text: string; point: number })}
			<div class="text-center py-1 hover:bg-orange-100">
				<h3 class="brutal-text text-md after:!bg-purple-200">{text}</h3>
				<span class="font-bold text-2xl block">{text === 'Total' ? '' : '+'}{point}</span>
			</div>
		{/snippet}

		{#each [{ text: 'Games', point: 10 }, { text: 'Trivia', point: 8 }, { text: 'Skill', point: 50 }, { text: 'Bonus', point: 25 }, { text: 'WMP', point: 7 }, { text: 'Total', point: 100 }] as item}
			{@render column(item)}
		{/each}
	</div>
</div>
