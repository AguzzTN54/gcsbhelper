<script lang="ts">
	import { preventDefault } from 'svelte/legacy';
	import { copyToClipboard } from '$lib/helpers/copy';
	import { POINT_TABLE } from '$lib/helpers/calculator-arcade';
	import { pushToast } from '$reusable/Toast/Toasts.svelte';
	import dayjs from '$lib/helpers/dateTime';
	import Donut from '$reusable/Donut.svelte';
	import Skeleton from '$reusable/Skeleton.svelte';
	import BadgeImage from './BadgeImage.svelte';
	import RateInput from './RateInput.svelte';
	import LabelPicker from './LabelPicker.svelte';
	import { loadSteps } from '$lib/stores/app.svelte';

	type Props = { data?: App.CourseItem; loading?: boolean };
	const { data, loading }: Props = $props();
	const {
		point,
		badgeurl,
		fasttrack,
		title,
		earned,
		validity,
		userinput,
		totallab,
		type,
		// level,
		token,
		courseid,
		badgeid,
		enddate,
		earndate,
		stats
	} = data || {};

	const { diff_easy, diff_hard, diff_medium, enrollment_count } = stats || {};
	const diff = { easy: diff_easy || 0, medium: diff_medium || 0, hard: diff_hard || 0 };
	const diffColor = {
		easy: 'after:!bg-green-200 text-green-800',
		medium: 'after:!bg-amber-200 text-amber-800',
		hard: 'after:!bg-red-200 text-red-800'
		// introductory: 'after:!bg-green-200 text-green-800',
		// intermediate: 'after:!bg-yellow-200 text-yellow-800',
		// advance: 'after:!bg-red-200 text-red-800'
	};

	const total = diff.easy + diff.hard + diff.medium;
	let highestKey: keyof typeof diff = 'easy';
	let highestVal = diff.easy;
	const donutVal: Record<string, number> = {};
	for (const [key, val] of Object.entries(diff) as [keyof typeof diff, number][]) {
		donutVal[key] = total > 0 ? (val / total) * 100 : 0;
		if (diff[key] > highestVal) {
			highestKey = key;
			highestVal = diff[key];
		}
	}
	const feedback = {
		rate: highestKey,
		percent: total > 0 ? Number((highestVal / total).toFixed(2)) * 100 : 0
	};

	const { label, rating } = userinput || {};
	const courseType = type || label || 'unknown';
	const isgame = ['wmp', 'trivia', 'game'].includes(courseType);
	const coursePoint = type ? (point ?? 0) : (POINT_TABLE[courseType] ?? 0);
	const cid = badgeid ? `g${badgeid}` : `c${courseid}`;

	const { arcade, facilitator } = validity || {};
	const isOutPeriode = !arcade && !facilitator && earned;
	const isExpired = !enddate ? false : dayjs(enddate).isBefore(new Date());
	const isLessThanAWeek = (enddate?: string | dayjs.Dayjs | Date) => {
		if (isExpired || !enddate) return false;
		const now = dayjs();
		const end = dayjs(enddate);
		return end.isBefore(now.add(7, 'day')) && end.isAfter(now);
	};
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
	class="brutal-border relative course-item bg-gray-100 rounded-tl-3xl rounded-br-3xl group"
	style="{skewDeg()};"
>
	{#if coursePoint > 0 && !isOutPeriode}
		<div
			class="absolute top-2 left-2 bg-lime-200/90 z-1 p-1 text-sm rounded text-lime-800 min-w-8 flex items-center justify-center"
		>
			<span> +{coursePoint} </span>
		</div>
	{/if}
	{#if earned}
		<div
			class="absolute size-full top-0 left-0 bg-gray-100/75 z-10 scale-110 group-[:hover]:opacity-0 pointer-events-none"
		></div>
	{/if}

	{#snippet topLabel(text: string, className: string)}
		<span
			class:!top-7={label && !type}
			class="absolute top-0 right-0 py-1 z-10 px-2 text-xs -skew-2 translate-y-1/3 translate-x-1/5 {className}"
		>
			{text}
		</span>
	{/snippet}

	{#if !loading}
		{#if !type}
			<LabelPicker courseid={cid} {label} />
		{/if}

		{#if isOutPeriode && (type || (label && !type))}
			{@render topLabel('Out of period', 'bg-rose-700 text-white')}
		{:else if earned && type}
			{@render topLabel('Completed', 'bg-purple-800 text-white !right-1')}
		{:else if isExpired}
			{@render topLabel('Expired!', 'bg-rose-700 text-white')}
		{:else if isLessThanAWeek(enddate)}
			{@render topLabel('Expiring Soon!', 'bg-amber-600 text-white')}
		{/if}

		{#if validity?.facilitator && courseType !== 'unknown'}
			{@render topLabel('Facilitator', '!top-5 !-right-1 bg-indigo-800 text-white')}
		{/if}
	{/if}

	<div
		class="size-full rounded-tl-[20px] rounded-br-3xl overflow-hidden"
		class:grayscale-100={isExpired && !earned}
	>
		<div class="w-full aspect-video bg-gray-400 rounded-b-xl border-b-4 overflow-hidden relative">
			{#if loading}
				<Skeleton class="size-full" />
			{:else}
				<BadgeImage
					{badgeurl}
					{isgame}
					type={courseType}
					label={labeltxt[isgame ? 'game' : courseType]}
				/>
			{/if}

			{#if earned}
				<RateInput {rating} courseid={cid} />
			{/if}

			{#if earned && earndate}
				<div
					class="bg-green-200 text-green-700 w-full p-0.5 absolute bottom-0 left-0 text-xs text-center"
				>
					Earned at <span class="font-semibold">
						{dayjs(earndate).format('DD MMM YYYY')}
					</span>
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
				<div class="inline text-xs">
					{#if loading}
						<i class="fasdl fa-flask text-indigo-400"></i>
						<Skeleton class="inline-block h-3.5 w-8 rounded-full" />
					{:else if (totallab || 0) > 0}
						<i class="fasdl fa-flask text-indigo-400"></i>
						<span class="text-gray-600">{totallab}</span>
					{/if}

					<i class="fasdl fa-users text-indigo-400 inline-block ml-2"></i>
					{#if loading}
						<Skeleton class="inline-block h-3.5 w-12 rounded-full" />
					{:else if !loadSteps.stats}
						<Skeleton class="inline-block h-3.5 w-7 rounded-full" />
					{:else}
						<span class="text-gray-600">{enrollment_count}</span>
					{/if}
				</div>

				<span class="brutal-text !mx-1 text-[10px] label_{isgame ? 'game' : courseType}">
					{labeltxt[isgame ? 'game' : courseType]}
				</span>
				{#if fasttrack}
					<span class="brutal-text after:!bg-sky-200 text-sky-800 !mx-1 text-[10px]">
						<i class="fasdl fa-bolt"></i> Fast Track
					</span>
				{/if}

				<!-- {#if level}
					<span
						class="brutal-text capitalize !mx-1 text-[10px] {diffColor[
							level as keyof typeof diffColor
						]}"
					>
						{level}
					</span>
				{/if} -->
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
					{@const { rate, percent } = feedback || {}}
					<div class="flex items-center text-gray-600 gap-2">
						<Donut size="1.2rem" values={donutVal} stroke={20} />

						{#if percent > 0}
							<div class="leading-[100%]">
								<span class="text-xs"> {percent}% reviews says it's </span>
								<span class="brutal-text text-xs !ml-0 {diffColor[rate]}">{rate}</span>
							</div>
						{:else}
							<div class="leading-[100%]">
								<span class="text-xs"> No User Review Yet </span>
							</div>
						{/if}
					</div>
				{/if}

				{#if loading}
					<Skeleton class="size-10 rounded-full aspect-square" />
				{:else}
					{@const path = isgame ? 'games' : 'course_templates'}
					<a
						onclick={courseid && courseid > 0 ? undefined : preventDefault(() => {})}
						href="https://www.cloudskillsboost.google/{path}/{courseid}"
						target="_blank"
						class="aspect-square w-10 bg-amber-300 brutal-border !border-[3px] rounded-full flex items-center justify-center hover:bg-amber-400"
						aria-label="Enroll Now"
						title="Enroll Now"
					>
						<i class="fasds fa-arrow-right-long"></i>
					</a>
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
	.label_labfree {
		@apply after:!bg-purple-200 text-purple-800;
	}
	.label_unknown {
		@apply hidden;
	}
</style>
