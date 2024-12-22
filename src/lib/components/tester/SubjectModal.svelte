<script lang="ts">
	export let isOpen: boolean = false; // Viditeľnosť modalu
	export let isEditing: boolean = false; // Pridať alebo upraviť režim
	export let subjectData: any; // Dáta predmetu na úpravu alebo pridanie
	export let studies: string[] = []; // Možnosti pre štúdiá (Bc., Ing.)
	export let bachelorFields: string[] = []; // Možnosti pre odbory bakalárskeho štúdia
	export let engineerFields: string[] = []; // Možnosti pre odbory inžinierskeho štúdia
	export let years: number[] = []; // Možnosti pre ročníky
	export let semesters: string[] = []; // Možnosti pre semestre

	// Udalosti pre rodičovský komponent
	export let onCancel: () => void;
	export let onSave: (subject: any) => void;

	// Povinné polia na overenie
	let errorMessage = '';

	// Kontrola validácie dát
	function validateForm() {
		if (
			!subjectData.name ||
			!subjectData.study ||
			!subjectData.fields.length ||
			!subjectData.year ||
			!subjectData.semester
		) {
			errorMessage = 'Vyplňte prosím všetky povinné polia.';
			return false;
		}
		errorMessage = '';
		return true;
	}

	// Uloženie predmetu
	function save() {
		if (validateForm()) {
			onSave(subjectData);
		}
	}

	// Získanie odborov podľa typu štúdia
	$: availableFields =
		subjectData.study === 'Bc.'
			? bachelorFields
			: subjectData.study === 'Ing.'
				? engineerFields
				: [];
</script>

{#if isOpen}
	<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
		<div class="bg-white w-full max-w-lg p-6 rounded-lg shadow-lg relative">
			<h2 class="text-xl font-bold mb-4">
				{isEditing ? 'Upraviť predmet' : 'Pridať nový predmet'}
			</h2>
			<form>
				<div class="mb-4">
					<label for="name" class="block text-sm font-medium text-gray-700">Názov predmetu</label>
					<input
						id="name"
						type="text"
						bind:value={subjectData.name}
						class="basic-input"
						placeholder="Názov predmetu"
					/>
				</div>

				<div class="mb-4">
					<label for="study" class="block text-sm font-medium text-gray-700">Štúdium</label>
					<select id="study" bind:value={subjectData.study} class="basic-input">
						<option value="">Vyberte štúdium</option>
						{#each studies as study}
							<option value={study}>{study}</option>
						{/each}
					</select>
				</div>

				<div class="mb-4">
					<label for="fields" class="block text-sm font-medium text-gray-700">Odbor</label>
					<select id="fields" bind:value={subjectData.fields} class="basic-input" multiple>
						{#if availableFields.length === 0}
							<option disabled value="">Vyberte najprv štúdium</option>
						{:else}
							{#each availableFields as field}
								<option value={field}>{field}</option>
							{/each}
						{/if}
					</select>
					<p class="text-sm text-gray-500 mt-1">
						Môžete vybrať viac odborov pomocou Ctrl (Windows) alebo Command (Mac).
					</p>
				</div>

				<div class="mb-4">
					<label for="year" class="block text-sm font-medium text-gray-700">Ročník</label>
					<select id="year" bind:value={subjectData.year} class="basic-input">
						<option value="">Vyberte ročník</option>
						{#each years as year}
							<option value={year}>{year}</option>
						{/each}
					</select>
				</div>

				<div class="mb-4">
					<label for="semester" class="block text-sm font-medium text-gray-700">Semester</label>
					<select id="semester" bind:value={subjectData.semester} class="basic-input">
						<option value="">Vyberte semester</option>
						{#each semesters as semester}
							<option value={semester}>{semester}</option>
						{/each}
					</select>
				</div>

				<div class="mb-4">
					<label for="link" class="block text-sm font-medium text-gray-700"
						>Odkaz na materiály</label
					>
					<input
						id="link"
						type="url"
						bind:value={subjectData.link}
						class="basic-input"
						placeholder="Odkaz na materiály"
					/>
				</div>

				{#if errorMessage}
					<p class="text-red-500 text-sm mb-4">{errorMessage}</p>
				{/if}

				<div class="flex justify-end space-x-3">
					<button
						type="button"
						class="basic-button bg-gray-300 hover:bg-gray-200"
						on:click={onCancel}
					>
						Zrušiť
					</button>
					<button
						type="button"
						class="basic-button bg-green-600 hover:bg-green-500"
						on:click={save}
					>
						{isEditing ? 'Uložiť zmeny' : 'Pridať'}
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}

<style>
	.basic-input {
		width: 100%;
		padding: 0.5rem;
		border: 1px solid #d1d5db;
		border-radius: 0.375rem;
	}

	.basic-button {
		padding: 0.5rem 1rem;
		border-radius: 0.375rem;
		font-size: 0.875rem;
		font-weight: 500;
		text-align: center;
	}
</style>
