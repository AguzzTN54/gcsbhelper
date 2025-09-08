<script lang="ts">
	import { stopPropagation } from 'svelte/legacy';
	import { onMount } from 'svelte';
	import { activeProfile, arcadeRegion, initData } from '$lib/stores/app-store';
	import pb from '$lib/helpers/pocketbase';
	import { shortShaId } from '$lib/helpers/crypto';
	import { arcadeSeason } from '$lib/data/config';
	import { pushToast } from '$reusable/Toast/Toasts.svelte';
	import Skeleton from '$reusable/Skeleton.svelte';

	const { courseid, label } = $props();
	const labelNcolor = $derived<
		Partial<Record<Exclude<App.CourseType | 'special' | 'unknown', null>, string>>
	>({
		skill: 'bg-amber-600',
		game: 'bg-blue-800',
		trivia: 'bg-rose-700',
		special: 'bg-purple-700',
		wmp: 'bg-emerald-700',
		...($arcadeRegion === 'india' ? { labfree: 'bg-sky-500' } : {}),
		unknown: ''
	});

	const labelsTxt = $derived(Object.keys(labelNcolor));
	let selectedlabel = $state<keyof typeof labelNcolor | null>(
		(label as keyof typeof labelNcolor) || 'unknown'
	);
	let showPicker = $state(false);
	let loading = $state(false);

	const updateInitdata = (cid: number, newlabel: App.CourseType | 'special' | null) => {
		initData.update((courses) => {
			return courses.map((c) => {
				const isMatch = [c.courseid, c.badgeid].includes(cid);
				return isMatch ? { ...c, userinput: { ...(c.userinput || {}), label: newlabel } } : c;
			});
		});
	};

	const selectLabel = async (cid: number, selected: App.CourseType | 'special' | 'unknown') => {
		showPicker = false;
		if (selectedlabel === selected) return;
		loading = true;
		const beforeChanged = selectedlabel;
		selectedlabel = selected;
		const label = selected === 'unknown' ? null : selected;

		const { uuid } = $activeProfile;
		const profile = await shortShaId(`${uuid}-${arcadeSeason.seasonid}`);
		const id = await shortShaId(`${profile}${cid}`);

		try {
			await pb.collection('course_enrollments').update(id, { label });
			updateInitdata(cid, label);
			pushToast({ type: 'success', message: 'Label Updated' });
		} catch (e) {
			pushToast({ type: 'error', message: 'Failed to Update Course Label' });
			selectedlabel = beforeChanged;
			console.error(e);
		} finally {
			loading = false;
		}
	};

	const dismiss = () => (showPicker = false);
	onMount(() => {
		window.addEventListener('mousedown', dismiss);
		return () => window.removeEventListener('mousedown', dismiss);
	});
</script>

<div
	class="absolute top-0 right-0 translate-y-1/3 translate-x-1/5 z-20 bg-pur"
	onmousedown={stopPropagation(() => {})}
	tabindex="0"
	role="listbox"
>
	{#if loading}
		<Skeleton class="w-20 h-6.5 -skew-2" />
	{:else}
		<button
			class="py-1 pl-2 pr-1 text-sm -skew-2 text-[var(--txt-color)] hover:brightness-90 capitalize
	{labelNcolor[selectedlabel ?? 'unknown'] || 'bg-gray-300'}"
			onclick={() => (showPicker = !showPicker)}
			style="--txt-color:{labelNcolor[selectedlabel ?? 'unknown'] ? '#fff' : '#000'}"
		>
			{selectedlabel} <i class="fasdl fa-caret-down"></i>
		</button>
	{/if}

	{#if showPicker}
		<div class="absolute top-[110%] right-0 bg-gray-300 -skew-y-2 text-sm min-w-full w-fit">
			{#each labelsTxt as label (label)}
				<button
					onclick={() => selectLabel(courseid, label as App.CourseType | 'special' | 'unknown')}
					class="block hover:bg-gray-400/50 px-3 py-1 w-full capitalize"
				>
					{label}
				</button>
			{/each}
		</div>
	{/if}
</div>
