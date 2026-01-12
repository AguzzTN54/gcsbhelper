<script lang="ts">
	// @ts-ignore
	import baffle from 'baffle';
	import { juaraSeason } from '$lib/data/config';
	import { delay } from '$lib/helpers/dateTime';
	import { getRank } from '$lib/helpers/loader.profile';
	import Tooltip from '$reusable/Tooltip';
	import { onMount } from 'svelte';

	let bfTarget = $state<HTMLElement | null>(null);

	interface Props {
		uuid: string;
		points?: number;
		isEligible?: boolean;
	}
	const { uuid, points, isEligible }: Props = $props();

	let percent = $state<number | null>();

	let b = $state<any>();
	onMount(() => {
		b = baffle(bfTarget, {
			characters: '░█/<▒▓▒▒░▒██▒▒▓/█▒ ▓▒░▓█ █░▒>░ ▓░▒░▓█0123456789',
			speed: 75
		});
		b.start();
	});

	$inspect({ points });

	let tmpPoint = $state<number | undefined>(undefined);
	const syncRank = async () => {
		if (!isEligible) return b.text(() => 'N/A').reveal(1500);
		if (typeof points !== 'number') return;
		if (tmpPoint === points) return;
		tmpPoint = points;

		const data = await getRank(uuid, juaraSeason.seasonid);
		const { position, percentSlices } = data;
		await delay(1000);
		b.text(() => String(position)).reveal(1000);
		percent = percentSlices;
	};

	$effect(() => {
		b?.start();

		try {
			syncRank();
		} catch (e) {
			console.error(e);
			b.text(() => 'Error').reveal(1500);
		}
	});
</script>

<div
	class="flex min-h-[92px] w-full flex-col items-center px-1 py-4 sm:col-span-1 sm:w-full sm:border-t-0 sm:p-2 sm:px-5"
>
	<div class="w-max text-xs font-semibold sm:text-sm">Posisi kamu pada platform ini</div>
	<div class="relative mt-5 mb-1 text-4xl font-black">
		<span
			class="absolute bottom-full left-1/2 -mb-2.5 block -translate-x-1/2 text-lg text-transparent"
			style="--fa-primary-color:var(--color-secondary)"
		>
			<i class="fasdl fa-crown"> </i>
		</span>
		<span bind:this={bfTarget}> N/A </span>
	</div>

	<Tooltip>
		{#snippet popup()}
			<div class="w-80 max-w-full p-1">
				<p>
					Kalkulasi hanya berdasarkan data dari pengguna platform ini, Jumlah point yang sama akan
					memiliki ranking yang sama tanpa mempertimbangkan kecepatan penyelesaian. Sehingga <b>
						pasti tidak akurat
					</b>
					dengan data yang diolah oleh Tim Resmi JuaraGCP.
				</p>
			</div>
		{/snippet}

		{#if typeof percent === 'number' && percent > 0}
			<div class="text-xs">
				<p class="inline-block">
					<span class="bg-[var(--color-third)]/20 font-semibold"> {percent}% </span> partisipan berada
					pada posisi yang sama
				</p>
				<span class="text-xs text-transparent" style="--fa-primary-color:var(--color-secondary)">
					<i class="fasdl fa-circle-info"></i>
				</span>
			</div>
		{/if}
	</Tooltip>
</div>
