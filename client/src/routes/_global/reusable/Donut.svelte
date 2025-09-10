<script lang="ts">
	interface DonutProps {
		size?: string;
		stroke?: number;
		values: { easy?: number; medium?: number; hard?: number };
	}
	const { size = '12rem', stroke = 20, values }: DonutProps = $props();
	const data = $derived([
		{ label: 'Easy', value: values.easy || 0, color: 'text-green-500' },
		{ label: 'Medium', value: values.medium || 0, color: 'text-amber-400' },
		{ label: 'Hard', value: values.hard || 0, color: 'text-red-500' }
	]);

	const r = 50 - stroke / 2;
	const circumference = 2 * Math.PI * r;

	// compute cumulative offsets
	let offset = 0;
	const segments = $derived.by(() => {
		return data.map((d) => {
			const length = (d.value / 100) * circumference;
			const seg = { ...d, length, offset };
			offset += length;
			return seg;
		});
	});
</script>

<div class="relative" style="width: {size}; height: {size};">
	<svg class="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
		<circle
			cx="50"
			cy="50"
			{r}
			class="text-gray-300"
			stroke="currentColor"
			stroke-width={stroke}
			fill="transparent"
		/>
		{#each segments as seg}
			<circle
				cx="50"
				cy="50"
				{r}
				class={seg.color}
				stroke="currentColor"
				stroke-width={stroke}
				fill="transparent"
				stroke-dasharray="{seg.length} {circumference - seg.length}"
				stroke-dashoffset={-seg.offset}
				stroke-linecap="butt"
			/>
		{/each}
	</svg>
</div>
