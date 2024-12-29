<script lang="ts">
    import ContentNavbar from "./ContentNavbar.svelte";
    import { onMount } from "svelte";
    import ContentView from "./ContentView.svelte";
    import EditorModal from "./EditorModal.svelte";
    import AdminControls from "./AdminControls.svelte";

    import { renderJSONToHTML } from "$lib/utils/jsonRenderer";

    export let isAdmin: boolean;
    export let tabs: {
        id: number;
        name: string;
        subtabs: { id: number; name: string }[];
    }[] = [];
    export let selectedTab: number | null = null;
    export let selectedSubTab: number | null = null;
    export let link: string;

    let selectedContent = 1;
    let content: any[] = [];
    let htmlContent: string[] = [];
    let loading = true;
    let errorMessage = "";
    let editingContent: { id: number; content: string } | null = null;
    let showEditor = false;
    let selectedOption = "";

    $: subtabId = tabs
        .find((tab) => tab.id === selectedTab)
        ?.subtabs.find((subtab) => subtab.id === selectedSubTab)?.id;

    const fetchContent = async (subtabId: number | undefined) => {
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

    function switchContentButton(index: number) {
        selectedContent = index;
    }

    function openEditor() {
        showEditor = true;
    }

    function closeEditor() {
        showEditor = false;
    }

    function cancelEdit() {
        editingContent = null;
        closeEditor();
    }

    function editContent(item: { id: number; content: string }) {
        editingContent = item;
        showEditor = true;
    }

    const deleteContent = async (id: number) => {
        try {
            const response = await fetch(
                `/subjects/${link}/tabs/subtabs/content?id=${id}`,
                {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" },
                },
            );

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || "Chyba pri mazaní obsahu.");
            }

            content = content.filter((item) => item.id !== id);
            htmlContent = content.map((item) => renderJSONToHTML(item.content));
        } catch (error) {
            console.error("Chyba pri mazaní obsahu:", error);
            errorMessage = "Chyba pri mazaní obsahu.";
        }
    };

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

    function handleContentSaved(event: CustomEvent) {
        const { content: savedContent, id: savedId, isNew } = event.detail;

        if (isNew) {
            content = [...content, { id: savedId, content: savedContent }];
            htmlContent = [...htmlContent, renderJSONToHTML(savedContent)];
        } else {
            content = content.map((item) =>
                item.id === savedId ? { ...item, content: savedContent } : item,
            );
            htmlContent = content.map((item) => renderJSONToHTML(item.content));
        }

        editingContent = null;
        closeEditor();
    }
</script>

<div class="flex flex-col w-full">
    <!-- Navbar -->
    <ContentNavbar {selectedContent} {switchContentButton} />

    <!-- Content Title -->
    <div class="mx-16 my-10">
        {#if selectedTab !== null}
            <h2 class="text-2xl font-semibold text-center text-gray-900">
                {tabs.find((tab) => tab.id === selectedTab)?.name}
                {#if selectedSubTab !== null}
                    - {tabs
                        .find((tab) => tab.id === selectedTab)
                        ?.subtabs.find((subtab) => subtab.id === selectedSubTab)
                        ?.name}
                {/if}
            </h2>
        {/if}

        <!-- Content View -->
        <ContentView
            {content}
            {htmlContent}
            {isAdmin}
            {loading}
            {errorMessage}
            {deleteContent}
            {editContent}
        />

        <!-- Admin Controls -->
        {#if isAdmin && !showEditor}
            <AdminControls bind:selectedOption {openEditor} />
        {/if}

        <!-- Editor Modal -->
        <EditorModal
            {showEditor}
            {editingContent}
            {selectedContent}
            {subtabId}
            {link}
            {closeEditor}
            {cancelEdit}
            on:contentSaved={handleContentSaved}
        />
    </div>
</div>
