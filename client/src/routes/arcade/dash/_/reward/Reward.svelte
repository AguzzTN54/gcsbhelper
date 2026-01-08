<script lang="ts">
	import { Swiper } from 'swiper';
	import { arcadeRewards as rewards } from '$lib/data/config';
	import { arcadeStats, loadSteps, profileReady } from '$lib/stores/app.svelte';
	import rewardBg from '$img/rewards.jpg';
	import Skeleton from '$reusable/Skeleton.svelte';

	const ready = $derived($profileReady && loadSteps.enrollmentdata && loadSteps.courselist);
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

<div class="relative pt-7">
	{#if !ready}
		<Skeleton class="h-1.5 w-full translate-y-10 rounded-full" />
	{/if}

	<div class="swiper w-full" bind:this={swiperEl}>
		<div class="swiper-wrapper w-full">
			{#each rewardKeys as key, i (key)}
				<div
					class="swiper-slide group !w-1/2 max-w-[250px] select-none lg:!w-1/3 xl:!w-1/4"
					class:active={i === initIndex}
				>
					{#if !ready}
						<div class="mt-14 pb-12">
							<Skeleton class="aspect-[5/4] w-full" />
						</div>
					{:else}
						<div class="flex flex-col items-center pb-12">
							<div class="relative mt-10 flex h-2 w-full items-center justify-center">
								{#if i < rewardKeys.length - 1}
									<div
										style="box-shadow: 2px 2px 0 #d1d5db;"
										class:bg-indigo-700={i < initIndex}
										class="bar absolute top-1/2 left-1/2 h-1/2 w-[calc(100%+25px)] -translate-y-1/2 bg-gray-200"
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
									class="dot relative size-4 cursor-pointer rounded-full bg-gray-400 hover:bg-gray-900"
									class:bg-indigo-700={i < initIndex}
								>
									<h4
										class="absolute top-0 left-1/2 w-fit -translate-x-1/2 -translate-y-[calc(100%+.25rem)] cursor-grab text-sm whitespace-nowrap"
									>
										{#if initIndex === 0 && i === initIndex}
											<span class=""> Start Here </span>
										{:else if i === initIndex}
											<span class="brutal-text text-base after:!bg-sky-200">
												Your Reward <i class="fasdl fa-gift text-xl text-rose-200"></i>
											</span>
										{:else if i > initIndex}
											<span class="bg-gray-300 p-1 text-gray-800"> {rewards[key]} </span>
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
									class="reward-item brutal-border relative mt-5 w-full bg-indigo-100 p-1 opacity-35 group-[.active]:bg-indigo-300"
								>
									<div
										class="absolute top-0 left-1/2 -z-1 -translate-x-1/2 -translate-y-[calc(50%+3px)]"
									>
										<i class="fasdl fa-caret-up text-xl"></i>
									</div>
									<h4 class="p-1 text-center">
										<span class="uppercase"> Arcade {key}</span>
									</h4>
									<div
										class="relative z-1 translate-y-1 -skew-2 overflow-hidden rounded-tl-3xl rounded-br-3xl border-2 border-indigo-700 bg-amber-300"
									>
										<div class="aspect-[5/3.2] w-full scale-97 skew-2 bg-gray-100">
											<div
												class="reward-image size-full"
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
			@apply flex size-6 items-center justify-center bg-amber-500;
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
