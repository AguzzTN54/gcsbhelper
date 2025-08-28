<script lang="ts">
	import { Swiper } from 'swiper';
	import { arcadeRewards as rewards } from '$lib/config';
	import { arcadeStats, profileReady } from '$lib/stores/app-store';
	import rewardBg from '$img/rewards.webp';
	import Skeleton from '$reusable/Skeleton.svelte';

	let swiperEl = $state<HTMLElement>();
	let swiper = $state<Swiper>();
	const rewardKeys = Object.keys(rewards) as (keyof typeof rewards)[];
	const initIndex = $derived.by(() => {
		const { tier } = $arcadeStats || {};
		if (!tier) return 0;
		const index = Object.keys(rewards).findIndex((k) => k === tier);
		return index || 0;
	});

	const dinstanceBetweenPoint = $derived.by(() => {
		const i = initIndex;
		const startPoint = i < 1 ? 0 : rewards[rewardKeys[i]];
		const currentPoint = $arcadeStats?.total || 0;
		const endPoint =
			i >= rewardKeys.length
				? rewards[rewardKeys[rewardKeys.length - 1]]
				: rewards[rewardKeys[i + 1]];

		const front = currentPoint - startPoint;
		const back = endPoint - currentPoint;
		const percentage = (front / (front + back)) * 100;
		return percentage;
	});

	$effect(() => {
		if (!swiperEl) return;
		swiper = new Swiper(swiperEl, {
			speed: 400,
			initialSlide: initIndex,
			centeredSlides: initIndex > 0 && initIndex < rewardKeys.length - 1,
			centeredSlidesBounds: true,
			grabCursor: true,
			spaceBetween: 25,
			slidesPerView: 'auto',
			touchStartForcePreventDefault: true
		});
		return () => swiper?.destroy();
	});
</script>

<div class="pt-7 relative">
	{#if !$profileReady}
		<Skeleton class="w-full h-1.5 rounded-full translate-y-10" />
	{/if}

	<div class="swiper w-full" bind:this={swiperEl}>
		<div class="swiper-wrapper w-full">
			{#each rewardKeys as key, i (key)}
				<div
					class="swiper-slide !w-1/2 lg:!w-1/3 xl:!w-1/4 max-w-[250px] group select-none"
					class:active={i === initIndex}
				>
					{#if !$profileReady}
						<div class="mt-14 pb-12">
							<Skeleton class="w-full aspect-[5/4]" />
						</div>
					{:else}
						<div class="flex flex-col items-center pb-12">
							<div class="flex h-2 items-center relative justify-center mt-10 w-full">
								{#if i < rewardKeys.length - 1}
									<div
										style="box-shadow: 2px 2px 0 #d1d5db;"
										class:bg-indigo-700={i < initIndex}
										class="bar absolute top-1/2 left-1/2 -translate-y-1/2 h-1/2 w-[calc(100%+25px)] bg-gray-200"
									>
										{#if i === initIndex}
											<div
												class="h-full w-[var(--wd)] bg-indigo-700"
												style="--wd:{dinstanceBetweenPoint}%;"
											></div>
										{/if}
									</div>
								{/if}
								<div
									class="rounded-full size-4 relative dot bg-gray-400 hover:bg-gray-900 cursor-pointer"
									class:bg-indigo-700={i < initIndex}
								>
									<h4
										class="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-[calc(100%+.25rem)] w-fit whitespace-nowrap text-sm cursor-grab"
									>
										{#if initIndex === 0 && i === initIndex}
											<span class=""> Start Here </span>
										{:else if i === initIndex}
											<span class="brutal-text text-base after:!bg-sky-200">
												Your Reward <i class="fasdl fa-gift text-rose-200 text-xl"></i>
											</span>
										{:else if i > initIndex}
											<span class="bg-gray-300 text-gray-800 p-1"> {rewards[key]} </span>
										{/if}
									</h4>

									{#if i === initIndex}
										<i class="fasds fa-check text-white"></i>
									{/if}
								</div>
							</div>

							{#if i > 0}
								<div
									style="box-shadow: 6px 6px 0 #d1d5db;"
									class="reward-item mt-5 w-full p-1 bg-indigo-100 brutal-border group-[.active]:bg-indigo-300 opacity-35 relative"
								>
									<div
										class="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-[calc(50%+3px)] -z-1"
									>
										<i class="fasdl fa-caret-up text-xl"></i>
									</div>
									<h4 class="text-center p-1">
										<span class="uppercase"> Arcade {key}</span>
									</h4>
									<div
										class="overflow-hidden -skew-2 bg-amber-300 border-2 translate-y-1 border-indigo-700 rounded-tl-3xl rounded-br-3xl relative z-1"
									>
										<div class="w-full aspect-[5/3.2] bg-gray-100 skew-2 scale-97">
											<div
												class="size-full reward-image"
												style="--url:url({rewardBg});--index:{i}"
											></div>
										</div>
									</div>
								</div>
							{/if}
						</div>
					{/if}
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

	.reward-image {
		background-image: var(--url);
		background-size: 500%;
		background-position: calc((var(--index) - 1) * 25%) 54%;
	}
</style>
