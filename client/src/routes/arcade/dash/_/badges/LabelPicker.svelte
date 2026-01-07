<script lang="ts">
	import { stopPropagation } from 'svelte/legacy';
	import { onMount } from 'svelte';
	import { activeProfile, ARCADECONFIG, arcadeRegion, initData } from '$lib/stores/app.svelte';
	import pb from '$lib/helpers/pocketbase';
	import { shortShaId } from '$lib/helpers/crypto';
	import { pushToast } from '$reusable/Toast/Toasts.svelte';
	import Skeleton from '$reusable/Skeleton.svelte';

	type Props = { courseid: string; label: App.CourseType | 'special' | undefined };
	const { courseid, label }: Props = $props();
	const labelNcolor = $derived<
		Partial<Record<Exclude<App.CourseType | 'special' | 'unknown', null>, string>>
	>({
		skill: 'bg-amber-600',
		game: 'bg-blue-800',
		trivia: 'bg-pink-600',
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

	const selectLabel = async (cid: string, selected: App.CourseType | 'special' | 'unknown') => {
		showPicker = false;
		if (selectedlabel === selected) return;
		loading = true;
		const beforeChanged = selectedlabel;
		selectedlabel = selected;
		const label = selected === 'unknown' ? null : selected;

		const { uuid } = $activeProfile;
		const profile = await shortShaId(`${uuid}-${$ARCADECONFIG?.arcade.identifier}`);
		const id = await shortShaId(`${profile}${cid}`);

		try {
			await pb.collection('course_enrollments').update(id, { label });
			const courseid = parseInt(cid.replace(/\D/g, ''), 10);
			updateInitdata(courseid, label);
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
	class="labelpicker absolute top-0 right-0 z-20 translate-x-1/5 translate-y-1/3"
	onmousedown={stopPropagation(() => {})}
	tabindex="0"
	role="listbox"
>
	{#if loading}
		<Skeleton class="h-6.5 w-20 -skew-2" />
	{:else}
		<button
			class="-skew-2 py-1 pr-1 pl-2 text-sm text-[var(--txt-color)] capitalize hover:brightness-90
	{labelNcolor[selectedlabel ?? 'unknown'] || 'bg-gray-300'}"
			onclick={() => (showPicker = !showPicker)}
			style="--txt-color:{labelNcolor[selectedlabel ?? 'unknown'] ? '#fff' : '#000'}"
		>
			{selectedlabel} <i class="fasdl fa-caret-down"></i>
		</button>
	{/if}

	{#if showPicker}
		<div
			class="label-selection absolute top-[110%] right-0 w-fit min-w-full -skew-y-2 bg-gray-300 text-sm"
		>
			{#each labelsTxt as label (label)}
				<button
					onclick={() => selectLabel(courseid, label as App.CourseType | 'special' | 'unknown')}
					class="block w-full px-3 py-1 capitalize hover:bg-gray-400/50"
				>
					{label}
				</button>
			{/each}
		</div>
	{/if}
</div>
