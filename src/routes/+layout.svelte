<script>
	import '../app.css';
	import Footer from '$lib/components/Footer.svelte';
	import Header from '$lib/components/Header.svelte';
</script>

<div class="relative flex flex-col mx-auto w-full text-sm sm:text-base min-h-screen bg-gray-200">
	<Header />
	<main class="flex-grow">
		<slot />
	</main>
	<Footer />
</div>
