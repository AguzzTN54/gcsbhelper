<script lang="ts">
	interface Props {
		children: any;
		cancel?: boolean;
		disabled?: boolean;
		onclick?: () => void;
		class?: string;
	}
	const { children, cancel = false, disabled = false, onclick, class: className }: Props = $props();
</script>

<button
	class="check rounded-full text-sm text-white {className || ''}"
	class:primary_hover_after={!disabled}
	class:cancel
	{disabled}
	type="submit"
	{onclick}
>
	{@render children()}
</button>

<style>
	.check {
		background-image: var(--color-gradient);
		background-size: 200%;
		background-position: 100%;
		padding: 0.75rem 2rem;
		transition:
			transform 0.1s,
			background 0.3s,
			box-shadow 0.25s;
		position: relative;

		&:hover {
			background-position: 0;
			box-shadow: var(--outer-shadow);
		}

		&:disabled {
			background-color: #ccc;
			color: #000;
			background-image: none;
			cursor: not-allowed;
		}

		&.cancel {
			background-image: linear-gradient(70deg, #e30606 45%, #ae0606);
		}
	}
</style>
