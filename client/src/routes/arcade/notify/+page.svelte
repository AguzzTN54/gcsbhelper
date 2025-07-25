<script lang="ts">
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import { disableNotifications, getSubscription, notifyme } from '$lib/helpers/notify';
	import Button from '$comp/Button.svelte';

	const { data } = $props()

	let activating = $state(false)
	let notifActive = $state(false)
	let isError = $state(false)

	const allowNotification = async()=> {
		activating = true
		isError = false
		notifActive = !!(await notifyme(data?.token || ''))
		isError = !notifActive
		activating = false
	}

	const disableNotif = async ()=> {
		await disableNotifications()
		notifActive = false
	}

	onMount(async () => {
		notifActive = !!(await getSubscription())
	})
</script>

<div class="wrapper" in:fade={{ delay: 500 }}>
	<div class="hero">
		<div class="top">
			<h1>Arcade Notification</h1>
		</div>
		<div class="field">
			{#if activating}
				<Button disabled>Activating..</Button>
			{:else if !notifActive}
				<Button onclick={allowNotification}>🔔 Notify Me!</Button>
			{:else}
				<Button cancel onclick={disableNotif}>🔕 Stop Notification</Button>
			{/if}
		</div>

		{#if isError}
			<span class="fail"> Failed to subscribe Notification! please try to refresh the page first!</span>
		{/if}
	</div>
</div>

<style>
	.wrapper {
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		position: absolute;
	}

	.field {
		transform: scale(1.2);
	}
	.fail {
		display: block;
		margin-top: 1rem;
		color: rgb(200, 18, 18);
	}

	.hero {
		padding: 2% 5%;
		width: var(--screen-width);
		min-height: var(--screen-height);
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	h1 {
		text-transform: uppercase;
		font-size: xx-large;
		line-height: 150%;
		padding-bottom: 0.5rem;
		text-align: center;
	}
	@media screen and (max-width: 700px) {
		h1 {
			font-size: large;
		}
	}
</style>
