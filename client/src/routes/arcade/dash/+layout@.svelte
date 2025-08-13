<script lang="ts">
	import { arcadeRegion } from '$lib/stores/app-store';
	import { setContext } from 'svelte';
	import bg from '$img/paper.webp';
	import Countdown from '../../_global/reusable/Countdown.svelte';
	import ScrollArea from '../../_global/reusable/ScrollArea.svelte';
	import ModalSelectRegion from '../_/ModalSelectRegion.svelte';
	import ProfilePic from '../_/ProfilePic.svelte';

	const { children } = $props();
	const regions: Record<string, string> = {
		indonesia: 'Facilitator Indonesia',
		global: 'Global Facilitator',
		unset: 'Regular Participan'
	};

	let showModal = $state(false);
	const handleFacilitatorSelector = (val?: boolean) => {
		showModal = typeof val === 'boolean' ? val : !showModal;
	};
	setContext('handleFacilitatorSelector', handleFacilitatorSelector);
</script>

<ModalSelectRegion {showModal} />

<section
	class="sm:p-4 p-2 pt-4 !pb-0 size-full relative overflow-hidden flex flex-col justify-end"
	id="dash"
>
	<div
		style="--bg:url({bg})"
		class="-skew-1 h-[calc(100%-3rem)] sm:h-full w-[calc(100%-1rem)] sm:w-[calc(100%-2rem)] z-1 absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-[1rem] brutal-border rounded-tl-3xl overflow-hidden bg-indigo-300 after:top-0 after:left-0 after:skew-1 after:-z-10 after:absolute after:size-full after:bg-gray-100"
	>
		<img
			src={bg}
			alt="Paper Bg"
			class="object-cover opacity-30 size-full absolute top-0 right-0 pointer-events-none rounded-tl-3xl"
			style="mask-image: linear-gradient(to bottom, transparent 5%, black 20%);"
		/>
	</div>

	<div class="flex justify-center sm:hidden">
		<ProfilePic />
	</div>
	<div class="w-full h-[calc(100%-5rem)] sm:h-full rounded-t-3xl relative z-2 p-2 pt-5">
		<ScrollArea>
			<div class="size-full flex flex-col sm:flex-row pr-4 sm:pr-0">
				<!-- left -->
				<div
					class="lg:w-120 sm:w-1/2 w-full max-w-full sm:border-r-4 border-[color:var(--stroke)] flex flex-col py-2 sm:pr-2"
				>
					<div class="sm:px-5 px-2">
						<div class="brutal-border rounded-br-3xl rounded-tl-3xl bg-amber-100">
							<div
								class="flex border-r-2 border-b-2 border-[color:var(--stroke)] rounded-br-3xl rounded-tl-3xl overflow-hidden bg-gray-100"
							>
								<div class="aspect-square w-20 scale-110 border-r-2 overflow-hidden rounded-br-3xl">
									<img
										src="https://lh3.googleusercontent.com/a/ACg8ocJeuBMql16UznPV_f-Qy6M3XGRDU3I1VJDch2tgr9ZGyVr5SQ=s320-c"
										alt="llo"
										class="size-full object-cover"
									/>
								</div>
								<!-- <div class="brutal-drop scale-70">
									<ProfilePic />
								</div> -->
								<div class="flex flex-col px-4 py-1 w-[calc(100%-5rem)] text-center">
									<h1 class="font-semibold text-xl">Agus Sedunia</h1>
									<div class="grid grid-cols-2 text-sm mt-2">
										<div class="">
											<span class="font-light text-xs block">Badges</span>
											<span class="font-extrabold">50</span>
										</div>
										<div class="">
											<span class="font-light text-xs block">Milestone</span>
											<span class="font-extrabold">Milestone 2</span>
										</div>
									</div>
								</div>
							</div>

							<div class="flex text-sm px-2 py-1 justify-center">
								<button
									class="underline text-amber-900"
									onclick={() => handleFacilitatorSelector?.()}
								>
									{regions[$arcadeRegion]} <i class="fasdl fa-caret-down text-amber-800"></i>
								</button>
							</div>
						</div>
					</div>

					<div class="mt-auto sm:px-5 px-2 pt-5">
						<div class="brutal-border p-2 w-full rounded-xl bg-amber-200 flex justify-center">
							<div class="flex flex-col items-center relative z-1">
								<span class="brutal-text after:!bg-indigo-100 text-xs sm:text-sm mb-2">
									Time Remaining
								</span>
								<Countdown />
							</div>
						</div>
					</div>
				</div>

				<!-- Right -->
				<div class="w-full sm:w-1/2 lg:w-full">
					<ScrollArea class="sm:py-2 sm:px-5 px-2">
						{@render children()}
					</ScrollArea>
				</div>
			</div>
		</ScrollArea>
	</div>
</section>
