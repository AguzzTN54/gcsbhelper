<script lang="ts">
	import dayjs from '$lib/helpers/dateTime';
	import { loadSteps } from '$lib/stores/app.svelte';
	import Skeleton from '$reusable/Skeleton.svelte';
	import Tooltip from '$reusable/Tooltip';
	import BadgeImage from './_badge-image.svelte';

	const { data }: { data: App.JuaraBadge } = $props();
	const { title, courseid, validity, date, badgeurl, required, totallab, enrollment_count, type } =
		$derived(data || {});
</script>

<div
	class:earned={date}
	class:required
	class:invalid={!validity && date}
	class="badgeitem relative w-full rounded-3xl border-6 border-[var(--color-secondary)] bg-[var(--color-primary)] pb-4 transition-colors duration-300 hover:border-[var(--color-third)]"
>
	{#snippet label(text: string, classname: string)}
		<span
			class="absolute top-0 right-0 z-5 translate-x-4 translate-y-1/3 rounded-full px-3 py-1 text-xs font-semibold text-green-50 {classname}"
		>
			{text}
		</span>
	{/snippet}

	{#if date && validity}
		{@render label('Complete', 'bg-green-700')}
	{:else if date && !validity}
		{@render label('Out of Period', 'bg-red-700')}
	{/if}

	<div
		class="relative aspect-video w-full overflow-hidden rounded-t-2xl bg-[var(--color-secondary)]/10"
	>
		<BadgeImage {badgeurl} />
		{#if date}
			<span
				class:!bg-[#ceddd1]={date && validity}
				class="absolute bottom-0 left-0 z-1 block w-full bg-[#ddd6ce] px-3 py-1 text-center text-xs font-semibold text-[var(--color-secondary)]"
			>
				Earned: {dayjs(date).format('DD MMMM YYYY')}
			</span>
		{/if}
	</div>

	<div class="duo px-4 py-1">
		<div class="inline text-xs">
			{#if type === 'skill'}
				<i class="fasds fa-flask opacity-50"></i>
				<span>{totallab}</span>
			{:else}
				<Tooltip class="inline-block">
					{#snippet popup()}
						<span>Total Labs & Quizzes </span>
					{/snippet}
					<i class="fasds fa-puzzle opacity-50"></i>
					<span>{totallab}</span>
				</Tooltip>
			{/if}

			<i class="fasds fa-users ml-2 inline-block opacity-50"></i>
			{#if !loadSteps.stats}
				<Skeleton class="inline-block h-3.5 w-7 rounded-full" />
			{:else}
				<span>{enrollment_count}</span>
			{/if}
		</div>
		{#if required}
			<span
				class="ml-1 inline-block scale-90 rounded-full bg-amber-600 px-2 py-0.5 text-xs font-semibold text-white"
			>
				Mandatory
			</span>
		{/if}
	</div>
	<h3 class="line-clamp-2 h-[48px] px-4 text-xl leading-[120%] font-semibold">
		{title}
	</h3>
	<div class="mt-4 px-4 text-center">
		<a
			target="_blank"
			href="https://www.skills.google/course_templates/{courseid}"
			class="duo block w-full rounded-full bg-[var(--color-secondary)] px-4 py-2 text-sm font-semibold text-[var(--color-primary)] transition-colors duration-300 hover:bg-amber-800"
		>
			{#if date}
				View <i class="fasds fa-eye"></i>
			{:else}
				Enroll Now! <i class="fasds fa-rocket-launch"></i>
			{/if}
		</a>
	</div>
</div>

<style lang="postcss">
	@import 'tailwindcss/theme' theme(reference);
	.badgeitem {
		&:hover::after {
			opacity: 0;
		}

		&.earned::after {
			content: '';
			transition: opacity 0.3s;
			@apply pointer-events-none absolute top-0 left-0 z-2 size-full scale-104 rounded-3xl bg-[var(--color-primary)]/70 brightness-95 backdrop-grayscale-100;
		}

		&.invalid.required::after {
			@apply bg-red-700/20;
		}
	}
</style>
