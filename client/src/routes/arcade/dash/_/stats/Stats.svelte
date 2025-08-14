<script lang="ts">
</script>

{#snippet heading(text: string)}
	<div class="flex justify-between items-center">
		<h2 class="text-lg my-3">{text}</h2>
		<button class="text-xs brutal-border px-2 py-1 !border-[2px]"> More </button>
	</div>
{/snippet}

<div class="flex flex-col lg:flex-row gap-5 lg:gap-10 pb-5">
	<div class="w-full lg:w-1/3">
		{@render heading('Milestone Chart')}
		<div class="flex justify-center">
			<div class="size-50 aspect-square bg-amber-200"></div>
			<!--  -->
		</div>
	</div>
	<div class="w-full lg:w-2/3">
		{@render heading('Activity Chart')}
		<div class="flex justify-center">
			<div class="w-full h-50 bg-amber-200"></div>
			<!--  -->
		</div>
	</div>
</div>

<div
	class="flex flex-col lg:flex-row p-2 items-center brutal-border !border-[3px] brutal-shadow rounded-br-3xl rounded-tl-3xl -skew-y-1"
>
	<div class="w-full lg:w-25 text-center lg:text-left">
		<h2 class="font-bold text-xl pb-2 leading-[100%] mt-2">POINT DETAILS</h2>
	</div>
	<div class="grid grid-cols-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 w-full gap-1">
		{#snippet column({ text, point }: { text: string; point: number })}
			<div class="text-center py-1 hover:bg-orange-200">
				<h3 class="brutal-text after:!bg-purple-200">{text}</h3>
				<span class="font-black text-2xl block">+{point}</span>
			</div>
		{/snippet}

		{#each [{ text: 'Games', point: 10 }, { text: 'Trivia', point: 10 }, { text: 'Skill', point: 10 }, { text: 'Milestone', point: 10 }, { text: 'WMP', point: 10 }, { text: 'Total', point: 10 }] as item}
			{@render column(item)}
		{/each}
	</div>
</div>
