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
			This site is not affiliated with Google Cloud Skill Boost or Google Cloud Platform. <b
				>We do not store your data on our server</b
			>. Your Public Profile will be processed directly on your device, and the official records are
			retrieved directly from the spreadsheet sources provided by the facilitators who have shared
			them with us.
		</span>
	</div>

	<span class="author">
		Made by
		<a href="http://github.com/AguzzTN54" target="_blank" rel="noopener noreferrer"> AguzzTN54 </a>
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
	.author a {
		color: #fff;
		text-decoration: underline;
		transition: all 0.25s;
		font-weight: bold;
	}
	.author a:hover {
		background-color: #fff;
		color: var(--color-theme-1);
	}

	.marquee .disclaimer span {
		display: block;
		width: fit-content;
		animation: marquee 60s linear infinite;
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
