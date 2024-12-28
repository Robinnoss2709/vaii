<script lang="ts">
    import SubjectCard from "$lib/components/subjects/SubjectCard.svelte";
    import { writable } from "svelte/store";

    import { onMount } from "svelte";
    import { subjectCardSchema } from "$lib/validation/subjectCard"; // Predpokladám, že schéma je uložená v súbore `schemas.ts`
    import { ZodError } from "zod"; // Uistite sa, že importujete ZodError
    import type {
        SubjectCard as SubjectCardType,
        FormData,
    } from "$lib/types/subjectCard";
    import { formatValidationErrors } from "$lib/utils/validation.js";
    import { page } from "$app/state";

    let formErrors = writable<Record<string, string>>({});

    export let data;
    const subjects = writable<SubjectCardType[]>(data.subjectCards);
    const showModal = writable(false);
    let formData: FormData = {
        name: "",
        study: "",
        fields: [],
        year: null,
        semester: "",
        link: "",
    };

    let isEditing = false;
    let editingItemId: number | null = null;
    let isEditingSubjects = false;

    const bachelorFields = [
        "Informatika",
        "Informatika a riadenie",
        "Informačné a sieťové technológie",
        "Manažment",
        "Počítačové inžinierstvo",
    ];

    const engineerFields = [
        "Aplikované sieťové inžinierstvo",
        "Biomedicínska Informatika",
        "Inteligentné informačné systémy",
        "Informačné systémy",
        "Informačný manažment",
        "Počítačové inžinierstvo",
    ];

    const years = [1, 2, 3];
    const studies = ["Bc.", "Ing."];
    const semesters = ["Zimný", "Letný"];

    async function fetchSubjects() {
        const response = await fetch("/tester");
        if (response.ok) {
            const items = await response.json();
            subjects.set(items);
        }
    }

    function resetForm() {
        formData = {
            name: "",
            study: "",
            fields: [],
            year: null,
            semester: "",
            link: "",
        };
        isEditing = false;
        editingItemId = null;
        formErrors.set({});
    }

    function openModalForAdd() {
        isEditing = false;
        showModal.set(true);
    }

    function openModalForEdit(item: SubjectCardType) {
        formData = { ...item };
        isEditing = true;
        editingItemId = item.id;
        showModal.set(true);
    }

    async function saveSubjectCard() {
        const validationResult = subjectCardSchema.safeParse(formData);
        if (!validationResult.success) {
            const errors = formatValidationErrors(
                validationResult.error.errors,
            );
            formErrors.set(errors);
            return;
        }

        try {
            if (isEditing && editingItemId) {
                await fetch(`/tester/${editingItemId}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(formData),
                });
            } else {
                await fetch("/tester", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(formData),
                });
            }

            await fetchSubjects();
            showModal.set(false);
            resetForm();
        } catch (err) {
            console.error("Error saving subject:", err);
        }
    }

    async function deleteItem(id: number) {
        try {
            await fetch(`/tester?id=${id}`, {
                method: "DELETE",
            });

            await fetchSubjects();
        } catch (err) {
            console.error("Error deleting subject:", err);
        }
    }

    function toggleEditMode() {
        isEditingSubjects = !isEditingSubjects;
    }

    onMount(fetchSubjects);

    let searchQuery = "";
    let searchSelectedField = "";
    let searchSelectedYear = "";
    let searchSelectedStudy = "";
    let searchSelectedSemester = "";

    function clearFilters() {
        searchQuery = "";
        searchSelectedField = "";
        searchSelectedYear = "";
        searchSelectedStudy = "";
        searchSelectedSemester = "";
    }
</script>

<div
    class="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6"
>
    <h1
        class="text-4xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-6 text-center"
    >
        Vyber si svoj predmet
    </h1>

    {#if page.data.isAdmin}
        <div class="mb-6 gap-5 flex">
            <span
                role="button"
                tabindex="0"
                aria-label="Pridať"
                class="basic-button bg-green-600 hover:bg-green-400 text-2xl"
                on:click={(e) => {
                    e.stopPropagation();
                    openModalForAdd();
                    resetForm();
                }}
                on:keydown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        e.stopPropagation();
                        openModalForAdd();
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
                        ? "bg-red-500 hover:bg-red-600 text-gray-900"
                        : "bg-blue-500 hover:bg-blue-600  text-gray-900"
                }`}
                on:click={toggleEditMode}
            >
                {isEditing ? "Dokončiť úpravy" : "Upraviť karty"}
            </button>
        </div>
    {/if}

    <div class="flex justify-center mb-5 text-gray-900 w-full max-w-4xl">
        <input
            type="text"
            bind:value={searchQuery}
            placeholder="Vyhľadaj predmet..."
            class="basic-input"
        />
    </div>

    <div
        class="text-gray-900 flex flex-col sm:flex-row justify-center mb-5 gap-4"
    >
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
                {#if searchSelectedStudy === "Bc."}
                    {#each bachelorFields as field}
                        <option value={field}>{field}</option>
                    {/each}
                {/if}
                {#if searchSelectedStudy === "Ing."}
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
            on:click={clearFilters}
        >
            Zruš filtre
        </button>
    </div>

    {#if $showModal}
        <div
            class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
            <div class="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg">
                <h2 class="text-2xl font-bold mb-4 text-gray-900">
                    {isEditingSubjects
                        ? "Uprav predmet"
                        : "Pridaj nový predmet"}
                </h2>
                <form
                    on:submit|preventDefault={saveSubjectCard}
                    class="flex flex-col gap-4"
                >
                    <input
                        id="name"
                        type="text"
                        bind:value={formData.name}
                        placeholder="Názov predmetu"
                        class="basic-input"
                    />
                    {#if $formErrors.name}
                        <p class="text-red-500">{$formErrors.name}</p>
                    {/if}
                    <select
                        bind:value={formData.study}
                        class="basic-input"
                        on:change={() => (formData.fields = [])}
                    >
                        <option value="">Štúdium</option>
                        {#each studies as study}
                            <option value={study}>{study}</option>
                        {/each}
                    </select>
                    {#if $formErrors.study}
                        <p class="text-red-500">{$formErrors.study}</p>
                    {/if}
                    <select bind:value={formData.year} class="basic-input">
                        <option value={null} disabled selected hidden
                            >Ročník</option
                        >
                        {#each years as year}
                            <option value={year}>{year}</option>
                        {/each}
                    </select>
                    {#if $formErrors.year}
                        <p class="text-red-500">{$formErrors.year}</p>
                    {/if}
                    <select bind:value={formData.semester} class="basic-input">
                        <option value="">Semester</option>
                        {#each semesters as semester}
                            <option value={semester}>{semester}</option>
                        {/each}
                    </select>
                    {#if $formErrors.semester}
                        <p class="text-red-500">{$formErrors.semester}</p>
                    {/if}
                    <select
                        bind:value={formData.fields}
                        class="basic-input"
                        multiple
                    >
                        <option value="" disabled>Vyber odbory</option>
                        {#if formData.study === "Bc."}
                            {#each bachelorFields as field}
                                <option value={field}>{field}</option>
                            {/each}
                        {/if}
                        {#if formData.study === "Ing."}
                            {#each engineerFields as field}
                                <option value={field}>{field}</option>
                            {/each}
                        {/if}
                    </select>
                    {#if $formErrors.fields}
                        <p class="text-red-500">{$formErrors.fields}</p>
                    {/if}
                    <input
                        type="text"
                        bind:value={formData.link}
                        placeholder="Odkaz na tester"
                        class="basic-input mb-2"
                    />
                    {#if $formErrors.link}
                        <p class="text-red-500">{$formErrors.link}</p>
                    {/if}

                    <div class="flex justify-end gap-4">
                        <button
                            type="button"
                            class="basic-button hover-bg-green bg-gray-500"
                            on:click={() => {
                                resetForm();
                                showModal.set(false);
                            }}
                        >
                            Zrušiť
                        </button>
                        <button
                            type="submit"
                            class="basic-button hover-bg-green bg-gray-500"
                        >
                            {isEditingSubjects
                                ? "Uložiť zmeny"
                                : "Pridať predmet"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    {/if}

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {#each $subjects as subject}
            {#if (!searchSelectedStudy || subject.study === searchSelectedStudy) && (!searchSelectedField || subject.fields.includes(searchSelectedField)) && (!searchSelectedYear || subject.year === Number(searchSelectedYear)) && (!searchSelectedSemester || subject.semester === searchSelectedSemester) && subject.name
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase())}
                <SubjectCard
                    {subject}
                    {isEditingSubjects}
                    onDelete={deleteItem}
                    onEdit={openModalForEdit}
                />
            {/if}
        {/each}
    </div>
</div>
