<script lang="ts">
	import SubjectCard from '../../lib/components/SubjectCard.svelte';
	import { onMount } from 'svelte';
	import { subjectCardSchema } from '$lib/schemas/tester/subjectCardForm'; // Predpokladám, že schéma je uložená v súbore `schemas.ts`
	import { ZodError } from 'zod'; // Uistite sa, že importujete ZodError

	type Subject = {
		id?: number;
		name: string;
		study: string;
		fields: string[];
		year: number | null;
		semester: string;
		link: string;
	};

	let subjects: Subject[] = [];
	let isLoading = true;
	let errorMessage = '';
	let newSubject: Subject = {
		name: '',
		study: '',
		fields: [],
		year: null,
		semester: '',
		link: ''
	};

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

	export let data;
	let { supabase, session } = data;

	$: ({ supabase, session } = data);

	export async function getUserEmail() {
		const {
			data: { user },
			error
		} = await supabase.auth.getUser();
		if (error) {
			console.error('Error fetching user:', error);
			return null;
		}
		return user?.email || null;
	}

	let userEmail = null;
	let isAuthorized = false;

	async function loadSubjects() {
		isLoading = true;
		errorMessage = '';

		try {
			const response = await fetch('/tester');
			if (!response.ok) {
				throw new Error('Failed to fetch subjects');
			}

			subjects = await response.json();
		} catch (error) {
			if (error instanceof Error) {
				errorMessage = error.message;
			} else {
				errorMessage = 'An unknown error occurred';
			}
		} finally {
			isLoading = false;
		}
	}

	let fieldErrors: Record<string, string> = {};

	async function addSubject() {
		fieldErrors = {}; // Resetujeme chyby pred validáciou
		try {
			// Validácia so Zod
			subjectCardSchema.parse(newSubject);

			const response = await fetch('/tester', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(newSubject)
			});

			if (!response.ok) {
				throw new Error('Failed to add subject');
			}

			const addedSubject = await response.json();
			subjects = [...subjects, { ...addedSubject }];
			closeModal();
			resetForm();
		} catch (error) {
			if (error instanceof ZodError) {
				// Mapovanie chýb na konkrétne polia
				error.errors.forEach((err) => {
					if (err.path.length) {
						const field = err.path[0] as string;
						fieldErrors[field] = err.message;
					}
				});
			} else if (error instanceof Error) {
				errorMessage = error.message;
			} else {
				errorMessage = 'An unknown error occurred';
			}
		}
	}

	function resetForm() {
		newSubject = { name: '', study: '', fields: [], year: null, semester: '', link: '' };
		errorMessage = '';
	}

	let searchQuery = '';
	let searchSelectedField = '';
	let searchSelectedYear = '';
	let searchSelectedStudy = '';
	let searchSelectedSemester = '';

	function clearFilters() {
		searchQuery = '';
		searchSelectedField = '';
		searchSelectedYear = '';
		searchSelectedStudy = '';
		searchSelectedSemester = '';
	}

	let isEditing = false;

	function toggleEditMode() {
		isEditing = !isEditing;
	}

	async function deleteSubject(subjectToDelete: Subject) {
		try {
			const response = await fetch(`/tester/${subjectToDelete.id}`, {
				method: 'DELETE'
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.error || 'Failed to delete subject');
			}

			// Aktualizujeme zoznam predmetov odstránením daného predmetu
			subjects = subjects.filter((subject) => subject.id !== subjectToDelete.id);
		} catch (error) {
			console.error('Error deleting subject:', error);
			errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
		}
	}

	let isEditingSubject = false;

	async function editSubject(subjectToEdit: Subject) {
		newSubject = { ...subjectToEdit }; // Nastavíme údaje do formulára
		isEditingSubject = true; // Nastavíme mód na editovanie
		openModal(); // Otvoríme modálne okno
	}

	async function saveEditedSubject() {
		try {
			const response = await fetch(`/tester/${newSubject.id}`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(newSubject)
			});

			if (!response.ok) {
				throw new Error('Failed to edit subject');
			}

			const updatedSubject = await response.json();
			subjects = subjects.map((subject) =>
				subject.id === updatedSubject.id ? updatedSubject : subject
			);
			closeModal();
			resetForm();
			isEditingSubject = false;
		} catch (error) {
			console.error('Error editing subject:', error);
			errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
		}
	}

	let showModal = false;

	function openModal() {
		showModal = true;
	}

	function closeModal() {
		showModal = false;
	}

	onMount(async () => {
		userEmail = await getUserEmail();
		isAuthorized = userEmail === 'fricapsuleceo@gmail.com';
	});

	onMount(() => {
		loadSubjects();
	});
</script>

<div class="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
	<h1 class="text-4xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-6 text-center">
		Vyber si svoj predmet
	</h1>

	<div class="mb-6 gap-5 flex" style:display={isAuthorized ? 'flex' : 'none'}>
		<span
			role="button"
			tabindex="0"
			aria-label="Pridať"
			class="basic-button bg-green-600 hover:bg-green-400 text-2xl"
			onclick={(e) => {
				e.stopPropagation();
				openModal();
				resetForm();
			}}
			onkeydown={(e) => {
				if (e.key === 'Enter' || e.key === ' ') {
					e.preventDefault();
					e.stopPropagation();
					openModal();
					resetForm();
				}
			}}
		>
			<i class="fa-solid fa-plus"></i>
		</span>
		<button
			type="button"
			class={`basic-button ${
				isEditing
					? 'bg-red-500 hover:bg-red-600 text-gray-900'
					: 'bg-blue-500 hover:bg-blue-600  text-gray-900'
			}`}
			onclick={toggleEditMode}
		>
			{isEditing ? 'Dokončiť úpravy' : 'Upraviť karty'}
		</button>
	</div>

	<div class="flex justify-center mb-5 text-gray-900 w-full max-w-4xl">
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
			<select bind:value={searchSelectedStudy} class="basic-input">
				<option value="">Štúdium</option>
				{#each studies as study}
					<option value={study}>{study}</option>
				{/each}
			</select>
		</div>
		<div class="flex items-center">
			<select bind:value={searchSelectedField} class="basic-input">
				<option value="">Odbor</option>
				{#if searchSelectedStudy === 'Bc.'}
					{#each bachelorFields as field}
						<option value={field}>{field}</option>
					{/each}
				{/if}
				{#if searchSelectedStudy === 'Ing.'}
					{#each engineerFields as field}
						<option value={field}>{field}</option>
					{/each}
				{/if}
			</select>
		</div>
		<div class="flex items-center">
			<select bind:value={searchSelectedYear} class="basic-input">
				<option value="">Ročník</option>
				{#each years as year}
					<option value={year}>{year}</option>
				{/each}
			</select>
		</div>

		<div class="flex items-center">
			<select bind:value={searchSelectedSemester} class="basic-input">
				<option value="">Semester</option>
				{#each semesters as semester}
					<option value={semester}>{semester}</option>
				{/each}
			</select>
		</div>
		<button
			type="button"
			class="flex items-center underline text-green-400 font-light cursor-pointer justify-center"
			onclick={clearFilters}
		>
			Zruš filtre
		</button>
	</div>

	{#if showModal}
		<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
			<div class="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg">
				<h2 class="text-2xl font-bold mb-4 text-gray-900">
					{isEditingSubject ? 'Uprav predmet' : 'Pridaj nový predmet'}
				</h2>
				<input
					type="text"
					bind:value={newSubject.name}
					placeholder="Názov predmetu"
					class="basic-input mb-2"
				/>
				{#if fieldErrors.name}
					<p class="text-red-500 mb-2">{fieldErrors.name}</p>
				{/if}
				<select
					bind:value={newSubject.study}
					class="basic-input mb-2"
					onchange={() => (newSubject.fields = [])}
				>
					<option value="">Štúdium</option>
					{#each studies as study}
						<option value={study}>{study}</option>
					{/each}
				</select>
				{#if fieldErrors.study}
					<p class="text-red-500 mb-2">{fieldErrors.study}</p>
				{/if}
				<select bind:value={newSubject.year} class="basic-input mb-2">
					<option value={null} disabled selected hidden>Ročník</option>
					{#each years as year}
						<option value={year}>{year}</option>
					{/each}
				</select>
				{#if fieldErrors.year}
					<p class="text-red-500 mb-2">{fieldErrors.year}</p>
				{/if}

				<select bind:value={newSubject.semester} class="basic-input mb-2">
					<option value="">Semester</option>
					{#each semesters as semester}
						<option value={semester}>{semester}</option>
					{/each}
				</select>
				{#if fieldErrors.semester}
					<p class="text-red-500 mb-2">{fieldErrors.semester}</p>
				{/if}
				<select bind:value={newSubject.fields} class="basic-input mb-2" multiple>
					<option value="" disabled>Vyber odbory</option>
					{#if newSubject.study === 'Bc.'}
						{#each bachelorFields as field}
							<option value={field}>{field}</option>
						{/each}
					{/if}
					{#if newSubject.study === 'Ing.'}
						{#each engineerFields as field}
							<option value={field}>{field}</option>
						{/each}
					{/if}
				</select>
				{#if fieldErrors.fields}
					<p class="text-red-500 mb-2">{fieldErrors.fields}</p>
				{/if}
				<input
					type="text"
					bind:value={newSubject.link}
					placeholder="Odkaz na tester"
					class="basic-input mb-2"
				/>
				{#if fieldErrors.link}
					<p class="text-red-500 mb-4">{fieldErrors.link}</p>
				{/if}
				<div class="flex justify-end gap-4">
					<button
						class="basic-button hover-bg-green bg-gray-500"
						onclick={() => {
							closeModal();
							isEditingSubject = false;
						}}
					>
						Zrušiť
					</button>
					<button
						class="basic-button hover-bg-green bg-gray-500"
						onclick={() => {
							if (isEditingSubject) {
								saveEditedSubject(); // Použijeme nový handler pre uloženie zmien
							} else {
								addSubject();
							}
						}}
					>
						{isEditingSubject ? 'Uložiť zmeny' : 'Pridať predmet'}
					</button>
				</div>
				{#if errorMessage}
					<p class="text-red-500 mt-4">{errorMessage}</p>
				{/if}
			</div>
		</div>
	{/if}

	{#if isLoading}
		<p class="text-gray-900">Načítavam predmety...</p>
	{:else if errorMessage}
		<p class="text-red-500">{errorMessage}</p>
	{:else}
		<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
			{#each subjects as subject}
				{#if (!searchSelectedStudy || subject.study === searchSelectedStudy) && (!searchSelectedField || subject.fields.includes(searchSelectedField)) && (!searchSelectedYear || subject.year === Number(searchSelectedYear)) && (!searchSelectedSemester || subject.semester === searchSelectedSemester) && subject.name
						.toLowerCase()
						.includes(searchQuery.toLowerCase())}
					<SubjectCard {subject} {isEditing} onDelete={deleteSubject} onEdit={editSubject} />
				{/if}
			{/each}
		</div>
	{/if}
</div>
