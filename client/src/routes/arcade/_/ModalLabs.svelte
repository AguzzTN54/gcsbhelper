<script lang="ts" module>
	let showModal = $state(false);
	let courseTitle = $state('');
	let courseId = $state<number>(0);
	let labIds = $state<string[]>([]);
	export const toggleLabs = () => (showModal = !showModal);
	export const showLabs = (courseid: number, labs?: string[], title?: string) => {
		if (!Array.isArray(labs) || !title || !courseid) return;
		showModal = true;
		courseTitle = title;
		labIds = labs;
		courseId = courseid;
	};
</script>

<script>
	import { setContext } from 'svelte';
	import { createQuery } from '$lib/stores/query-store';
	import { completedLabs } from '$lib/stores/app.svelte';
	import Modal from '$reusable/Modal.svelte';
	import pb from '$lib/helpers/pocketbase';
	import Loading from '$reusable/Loading.svelte';
	import { preventDefault } from 'svelte/legacy';
	setContext('modalHandle', toggleLabs);

	type Titles = { id: string; title: string };
	const q = $derived.by(() => {
		return createQuery(courseTitle, async () => {
			const res = await pb.collection('labs').getList(1, 500, {
				fields: 'title,id',
				filter: labIds.map((id) => pb.filter('id={:id}', { id })).join('||')
			});
			return res.items as unknown as Titles[];
		});
	});
</script>

{#if showModal}
	<Modal>
		<div class="sm:pt-5 sm:pb-1">
			<h1 class="text-center font-extrabold sm:text-xl mb-2 leading-[120%]">
				{courseTitle}
			</h1>

			{#if $q.isLoading}
				<div class="p-2 flex justify-center">
					<Loading />
				</div>
			{:else if !$q.error && Array.isArray($q.data)}
				<div class="overflow-auto max-h-50">
					{#each $q.data as { id, title }, i (i)}
						<div
							class="flex w-full items-center border-t-2 hover:bg-gray-200"
							class:!border-t-0={i === 0}
						>
							<span
								aria-label="Delete"
								class:bg-green-200={$completedLabs.has(id)}
								class="w-10 min-h-10 h-full bg-gray-200 inline-flex items-center justify-center"
							>
								{#if $completedLabs.has(id)}
									<i class="fasdl fa-check text-green-300"></i>
								{:else}
									<i class="fasdl fa-flask text-indigo-400"></i>
								{/if}
							</span>
							<button
								class="w-full text-left flex items-center py-2 text-sm"
								style="--line-number:1"
							>
								<span class="inline-block ml-2 text-overflow">{title}</span>
							</button>
						</div>
					{/each}
				</div>
			{/if}

			<p class="p-2 bg-amber-200 text-amber-700 text-xs text-center">
				This progress is only an estimate based on your earned badges. I can't guarantee accuracy,
				but I hope it helps you decide which course to take next.
			</p>

			<div class="flex justify-center mt-3">
				<a
					onclick={courseId && courseId > 0 ? undefined : preventDefault(() => {})}
					href="https://www.cloudskillsboost.google/course_templates/{courseId}"
					target="_blank"
					class="px-2 py-1 brutal-border !border-4 bg-amber-200 hover:bg-amber-300 active:bg-amber-400 mx-auto"
				>
					Enroll Now!
				</a>
			</div>
		</div>
	</Modal>
{/if}
