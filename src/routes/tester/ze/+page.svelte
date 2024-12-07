<script>
	// @ts-nocheck

	import Quiz from '../../../lib/components/AbcdQuiz.svelte';
	import quizData from '../../../lib/data/zaklady_ekonomie/quiz/ze_1.json';

	let correctAnswersCount = 0;
</script>

<div class="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6 text-gray-900">
	<h1 class="text-4xl font-bold mb-6 text-center">1. Vedecké základy ekonomickej teórie</h1>
	<Quiz {quizData} bind:correctAnswersCount />
</div>
