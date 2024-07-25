<script>
	const marquee = (content) => {
		const setMarquee = () => {
			const titleContainer = content.querySelector('.disclaimer');
			const titleEl = titleContainer.querySelector('span');
			const containerWidth = titleContainer.offsetWidth;
			const titleWidth = titleEl.offsetWidth;
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
			This site is not affiliated with Google Cloud Skill Boost or Google Cloud Platform. This site
			is created solely to help you track your progress.
		</span>
	</div>

	<span class="author">
		Created by <a href="http://github.com/AguzzTN54" target="_blank" rel="noopener noreferrer">
			???
		</a>
	</span>
</div>

<style>
	.footnote {
		width: var(--screen-width);
		display: flex;
		overflow: hidden;
		background-color: #fff;
		padding: 0.5% 2.5%;
		font-size: smaller;
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
	.marquee .disclaimer span {
		display: block;
		width: fit-content;
		animation: marquee 20s linear infinite;
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
