<script lang="ts">
	import { Swiper } from 'swiper';
	let swiperEl = $state<HTMLElement>();
	let swiper = $state<Swiper>();
	// let index = $state(0);
	let initIndex = 2;
	const rewards = Array(6);

	$effect(() => {
		if (!swiperEl) return;
		swiper = new Swiper(swiperEl, {
			speed: 400,
			initialSlide: initIndex,
			centeredSlides: initIndex > 0 && initIndex < rewards.length - 1,
			centeredSlidesBounds: true,
			grabCursor: true,
			spaceBetween: 25,
			slidesPerView: 'auto',
			touchStartForcePreventDefault: true
			// on: { activeIndexChange: (s) => (index = s.activeIndex) }
		});
		return () => swiper?.destroy();
	});
</script>

<div class="pt-7">
	<div class="swiper w-full" bind:this={swiperEl}>
		<div class="swiper-wrapper w-full">
			{#each rewards as data, i}
				<div
					class="swiper-slide !w-1/2 lg:!w-1/3 xl:!w-1/4 max-w-[250px] group select-none"
					class:active={i === initIndex}
				>
					<div class="flex flex-col items-center pb-0">
						<div class="flex h-2 items-center relative justify-center mt-9 w-full">
							{#if i < rewards.length - 1}
								<div
									class:bg-indigo-700={i < initIndex}
									class="bar absolute top-1/2 left-1/2 -translate-y-1/2 h-1/2 w-[calc(100%+25px)] bg-gray-300"
								></div>
							{/if}
							<div
								class="rounded-full size-4 relative dot bg-gray-400 hover:bg-gray-900 cursor-pointer"
								class:bg-indigo-700={i < initIndex}
							>
								{#if i === initIndex}
									<h4
										class="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-[calc(100%+.25rem)] w-fit whitespace-nowrap text-sm cursor-grab"
									>
										{#if i > 0}
											<span class="brutal-text after:!bg-sky-200"> Your Reward </span>
										{:else}
											<span class=""> Start Here </span>
										{/if}
									</h4>
									{#if i > 0}
										<i class="fasds fa-check text-white"></i>
									{/if}
								{/if}
							</div>
						</div>

						{#if i > 0}
							<div
								class="reward-item mt-5 w-full p-1 bg-indigo-100 brutal-border group-[.active]:bg-indigo-300 opacity-35 relative"
							>
								<div
									class="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-[calc(50%+3px)] -z-1"
								>
									<i class="fasdl fa-caret-up text-xl"></i>
								</div>
								<h4 class="text-center p-1">
									<span class="brutal-text after:!bg-amber-100 text-sm"> Arcade Ranger</span>
								</h4>
								<div
									class="overflow-hidden -skew-2 bg-amber-300 border-2 translate-y-1 border-indigo-700 rounded-tl-3xl rounded-br-3xl relative z-1"
								>
									<div class="w-full aspect-[5/3.2] bg-gray-100 skew-2 scale-97"></div>
								</div>
							</div>
						{/if}
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>

<style lang="postcss">
	@import 'tailwindcss/theme' theme(reference);

	.active {
		.dot {
			@apply bg-amber-500 size-6 flex justify-center items-center;
		}
		.reward-item {
			@apply opacity-100;
		}
	}

	.swiper-slide .reward-item:hover {
		@apply opacity-100;
	}
</style>
