<script lang="ts">
	import Donut from '$reusable/Donut.svelte';
	const { complete = false, rated = false } = $props();

	const skewDeg = () => {
		const degX = Math.random() * 4 - 2;
		const degY = Math.random() * 4 - 2;
		return `--degX:${degX.toFixed(2)}deg;--degY:${degY.toFixed(2)}deg;`;
	};
</script>

<div
	class:complete
	class:rated
	class="brutal-border relative course-item bg-gray-100 rounded-tl-3xl rounded-br-3xl group"
	style="{skewDeg()};"
>
	{#if complete}
		<div
			class="absolute size-full top-0 left-0 bg-gray-100/75 z-10 scale-120 group-[:hover]:opacity-0 pointer-events-none"
		></div>

		<span
			class="absolute top-0 right-0 py-1 z-10 px-2 text-xs bg-purple-800 text-white -skew-2 translate-y-1/3 translate-x-1/5"
		>
			Completed
		</span>
	{/if}

	<div class="size-full rounded-tl-3xl rounded-br-3xl overflow-hidden">
		<div class="w-full aspect-video bg-gray-400 rounded-b-xl border-b-4 overflow-hidden relative">
			{#if !complete || (rated && complete)}
				<img
					src="https://cdn.qwiklabs.com/H5Nw8iJDyQktGkZLbZBXV%2FwyW9tf2co6Sbpu67lz2dU%3D"
					alt="Badge"
				/>
			{/if}

			{#if !rated && complete}
				<div
					class="size-full bg-slate-100 absolute top-0 left-0 opacity-40 group-[:hover]:opacity-100 flex items-center justify-center"
				>
					<div class="flex flex-col items-center justify-center text-center text-xs w-9/12">
						<span>Please help others by rating this course</span>
						<div class="flex justify-between gap-1">
							<button
								class="bg-green-300 hover:bg-green-400 active:bg-green-500 py-1 px-3 brutal-border !border-[2px] rounded-full relative"
							>
								Easy
							</button>
							<button
								class="bg-amber-300 hover:bg-amber-400 active:bg-amber-500 py-1 px-3 brutal-border !border-[2px] rounded-full relative"
							>
								Medium
							</button>
							<button
								class="bg-red-300 hover:bg-red-400 active:bg-red-500 py-1 px-3 brutal-border !border-[2px] rounded-full relative"
							>
								Hard
							</button>
						</div>
					</div>
				</div>
			{:else if complete}
				<div
					class="bg-amber-200 text-amber-700 w-full p-0.5 absolute bottom-0 left-0 text-xs text-center"
				>
					Your rating: <button class="underline">intermediate</button>
				</div>
			{/if}
		</div>
		<div class="p-2">
			<div class="block pt-1 pb-2">
				<div class="inline-block text-xs">
					<i class="fasdl fa-flask text-indigo-400"></i>
					<span class="text-gray-600">6</span>
					<i class="fasdl fa-users text-indigo-400 inline-block ml-2"></i>
					<span class="text-gray-600">1209</span>
				</div>

				<span class="brutal-text after:!bg-amber-200 text-amber-800 !mx-1 text-[10px]">
					Skill Badge
				</span>
				<span class="brutal-text after:!bg-sky-200 text-sky-800 !mx-1 text-[10px]">
					<i class="fasdl fa-bolt"></i> Fast Track
				</span>
			</div>
			<h3 class="text-xl leading-[120%] text-overflow" style="--line-number:2">
				Enhance Gemini Model Capabilities Enhance Gemini Model Capabilities
			</h3>
			<div class="flex justify-between items-center pt-1">
				<div class="flex items-center text-gray-600 gap-2">
					<Donut size="1.2rem" values={{ easy: 50, hard: 10, medium: 40 }} stroke={20} />
					<div class="leading-[100%]">
						<span class="text-xs"> 80% reviews says it's </span>
						<span class="brutal-text text-xs after:!bg-red-200 !ml-0 text-red-800">Hard</span>
					</div>
				</div>
				<button
					class="aspect-square w-10 bg-amber-300 brutal-border !border-[3px] rounded-full flex items-center justify-center hover:bg-amber-400"
					aria-label="Enroll Now"
					title="Enroll Now"
				>
					<i class="fasds fa-arrow-right-long"></i>
				</button>
			</div>
		</div>
	</div>
</div>

<style lang="postcss">
	@import 'tailwindcss/theme' theme(reference);

	.course-item {
		&::before {
			@apply bg-amber-300 scale-105 skew-x-[var(--degY)] skew-y-[var(--degX)];
		}
		&::after {
			@apply bg-indigo-300 scale-104 skew-y-[var(--degY)] skew-x-[var(--degX)];
		}
		&::after,
		&::before {
			content: '';
			@apply rounded-tl-3xl rounded-br-3xl size-full absolute top-0 left-0 -z-1;
		}

		button::after {
		}
	}
</style>
