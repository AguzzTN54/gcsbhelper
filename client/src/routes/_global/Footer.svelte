<script lang="ts">
	const marquee = (content: HTMLElement) => {
		const setMarquee = () => {
			const titleContainer = content.querySelector('.disclaimer') as HTMLElement;
			const titleEl = titleContainer?.querySelector('span');
			const containerWidth = titleContainer?.offsetWidth || 0;
			const titleWidth = titleEl?.offsetWidth || 0;
			if (containerWidth > titleWidth) return content.classList.remove('marquee');
			content.classList.add('marquee');
			content.style.setProperty('--marquee-width', `${containerWidth}px`);
		};
		new ResizeObserver(setMarquee).observe(content);
	};
</script>

<div class="footnote" use:marquee>
	<div class="disclaimer">
		<span>
			This site is not officially affiliated with
			<a href="https://cloudskillsboost.google"> Google Cloud Skill Boost </a>
			<!-- or <a href="https://cloud.google.com/"> JuaraGCP </a>! -->
			<!-- <b> We do not store or even proccess your data on our server! </b> -->
		</span>
	</div>

	<span class="author">
		Made by
		<a
			href="http://github.com/AguzzTN54/gcsbhelper"
			target="_blank"
			rel="noopener noreferrer"
			title="Agus Sedunia"
		>
			AguzzTN54
		</a>
	</span>
</div>

<style>
	.footnote {
		width: var(--screen-width);
		display: flex;
		overflow: hidden;
		background-image: var(--color-gradient);
		background-size: 150%;
		color: #fff;
		padding: 0.5% 2.5%;
		font-size: smaller;
		view-transition-name: footer;
	}

	.footnote span {
		display: block;
		white-space: nowrap;
		width: fit-content;
	}
	.disclaimer {
		width: 100%;
		overflow: hidden;
	}
	.author {
		margin-left: auto;
		width: 100%;
		padding-left: 2%;
	}

	a {
		color: #fff;
		text-decoration: underline;
		transition: all 0.25s;
	}

	.author a {
		font-weight: bold;
	}
	.author a:hover {
		background-color: #fff;
		color: var(--color-theme-1);
	}

	:global(.marquee .disclaimer span) {
		display: block;
		width: fit-content;
		animation: marquee 25s linear infinite;
	}

	@keyframes marquee {
		from {
			transform: translateX(var(--marquee-width));
		}
		to {
			transform: translateX(-100%);
		}
	}
</style>
