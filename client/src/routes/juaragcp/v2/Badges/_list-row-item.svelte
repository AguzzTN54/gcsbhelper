<script>
	const { i = 0 } = $props();
</script>

<div
	class="flex items-center border-b border-[var(--color-secondary)] px-2 py-4 transition-colors duration-300 hover:bg-[var(--color-secondary)]/10"
>
	<div class="pr-3 sm:pr-5 sm:pl-2">
		<span>{i + 1}</span>
	</div>
	<div class="">
		<a href="/#" class="inline-block leading-[130%] font-semibold hover:underline">
			Iki Contoh badges Iki Contoh badges Iki Contoh
			<i class="fasds fa-up-right-from-square text-xs"></i>
		</a>
		<div class="text-xs">Earned 10 Jan 2025</div>
	</div>
	<div class="ml-auto">
		<span class="inline-block bg-lime-200 px-2 text-xs whitespace-nowrap text-lime-900">
			Completed <i class="fasds fa-check"></i>
		</span>
	</div>
</div>
