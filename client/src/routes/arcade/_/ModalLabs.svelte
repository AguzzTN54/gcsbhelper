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
	import { preventDefault } from 'svelte/legacy';
	import { createQuery } from '$lib/stores/query-store';
	import { completedLabs } from '$lib/stores/app.svelte';
	import Modal from '$reusable/Modal.svelte';
	import pb from '$lib/helpers/pocketbase';
	import Loading from '$reusable/Loading.svelte';

	setContext('modalHandle', toggleLabs);
	type Titles = { id: string; title: string };
	const q = $derived.by(() => {
		return createQuery({
			queryKey: courseTitle,
			queryFn: async () => {
				const res = await pb.collection('labs').getList(1, 500, {
					fields: 'title,id',
					filter: labIds.map((id) => pb.filter('id={:id}', { id })).join('||')
				});
				return res.items as unknown as Titles[];
			}
		});
	});
</script>

{#if showModal}
	<Modal>
		<div class="sm:pt-5 sm:pb-1">
			<h1 class="mb-2 text-center leading-[120%] font-extrabold sm:text-xl">
				{courseTitle}
			</h1>

			{#if $q.isLoading}
				<div class="flex justify-center p-2">
					<Loading />
				</div>
			{:else if !$q.error && Array.isArray($q.data)}
				<div class="max-h-50 overflow-auto">
					{#each $q.data as { id, title }, i (i)}
						<div
							class="flex w-full items-center border-t-2 hover:bg-gray-200"
							class:!border-t-0={i === 0}
						>
							<span
								aria-label="Delete"
								class:bg-green-200={$completedLabs.has(id)}
								class="inline-flex h-full min-h-10 w-10 items-center justify-center bg-gray-200"
							>
								{#if $completedLabs.has(id)}
									<i class="fasdl fa-check text-green-300"></i>
								{:else}
									<i class="fasdl fa-flask text-indigo-400"></i>
								{/if}
							</span>
							<button
								class="flex w-full items-center py-2 text-left text-sm"
								style="--line-number:1"
							>
								<span class="text-overflow ml-2 inline-block">{title}</span>
							</button>
						</div>
					{/each}
				</div>
			{/if}

			<p class="bg-amber-200 p-2 text-center text-xs text-amber-700">
				This progress is only a prediction based on your earned badges. I can't guarantee the
				accuracy, but I hope it helps you decide which course to take next.
			</p>

			<div class="mt-3 flex justify-center">
				<a
					onclick={courseId && courseId > 0 ? undefined : preventDefault(() => {})}
					href="https://www.cloudskillsboost.google/course_templates/{courseId}"
					target="_blank"
					class="brutal-border mx-auto !border-4 bg-amber-200 px-2 py-1 hover:bg-amber-300 active:bg-amber-400"
				>
					Enroll Now!
				</a>
			</div>
		</div>
	</Modal>
{/if}
