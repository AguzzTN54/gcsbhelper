<script>
	export let tierData;
	const { tier, status } = tierData || {};
</script>

<div class="tier">
	{#if tier === 0 || status === 'incomplete'}
		<h3>NO TIER</h3>
	{:else}
		<h3>TIER {tier}</h3>
	{/if}
</div>

{#if status === 'incomplete' && tier > 0}
	<div class="notes">
		<p>
			Badge(s) dengan label "<b>Mandatory</b>" wajib diselesaikan!
		</p>
	</div>
{:else if tier > 0}
	<div class="notes">
		<p>
			Selamat! Kini kamu bisa <b>Cek Kembali Email Welcome</b> dari #JuaraGCP untuk mengisi
			<b> Completion Form </b> dan nantikan info berikutnya dari #JuaraGCP!
			<br />
			Eits... tapi jangan stop di sini!! masih banyak materi GCP yang bisa kamu pelajari di
			<a href="https://www.cloudskillsboost.google/catalog" target="_blank">Cloud Skill Boost</a>!!
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

	a {
		text-decoration: underline;
	}

	.notes {
		width: 650px;
		max-width: 100%;
		padding: 0.5rem 1rem 1rem;
		border: 2px dashed var(--color-theme-1);
		color: var(--color-theme-1);
		border-radius: 1rem;
		margin: auto;
	}
</style>
