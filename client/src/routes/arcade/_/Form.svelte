<script>
	import Button from '../../_global/reusable/Button.svelte';
</script>

<div class="flex w-full py-5 flex-col h-full items-center justify-center">
	<div class="input relative rounded-full w-10/12 sm:w-[60%]">
		<input
			type="text"
			class="brutal-border !border-[4px] bg-gray-100 rounded-full h-16 px-5 placeholder:font-medium w-full outline-0"
			placeholder="Input Public Profile URL"
		/>
		<span
			class="absolute top-0 right-0 text-[1.75rem] md:text-[2.5rem] translate-x-2/3 -translate-y-1/2"
		>
			<i class="fasdl fa-sparkles text-indigo-400"></i>
		</span>
	</div>

	<Button>
		Calculate Points <i class="fasdl fa-stars text-rose-300"></i>
	</Button>
</div>

<style lang="postcss">
	@import 'tailwindcss/theme' theme(reference);

	.input::after,
	.input::before {
		content: '';
		@apply absolute top-0 left-0 size-full bg-indigo-400 block -z-1 skew-y-[2deg] rounded-full;
	}
	.input::after {
		@apply skew-y-[1.5deg] bg-amber-300;
	}
</style>
