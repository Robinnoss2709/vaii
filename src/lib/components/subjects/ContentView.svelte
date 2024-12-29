<script lang="ts">
    import ContentItem from "./ContentItem.svelte";

    export let content: any[];
    export let htmlContent: string[];
    export let isAdmin: boolean;
    export let deleteContent: (id: number) => void;
    export let editContent: (item: { id: number; content: string }) => void;
    export let loading: boolean;
    export let errorMessage: string;
</script>

<div class="flex flex-col w-full text-gray-900">
    {#if loading}
        <p>Načítavam obsah...</p>
    {:else if errorMessage}
        <p class="text-red-500">{errorMessage}</p>
    {:else}
        <div class="flex-row">
            {#each content as item, index (item.id)}
                <ContentItem
                    {item}
                    {isAdmin}
                    htmlContent={htmlContent[index]}
                    {deleteContent}
                    {editContent}
                />
            {/each}
        </div>
    {/if}
</div>
