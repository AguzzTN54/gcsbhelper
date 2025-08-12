<script lang="ts">
	interface Props {
		checked?: boolean;
		id?: string;
		onchange?: (e: Event) => void;
		children: any;
	}
	const { checked, id = '_0', onchange: change, children }: Props = $props();
	const onchange = (e: Event) => {
		change?.(e);
	};
</script>

<div class="checkbox">
	<input type="checkbox" name="check{id}" id="check{id}" {checked} {onchange} />
	<label for="check{id}">
		<i class="brutal-border"></i>
		<span> {@render children()} </span>
	</label>
</div>

<style lang="postcss">
	@import 'tailwindcss/theme' theme(reference);

	.checkbox {
		margin: 1%;
		cursor: pointer;

		label {
			cursor: inherit;
			@apply flex items-center gap-2;
		}

		input {
			display: none;

			+ label i {
				@apply inline-flex size-6 justify-center items-center;
			}

			&:checked + label i {
				@apply bg-indigo-300 relative;
				&::after {
					content: '✔';
					@apply absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2;
				}
			}
		}
	}
</style>
