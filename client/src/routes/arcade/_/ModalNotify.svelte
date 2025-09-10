<script lang="ts">
	import { getContext, onMount, setContext } from 'svelte';
	import { disableNotifications, getSubscription, notifyme } from '$lib/helpers/notify';
	import Modal from '$reusable/Modal.svelte';

	const modalHandle = getContext('modalNotifHandler') as (val: boolean) => void;
	setContext('modalHandle', modalHandle);
	let activating = $state(false);
	let notifActive = $state(false);
	let isError = $state(false);

	const allowNotification = async () => {
		activating = true;
		isError = false;
		notifActive = !!(await notifyme());
		isError = !notifActive;
		activating = false;
		modalHandle?.(!!isError);
	};

	const disableNotif = async () => {
		await disableNotifications();
		notifActive = false;
		modalHandle?.(false);
	};

	onMount(async () => {
		notifActive = !!(await getSubscription());
	});
</script>

<Modal>
	<div class="sm:py-2">
		<h1 class="text-center font-extrabold sm:text-xl">Push Notification</h1>
		<p class="text-center my-2">
			Get notified instantly when a new game launches, don't miss the challenge!
		</p>

		<div class="flex justify-center">
			{#if activating}
				<button disabled aria-label="Notify Me" class="px-2 py-1 brutal-border bg-gray-300">
					<i class="fasdl fa-bell text-sky-500"></i> Activating..
				</button>
			{:else if !notifActive}
				<button
					onclick={allowNotification}
					aria-label="Notify Me"
					class="px-2 py-1 brutal-border bg-sky-200 hover:bg-sky-300 active:bg-sky-400"
				>
					<i class="fasdl fa-bell text-sky-500"></i> Notify Me!
				</button>
			{:else}
				<button
					onclick={disableNotif}
					aria-label="Notify Me"
					class="px-2 py-1 brutal-border bg-rose-200 hover:bg-rose-300 active:bg-rose-400"
				>
					<i class="fasdl fa-bell-slash text-rose-500"></i> Stop Notification!
				</button>
			{/if}
		</div>

		{#if isError}
			<p class="text-center">
				<span class="text-xs text-rose-700">
					Failed to subscribe to notifications! Please make sure you’ve allowed permission!
				</span>
			</p>
		{/if}
	</div>
</Modal>
