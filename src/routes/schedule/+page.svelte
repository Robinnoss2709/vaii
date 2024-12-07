<script lang="ts">
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import { scheduleSchema } from '$lib/schemas/schedule';

	let formErrors = writable<Record<string, string>>({}); // Uloženie chýb formulára

	type ScheduleItem = {
		id?: number;
		day: string;
		hour: string;
		subject: string;
		teacher: string;
		classroom: string;
		type: string;
		color: string;
	};

	const schedule = writable<ScheduleItem[]>([]);
	const showModal = writable(false);
	const editMode = writable(false); // Nová premenná na sledovanie režimu úpravy
	let formData: ScheduleItem = {
		day: '',
		hour: '',
		subject: '',
		teacher: '',
		classroom: '',
		type: 'lecture',
		color: 'bg-gray-400'
	};

	let isEditing = false;
	let editingItemId: number | null = null;

	async function fetchSchedule() {
		try {
			const res = await fetch('/api/schedule');
			if (!res.ok) throw new Error('Failed to fetch schedule');
			schedule.set(await res.json());
		} catch (err) {
			console.error('Error fetching schedule:', err);
		}
	}

	function resetForm() {
		formData = {
			day: '',
			hour: '',
			subject: '',
			teacher: '',
			classroom: '',
			type: 'lecture',
			color: 'bg-gray-400'
		};
		isEditing = false;
		editingItemId = null;
	}

	function openModalForAdd(day: string, hour: string) {
		// Skontrolujte, či už existuje predmet pre daný deň a hodinu
		const existingItem = $schedule.find((item) => item.day === day && item.hour === hour);

		if (existingItem) {
			return;
		}

		formData.day = day;
		formData.hour = hour;
		isEditing = false;
		showModal.set(true);
	}

	function openModalForEdit(item: ScheduleItem) {
		formData = { ...item };
		isEditing = true;
		showModal.set(true);
	}

	async function saveItem() {
		// Validácia pomocou Zod
		const validationResult = scheduleSchema.safeParse(formData);

		if (!validationResult.success) {
			// Define the type for the errors object
			type FormErrors = {
				[key: string]: string; // dynamic keys with string values
			};

			// Initialize acc with the specified type
			const errors: FormErrors = validationResult.error.errors.reduce((acc: FormErrors, err) => {
				acc[err.path[0]] = err.message; // Extract error messages
				return acc;
			}, {} as FormErrors); // Specify the initial value type

			formErrors.set(errors); // Set the errors
			return;
		}

		formErrors.set({}); // Vyčistenie chýb, ak je validácia úspešná

		if (!isEditing) {
			await addItem();
		} else {
			await editItem(formData.id!, formData);
		}
		showModal.set(false);
	}

	async function addItem() {
		const validDays = ['Pondelok', 'Utorok', 'Streda', 'Štvrtok', 'Piatok'];
		const validHours = Array.from({ length: 13 }, (_, i) => 7 + i + ':00');

		if (!validDays.includes(formData.day)) {
			alert('Neplatný deň!');
			return;
		}

		if (!validHours.includes(formData.hour)) {
			alert('Neplatná hodina!');
			return;
		}

		// Odoslanie dát na server na pridanie nového predmetu
		const response = await fetch('/api/schedule', {
			method: 'POST',
			body: JSON.stringify(formData),
			headers: { 'Content-Type': 'application/json' }
		});

		if (response.ok) {
			const newItem = await response.json();
			schedule.update((items) => [...items, newItem]); // Pridanie nového predmetu do miestneho stavu
			resetForm();
		} else {
			alert('Chyba pri pridávaní predmetu');
		}
	}

	async function editItem(id: number, updatedData: Partial<ScheduleItem>) {
		const response = await fetch(`/api/schedule/${id}`, {
			method: 'PATCH',
			body: JSON.stringify(updatedData),
			headers: { 'Content-Type': 'application/json' }
		});

		if (response.ok) {
			const updatedItem = await response.json();
			schedule.update((items) => items.map((item) => (item.id === id ? updatedItem : item)));
		} else {
			alert('Chyba pri editovaní predmetu');
		}
	}

	async function deleteItem(id: number) {
		try {
			const response = await fetch(`/api/schedule?id=${id}`, {
				method: 'DELETE'
			});

			if (response.ok) {
				// Aktualizovať stav po úspešnom odstránení
				schedule.update((items) => items.filter((item) => item.id !== id));
			} else {
				const error = await response.json();
				alert(`Chyba pri mazaní: ${error.error || 'Neznáma chyba'}`);
			}
		} catch (err) {
			console.error('Chyba pri mazaní položky:', err);
			alert('Nepodarilo sa vymazať položku. Skúste znova.');
		}
	}

	let colors = {
		blue: 'bg-blue-500',
		red: 'bg-red-500',
		yellow: 'bg-yellow-400',
		green: 'bg-green-700',
		orange: 'bg-orange-400',
		pink: 'bg-pink-400',
		purple: 'bg-purple-400',
		gray: 'bg-gray-400',
		lightBlue: 'bg-blue-300',
		lime: 'bg-green-400'
	};

	// Pridaj novú premennú na sledovanie editačného režimu
	let isEditingSchedule = false;

	// Funkcia na prepnutie editačného režimu
	function toggleEditSchedule() {
		isEditingSchedule = !isEditingSchedule;
	}

	onMount(fetchSchedule);
</script>

<div class="container mx-auto py-8 px-3">
	<!-- Tlačidlo na úpravu rozvrhu -->
	<h1 class="font-bold text-3xl text-gray-900 mb-6 text-center">Rozvrh Hodín</h1>
	<div class="mb-4 text-center">
		<button
			type="button"
			class={`py-1 px-4 rounded-md font-bold transition duration-300 border-2 border-gray-900 ${
				isEditingSchedule
					? 'bg-red-500 hover:bg-red-600 text-gray-900'
					: 'bg-blue-500 hover:bg-blue-600  text-gray-900'
			}`}
			on:click={toggleEditSchedule}
		>
			{isEditingSchedule ? 'Skončiť úpravy' : 'Upraviť rozvrh'}
		</button>
	</div>

	<div class="overflow-x-auto">
		<div
			class="grid grid-cols-[100px_repeat(13,_minmax(0,1fr))] grid-rows-[50px_repeat(5,100px)] border-2 border-gray-900 rounded-sm shadow-md"
		>
			<div
				class="text-gray-900 p-2 font-bold sticky left-0 top-0 z-20 border-2 border-gray-900"
			></div>

			{#each Array.from({ length: 13 }, (_, i) => 7 + i) as hour}
				<div
					class="bg-green-500 text-gray-900 p-2 font-bold sticky top-0 z-10 border-2 border-gray-900"
				>
					{hour}:00
				</div>
			{/each}

			{#each ['Pondelok', 'Utorok', 'Streda', 'Štvrtok', 'Piatok'] as day}
				<div
					class="border-2 border-gray-900 p-2 bg-slate-300 text-gray-900 font-bold sticky left-0 z-10"
				>
					{day}
				</div>
				{#each Array.from({ length: 13 }, (_, i) => 7 + i) as hour}
					<button
						type="button"
						class={`w-full border-2 border-gray-900 p-1 cursor-pointer text-left relative ${
							isEditingSchedule
								? 'hover:bg-green-700 hover:bg-opacity-30 hover:text-gray-900'
								: 'cursor-auto bg-gray-200 text-gray-400'
						}`}
						on:click={() => {
							if (isEditingSchedule) {
								openModalForAdd(day, `${hour}:00`);
							}
						}}
					>
						{#each $schedule.filter((item) => item.day === day && item.hour === `${hour}:00`) as item}
							<div
								class={`relative h-full ${item.color} text-gray-900 rounded p-1 border-2 border-gray-900`}
							>
								<p class="font-semibold">{item.subject}</p>
								<p class="text-sm">{item.teacher}</p>
								{#if item.type === 'lecture'}
									<p class="text-sm">Pr.({item.classroom})</p>
								{:else if item.type === 'exercise'}
									<p class="text-sm">Cv.({item.classroom})</p>
								{/if}

								{#if isEditingSchedule}
									<!-- Tlačidlo na odstránenie -->
									<span
										class="absolute top-0 right-0 border-1 text-red-900 hover:text-red-800 cursor-pointer"
										role="button"
										tabindex="0"
										aria-label="Odstrániť"
										on:click={(e) => {
											e.stopPropagation();
											deleteItem(item.id!);
										}}
										on:keydown={(e) => {
											if (e.key === 'Enter' || e.key === ' ') {
												e.preventDefault();
												e.stopPropagation();
												deleteItem(item.id!);
											}
										}}
									>
										<i class="fas fa-times w-4 h-4"></i>
									</span>

									<!-- Tlačidlo na úpravu -->
									<span
										class="absolute bottom-0 right-0 text-green-900 hover:text-green-800 pr-1 cursor-pointer text-sm"
										role="button"
										tabindex="0"
										aria-label="Upraviť"
										on:click={(e) => {
											e.stopPropagation();
											openModalForEdit(item);
										}}
										on:keydown={(e) => {
											if (e.key === 'Enter' || e.key === ' ') {
												e.preventDefault();
												e.stopPropagation();
												openModalForEdit(item);
											}
										}}
									>
										<i class="fa-solid fa-pen-to-square"></i>
									</span>
								{/if}
							</div>
						{/each}
					</button>
				{/each}
			{/each}
		</div>
	</div>
</div>

{#if $showModal}
	<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
		<div
			class="bg-gray-200 text-gray-900 rounded-lg p-6 shadow-lg border-2 border-slate-900 mx-8 w-full max-w-md"
		>
			<h2 class="text-xl font-bold mb-4 text-center">
				{isEditing ? 'Uprav predmet' : 'Pridaj predmet'}
			</h2>
			<form class="flex flex-col gap-4" on:submit|preventDefault={saveItem}>
				<div>
					<label for="day" class="block text-sm font-bold mb-1">Deň</label>
					<input
						id="day"
						class="basic-input bg-gray-300 cursor-default"
						type="text"
						placeholder="Zadajte deň"
						bind:value={formData.day}
						readonly
					/>
				</div>

				<div>
					<label for="hour" class="block text-sm font-bold mb-1">Hodina</label>
					<input
						id="hour"
						class="basic-input bg-gray-300 cursor-default"
						type="text"
						placeholder="Zadajte hodinu"
						bind:value={formData.hour}
						readonly
					/>
				</div>

				<div>
					<label for="subject" class="block text-sm font-bold mb-1">Predmet</label>
					<input
						id="subject"
						class="basic-input bg-gray-300"
						type="text"
						placeholder="Zadajte predmet"
						bind:value={formData.subject}
						required
					/>
					<p class="text-red-500 text-sm mt-1">{$formErrors.subject}</p>
					<!-- Chyba pre predmet -->
				</div>

				<div>
					<label for="teacher" class="block text-sm font-bold mb-1">Učiteľ</label>
					<input
						id="teacher"
						class="basic-input bg-gray-300"
						type="text"
						placeholder="Zadajte učiteľa"
						bind:value={formData.teacher}
						required
					/>
					<p class="text-red-500 text-sm mt-1">{$formErrors.teacher}</p>
					<!-- Chyba pre učiteľa -->
				</div>

				<div>
					<label for="classroom" class="block text-sm font-bold mb-1">Miestnosť</label>
					<input
						id="classroom"
						class="basic-input bg-gray-300"
						type="text"
						placeholder="Zadajte miestnosť"
						bind:value={formData.classroom}
						required
					/>
					<p class="text-red-500 text-sm mt-1">{$formErrors.classroom}</p>
					<!-- Chyba pre miestnosť -->
				</div>

				<div>
					<p class="block text-sm font-bold mb-1">Typ výučby</p>
					<div class="flex items-center gap-4">
						<label class="flex items-center gap-2">
							<input
								type="radio"
								name="type"
								value="lecture"
								bind:group={formData.type}
								class="border-2 border-gray-500 rounded-full p-2"
							/>
							<span>Prednáška</span>
						</label>
						<label class="flex items-center gap-2">
							<input
								type="radio"
								name="type"
								value="exercise"
								bind:group={formData.type}
								class="border-2 border-gray-500 rounded-full p-2"
							/>
							<span>Cvičenie</span>
						</label>
					</div>
				</div>

				<div>
					<p class="block text-sm font-bold mb-1">Farba</p>
					<div class="flex justify-between">
						{#each Object.entries(colors) as [colorName, colorClass]}
							<button
								type="button"
								class={`rounded-md border-2 border-slate-900 p-3 focus:border-green-400 focus:border-2 ${colorClass}`}
								aria-label={colorName}
								on:click={() => (formData.color = colorClass)}
							>
							</button>
						{/each}
					</div>
				</div>

				<div>
					{#if Object.keys($formErrors).length > 0}
						<div class="text-red-500 text-sm mt-1">Opravte chyby vo formulári a skúste znova.</div>
					{/if}
				</div>
				<div class="flex justify-end gap-2">
					<button
						type="button"
						class="py-2 px-4 rounded-md bg-red-600 text-gray-900 font-bold transition duration-300 hover:bg-red-800 border-2 border-gray-900"
						on:click={() => {
							resetForm();
							showModal.set(false);
						}}
					>
						Zrušiť
					</button>
					<button
						type="submit"
						class="py-2 px-4 rounded-md bg-green-400 text-gray-900 font-bold transition duration-300 hover:bg-green-600 border-2 border-gray-900"
					>
						Uložiť
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}
