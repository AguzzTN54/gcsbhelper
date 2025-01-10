<script lang="ts">
	import { badgeCounter } from '$lib/helpers/calculator-juaragcp';
	import { juaraBadges } from '$lib/stores/app-store';
	import Counter from '$comp/Counter.svelte';

	const { completion, skill } = badgeCounter($juaraBadges);
	const total = completion + skill;
</script>

<section>
	<div class="table">
		<div class="row">
			<div class="col">
				<div class="head">Skill Badges</div>
				<div class="body"><Counter max={skill} interval={50} /></div>
			</div>
			<div class="col">
				<div class="head">Regular Badges</div>
				<div class="body"><Counter max={completion} interval={50} /></div>
			</div>
			<div class="col total">
				<div class="head">Total</div>
				<div class="body"><Counter max={total} interval={50} /></div>
			</div>
		</div>
	</div>
</section>

<style>
	section {
		margin: 1rem auto 1%;
		border-top: 1px solid #ccc;
		width: 700px;
		max-width: 100%;
	}

	.table {
		border-radius: 0.5rem;
		overflow: hidden;
		border: 1px solid #999;
	}
	.table,
	.row {
		width: 100%;
	}
	.row {
		display: flex;
		flex-wrap: wrap;
	}

	.head {
		border-bottom: 1px solid #999;
		font-weight: 700;
		padding: 0.75rem 0.3rem;
	}

	.col {
		flex: 1;
		flex-basis: calc(100% / 3);
		border: 1px solid #999;
		text-align: center;
		transition: background 0.5s;
	}
	.col:hover {
		background-color: #f2f2f2;
	}

	.body {
		padding: 1rem 0.3rem;
	}

	.body:not(.milestone) {
		font-weight: 800;
		font-size: x-large;
	}

	@media screen and (max-width: 450px) {
		.col {
			flex-basis: 50%;
		}

		.col.total {
			flex-basis: 100%;
		}
	}
</style>
