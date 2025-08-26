<script module lang="ts">
	import { toastMsg } from '$lib/stores/app-store';

	export const pushToast = ({
		type = 'info',
		dismissible = false,
		autoclose = true,
		timeout = 3000,
		message = ''
	}: App.Toast) => {
		const id = Math.floor(Math.random() * 10000);
		const toastData = { id, dismissible, autoclose, timeout, type, message };
		toastMsg.update((all) => [toastData, ...all]);
		if (autoclose && timeout > 1) setTimeout(() => dismissToast(id), timeout);
	};

	export const dismissToast = (id: number) => {
		toastMsg.update((all) => all.filter((t) => t.id !== id));
	};
</script>

<script lang="ts">
	import { flip } from 'svelte/animate';
	import Toast from './Toast.svelte';
</script>

{#if $toastMsg}
	<div
		class="fixed top-4 left-0 right-0 flex flex-col items-center gap-2 z-[1000] pointer-events-none"
	>
		{#each $toastMsg as { type, id, dismissible, message, autoclose, timeout } (id)}
			<div animate:flip={{ duration: (i) => 25 * Math.sqrt(i) }}>
				<Toast {type} {dismissible} {autoclose} {timeout} onclose={() => dismissToast(id || 0)}>
					{message}
				</Toast>
			</div>
		{/each}
	</div>
{/if}
