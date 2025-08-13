<script lang="ts">
	import { mount, unmount, type Snippet } from 'svelte';
	import Wormhole from './Wormhole.svelte';

	const {
		children,
		target = 'body',
		disabled = false
	}: {
		children: Snippet;
		/**
		 * Required. Specify target container.
		 * Can either be a selector or an actual element.
		 */
		target?: string | HTMLElement;
		/**
		 * When `true`, the content will remain in its original
		 * location instead of moved into the target container.
		 * Can be changed dynamically.
		 */
		disabled?: boolean;
	} = $props();

	$effect(() => {
		let app: Record<string, unknown>;

		let element: Element | null;

		if (disabled) {
			return;
		}

		if (!target) {
			console.warn(`[svelte-portal] Invalid Portal target: ${target}`);
			return;
		}

		if (typeof target === 'string') {
			element = document.querySelector(target);
		} else {
			element = target;
		}

		if (element) {
			app = mount(Wormhole, {
				target: element,
				props: {
					children
				}
			});
		}

		return () => {
			if (app) {
				unmount(app);
			}
		};
	});
</script>

{#if disabled}
	{@render children()}
{/if}
