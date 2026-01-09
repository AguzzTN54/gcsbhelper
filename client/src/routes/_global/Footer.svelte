<script lang="ts">
	import { skillbase } from '$lib/data/config';

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

<div
	class="relative z-99 flex w-screen bg-black/90 px-[2.5%] py-[.5%] text-xs text-white sm:py-0"
	use:marquee
>
	<div class="disclaimer w-full overflow-hidden py-[.5%]">
		<span class="block w-fit whitespace-nowrap">
			This site is NOT affiliated to
			<a href={skillbase} class="brutal-text"> Google Cloud Skill Boost </a>
			or any Facilitators
			<!-- or <a href="https://cloud.google.com/"> JuaraGCP </a>! -->
			<!-- <b> We do not store or even proccess your data on our server! </b> -->
		</span>
	</div>

	<span class="relative inline-block py-[.5%] whitespace-nowrap">
		Made by
		<a
			href="http://github.com/AguzzTN54/gcsbhelper"
			target="_blank"
			rel="noopener noreferrer"
			title="Agus Sedunia"
			class="author brutal-text text-black"
		>
			AguzzTN54
		</a>
	</span>
</div>

<style lang="postcss">
	@import 'tailwindcss/theme' theme(reference);

	.brutal-text.author::after {
		@apply bg-amber-300;
	}

	:global {
		.marquee .disclaimer span {
			display: block;
			width: fit-content;
			animation: marquee 25s linear infinite;
		}
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
