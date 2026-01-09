<script lang="ts">
	import { preventDefault } from 'svelte/legacy';
	import { copyToClipboard } from '$lib/helpers/copy';
	import { POINT_TABLE } from '$lib/helpers/calculator-arcade';
	import { pushToast } from '$reusable/Toast/Toasts.svelte';
	import { loadSteps } from '$lib/stores/app.svelte';
	import { createCountdown } from '$lib/stores/countdown.svelte';
	import dayjs from '$lib/helpers/dateTime';
	// import Donut from '$reusable/Donut.svelte';
	import Skeleton from '$reusable/Skeleton.svelte';
	import BadgeImage from './BadgeImage.svelte';
	// import RateInput from './RateInput.svelte';
	import LabelPicker from './LabelPicker.svelte';
	import { showLabs } from '../../../_/ModalLabs.svelte';
	import { skillbase } from '$lib/data/config';

	type Props = { data?: App.CourseItem; loading?: boolean };
	const { data, loading }: Props = $props();
	const {
		id,
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
		labs,
		progress,
		token,
		courseid,
		badgeid,
		enddate,
		earndate,
		stats
	} = data || {};

	const { diff_easy, diff_hard, diff_medium, enrollment_count } = stats || {};
	// const diff = { easy: diff_easy || 0, medium: diff_medium || 0, hard: diff_hard || 0 };
	// const diffColor = {
	// 	easy: 'after:!bg-green-200 text-green-800',
	// 	medium: 'after:!bg-amber-200 text-amber-800',
	// 	hard: 'after:!bg-red-200 text-red-800'
	// 	// introductory: 'after:!bg-green-200 text-green-800',
	// 	// intermediate: 'after:!bg-yellow-200 text-yellow-800',
	// 	// advance: 'after:!bg-red-200 text-red-800'
	// };

	// const total = diff.easy + diff.hard + diff.medium;
	// let highestKey: keyof typeof diff = 'easy';
	// let highestVal = diff.easy;
	// const donutVal: Record<string, number> = {};
	// for (const [key, val] of Object.entries(diff) as [keyof typeof diff, number][]) {
	// 	donutVal[key] = total > 0 ? (val / total) * 100 : 0;
	// 	if (diff[key] > highestVal) {
	// 		highestKey = key;
	// 		highestVal = diff[key];
	// 	}
	// }
	// const feedback = {
	// 	rate: highestKey,
	// 	percent: total > 0 ? Number((highestVal / total).toFixed(2)) * 100 : 0
	// };

	const { label, rating } = userinput || {};
	const courseType = type || label || 'unknown';
	const isgame = ['wmp', 'trivia', 'game'].includes(courseType);
	const coursePoint = type ? (point ?? 0) : (POINT_TABLE[courseType] ?? 0);
	const cid = badgeid ? `g${badgeid}` : `c${courseid}`;

	const { arcade, facilitator } = validity || {};
	const isOutPeriode = !arcade && !facilitator && earned;
	const expiryTimer = createCountdown(enddate);
	const countdown = $derived.by(() => {
		const { d, h, m, s } = $expiryTimer;
		const time = `${d}d ${h}h ${m}m ${s}s`;
		return time;
	});

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
	class="brutal-border course-item group relative rounded-tl-3xl rounded-br-3xl bg-gray-100"
	style="{skewDeg()};"
>
	{#if coursePoint > 0 && !isOutPeriode}
		<div
			class="absolute top-2 left-2 z-1 flex min-w-8 items-center justify-center rounded bg-lime-200/90 p-1 text-sm text-lime-800"
		>
			<span> +{coursePoint} </span>
		</div>
	{/if}
	{#if earned}
		<div
			class="pointer-events-none absolute top-0 left-0 z-10 size-full scale-110 bg-gray-100/75 group-[:hover]:opacity-0"
		></div>
	{/if}

	{#snippet topLabel(text: string, className: string)}
		<span
			class:!top-7={label && !type}
			class="absolute top-0 right-0 z-10 translate-x-1/5 translate-y-1/3 -skew-2 px-2 py-1 text-xs {className}"
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
		{:else if isExpired && type}
			{@render topLabel('Expired!', 'bg-rose-700 text-white')}
		{:else if isLessThanAWeek(enddate)}
			{@render topLabel(countdown, 'bg-amber-600 text-white')}
		{/if}

		{#if validity?.facilitator && courseType !== 'unknown'}
			{@render topLabel('Facilitator', '!top-5 !-right-1 bg-indigo-800 text-white')}
		{/if}
	{/if}

	<div
		class="size-full overflow-hidden rounded-tl-[20px] rounded-br-3xl"
		class:grayscale-100={isExpired && !earned}
	>
		<div class="relative aspect-video w-full overflow-hidden rounded-b-xl border-b-4 bg-gray-400">
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

			<!-- {#if earned}
				<RateInput {rating} courseid={cid} />
			{/if} -->

			{#if earned && earndate}
				<div
					class="absolute bottom-0 left-0 w-full bg-green-200 p-0.5 text-center text-xs text-green-700"
				>
					Earned at <span class="font-semibold">
						{dayjs(earndate).format('DD MMM YYYY')}
					</span>
				</div>
			{:else if isgame && token}
				<div
					class="absolute bottom-0 left-0 w-full bg-blue-200/90 p-0.5 text-center text-sm text-blue-900"
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
						{#if type === 'labfree'}
							<i class="fasdl fa-puzzle text-indigo-300"></i>
						{:else}
							<i class="fasdl fa-flask text-indigo-400"></i>
						{/if}
						<span class="text-gray-600">{totallab}</span>
					{/if}

					<i class="fasdl fa-users ml-2 inline-block text-indigo-400"></i>
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
					<span class="brutal-text !mx-1 text-[10px] text-sky-800 after:!bg-sky-200">
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
				<Skeleton class="h-6 w-full rounded-lg" />
				<Skeleton class="mt-2 h-6 w-7/12 rounded-lg" />
			{:else}
				<div class="h-12">
					<h3 class="text-overflow text-xl leading-[120%]" {title} style="--line-number:2">
						{title}
					</h3>
				</div>
			{/if}

			<div class="flex items-end justify-between pt-1">
				{#if loading}
					<div>
						<Skeleton class="size-5 rounded-full" />
					</div>
					<div class="flex w-full rounded pr-3 pl-2">
						<Skeleton class="h-4	 w-11/12" />
					</div>
				{:else}
					<!-- {@const { rate, percent } = feedback || {}} -->
					<div class="flex w-[calc(100%-3rem)] flex-col justify-end">
						<!-- <div class="flex text-gray-600 gap-2">
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
						</div> -->

						{#if type === 'skill' && typeof progress === 'number' && (labs?.length || 0) > 0}
							<div class="flex justify-between pb-0.5 text-xs font-medium text-gray-500">
								<button
									class="group"
									aria-label="Lab info"
									title="Show Shared Labs"
									onclick={() => showLabs(courseid || 0, labs, title)}
								>
									<span> Estimated progress </span>
									<i
										class="fasdl fa-info size-4 rounded-full border group-[button:hover]:bg-sky-300"
									></i>
								</button>
								<span> {progress}/{labs?.length || 0} </span>
							</div>
							<div class="flex items-center gap-0.5 text-gray-600">
								{#each labs || [] as _, i (i)}
									<div
										class:bg-slate-300={i >= progress}
										class="h-1 w-full rounded-full bg-amber-400"
									></div>
								{/each}
							</div>
						{/if}
					</div>
				{/if}

				{#if loading}
					<Skeleton class="aspect-square size-10 rounded-full" />
				{:else}
					{@const path = isgame ? 'games' : 'course_templates'}
					<a
						onclick={courseid && courseid > 0 ? undefined : preventDefault(() => {})}
						href="{skillbase}/{path}/{courseid}"
						target="_blank"
						class="brutal-border flex aspect-square w-10 items-center justify-center rounded-full !border-[3px] bg-amber-300 hover:bg-amber-400"
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
			@apply scale-105 skew-x-[var(--degY)] skew-y-[var(--degX)] bg-amber-300;
		}
		&::after {
			@apply scale-104 skew-x-[var(--degX)] skew-y-[var(--degY)] bg-indigo-300;
		}
		&::after,
		&::before {
			content: '';
			@apply absolute top-0 left-0 -z-1 size-full rounded-tl-3xl rounded-br-3xl;
		}

		button::after {
		}
	}

	.label_skill {
		@apply text-amber-800 after:!bg-amber-200;
	}
	.label_game {
		@apply text-indigo-800 after:!bg-indigo-200;
	}
	.label_labfree {
		@apply text-purple-800 after:!bg-purple-200;
	}
	.label_unknown {
		@apply hidden;
	}
</style>
