<script>
	import { getContext } from 'svelte';
	import { fade } from 'svelte/transition';
	import { pointList, profile } from '$lib/stores/app-store';
	import { getBonus, getBonusMilestone } from '$lib/helpers/arcade/calculator';
	import Counter from '$comp/Counter.svelte';
	import Links from './_links.svelte';

	const modalHandle = getContext('modalHandle');
	const { name: user, last_update, email } = $profile;
	const { trivia, arcade, skillbadge: skillbadges } = $pointList;
	const bonus = getBonus({ arcade, skillbadges, trivia });
</script>

<div class="wrapper" class:empty={!email && !user} transition:fade>
	<button class="user" on:click={modalHandle}>
		<h2>
			<i class="gc-triangle-down"></i>
			{user || 'Your Accounts'}
		</h2>
		<span> {email || ''}</span>
	</button>

	{#if !email && !user}
		<div class="nodata">No Data Recorded for Your Account, please contact your facilitator!</div>
	{:else}
		<div class="table">
			<div class="row">
				<div class="col">
					<div class="head">SkillBadges Complete</div>
					<div class="body"><Counter max={skillbadges} /></div>
				</div>
				<div class="col">
					<div class="head">Trivia Complete</div>
					<div class="body"><Counter max={trivia} /></div>
				</div>
				<div class="col">
					<div class="head">Arcade Complete</div>
					<div class="body"><Counter max={arcade} /></div>
				</div>
			</div>
			<div class="row sync">
				<span>Last Sync: <b>{last_update}</b></span>
			</div>
		</div>

		<div class="milestone">
			<h1>{getBonusMilestone(bonus)}</h1>
			<div class="bonus">+<Counter max={bonus} /> <span>bonus point</span></div>
		</div>

		<Links />
	{/if}
</div>

<style>
	.wrapper {
		text-align: center;
		width: 750px;
		max-width: calc(0.9 * var(--screen-width));
		height: 90%;
	}
	.wrapper.empty {
		height: 50%;
	}

	button.user {
		background-color: transparent;
		border: none;
		font-size: inherit;
		position: relative;
		margin-bottom: 5%;
	}

	button.user i {
		position: absolute;
		left: 0;
		top: 50%;
		transform: translate(-100%, -50%);
		font-size: large;
		line-height: 0;
	}

	button.user h2 {
		position: relative;
	}

	button.user h2::after {
		content: '';
		position: absolute;
		width: 100%;
		bottom: -25%;
		left: 0;
		border-bottom: 1px solid #aaa;
	}

	button.user span {
		display: block;
		margin-top: 0.55rem;
		font-size: 1rem;
		color: #888;
	}

	h1 {
		font-size: large;
		padding: 0.5rem 7%;
		border-radius: 2rem;
		color: var(--color-theme-1);
		margin: 1.5rem auto 2%;
		width: fit-content;
		position: relative;
		background-color: #fff;
	}
	h1::before {
		background-image: var(--color-gradient);
		content: '';
		height: 100%;
		width: 100%;
		border-radius: inherit;
		position: absolute;
		top: 50%;
		left: 50%;
		z-index: -1;
		transform: translate(-50%, -50%) scaleY(1.1) scaleX(1.01);
	}

	.table {
		border-radius: 0.5rem;
		overflow: hidden;
		border: 1px solid #999;
		border-bottom: none;
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
		font-size: 0.9rem;
		padding: 0.75rem 0.3rem;
	}

	.col {
		flex: 1;
		flex-basis: 33.333333333333%;
		border: 1px solid #999;
		text-align: center;
		transition: background 0.5s;
	}
	.col:hover {
		background-color: #f2f2f2;
	}

	.body {
		padding: 1rem 0.3rem;
		font-weight: 800;
		font-size: xx-large;
	}

	.sync {
		font-size: small;
		padding: 0.2rem 1rem;
		text-align: right;
		background-image: var(--color-gradient);
		background-size: 300%;
		background-position: 60%;
		color: #fff;
	}

	.sync span {
		margin-left: auto;
	}

	.bonus {
		font-weight: 800;
		font-size: 3rem;
	}
	.bonus span {
		font-size: initial;
		font-weight: 600;
		display: inline-block;
		width: min-content;
		text-align: left;
		line-height: 110%;
		transform: translateY(-15%);
	}
</style>
