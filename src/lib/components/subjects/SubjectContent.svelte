<script lang="ts">
    import { renderJSONToHTML } from "$lib/utils/jsonRenderer";
    import { onMount } from "svelte";
    import "$lib/utils/lists.css"; // Import CSS
    import TipTapEditor from "../TipTapEditor.svelte";

    export let isAdmin: boolean;
    export let tabs: {
        id: number;
        name: string;
        subtabs: { id: number; name: string }[];
    }[] = [];

    export let selectedTab: number | null = null; // Selected main tab
    export let selectedSubTab: number | null = null; // Selected subtab
    export let link: string;

    let selectedContent = 1;

    function switchContentButton(index: number) {
        selectedContent = index;
    }

    let content: any[] = []; // Pre načítaný obsah
    let htmlContent: string[] = []; // Pre generovaný HTML obsah
    let loading: boolean = true;
    let errorMessage: string = "";
    let subtabId = tabs
        .find((tab) => tab.id === selectedTab)
        ?.subtabs.find((subtab) => subtab.id === selectedSubTab)?.id;

    $: subtabId = tabs
        .find((tab) => tab.id === selectedTab)
        ?.subtabs.find((subtab) => subtab.id === selectedSubTab)?.id;

    const fetchContent = async (subtabId: number | null) => {
        if (subtabId === null) return;

        loading = true;
        errorMessage = "";
        content = [];

        try {
            const response = await fetch(
                `/subjects/${link}/tabs/subtabs/content/?subtabId=${subtabId}`,
            );

            if (!response.ok) {
                const data = await response.json();
                errorMessage = data.message || "Chyba pri načítaní obsahu";
                return;
            }

            const data = await response.json();
            content = data.content;

            htmlContent = content.map((item: any) =>
                renderJSONToHTML(item.content),
            );
        } catch (error) {
            console.error("Chyba pri načítaní obsahu zo servera:", error);
            errorMessage = "Chyba pri načítaní obsahu zo servera.";
        } finally {
            loading = false;
        }
    };

    type ContentItem = {
        id: number;
        content: string;
    };

    let editingContent: ContentItem | null = null; // Obsah, ktorý sa práve upravuje

    function editContent(item: ContentItem) {
        editingContent = item;
        showEditor = true;
    }

    const deleteContent = async (id: number) => {
        try {
            // Odoslanie DELETE požiadavky na server
            const response = await fetch(
                `/subjects/${link}/tabs/subtabs/content?id=${id}`,
                {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                    },
                },
            );

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || "Chyba pri mazaní obsahu.");
            }

            // Aktualizácia obsahu na klientovi
            const indexToRemove = content.findIndex((item) => item.id === id);
            if (indexToRemove !== -1) {
                content = content.filter((item) => item.id !== id);
                htmlContent = htmlContent.filter(
                    (_, index) => index !== indexToRemove,
                );
            }
        } catch (error) {
            console.error("Chyba pri mazaní obsahu:", error);
            errorMessage = "Chyba pri mazaní obsahu.";
        }
    };

    let showEditor = false; // Určuje, či sa má TipTapEditor zobraziť

    // Otvoriť nový editor
    function openEditor() {
        showEditor = true;
    }

    function closeEditor() {
        showEditor = false;
    }

    function cancelEdit() {
        editingContent = null; // Vymažeme aktuálny obsah
        closeEditor(); // Skryjeme editor
    }

    $: {
        if (selectedSubTab !== null) {
            fetchContent(selectedSubTab);
        }
    }

    onMount(() => {
        if (selectedSubTab !== null) {
            fetchContent(selectedSubTab);
        }
    });

    // Dynamické pridanie komponentov
    let selectedOption: string = "";
    let dynamicComponents: { type: string; id: number }[] = [];
    let componentId = 0; // Unikátne ID pre každý pridaný komponent

    function handleAddComponent() {
        if (!showEditor) {
            if (selectedOption === "Text") {
                dynamicComponents = [
                    ...dynamicComponents,
                    { type: "TipTapEditor", id: componentId++ },
                ];
            }
            selectedOption = ""; // Reset výberu
        }
    }
</script>

<div class="flex flex-col w-full">
    <!-- Navbar -->
    <div class="bg-green-600 text-white">
        <div class="flex justify-around">
            <button
                class="w-full p-4 bg-green-600 hover:bg-green-700 drop-shadow-2xl"
                class:bg-green-700={selectedContent === 1}
                on:click={() => switchContentButton(1)}
            >
                FriCapsule
            </button>
            <button
                class="w-full p-4 bg-green-600 hover:bg-green-700 drop-shadow-2xl"
                class:bg-green-700={selectedContent === 2}
                on:click={() => switchContentButton(2)}
            >
                CommunityCapsule
            </button>
            <button
                class="w-full p-4 bg-green-600 hover:bg-green-700 drop-shadow-2xl"
                class:bg-green-700={selectedContent === 3}
                on:click={() => switchContentButton(3)}
            >
                CapsuleNotes
            </button>
        </div>
    </div>

    <!-- Hlavný obsah -->
    <div class="mx-16 my-10">
        <div
            class="w-full max-w-[1200px] mx-auto overflow-hidden mt-5 text-gray-900"
        >
            <!-- Nadpis -->
            <div>
                {#if selectedTab !== null}
                    <h2 class="text-2xl font-semibold text-center">
                        {tabs.find((tab) => tab.id === selectedTab)?.name}
                        {#if selectedSubTab !== null}
                            - {tabs
                                .find((tab) => tab.id === selectedTab)
                                ?.subtabs.find(
                                    (subtab) => subtab.id === selectedSubTab,
                                )?.name}
                        {/if}
                    </h2>
                {/if}
            </div>

            <!-- Dynamické pridanie komponentov -->
        </div>
        <div class="flex flex-col w-full text-gray-900">
            {#if loading}
                <p>Načítavam obsah...</p>
            {:else if errorMessage}
                <p class="text-red-500">{errorMessage}</p>
            {:else}
                <!-- Zobrazenie načítaného obsahu -->
                <div class="flex-row">
                    {#each content as item, index (item.id)}
                        <div class="flex">
                            {#if isAdmin}
                                <div class="flex flex-col mt-1">
                                    <button
                                        aria-label="Odstrániť"
                                        class="text-red-500"
                                        on:click={(e) => {
                                            e.stopPropagation();
                                            deleteContent(item.id); // Používame item.id namiesto index
                                        }}
                                        on:keydown={(e) => {
                                            if (
                                                e.key === "Enter" ||
                                                e.key === " "
                                            ) {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                deleteContent(item.id); // Používame item.id namiesto index
                                            }
                                        }}
                                    >
                                        <i class="fas fa-times w-4 h-4"></i>
                                    </button>
                                    <button
                                        aria-label="Upraviť"
                                        class="text-blue-500"
                                        on:click={(e) => {
                                            e.stopPropagation();
                                            editContent(item); // Odovzdáme aktuálny obsah
                                        }}
                                        on:keydown={(e) => {
                                            if (
                                                e.key === "Enter" ||
                                                e.key === " "
                                            ) {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                editContent(item); // Odovzdáme aktuálny obsah
                                            }
                                        }}
                                    >
                                        <i class="fa-solid fa-pen-to-square"
                                        ></i>
                                    </button>
                                </div>
                            {/if}

                            <div
                                class="content-item border-2 p-4 rounded-xl bg-white w-full"
                            >
                                {@html htmlContent[index]}
                                <!-- Zobrazenie HTML obsahu podľa indexu -->
                            </div>
                        </div>
                    {/each}
                </div>
            {/if}
        </div>
        {#if showEditor}
            <TipTapEditor
                initialContent={editingContent?.content || ""}
                {editingContent}
                {selectedContent}
                {subtabId}
                {link}
                on:contentSaved={(e) => {
                    const savedContent = e.detail.content;
                    const savedId = e.detail.id;
                    const isNew = e.detail.isNew;

                    if (isNew) {
                        // Pridanie nového obsahu
                        content = [
                            ...content,
                            { id: savedId, content: savedContent },
                        ];
                        htmlContent = [
                            ...htmlContent,
                            renderJSONToHTML(savedContent),
                        ];
                    } else {
                        // Aktualizácia existujúceho obsahu
                        content = content.map((item) =>
                            item.id === savedId
                                ? { ...item, content: savedContent }
                                : item,
                        );
                        htmlContent = content.map((item) =>
                            renderJSONToHTML(item.content),
                        );
                    }

                    editingContent = null; // Reset aktuálne upravovaného obsahu
                    closeEditor(); // Skryjeme editor
                }}
                on:cancelEdit={cancelEdit}
                on:closeEditor={closeEditor}
            />
        {:else}
            <!-- Výber a tlačidlo na pridanie -->
            {#if isAdmin}
                <div class="flex gap-2 my-5">
                    <select
                        bind:value={selectedOption}
                        class="basic-button w-full bg-green-500 hover:bg-green-700 text-center"
                    >
                        <option class="bg-gray-200 text-gray-900" value="">
                            Pridaj
                        </option>
                        <option class="bg-gray-200 text-gray-900" value="Text">
                            Text
                        </option>
                    </select>
                    <button
                        on:click={() => {
                            if (selectedOption === "Text") {
                                openEditor();
                            } else {
                                alert(
                                    "Vyberte platnú možnosť pre pridanie komponentu.",
                                );
                            }
                        }}
                        class="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700"
                    >
                        Pridať komponent
                    </button>
                </div>
            {/if}
        {/if}
    </div>
</div>
