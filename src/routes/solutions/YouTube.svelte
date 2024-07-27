<script>
	export let videoID = '';
</script>

{#if videoID}
	<iframe
		src="https://www.youtube.com/embed/{videoID}"
		title=""
		frameBorder="0"
		allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
		allowFullScreen
	>
	</iframe>
{/if}

<style>
	iframe {
		width: 100%;
		aspect-ratio: 16/9;
		margin-bottom: 3rem;
	}
</style>
