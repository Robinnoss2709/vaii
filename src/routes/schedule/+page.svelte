<script lang="ts">
	import { onMount } from "svelte";
	import { writable } from "svelte/store";
	import { scheduleSchema } from "$lib/validation/scheduleSchema";
	import { colors } from "$lib/constants/colors";
	import ScheduleItem from "$lib/components/ScheduleItem.svelte";
	import type {
		ScheduleItem as ScheduleItemType,
		FormData,
	} from "$lib/types/schedule";
	import { formatValidationErrors } from "$lib/utils/validation.js";

	let formErrors = writable<Record<string, string>>({});

	export let data;
	const schedule = writable<ScheduleItemType[]>(data.scheduleItems);
	const showModal = writable(false);
	let formData: FormData = {
		day: "",
		hour: "",
		subject: "",
		teacher: "",
		classroom: "",
		type: "lecture",
		color: "bg-gray-400",
	};

	let isEditing = false;
	let editingItemId: number | null = null;
	let isEditingSchedule = false;

	async function fetchSchedule() {
		const response = await fetch("/schedule");
		if (response.ok) {
			const items = await response.json();
			schedule.set(items);
		}
	}

	function resetForm() {
		formData = {
			day: "",
			hour: "",
			subject: "",
			teacher: "",
			classroom: "",
			type: "lecture",
			color: "bg-gray-400",
		};
		isEditing = false;
		editingItemId = null;
		formErrors.set({});
	}

	function openModalForAdd(day: string, hour: string) {
		const existingItem = $schedule.find(
			(item) => item.day === day && item.hour === hour,
		);
		if (existingItem) return;
		formData.day = day;
		formData.hour = hour;
		isEditing = false;
		showModal.set(true);
	}

	function openModalForEdit(item: ScheduleItemType) {
		formData = { ...item };
		isEditing = true;
		editingItemId = item.id;
		showModal.set(true);
	}

	// Update the saveItem function in +page.svelte
	async function saveItem() {
		const validationResult = scheduleSchema.safeParse(formData);
		if (!validationResult.success) {
			const errors = formatValidationErrors(
				validationResult.error.errors,
			);
			formErrors.set(errors);
			return;
		}

		try {
			if (isEditing && editingItemId) {
				await fetch(`/schedule/${editingItemId}`, {
					method: "PATCH",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(formData),
				});
			} else {
				await fetch("/schedule", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(formData),
				});
			}

			await fetchSchedule();
			showModal.set(false);
			resetForm();
		} catch (err) {
			console.error("Error saving item:", err);
		}
	}

	async function deleteItem(id: number) {
		try {
			await fetch(`/schedule?id=${id}`, {
				method: "DELETE",
			});
			await fetchSchedule();
		} catch (err) {
			console.error("Error deleting item:", err);
		}
	}

	function toggleEditSchedule() {
		isEditingSchedule = !isEditingSchedule;
	}

	onMount(fetchSchedule);
</script>

<div
	class="min-h-screen flex flex-col items-center justify-start bg-gray-100 p-6 pt-5"
>
	<div class="container mx-auto py-6 px-3">
		<h1 class="font-bold text-3xl text-gray-900 mb-6 text-center">
			Rozvrh Hodín
		</h1>
		<div class="mb-4 text-center">
			<button
				type="button"
				class={`py-1 px-4 rounded-md font-bold transition duration-300 border-2 border-gray-900 ${
					isEditingSchedule
						? "bg-red-500 hover:bg-red-600 text-gray-900"
						: "bg-blue-500 hover:bg-blue-600 text-gray-900"
				}`}
				on:click={toggleEditSchedule}
			>
				{isEditingSchedule ? "Skončiť úpravy" : "Upraviť rozvrh"}
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

				{#each ["Pondelok", "Utorok", "Streda", "Štvrtok", "Piatok"] as day}
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
									? "hover:bg-green-700 hover:bg-opacity-30 hover:text-gray-900"
									: "cursor-auto bg-gray-200 text-gray-400"
							}`}
							on:click={() => {
								if (isEditingSchedule) {
									openModalForAdd(day, `${hour}:00`);
								}
							}}
						>
							{#each $schedule.filter((item) => item.day === day && item.hour === `${hour}:00`) as item}
								<ScheduleItem
									{item}
									{isEditingSchedule}
									onDelete={deleteItem}
									onEdit={openModalForEdit}
								/>
							{/each}
						</button>
					{/each}
				{/each}
			</div>
		</div>
	</div>

	{#if $showModal}
		<div
			class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10"
		>
			<div
				class="bg-gray-200 text-gray-900 rounded-lg p-6 shadow-lg border-2 border-slate-900 mx-8 w-full max-w-md"
			>
				<h2 class="text-xl font-bold mb-4 text-center">
					{isEditing ? "Uprav predmet" : "Pridaj predmet"}
				</h2>
				<form
					on:submit|preventDefault={saveItem}
					class="flex flex-col gap-4"
				>
					<div>
						<label for="day" class="block text-sm font-bold mb-1"
							>Deň</label
						>
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
						<label for="hour" class="block text-sm font-bold mb-1"
							>Hodina</label
						>
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
						<label
							for="subject"
							class="block text-sm font-bold mb-1">Predmet</label
						>
						<input
							id="subject"
							class="basic-input bg-gray-300"
							type="text"
							placeholder="Zadajte predmet"
							bind:value={formData.subject}
							required
						/>
						<p class="text-red-500 text-sm mt-1">
							{$formErrors.subject}
						</p>
					</div>

					<div>
						<label
							for="teacher"
							class="block text-sm font-bold mb-1">Učiteľ</label
						>
						<input
							id="teacher"
							class="basic-input bg-gray-300"
							type="text"
							placeholder="Zadajte učiteľa"
							bind:value={formData.teacher}
							required
						/>
						<p class="text-red-500 text-sm mt-1">
							{$formErrors.teacher}
						</p>
					</div>

					<div>
						<label
							for="classroom"
							class="block text-sm font-bold mb-1"
							>Miestnosť</label
						>
						<input
							id="classroom"
							class="basic-input bg-gray-300"
							type="text"
							placeholder="Zadajte miestnosť"
							bind:value={formData.classroom}
							required
						/>
						<p class="text-red-500 text-sm mt-1">
							{$formErrors.classroom}
						</p>
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
									on:click={() =>
										(formData.color = colorClass)}
								></button>
							{/each}
						</div>
					</div>

					<div>
						{#if Object.keys($formErrors).length > 0}
							<div class="text-red-500 text-sm mt-1">
								Opravte chyby vo formulári a skúste znova.
							</div>
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
</div>
