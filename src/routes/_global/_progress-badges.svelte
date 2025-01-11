<script lang="ts">
	import { getContext } from 'svelte';

	interface CourseInfo {
		pathID?: number;
		point?: number;
		isComplete?: boolean;
	}

	interface CoursesDetail extends App.UserCourses, App.SourceCourses {
		point: number;
		isComplete?: boolean;
		token?: string;
		labs?: { hasSolution: boolean }[];
		hasBonus?: boolean;
		validity?: boolean;
	}

	interface Props {
		badgeType?: 'games' | 'skillbadges' | 'bonus';
		data?: (App.CourseList & CourseInfo)[];
		page?: string;
	}

	const { badgeType = 'games', data = [], page = 'arcade' }: Props = $props();
	const isSkill = badgeType === 'skillbadges';
	const isBonus = badgeType === 'bonus';

	let opened = $state([] as string[]);
	const handleModalSol = getContext('handleModalSol') as (x: unknown[]) => void;

	const toggleAccordion = (key: string) => {
		const content = document.querySelector('#' + key);
		if (!opened.includes(key)) {
			opened = [...opened, key];
			content?.setAttribute('style', '--height:' + content.scrollHeight + 'px');
			return;
		}
		opened = opened.filter((k) => k !== key);
		content?.setAttribute('style', '--height:0px');
		return;
	};

	type ProggressProps = App.UserCourses & App.SourceCourses & { validity: boolean };
	const completionProgress = (arr: ProggressProps[]) => {
		const complete = arr.filter(({ validity }) => validity).length;
		const all = arr.length;
		return `${complete}/${all}`;
	};

	const hasTrick = (labs: { hasSolution: boolean }[] = []) => {
		const has = labs.map(({ hasSolution }) => hasSolution) as boolean[];
		return has.includes(true);
	};
</script>

<div class="group">
	{#each data as { courses, title, pathID, point: parentPoint, isComplete, group }, i}
		{@const courseList = courses as CoursesDetail[]}
		{@const progress = completionProgress(courses)}
		<div class="accordion" class:open={opened.includes(group + i)}>
			<button class="handler" onclick={() => toggleAccordion(group + i)}>
				{#if isBonus && pathID}
					<h4>
						<a href="https://www.cloudskillsboost.google/paths/{pathID}" target="_blank">
							{title}
							<small> <i class="gc-external-link"></i></small>
						</a>
					</h4>
				{:else}
					<h4>{title}</h4>
				{/if}

				<div class="pts">
					{#if isBonus && isComplete && pathID}
						<span class="point" style="color: green;"> (+{parentPoint}pts)</span>
					{/if}

					{#if isComplete}
						<span class="complete">
							Complete <i class="gc-check"></i>
						</span>
					{/if}
					<span>{progress}</span>
				</div>

				<div class="icon">
					<i class="gc-chevron-up"></i>
				</div>
			</button>

			<div class="list" id={group + i} style="--height: 0px;">
				{#each courseList as { courseName, courseID, date, validity, required, point, token, labs, hasBonus }}
					<div class="item" class:finished={!!date}>
						<div class="left">
							<div class="left-top">
								<div class="div">
									{#if courseID}
										{@const endpoint = token ? 'games' : `paths/${pathID}/course_templates`}
										{@const path = isSkill ? 'course_templates' : endpoint}
										<a href="https://www.cloudskillsboost.google/{path}/{courseID}" target="_blank">
											{courseName}
											<i class="gc-external-link"></i>
										</a>
									{:else}
										<span>{courseName}</span>
									{/if}

									{#if required}
										<span style="display: inline-block; margin-left: 1rem">
											<b>(Mandatory)</b>
										</span>
									{/if}

									{#if token}
										{#if token}
											<span style="display: inline-block; margin-left: 1rem">
												Access Code: <b>{token}</b>
											</span>
										{:else}
											<span> (Coming Soon) </span>
										{/if}
									{/if}
								</div>

								{#if labs && hasTrick(labs)}
									<div class="solution">
										<button onclick={() => handleModalSol(labs)}>Solution</button>
									</div>
								{/if}
							</div>
							<div class="date">
								{#if date && typeof date !== 'string' && !(date instanceof Date)}
									<span>Earned: {date.format('DD MMMM YYYY')}</span>
								{:else if date}
									<span>Earned: {date}</span>
								{/if}
							</div>
						</div>

						{#if date}
							<div class="pointCheck">
								{#if validity}
									{#if hasBonus}
										<span style="font-size: small;"> (Monsoon Bonus)</span>
									{/if}

									{#if (isBonus && pathID) || page === 'juaragcp'}
										<small class="point"> Complete <i class="gc-check"></i> </small>
									{:else}
										<span class="point"> +{point}pts</span>
									{/if}

									<!-- Outside the program -->
								{:else}
									<small class="invalid"> Finished outside the program </small>
								{/if}
							</div>
						{/if}
					</div>
				{/each}
			</div>
		</div>
	{/each}
</div>

<style>
	.group {
		/* border: 2px solid #ddd; */
		border-radius: 0.5rem;
		box-shadow: var(--outer-shadow);
	}

	h4 {
		font-size: 1rem;
		text-transform: capitalize;
	}

	button.handler {
		width: 100%;
		padding: 1.25rem;
		background-color: transparent;
		border: 0;
		border-top: 2px solid #ddd;
		text-align: left;
		display: flex;
		align-items: center;
	}
	.accordion:first-child button {
		border-top: 0;
	}
	button.handler:focus {
		outline: 2px solid var(--color-theme-1);
	}
	button.handler .pts {
		text-align: right;
		font-size: 1rem;
		opacity: 0.7;
		margin-left: auto;
		margin-right: 2%;
	}
	button.handler span.complete {
		font-size: 0.9rem;
		background-color: rgb(217, 255, 217);
		color: green;
		padding: 0 0.2rem;
		white-space: nowrap;
	}

	button.handler .icon {
		transform: rotate(-180deg);
		transition: transform 0.25s;
	}
	.open button.handler .icon {
		transform: rotate(0deg);
	}

	.list {
		height: var(--height);
		overflow: hidden;
		transition: all 0.25s;
	}

	.item {
		width: 100%;
		padding: calc(0.025 * var(--screen-height));
		border-top: 1px solid #ccc;
		display: flex;
		align-items: center;
		background-color: #fff;
		transition: background 0.25s;
	}

	.item:not(.finished):hover {
		background-color: #efefef;
	}

	.item .left,
	.left-top {
		display: flex;
	}
	.item .left {
		flex-direction: column;
	}
	.date {
		font-style: italic;
		font-size: small;
		opacity: 0.75;
	}

	.item .point {
		color: rgb(20, 178, 20);
	}

	.item .invalid {
		display: block;
		color: rgb(241, 80, 80);
		max-width: 125px;
		line-height: 90%;
	}

	.item a i {
		font-size: small;
	}

	.finished {
		background-color: #f9f9f9;
	}
	.finished a,
	.finished .solution button {
		opacity: 0.5;
		transition: opacity 0.25s;
	}
	.finished a:hover,
	.finished .solution button:hover {
		opacity: 1;
	}

	.solution {
		margin-left: 1rem;
		display: flex;
		align-items: center;
	}

	.solution button {
		background-image: var(--color-gradient);
		background-size: 120%;
		color: #fff;
		padding: 0.2rem 0.5rem;
		border: 0;
		border-radius: 5rem;
		font-size: small;
		transition: transform 0.1s;
	}
	.solution button:active {
		transform: scale(0.9);
	}

	.finished .solution button {
		display: none;
	}
	.finished:hover .solution button {
		display: unset;
	}

	.pointCheck {
		text-align: right;
		margin-left: auto;
	}
</style>
