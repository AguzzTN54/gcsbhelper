<script>
	export let tier = 0;
</script>

<div class="tier">
	{#if tier === 0}
		<h3>NO TIER</h3>
	{:else}
		<h3>TIER {tier}</h3>
	{/if}
</div>

{#if tier > 0}
	<div class="notes">
		<p>
			Selamat, kamu telah menyelesaikan salah satu syarat untuk mendapatkan reward Tier {tier}!!
			<br />
			Eits... jangan stop di sini, masih ada 1 step lagi agar kamu sepenuhnya layak mendapatkan Hadiah.
			Nantikan Info selanjutnya dari <b>#JuaraGCP</b>!
		</p>
	</div>
{/if}

<style>
	.tier {
		padding: calc(0.01 * var(--screen-height));
	}
	.tier h3 {
		font-size: calc(0.1 * var(--screen-height));
		font-weight: 800;
	}

	@media screen and (max-width: 540px) {
		.tier h3 {
			font-size: calc(0.07 * var(--screen-height));
		}
	}

	.notes {
		width: 600px;
		max-width: 100%;
		padding: 0.5rem 1rem 1rem;
		border: 2px dashed var(--color-theme-1);
		color: var(--color-theme-1);
		border-radius: 1rem;
		margin: auto;
	}
</style>
