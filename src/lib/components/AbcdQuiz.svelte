<script>
    import { onMount } from "svelte";

    export let quizData;

    let selectedAnswers = {};
    let correctAnswersCount = 0;

    // Shuffle funkcia
    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function shuffleQuizData() {
        // Zamiešaj otázky aj odpovede
        quizData = quizData.map(topic => {
            topic.questions = shuffle(topic.questions);
            topic.questions.forEach(question => {
                question.answers = shuffle(question.answers);
            });
            return topic;
        });
    }

    onMount(() => {
        // Zamiešaj otázky aj odpovede pri načítaní komponentu
        shuffleQuizData();
    });

    function checkCorrect(questionId, answer) {
        if (selectedAnswers[questionId]) return;

        selectedAnswers[questionId] = answer;

        if (answer.isCorrect) {
            correctAnswersCount += 1;
        }
    }

    function isQuestionAnswered(questionId) {
        return !!selectedAnswers[questionId];
    }

    function resetQuiz() {
        selectedAnswers = {};
        correctAnswersCount = 0;
        shuffleQuizData(); 
        window.scrollTo(0, 0);
    }

    const totalQuestions = quizData.reduce((total, topic) => total + topic.questions.length, 0);

    export { correctAnswersCount };
</script>

<div class="fixed bottom-4 right-4 shadow-lg flex flex-auto gap-2 items-center">
    <button
        on:click={resetQuiz}
        class="text-lg font-bold bg-red-500 border-2 border-gray-900 p-2 rounded-lg"
    >
        Reset
    </button>
    <p class="text-lg font-bold bg-green-500 border-2 border-gray-900 p-2 rounded-lg">{correctAnswersCount}/{totalQuestions}</p>
</div>

{#each quizData as topic}
    <div class="my-4 p-4 border-2 border-gray-400 rounded-lg">
        {#each topic.questions as question, questionIndex}
            <div class="mb-4 bg-gray-300 p-2 rounded-xl border-2 border-gray-400">
                <p class="font-bold text-gray-900 mb-4 ">{questionIndex + 1}. {question.question}</p>
                <ul>
                    {#each question.answers as answer}
                        <li>
                            <button
                                class="w-full text-left p-2 rounded-md transition-colors duration-300 border border-gray-900 mb-1"
                                class:bg-green-600={isQuestionAnswered(question.id) && answer.isCorrect && selectedAnswers[question.id] === answer}
                                class:bg-red-500={isQuestionAnswered(question.id) && selectedAnswers[question.id] === answer && !answer.isCorrect}
                                class:opacity-50={isQuestionAnswered(question.id)} 
                                on:click={() => checkCorrect(question.id, answer)}
                                disabled={isQuestionAnswered(question.id)} 
                            >
                                {answer.answer}
                            </button>
                        </li>
                    {/each}
                </ul>
                <div class="mt-2">
                    {#if isQuestionAnswered(question.id)}
                        <p class="text-sm text-gray-600">
                            {selectedAnswers[question.id].isCorrect ? 'Správne!' : 'Nesprávne!'}
                        </p>
                        {#if !selectedAnswers[question.id].isCorrect} 
                            <p class="text-sm text-red-600">
                                Správna odpoveď: 
                                {#each question.answers as answer}
                                    {#if answer.isCorrect}
                                        {answer.answer}
                                    {/if}
                                {/each}
                            </p>
                        {/if}
                    {/if}
                </div>
            </div>
        {/each}
    </div>
{/each}
