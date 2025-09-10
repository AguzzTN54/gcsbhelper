<script lang="ts">
	import { arcadeSeason } from '$lib/data/config';
	import { shortShaId } from '$lib/helpers/crypto';
	import pb from '$lib/helpers/pocketbase';
	import { activeProfile, initData } from '$lib/stores/app.svelte';
	import { pushToast } from '$reusable/Toast/Toasts.svelte';

	type DiffLevel = 'easy' | 'medium' | 'hard';
	type Props = { rating?: DiffLevel | null; courseid: string };
	const { rating, courseid }: Props = $props();

	let editRate = $state(!rating);
	const updateInitdata = (cid: number, newRating: DiffLevel) => {
		initData.update((courses) => {
			return courses.map((c) => {
				const isMatch = [c.courseid, c.badgeid].includes(cid);
				return isMatch ? { ...c, userinput: { ...(c.userinput || {}), rating: newRating } } : c;
			});
		});
	};

	const rateThis = async (myfeedback: DiffLevel) => {
		editRate = false;
		if (rating === myfeedback) return;

		const { uuid } = $activeProfile;
		const profile = await shortShaId(`${uuid}-${arcadeSeason.seasonid}`);
		const id = await shortShaId(`${profile}${courseid}`);

		try {
			await pb.collection('course_enrollments').update(id, { difficulty: myfeedback });
			const cid = parseInt(courseid.replace(/\D/g, ''), 10);
			updateInitdata(cid, myfeedback);
			pushToast({ type: 'success', message: 'Thanks for your feedback' });
		} catch (e) {
			console.error(e);
			pushToast({ type: 'error', message: 'Failed send feeback!' });
		}
	};

	const baseRating: Record<DiffLevel, string> = {
		easy: 'bg-green-300',
		medium: 'bg-amber-300',
		hard: 'bg-red-300'
	};
</script>

{#snippet button(text: string, className: string)}
	<button
		onclick={() => rateThis(text as DiffLevel)}
		class:opacity-50={rating !== text}
		class="{className} capitalize hover:brightness-95 hover:opacity-100 active:brightness-90 py-1 px-3 brutal-border !border-[2px] rounded-full relative"
	>
		{text}
	</button>
{/snippet}

{#if rating}
	<div class="absolute bottom-6 left-0.5 text-xs">
		<button
			onclick={() => (editRate = !editRate)}
			class="text-xs flex items-center justify-center size-6 aspect-square hover:bg-indigo-300 rounded-full text-amber-500
			{baseRating[rating as DiffLevel]}"
			aria-label="rated"
			title="your review: {rating}"
		>
			<i class="fasdl fa-star"></i>
		</button>
	</div>
{/if}

{#if editRate}
	<div
		class="size-full bg-slate-100 absolute top-0 left-0 hidden group-[:hover]:flex items-center justify-center"
	>
		<div class="flex flex-col items-center justify-center text-center text-xs w-9/12">
			<span>Please help others by rating this course</span>
			<div class="flex justify-between gap-1">
				{#each Object.keys(baseRating) as k (k)}
					{@render button(k, baseRating[k as DiffLevel])}
				{/each}
			</div>
		</div>
	</div>
{/if}
