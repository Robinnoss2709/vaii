<script lang="ts">
    import TipTapEditor from "../TipTapEditor.svelte";
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher(); // Použi dispatch z createEventDispatcher

    export let showEditor: boolean;
    export let editingContent: { id: number; content: string } | null;
    export let selectedContent: number;
    export let subtabId: number | undefined;
    export let link: string;
    export let closeEditor: () => void;
    export let cancelEdit: () => void;

    function handleContentSaved(event: CustomEvent) {
        const { detail } = event;
        dispatch("contentSaved", detail); // Správne použitie dispatch
    }
</script>

{#if showEditor}
    <TipTapEditor
        initialContent={editingContent?.content || ""}
        {editingContent}
        {selectedContent}
        {subtabId}
        {link}
        on:contentSaved={handleContentSaved}
        on:cancelEdit={cancelEdit}
        on:closeEditor={closeEditor}
    />
{/if}
