<script lang="ts">
	import dayjs from '$lib/helpers/dateTime';
	const { date: daterange }: { date: App.JuaraCalendar[] } = $props();
</script>

<div class="rounded-xl bg-amber-900 md:rounded-3xl">
	<div class="grid grid-cols-7">
		{#each ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'] as day}
			<div class="p-2 text-center text-[calc(var(--w)*0.025)]">{day}</div>
		{/each}
	</div>
	<div
		class="grid grid-cols-7 gap-y-2 overflow-hidden rounded-xl bg-[var(--color-primary)] md:gap-y-3 md:rounded-3xl md:py-2"
	>
		{#each daterange as { date, end, inPeriode, inCurrentMonth, hasEvent, start, today }, i}
			<div
				class="date-item relative z-1 flex aspect-square items-center justify-center overflow-hidden text-black lg:aspect-[5/3.5]"
				class:start
				class:end
				class:today
				class:range={inPeriode}
			>
				<button
					class="relative flex aspect-square h-full items-center justify-center rounded-full p-2 text-[var(--color-secondary)] transition-colors duration-300
					{dayjs().isAfter(date) && hasEvent && !start && !end ? 'bg-amber-700/50' : ''}"
					class:!bg-[var(--color-secondary)]={start || end}
					class:!text-[var(--color-primary)]={start || end || hasEvent}
					class:bg-amber-700={hasEvent}
					class:notInCurrentMonth={!inCurrentMonth}
					title={start ? 'Start JuaraGCP' : end ? 'Deadline JuaraGCP' : ''}
				>
					<span
						class="text-[calc(var(--w)*0.045)] lg:text-[calc(var(--w)*0.035)]"
						class:font-semibold={inCurrentMonth}
					>
						{dayjs(date).format('D')}
					</span>
				</button>
			</div>
		{/each}
	</div>
</div>

<style lang="postcss">
	@import 'tailwindcss/theme' theme(reference);

	.date-item {
		&.range::before {
			content: '';
			@apply pointer-events-none absolute top-1/2 left-0 -z-1 size-full -translate-y-1/2 bg-[var(--color-secondary)]/10 brightness-95 backdrop-grayscale-100;
		}
		&.start::before {
			@apply left-1/2;
		}

		&.end::before {
			@apply right-1/2 left-[unset];
		}

		&.today button {
			@apply border-[calc(var(--w)*0.01)] border-[var(--color-secondary)];
		}

		button.notInCurrentMonth::after {
			content: '';
			@apply absolute inset-0 size-full scale-x-150 bg-[var(--color-primary)]/70;
		}
	}
</style>
