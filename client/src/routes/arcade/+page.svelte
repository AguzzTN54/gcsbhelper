<script>
	import Form from './_/Form.svelte';
</script>

<svelte:head>
	<title>CloudSkillBoost Arcade Progress Tracker</title>
</svelte:head>

<section class="font-extrabold p-2 flex flex-col h-full">
	<h1 class="text-3xl md:text-4xl text-center p-3 sm:p-5">
		<span class="brutal-text after:!bg-sky-600 text-white italic"> Arcade </span> Progress Tracker
	</h1>

	<Form />

	<article class="mb-5 px-[2%] text-center text-sm md:text-base">
		<span class="brutal-text after:!bg-green-300">Privacy First</span> — By default, this site does
		not collect any personally identifiable data. We will create a unique
		<span class="brutal-text after:!bg-indigo-200">Hashed ID</span> solely to help us analyze course
		progress, which in turn helps other users complete the course.
	</article>
</section>
