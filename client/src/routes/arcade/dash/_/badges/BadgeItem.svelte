<script lang="ts">
	import { copyToClipboard } from '$lib/helpers/copy';
	import { pushToast } from '$reusable/Toast/Toasts.svelte';
	import Donut from '$reusable/Donut.svelte';
	import Skeleton from '$reusable/Skeleton.svelte';
	import BadgeImage from './BadgeImage.svelte';
	import RateInput from './RateInput.svelte';

	type Props = { data?: App.CourseItem; loading?: boolean };
	const { data, loading }: Props = $props();

	const { badgeurl, fasttrack, title, earned, validity, totallab, type, token } = data || {};
	const isgame = ['wmp', 'trivia', 'game'].includes(type || '');
	const rated = false;

	const labeltxt: Record<string, string> = {
		all: 'All',
		game: 'Arcade Games',
		skill: 'Skill Badge',
		fasttrack: 'Fast Track',
		labfree: 'Lab-Free',
		unknown: 'Unknown'
	};

	const skewDeg = () => {
		const degX = Math.random() * 4 - 2;
		const degY = Math.random() * 4 - 2;
		return `--degX:${degX.toFixed(2)}deg;--degY:${degY.toFixed(2)}deg;`;
	};

	const copy = async (text: string) => {
		try {
			await copyToClipboard(text);
			pushToast({ message: 'Copied to Clipboard', type: 'success' });
		} catch {}
	};
</script>

<div
	class:earned
	class:rated
	class="brutal-border relative course-item bg-gray-100 rounded-tl-3xl rounded-br-3xl group"
	style="{skewDeg()};"
>
	{#if earned}
		<div
			class="absolute size-full top-0 left-0 bg-gray-100/75 z-10 scale-120 group-[:hover]:opacity-0 pointer-events-none"
		></div>
	{/if}

	{#if !validity?.arcade && !validity?.facilitator && earned}
		<span
			class="absolute top-0 right-0 py-1 z-10 px-2 text-xs bg-rose-700 text-white -skew-2 translate-y-1/3 translate-x-1/5"
		>
			Out of period
		</span>
	{:else if earned}
		<span
			class="absolute top-0 right-0 py-1 z-10 px-2 text-xs bg-purple-800 text-white -skew-2 translate-y-1/3 translate-x-1/5"
		>
			Completed
		</span>
	{/if}

	<div class="size-full rounded-tl-[20px] rounded-br-3xl overflow-hidden">
		<div class="w-full aspect-video bg-gray-400 rounded-b-xl border-b-4 overflow-hidden relative">
			{#if loading}
				<Skeleton class="size-full" />
			{:else}
				<BadgeImage
					{badgeurl}
					type={type || 'unknown'}
					{isgame}
					label={labeltxt[isgame ? 'game' : type || '']}
				/>
			{/if}

			{#if !rated && earned}
				<RateInput />
			{:else if earned}
				<div
					class="bg-amber-200 text-amber-700 w-full p-0.5 absolute bottom-0 left-0 text-xs text-center"
				>
					Your rating: <button class="underline font-semibold">Intermediate</button>
				</div>
			{:else if isgame && token}
				<div
					class="bg-blue-200/90 text-blue-900 w-full p-0.5 absolute bottom-0 left-0 text-sm text-center"
				>
					Token:
					<button
						aria-label="Copy"
						title="Copy"
						class="font-bold select-text"
						onclick={() => copy(token)}
					>
						{token}
						<i class="fasdl fa-copy text-transparent"></i>
					</button>
				</div>
			{/if}
		</div>
		<div class="p-2">
			<div class="block pt-1 pb-2">
				<div class="inline-block text-xs">
					<i class="fasdl fa-flask text-indigo-400"></i>
					{#if loading}
						<Skeleton class="inline-block h-3.5 w-8 rounded-full" />
					{:else}
						<span class="text-gray-600">{totallab}</span>
					{/if}

					<i class="fasdl fa-users text-indigo-400 inline-block ml-2"></i>
					{#if loading}
						<Skeleton class="inline-block h-3.5 w-12 rounded-full" />
					{:else}
						<span class="text-gray-600">1209</span>
					{/if}
				</div>

				<span class="brutal-text !mx-1 text-[10px] label_{isgame ? 'game' : type || 'unknown'}">
					{labeltxt[isgame ? 'game' : type || '']}
				</span>
				{#if fasttrack}
					<span class="brutal-text after:!bg-sky-200 text-sky-800 !mx-1 text-[10px]">
						<i class="fasdl fa-bolt"></i> Fast Track
					</span>
				{/if}
			</div>

			{#if loading}
				<Skeleton class="w-full h-6 rounded-lg" />
				<Skeleton class="w-7/12 mt-2 h-6 rounded-lg" />
			{:else}
				<h3 class="text-xl leading-[120%] text-overflow" {title} style="--line-number:2">
					{title}
				</h3>
			{/if}

			<div class="flex justify-between items-center pt-1">
				{#if loading}
					<div>
						<Skeleton class="rounded-full size-5" />
					</div>
					<div class="flex pl-2 pr-3 rounded w-full">
						<Skeleton class="w-11/12	 h-4" />
					</div>
				{:else}
					<div class="flex items-center text-gray-600 gap-2">
						<Donut size="1.2rem" values={{ easy: 50, hard: 10, medium: 40 }} stroke={20} />
						<div class="leading-[100%]">
							<span class="text-xs"> 80% reviews says it's </span>
							<span class="brutal-text text-xs after:!bg-red-200 !ml-0 text-red-800">Hard</span>
						</div>
					</div>
				{/if}

				{#if loading}
					<Skeleton class="size-10 rounded-full aspect-square" />
				{:else}
					<button
						class="aspect-square w-10 bg-amber-300 brutal-border !border-[3px] rounded-full flex items-center justify-center hover:bg-amber-400"
						aria-label="Enroll Now"
						title="Enroll Now"
					>
						<i class="fasds fa-arrow-right-long"></i>
					</button>
				{/if}
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

	.label_skill {
		@apply after:!bg-amber-200 text-amber-800;
	}
	.label_game {
		@apply after:!bg-indigo-200 text-indigo-800;
	}
	.label_unknown {
		@apply hidden;
	}
</style>
