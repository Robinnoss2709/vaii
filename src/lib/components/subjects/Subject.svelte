<script lang="ts">
    import { onMount } from "svelte";
    import SubjectContent from "$lib/components/subjects/SubjectContent.svelte";
    import { page } from "$app/state";

    export let isAdmin: boolean;
    export let subject: {
        id: number;
        name: string;
        study: string;
        year: string | number;
        semester: string | number;
        fields: string[];
        link: string;
    };

    let tabs: {
        id: number;
        name: string;
        subtabs: { id: number; name: string }[];
    }[] = [];
    let selectedTab: number | null = null; // Selected main tab
    let selectedSubTab: number | null = null; // Selected subtab
    let newTabName = "";
    let editingTabId: number | null = null; // ID of the tab being edited
    let editingTabName = "";
    let newSubTabName = "";
    let editingSubTabId: number | null = null; // ID of the subtab being edited
    let editingSubTabName = "";

    const fetchTabs = async () => {
        try {
            const response = await fetch(`/subjects/${subject.link}/tabs`);
            if (response.ok) {
                const data = await response.json();
                tabs = data.panels.map((tab: any) => ({
                    ...tab,
                    subtabs: [], // Predinicializujeme subtabs
                }));
                for (const tab of tabs) {
                    await fetchSubTabs(tab.id);
                }
            } else {
                console.error("Failed to fetch tabs");
            }
        } catch (error) {
            console.error("Error fetching tabs:", error);
        }
    };

    const addTab = async () => {
        if (!newTabName.trim()) return;
        try {
            const response = await fetch(`/subjects/${subject.link}/tabs`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: newTabName.trim() }),
            });
            if (response.ok) {
                const data = await response.json();
                // Instead of modifying tabs directly, create a new array
                tabs = [...tabs, { ...data.panel, subtabs: [] }];
                newTabName = ""; // Clear the input field
            } else {
                console.error("Failed to add tab");
            }
        } catch (error) {
            console.error("Error adding tab:", error);
        }
    };

    const editTab = async () => {
        if (!editingTabName.trim() || editingTabId === null) return;
        try {
            const response = await fetch(`/subjects/${subject.link}/tabs`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: editingTabId,
                    name: editingTabName.trim(),
                }),
            });
            if (response.ok) {
                const tab = tabs.find((tab) => tab.id === editingTabId);
                if (tab) {
                    tab.name = editingTabName.trim(); // Update the name immediately
                }
                editingTabId = null;
                editingTabName = "";
            } else {
                console.error("Failed to edit tab");
            }
        } catch (error) {
            console.error(error);
        }
    };

    const deleteTab = async (id: number) => {
        try {
            const response = await fetch(
                `/subjects/${subject.link}/tabs?id=${id}`,
                {
                    method: "DELETE",
                },
            );
            if (response.ok) {
                tabs = tabs.filter((tab) => tab.id !== id); // Update immediately
            } else {
                console.error("Failed to delete tab");
            }
        } catch (error) {
            console.error(error);
        }
    };

    const fetchSubTabs = async (tabId: number) => {
        try {
            const response = await fetch(
                `/subjects/${subject.link}/tabs/subtabs?tab_id=${tabId}`,
            );
            if (response.ok) {
                const data = await response.json();
                const tab = tabs.find((t) => t.id === tabId);
                if (tab) tab.subtabs = data.subtabs;
            } else {
                console.error("Failed to fetch subtabs");
            }
        } catch (error) {
            console.error("Error fetching subtabs:", error);
        }
    };

    const addSubTab = async (tabId: number) => {
        if (!newSubTabName.trim()) return;
        try {
            const response = await fetch(
                `/subjects/${subject.link}/tabs/subtabs`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        panel_id: tabId,
                        name: newSubTabName.trim(),
                    }),
                },
            );
            if (response.ok) {
                const data = await response.json();
                // Find the tab and create a new subtabs array
                const tabIndex = tabs.findIndex((t) => t.id === tabId);
                if (tabIndex !== -1) {
                    const updatedTab = {
                        ...tabs[tabIndex],
                        subtabs: [...tabs[tabIndex].subtabs, data.subtab], // Create new subtabs array
                    };
                    tabs = [
                        ...tabs.slice(0, tabIndex),
                        updatedTab,
                        ...tabs.slice(tabIndex + 1),
                    ];
                }
                newSubTabName = ""; // Clear the input field
            } else {
                console.error("Failed to add subtab");
            }
        } catch (error) {
            console.error("Error adding subtab:", error);
        }
    };

    const editSubTab = async () => {
        if (!editingSubTabName.trim() || editingSubTabId === null) return;
        try {
            const response = await fetch(
                `/subjects/${subject.link}/tabs/subtabs`,
                {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        id: editingSubTabId,
                        name: editingSubTabName.trim(),
                    }),
                },
            );
            if (response.ok) {
                const tab = tabs.find((tab) =>
                    tab.subtabs.some((st) => st.id === editingSubTabId),
                );
                if (tab) {
                    const subtab = tab.subtabs.find(
                        (st) => st.id === editingSubTabId,
                    );
                    if (subtab) {
                        subtab.name = editingSubTabName.trim(); // Aktualizujte meno subtabu
                        // Uistite sa, že premenná sa správne aktualizuje
                        tabs = [...tabs]; // Prezentácia zmien pre Svelte
                    }
                }
                editingSubTabId = null;
                editingSubTabName = "";
            } else {
                console.error("Failed to edit subtab");
            }
        } catch (error) {
            console.error(error);
        }
    };

    const deleteSubTab = async (id: number, tabId: number) => {
        try {
            const response = await fetch(
                `/subjects/${subject.link}/tabs/subtabs?id=${id}`,
                {
                    method: "DELETE",
                },
            );
            if (response.ok) {
                const tab = tabs.find((tab) => tab.id === tabId);
                if (tab) {
                    tab.subtabs = tab.subtabs.filter(
                        (subtab) => subtab.id !== id,
                    );
                    // Opäť zaručte reaktivitu
                    tabs = [...tabs]; // Týmto spôsobom sa zmienky aktualizujú
                }
            } else {
                console.error("Failed to delete subtab");
            }
        } catch (error) {
            console.error(error);
        }
    };

    // Funkcia na zmenu tabu
    const changeTab = (tabId: number) => {
        selectedTab = tabId;
        selectedSubTab = null; // Reset podtabu pri zmene hlavného tabu
    };

    // Funkcia na zmenu subtabu
    const changeSubTab = (subTabId: number) => {
        selectedSubTab = subTabId;
    };

    let isSidebarOpen = true;

    function toggleSidebar() {
        isSidebarOpen = !isSidebarOpen;
    }

    let isAtBottom = false;

    onMount(() => {
        fetchTabs();
        const handleScroll = () => {
            const scrollPosition = window.scrollY + window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;
            isAtBottom = scrollPosition >= documentHeight - 100; // adjust the offset as needed
        };

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    });
</script>

<div class="flex flex-grow min-h-screen">
    <!-- Bočný panel -->
    <div
        class="fixed left-0 bg-gray-200 text-gray-900 p-4 transition-transform duration-300 z-20"
        class:translate-x-[-300px]={!isSidebarOpen}
        class:translate-x-[0]={isSidebarOpen}
        style="width: 300px; height: 100vh;"
    >
        <h2 class="font-bold mb-4">Témy predmetu</h2>

        {#if isAdmin}
            <div class="mb-4">
                <input
                    type="text"
                    bind:value={newTabName}
                    placeholder="Názov nového tabu"
                    class="w-full p-2 rounded-md border"
                />
                <button
                    class="w-full mt-2 bg-green-500 text-white p-2 rounded-md hover:bg-green-600"
                    on:click={addTab}
                >
                    <i class="fa-solid fa-plus"></i> Pridať Tab
                </button>
            </div>
        {/if}

        <ul>
            {#each tabs as tab}
                <li class="bg-gray-100 hover:bg-gray-300 rounded-lg p-1 m-1">
                    <ul
                        class="flex justify-between rounded-lg my-1 px-2"
                        class:selected={selectedTab === tab.id}
                    >
                        {#if editingTabId === tab.id}
                            <input
                                type="text"
                                bind:value={editingTabName}
                                placeholder="Editovať názov tabu"
                                class="w-full rounded-md border mx-2 px-1 text-gray-900"
                            />
                            {#if isAdmin}
                                <div class="flex flex-row gap-2 text-lg">
                                    <button
                                        aria-label="Upraviť"
                                        class="text-green-500"
                                        on:click={(e) => {
                                            e.stopPropagation();
                                            editTab();
                                        }}
                                        on:keydown={(e) => {
                                            if (
                                                e.key === "Enter" ||
                                                e.key === " "
                                            ) {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                editTab();
                                            }
                                        }}
                                    >
                                        <i class="fa-solid fa-check"></i>
                                    </button>
                                    <button
                                        aria-label="Odstrániť"
                                        class="text-red-500"
                                        on:click={(e) => {
                                            e.stopPropagation();
                                            editingTabId = null;
                                            editingTabName = "";
                                        }}
                                        on:keydown={(e) => {
                                            if (
                                                e.key === "Enter" ||
                                                e.key === " "
                                            ) {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                editingTabId = null;
                                                editingTabName = "";
                                            }
                                        }}
                                    >
                                        <i class="fas fa-times w-4 h-4"></i>
                                    </button>
                                </div>
                            {/if}
                        {:else}
                            <button on:click={() => changeTab(tab.id)}>
                                {tab.name}
                            </button>
                            {#if isAdmin}
                                <div class="flex flex-row gap-2 text-lg">
                                    <button
                                        aria-label="Upraviť"
                                        class="text-blue-500"
                                        on:click={(e) => {
                                            e.stopPropagation();
                                            editingTabId = tab.id;
                                            editingTabName = tab.name;
                                        }}
                                        on:keydown={(e) => {
                                            if (
                                                e.key === "Enter" ||
                                                e.key === " "
                                            ) {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                deleteTab(tab.id);
                                            }
                                        }}
                                    >
                                        <i class="fa-solid fa-pen-to-square"
                                        ></i>
                                    </button>
                                    <button
                                        aria-label="Odstrániť"
                                        class="text-red-500"
                                        on:click={(e) => {
                                            e.stopPropagation();
                                            deleteTab(tab.id);
                                        }}
                                        on:keydown={(e) => {
                                            if (
                                                e.key === "Enter" ||
                                                e.key === " "
                                            ) {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                deleteTab(tab.id);
                                            }
                                        }}
                                    >
                                        <i class="fas fa-times w-4 h-4"></i>
                                    </button>
                                </div>
                            {/if}
                        {/if}
                    </ul>

                    <!-- Subtabs pre každý tab -->
                    {#if selectedTab === tab.id}
                        <ul class="pl-4 mt-2">
                            {#each tab.subtabs as subtab}
                                <li
                                    class="flex justify-between items-center rounded-lg my-1 px-2"
                                    class:selected={selectedSubTab ===
                                        subtab.id}
                                >
                                    {#if editingSubTabId === subtab.id}
                                        <input
                                            type="text"
                                            bind:value={editingSubTabName}
                                            placeholder="Editovať názov podtabu"
                                            class="w-full rounded-md border mx-2 px-1 text-gray-900"
                                        />
                                        {#if isAdmin}
                                            <div
                                                class="flex flex-row gap-2 text-lg"
                                            >
                                                <button
                                                    aria-label="Upraviť"
                                                    class="text-green-500"
                                                    on:click={(e) => {
                                                        e.stopPropagation();
                                                        editSubTab();
                                                    }}
                                                    on:keydown={(e) => {
                                                        if (
                                                            e.key === "Enter" ||
                                                            e.key === " "
                                                        ) {
                                                            e.preventDefault();
                                                            e.stopPropagation();
                                                            editSubTab();
                                                        }
                                                    }}
                                                >
                                                    <i class="fa-solid fa-check"
                                                    ></i>
                                                </button>
                                                <button
                                                    aria-label="Zrušiť"
                                                    class="text-red-500"
                                                    on:click={(e) => {
                                                        e.stopPropagation();
                                                        editingSubTabId = null;
                                                        editingSubTabName = "";
                                                    }}
                                                    on:keydown={(e) => {
                                                        if (
                                                            e.key === "Enter" ||
                                                            e.key === " "
                                                        ) {
                                                            e.preventDefault();
                                                            e.stopPropagation();
                                                            editingSubTabId =
                                                                null;
                                                            editingSubTabName =
                                                                "";
                                                        }
                                                    }}
                                                >
                                                    <i
                                                        class="fas fa-times w-4 h-4"
                                                    ></i>
                                                </button>
                                            </div>
                                        {/if}
                                    {:else}
                                        <button
                                            on:click={() =>
                                                changeSubTab(subtab.id)}
                                            class:selected={selectedSubTab ===
                                                subtab.id}
                                        >
                                            {subtab.name}
                                        </button>
                                        {#if isAdmin}
                                            <div
                                                class="flex flex-row gap-2 text-lg"
                                            >
                                                <button
                                                    aria-label="Odstrániť"
                                                    class="text-blue-500"
                                                    on:click={(e) => {
                                                        editingSubTabId =
                                                            subtab.id;
                                                        editingSubTabName =
                                                            subtab.name;
                                                    }}
                                                    on:keydown={(e) => {
                                                        if (
                                                            e.key === "Enter" ||
                                                            e.key === " "
                                                        ) {
                                                            e.preventDefault();
                                                            e.stopPropagation();
                                                            editingSubTabId =
                                                                subtab.id;
                                                            editingSubTabName =
                                                                subtab.name;
                                                        }
                                                    }}
                                                >
                                                    <i
                                                        class="fa-solid fa-pen-to-square"
                                                    ></i>
                                                </button>
                                                <button
                                                    aria-label="Odstrániť"
                                                    class="text-red-500"
                                                    on:click={(e) => {
                                                        e.stopPropagation();
                                                        deleteSubTab(
                                                            subtab.id,
                                                            tab.id,
                                                        );
                                                    }}
                                                    on:keydown={(e) => {
                                                        if (
                                                            e.key === "Enter" ||
                                                            e.key === " "
                                                        ) {
                                                            e.preventDefault();
                                                            e.stopPropagation();
                                                            deleteSubTab(
                                                                subtab.id,
                                                                tab.id,
                                                            );
                                                        }
                                                    }}
                                                >
                                                    <i
                                                        class="fas fa-times w-4 h-4"
                                                    ></i>
                                                </button>
                                            </div>
                                        {/if}
                                    {/if}
                                </li>
                            {/each}
                        </ul>
                        {#if isAdmin}
                            <div class="mt-2">
                                <input
                                    type="text"
                                    bind:value={newSubTabName}
                                    placeholder="Nový subtab"
                                    class="w-full p-2 rounded-md border"
                                />
                                <button
                                    class="w-full mt-2 bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
                                    on:click={() => addSubTab(tab.id)}
                                >
                                    <i class="fa-solid fa-plus"></i> Pridať SubTab
                                </button>
                            </div>
                        {/if}
                    {/if}
                </li>
            {/each}
        </ul>
    </div>
    <div
        class="flex-grow bg-gray-100 transition-all duration-300 ml-0"
        class:ml-[300px]={isSidebarOpen}
        style="min-height: 100vh; overflow-x: hidden;"
    >
        <SubjectContent
            {tabs}
            {selectedTab}
            {selectedSubTab}
            link={subject.link}
            {isAdmin}
        />
    </div>

    <!-- Tlačidlo na otváranie/zatváranie -->
    <button
        class="fixed bottom-4 left-4 bg-green-500 text-white p-3 rounded-full shadow-lg hover:bg-green-600 transition-colors z-50"
        style="bottom: {isAtBottom ? '80px' : '4px'};"
        on:click={toggleSidebar}
    >
        {#if isSidebarOpen}
            <i class="fa-solid fa-chevron-left"></i>
        {:else}
            <i class="fa-solid fa-chevron-right"></i>
        {/if}
    </button>
</div>

<style>
    .selected {
        background-color: #4caf50;
        color: white;
    }
</style>
