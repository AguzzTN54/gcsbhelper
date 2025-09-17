<script lang="ts" module>
	interface TourStepProps {
		message: string;
		element?: string;
		container?: string;
		navigation?:
			| boolean
			| {
					next?: boolean;
					back?: boolean;
					close?: boolean;
			  };
		dynamic?: boolean;
		navigateOnTargetClick?: boolean;
		onclick?: () => void;
	}

	interface TourStep extends TourStepProps {
		targetNode?: Element | null;
	}
	let steps = $state<TourStep[]>([]);
	export const startTour = (_steps: TourStepProps[]) => {
		steps = _steps;
	};
</script>

<script>
	import { crossfade, fade, fly, type FlyParams } from 'svelte/transition';
	import { screenSize } from '$lib/stores/app.svelte';

	let currentStepPos = $state(0);
	let stepOnStage = $state<TourStep[]>([]);
	let promptPos = $state('');

	const hasNavigation = $derived.by(() => {
		if (!steps || !steps.length) return false;
		const step = steps[currentStepPos];
		return typeof step.navigation === 'undefined' || step.navigation === true;
	});

	const promptTransition = { key: {}, duration: 300, y: -8 };
	const spotlightTransition = { key: {}, duration: 300 };

	$effect(() => {
		if (!steps || !steps.length || currentStepPos > 0) return;
		startStep(0);
	});

	const waitForElement = (selector: string, timeout?: number): Promise<Element | null> => {
		return new Promise((resolve) => {
			const el = document.querySelector(selector);
			if (el) {
				resolve(el);
				return;
			}

			const observer = new MutationObserver(() => {
				const el = document.querySelector(selector);
				if (el) {
					observer.disconnect();
					resolve(el);
				}
			});
			observer.observe(document.body, { childList: true, subtree: true });

			// Only apply timeout if provided
			if (timeout) {
				setTimeout(() => {
					observer.disconnect();
					resolve(null);
				}, timeout);
			}
		});
	};

	const startStep = async (stepPos: number) => {
		if (stepPos >= steps.length || stepPos < 0) {
			reset();
			return;
		}

		currentStepPos = stepPos;
		const step = steps[currentStepPos];
		if (step.element) {
			if (step.dynamic) {
				step.targetNode = await waitForElement(step.element, 1000 * 60 * 5); // wait up to 5 mins
			} else {
				step.targetNode = document.querySelector(step.element);
			}

			if (step.targetNode) {
				step.targetNode.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
				if (step.navigateOnTargetClick) {
					step.targetNode.addEventListener('click', onNext, { once: true });
				}
			}
		}

		stepOnStage = [step];
	};

	const reset = () => {
		steps = [];
		currentStepPos = 0;
		stepOnStage = [];
	};

	const onNext = () => {
		steps[currentStepPos].onclick?.();
		startStep(++currentStepPos);
	};
	const onBack = () => startStep(--currentStepPos);
	const onSkip = () => reset();

	let spotlightStyle = $state({ left: '0px', top: '0px', width: '0px', height: '0px' });
	const spotlightStylestring = $derived.by(() => {
		return Object.entries(spotlightStyle)
			.map(([k, v]) => `--${k}: ${v};`)
			.join(' ');
	});
	const isOffscreen = $derived.by(() => {
		const left = parseFloat(spotlightStyle.left.replace('px', ''));
		const top = parseFloat(spotlightStyle.top.replace('px', ''));
		const width = parseFloat(spotlightStyle.width.replace('px', ''));
		const height = parseFloat(spotlightStyle.height.replace('px', ''));
		let screen = $screenSize;
		return left + width < 0 || top + height < 0 || left > screen.width || top > screen.height;
	});

	const tourAction = (node: Element, step: TourStep) => {
		const promptNode = node.querySelector('.tour-prompt') as HTMLElement;
		const spotlightNode = node.querySelector('.tour-spotlight') as HTMLElement;
		const arrowNode = node.querySelector('.tour-arrow') as HTMLElement;
		const bodyNode = node.querySelector('.tour-body') as HTMLElement;

		if (!promptNode || !spotlightNode || !arrowNode || !bodyNode) {
			console.error('Tour action: Missing required elements in the DOM structure.');
			return;
		}

		const promptStyle = promptNode.style;
		const arrowStyle = arrowNode.style;
		const getNum = (str: string) => parseInt(str) || 0;

		const updatePos = () => {
			if (step.targetNode) {
				// set prompt position
				const promptRect = promptNode.getBoundingClientRect();
				const targetRect = step.targetNode.getBoundingClientRect();

				if (targetRect.bottom + promptRect.height + 5 < document.body.clientHeight) {
					promptStyle.top = `${targetRect.bottom}px`;
					promptStyle.bottom = '';
					promptPos = '';
				} else {
					promptStyle.bottom = `${document.body.clientHeight - targetRect.top}px`;
					promptStyle.top = '';
					promptPos = 'top';
				}

				if (targetRect.left + promptRect.width + 5 < document.body.clientWidth) {
					promptStyle.left = `${targetRect.left}px`;
					promptStyle.right = '';
					promptStyle.marginLeft = promptStyle.marginRight = '';
				} else {
					promptStyle.right = '0';
					promptStyle.left = '';
					promptStyle.marginLeft = promptStyle.marginRight = '5px';
				}

				// set arrow position
				const pStyle = getComputedStyle(promptNode);
				const aStyle = getComputedStyle(arrowNode);
				arrowStyle.left =
					targetRect.width / 2 +
					targetRect.left -
					getNum(pStyle.left) -
					getNum(pStyle.marginLeft) -
					getNum(aStyle.borderLeftWidth) +
					'px';

				// set spotlight position
				spotlightStyle = {
					top: `${targetRect.top}px`,
					left: `${targetRect.left}px`,
					width: `${targetRect.width}px`,
					height: `${targetRect.height}px`
				};
			} else {
				// set prompt to center
				const bodyRect = bodyNode.getBoundingClientRect();

				promptStyle.top = `${(document.body.clientHeight - bodyRect.height) / 2}px`;
				promptStyle.left = `${(document.body.clientWidth - bodyRect.width) / 2}px`;
				promptPos = 'center';

				// set spotlight to center
				spotlightStyle = {
					top: `${document.body.clientHeight / 2}px`,
					left: `${document.body.clientWidth / 2}px`,
					width: '0',
					height: '0'
				};
			}
		};

		updatePos();
		const targetContainer = step.container
			? document.querySelector(step.container) || window
			: window;
		targetContainer.addEventListener('scroll', updatePos);
		targetContainer.addEventListener('resize', updatePos);

		return {
			destroy() {
				targetContainer.removeEventListener('scroll', updatePos);
				targetContainer.removeEventListener('resize', updatePos);
			}
		};
	};

	const [send, receive] = crossfade({ fallback: (n, p) => fly(n, p as FlyParams) });
</script>

{#if steps.length}
	<div
		class:isOffscreen
		class="tour-backdrop fixed top-0 left-0 size-full z-[999999] pointer-events-none"
		style={spotlightStylestring}
		transition:fade={{ duration: 250 }}
	>
		{#each stepOnStage as step (step)}
			<div use:tourAction={step}>
				<div
					class="tour-spotlight"
					style="left:var(--left); top:var(--top); width:var(--width); height:var(--height);"
					in:receive={spotlightTransition}
					out:send={spotlightTransition}
				></div>

				<div
					class="tour-prompt fixed text-xs sm:text-sm min-w-50 sm:max-w-[25em] max-w-10/12 pointer-events-auto"
					class:tour-prompt-top={promptPos === 'top'}
					class:tour-prompt-center={promptPos === 'center'}
					in:receive={promptTransition}
					out:send={promptTransition}
				>
					<div
						class="tour-arrow absolute mt-[0.1em] border-solid border-[0_.5em_0.5em_0.5em] border-black border-x-transparent"
					></div>
					<div
						class="tour-body mt-[0.5em] bg-gray-100 border-4 border-black rounded-tl-3xl rounded-br-3xl py-2 px-4 -skew-x-4"
					>
						<div class="skew-x-4">
							<div class="tour-content py-1">{step.message}</div>
							<div class="tour-footer flex items-center justify-center">
								<div class="tour-footer-left">
									<!-- {#if currentStepPos < steps.length - 1}
									<button onclick={onSkip}>Skip</button>
								{/if} -->
								</div>

								<div class="tour-footer-right">
									{#if currentStepPos !== 0 && (hasNavigation || (typeof step.navigation === 'object' && step.navigation.back))}
										<button
											onclick={onBack}
											class="bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded text-xs"
										>
											Back
										</button>
									{/if}

									{#if hasNavigation || (typeof step.navigation === 'object' && step.navigation.next)}
										<button
											onclick={onNext}
											class="bg-amber-300 hover:bg-amber-400 px-2 py-1 rounded text-xs ml-2"
										>
											{currentStepPos < steps.length - 1 ? 'Next' : 'Done'}
										</button>
									{/if}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		{/each}
	</div>
{/if}

<style lang="postcss">
	@import 'tailwindcss/theme' theme(reference);

	.tour-backdrop {
		--left: 0px;
		--top: 0px;
		--width: 0px;
		--height: 0px;

		backdrop-filter: grayscale(1);
		/* Chrome/Firefox */
		mask:
			linear-gradient(#fff 0 0) var(--left) var(--top) / var(--width) var(--height) no-repeat,
			linear-gradient(#fff 0 0) 0 0 / 100% 100% no-repeat;
		mask-composite: exclude, add;
		mask-repeat: no-repeat, no-repeat;

		/* Safari / WebKit */
		-webkit-mask:
			linear-gradient(#fff 0 0) var(--left) var(--top) / var(--width) var(--height) no-repeat,
			linear-gradient(#fff 0 0) 0 0 / 100% 100% no-repeat;
		-webkit-mask-composite: destination-out, destination-over;
		-webkit-mask-repeat: no-repeat, no-repeat;

		&.isOffscreen {
			mask: none;
			-webkit-mask: none;
		}
	}

	.tour-spotlight {
		@apply fixed opacity-30;
		box-shadow: 0 0 0 calc(999vw + 999vh) theme(--color-gray-800);
	}

	.tour-footer-left {
		flex-grow: 1;
	}

	.tour-footer-left,
	.tour-footer-right {
		display: flex;
	}

	.tour-prompt.tour-prompt-top {
		@apply flex flex-col-reverse;
	}

	.tour-prompt.tour-prompt-top > .tour-arrow {
		@apply border-[0.5em_0.5em_0_0.5em] mt-0 mb-[0.1em];
	}

	.tour-prompt.tour-prompt-top > .tour-body {
		@apply mt-0 mb-[0.6em];
	}

	.tour-prompt.tour-prompt-center > .tour-arrow {
		@apply border-[0_0.5em] !my-0;
	}

	.tour-prompt.tour-prompt-center > .tour-body {
		@apply !my-0;
	}
</style>
