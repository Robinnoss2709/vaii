<script>
	import SubjectCard from '../../lib/components/SubjectCard.svelte';
	import subjects from '../../lib/data/subjects.json';

	let searchQuery = '';
	let selectedField = '';
	let selectedYear = '';
	let selectedStudy = '';
	let selectedSemester = '';

	function clearFilters() {
		selectedField = '';
		selectedYear = '';
		selectedStudy = '';
		selectedSemester = '';
	}

	const bachelorFields = [
		'Informatika',
		'Informatika a riadenie',
		'Informačné a sieťové technológie',
		'Manažment',
		'Počítačové inžinierstvo'
	];

	const engineerFields = [
		'Aplikované sieťové inžinierstvo',
		'Biomedicínska Informatika',
		'Inteligentné informačné systémy',
		'Informačné systémy',
		'Informačný manažment',
		'Počítačové inžinierstvo'
	];

	const years = [1, 2, 3];
	const studies = ['Bc.', 'Ing.'];
	const semesters = ['Zimný', 'Letný'];
</script>

<div class="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
	<h1 class="text-4xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-6 text-center">
		Vyber si svoj predmet
	</h1>

	<div class="flex justify-center mb-5 text-gray-900">
		<input
			type="text"
			bind:value={searchQuery}
			placeholder="Vyhľadaj predmet..."
			class="basic-input"
		/>
	</div>

	<div class="text-gray-900 flex flex-col sm:flex-row justify-center mb-5 gap-4">
		<div class="flex items-center mx-auto">
			<i class="fa-solid fa-filter mr-2"></i>
		</div>
		<div class="flex items-center">
			<select bind:value={selectedStudy} class="basic-input">
				<option value="">Štúdium</option>
				{#each studies as study}
					<option value={study}>{study}</option>
				{/each}
			</select>
		</div>
		<div class="flex items-center">
			<select bind:value={selectedField} class="basic-input">
				<option value="">Odbor</option>
				{#if selectedStudy === 'Bc.'}
					{#each bachelorFields as field}
						<option value={field}>{field}</option>
					{/each}
				{/if}
				{#if selectedStudy === 'Ing.'}
					{#each engineerFields as field}
						<option value={field}>{field}</option>
					{/each}
				{/if}
			</select>
		</div>
		<div class="flex items-center">
			<select bind:value={selectedYear} class="basic-input">
				<option value="">Ročník</option>
				{#each years as year}
					<option value={year}>{year}</option>
				{/each}
			</select>
		</div>

		<div class="flex items-center">
			<select bind:value={selectedSemester} class="basic-input">
				<option value="">Semester</option>
				{#each semesters as semester}
					<option value={semester}>{semester}</option>
				{/each}
			</select>
		</div>
		<button
			type="button"
			class="flex items-center underline text-green-400 font-light cursor-pointer justify-center"
			on:click={clearFilters}
		>
			Zruš filtre
		</button>
	</div>

	<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
		{#each subjects as subject}
			{#if (!selectedStudy || subject.study === selectedStudy) && (!selectedField || subject.fields.includes(selectedField)) && (!selectedYear || subject.year === Number(selectedYear)) && (!selectedSemester || subject.semester === selectedSemester) && subject.name
					.toLowerCase()
					.includes(searchQuery.toLowerCase())}
				<SubjectCard {subject} />
			{/if}
		{/each}
	</div>
</div>
