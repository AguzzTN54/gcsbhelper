<script lang="ts">
	import { shortShaId } from '$lib/helpers/crypto';
	import pb from '$lib/helpers/pocketbase';
	import { activeProfile, ARCADECONFIG, initData } from '$lib/stores/app.svelte';
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
		const profile = await shortShaId(`${uuid}-${$ARCADECONFIG?.arcade.identifier}`);
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
		class="{className} brutal-border relative rounded-full !border-[2px] px-3 py-1 capitalize hover:opacity-100 hover:brightness-95 active:brightness-90"
	>
		{text}
	</button>
{/snippet}

{#if rating}
	<div class="absolute bottom-6 left-0.5 text-xs">
		<button
			onclick={() => (editRate = !editRate)}
			class="flex aspect-square size-6 items-center justify-center rounded-full text-xs text-amber-500 hover:bg-indigo-300
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
		class="absolute top-0 left-0 hidden size-full items-center justify-center bg-slate-100 group-[:hover]:flex"
	>
		<div class="flex w-9/12 flex-col items-center justify-center text-center text-xs">
			<span>Please help others by rating this course</span>
			<div class="flex justify-between gap-1">
				{#each Object.keys(baseRating) as k (k)}
					{@render button(k, baseRating[k as DiffLevel])}
				{/each}
			</div>
		</div>
	</div>
{/if}
