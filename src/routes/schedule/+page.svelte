<script lang="ts">
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';

	type ScheduleItem = {
		id?: number;
		day: string;
		hour: string;
		subject: string;
		teacher: string;
		classroom: string;
		type: string;
	};

	const schedule = writable<ScheduleItem[]>([]);
	const showModal = writable(false);
	let formData = {
		day: '',
		hour: '',
		subject: '',
		teacher: '',
		classroom: '',
		type: 'lecture'
	};

	async function fetchSchedule() {
		const res = await fetch('/api/schedule');
		schedule.set(await res.json());
	}

	async function addItem() {
		const validDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
		const validHours = Array.from({ length: 15 }, (_, i) => 6 + i + ':00');

		if (!validDays.includes(formData.day)) {
			alert('Neplatný deň! Zadajte jeden z dní: Pondelok, Utorok, Streda, Štvrtok, Piatok.');
			return;
		}

		if (!validHours.includes(formData.hour)) {
			alert('Neplatná hodina! Zadajte hodinu medzi 6:00 a 20:00.');
			return;
		}

		if (
			formData.day &&
			formData.hour &&
			formData.subject &&
			formData.teacher &&
			formData.classroom &&
			formData.type
		) {
			await fetch('/api/schedule', {
				method: 'POST',
				body: JSON.stringify(formData),
				headers: { 'Content-Type': 'application/json' }
			});
			fetchSchedule();
			resetForm();
			showModal.set(false);
		}
	}

	function resetForm() {
		formData = { day: '', hour: '', subject: '', teacher: '', classroom: '', type: 'lecture' };
	}

	async function deleteItem(id: number) {
		await fetch(`/api/schedule/${id}`, { method: 'DELETE' });
		fetchSchedule();
	}

	onMount(fetchSchedule);
</script>

<!-- Add Subject Button -->
<!--<div class="flex justify-end mb-4">
	<button
		class="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600"
		on:click={() => {
			resetForm();
			showModal.set(true);
		}}
	>
		Pridaj predmet
	</button>
</div>-->

<div class="container mx-auto py-8 px-3">
	<h1 class="text-2xl font-bold mb-4 text-center">Rozvrh Hodín</h1>
	<div class="overflow-x-auto">
		<div
			class="grid grid-cols-timetable sm:grid-cols-[100px_repeat(5,_minmax(0,1fr))] gap-px border border-gray-300 rounded-lg shadow-md text-center"
		>
			<!-- Header -->
			<div class="bg-green-500 text-gray-900 p-2 font-bold sticky top-0 z-10">Čas</div>
			<div class="bg-green-500 text-gray-900 p-2 font-bold sticky top-0 z-10">Pondelok</div>
			<div class="bg-green-500 text-gray-900 p-2 font-bold sticky top-0 z-10">Utorok</div>
			<div class="bg-green-500 text-gray-900 p-2 font-bold sticky top-0 z-10">Streda</div>
			<div class="bg-green-500 text-gray-900 p-2 font-bold sticky top-0 z-10">Štvrok</div>
			<div class="bg-green-500 text-gray-900 p-2 font-bold sticky top-0 z-10">Piatok</div>

			<!-- Rows -->
			{#each Array.from({ length: 15 }, (_, i) => 6 + i) as hour}
				<!-- Time Column -->
				<div class="border p-2 bg-slate-700 text-white">{hour}:00</div>

				<!-- Day Columns -->
				{#each ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] as day}
					<button
						type="button"
						class="w-full border p-2 hover:bg-green-400 hover:bg-opacity-15 hover:text-gray-900 cursor-pointer text-left bg-transparent text-white"
						on:click={() => {
							formData.day = day;
							formData.hour = `${hour}:00`;
							showModal.set(true);
						}}
					>
						{#each $schedule.filter((item) => item.day === day && item.hour === `${hour}:00`) as item}
							<div class="bg-slate-500 text-gray-900 rounded p-1 mb-1">
								<p class="font-semibold">{item.subject}</p>
								<p class="text-sm">{item.teacher} ({item.classroom})</p>
								<span
									class="text-red-900 text-sm mt-1 cursor-pointer font-bold"
									role="button"
									tabindex="0"
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
									Odstrániť
								</span>
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
			class="bg-slate-950 text-white rounded-lg p-6 shadow-lg border border-slate-700 mx-8 w-full max-w-md"
		>
			<h2 class="text-xl font-bold mb-4 text-center">Pridaj predmet</h2>
			<form class="flex flex-col gap-4" on:submit|preventDefault={addItem}>
				<!-- Day Input -->
				<div>
					<label for="day" class="block text-sm font-bold mb-1">Deň</label>
					<input
						id="day"
						class="basic-input"
						type="text"
						placeholder="Zadajte deň"
						bind:value={formData.day}
					/>
				</div>

				<!-- Hour Input -->
				<div>
					<label for="hour" class="block text-sm font-bold mb-1">Hodina</label>
					<input
						id="hour"
						class="basic-input"
						type="text"
						placeholder="Zadajte hodinu"
						bind:value={formData.hour}
					/>
				</div>

				<!-- Subject Input -->
				<div>
					<label for="subject" class="block text-sm font-bold mb-1">Predmet</label>
					<input
						id="subject"
						class="basic-input"
						type="text"
						placeholder="Zadajte predmet"
						bind:value={formData.subject}
						required
					/>
				</div>

				<!-- Teacher Input -->
				<div>
					<label for="teacher" class="block text-sm font-bold mb-1">Učiteľ</label>
					<input
						id="teacher"
						class="basic-input"
						type="text"
						placeholder="Zadajte učiteľa"
						bind:value={formData.teacher}
						required
					/>
				</div>

				<!-- Classroom Input -->
				<div>
					<label for="classroom" class="block text-sm font-bold mb-1">Miestnosť</label>
					<input
						id="classroom"
						class="basic-input"
						type="text"
						placeholder="Zadajte miestnosť"
						bind:value={formData.classroom}
						required
					/>
				</div>

				<!-- Type Radio Buttons -->
				<div>
					<p class="block text-sm font-bold mb-1">Typ výučby</p>
					<div class="flex items-center gap-4">
						<label class="flex items-center gap-2">
							<input
								type="radio"
								name="type"
								value="lecture"
								bind:group={formData.type}
								class="radio-input"
							/>
							<span>Prednáška</span>
						</label>
						<label class="flex items-center gap-2">
							<input
								type="radio"
								name="type"
								value="exercise"
								bind:group={formData.type}
								class="radio-input"
							/>
							<span>Cvičenie</span>
						</label>
					</div>
				</div>

				<!-- Buttons -->
				<div class="flex justify-end gap-2">
					<button
						type="button"
						class="py-2 px-4 rounded-md bg-gray-500 text-white font-bold transition duration-300 hover:bg-gray-600"
						on:click={() => showModal.set(false)}
					>
						Zrušiť
					</button>
					<button
						type="submit"
						class="py-2 px-4 rounded-md bg-blue-500 text-white font-bold transition duration-300 hover:bg-blue-600"
					>
						Pridať
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}

<style>
	@media (max-width: 640px) {
		.grid-cols-timetable {
			display: grid;
			grid-template-columns: 1fr;
			grid-auto-rows: min-content;
		}
		.grid-cols-timetable > div {
			display: flex;
			flex-direction: column;
			align-items: center;
		}
		.grid-cols-timetable .sticky {
			position: relative;
		}
	}
	.grid-cols-timetable {
		grid-template-columns: 100px repeat(5, 1fr);
	}
	.basic-input {
		border: 1px solid #4a5568;
		padding: 0.5rem;
		border-radius: 0.375rem;
		background-color: #1e293b;
		color: #f8fafc;
		width: 100%;
	}
	.basic-input::placeholder {
		color: #94a3b8;
	}
	.radio-input {
		appearance: none;
		width: 16px;
		height: 16px;
		border: 2px solid #4a5568;
		border-radius: 50%;
		background-color: #1e293b;
		cursor: pointer;
		transition:
			background-color 0.2s,
			border-color 0.2s;
	}
	.radio-input:checked {
		background-color: #38bdf8;
		border-color: #38bdf8;
	}
	.radio-input:focus {
		outline: 2px solid #2563eb;
	}
</style>
