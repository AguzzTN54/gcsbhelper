<script>
	import { pointList } from '$lib/stores/app-store';
	const { skillbadges, trivia, arcade, bonus, additional } = $pointList;
	const total = skillbadges + trivia + arcade + additional + bonus;
</script>

<section>
	<h2 id="milestone" class="press"># Your Milestone</h2>

	<div class="table">
		<div class="row">
			<div class="col">
				<div class="head">Skill Point</div>
				<div class="body">+{skillbadges}</div>
			</div>
			<div class="col">
				<div class="head">Trivia Point</div>
				<div class="body">+{trivia}</div>
			</div>
			<div class="col">
				<div class="head">Arcade Point</div>
				<div class="body">+{arcade}</div>
			</div>
			<div class="col">
				<div class="head">Milestone Bonus</div>
				<div class="body">+{bonus}</div>
			</div>
			<div class="col">
				<div class="head">Additional</div>
				<div class="body">
					<span> +{additional} </span>
				</div>
			</div>
			<div class="col">
				<div class="head">Total</div>
				<div class="body">{total}</div>
			</div>
		</div>
	</div>
</section>

<style>
	section {
		margin: 0 5% 1%;
		border-top: 1px solid #ccc;
		padding-bottom: calc(0.075 * var(--screen-height));
	}

	h2 {
		font-size: initial;
		text-transform: uppercase;
		font-weight: 800;
		padding: calc(0.05 * var(--screen-height)) 0 calc(0.03 * var(--screen-height));
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
		flex-basis: calc(100% / 6);
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

	/* .milestone {
		font-size: larger;
	} */

	@media screen and (max-width: 800px) {
		h2 {
			padding: 1rem 0;
		}
		.col {
			flex-basis: calc(100% / 3);
		}
	}

	@media screen and (max-width: 450px) {
		.col {
			flex-basis: 50%;
		}
	}
</style>
