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
		width: 700px;
		max-width: 100%;
	}

	.table {
		border-radius: 0.75rem;
		box-shadow: var(--outer-shadow);
	}
	.table,
	.row {
		width: 100%;
	}
	.row {
		border-radius: inherit;
		overflow: hidden;
		display: flex;
		flex-wrap: wrap;
	}

	.col {
		flex: 1;
		flex-basis: calc(100% / 3);
		text-align: center;
		transition: background 0.5s;
		box-shadow: var(--inner-shadow);
	}

	.head {
		font-weight: 500;
		padding: 0.75rem 0.3rem;
		position: relative;

		&::after {
			content: '';
			position: absolute;
			width: 75%;
			left: 50%;
			transform: translateX(-50%);
			bottom: 0;
			border-bottom: 1px solid #000;
		}
	}

	.body {
		padding: 1rem 0.3rem;

		&:not(.milestone) {
			font-weight: 800;
			font-size: x-large;
		}
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
