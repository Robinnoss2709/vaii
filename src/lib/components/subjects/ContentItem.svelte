<script lang="ts">
    import { renderJSONToHTML } from "$lib/utils/jsonRenderer";

    export let item: { id: number; content: string };
    // export let index: number;
    export let isAdmin: boolean;
    export let htmlContent: string;
    export let deleteContent: (id: number) => void;
    export let editContent: (item: { id: number; content: string }) => void;
</script>

<div class="flex">
    {#if isAdmin}
        <div class="flex flex-col mt-1">
            <button
                aria-label="Odstrániť"
                class="text-red-500"
                on:click={(e) => {
                    e.stopPropagation();
                    deleteContent(item.id);
                }}
            >
                <i class="fas fa-times w-4 h-4"></i>
            </button>
            <button
                aria-label="Upraviť"
                class="text-blue-500"
                on:click={(e) => {
                    e.stopPropagation();
                    editContent(item);
                }}
            >
                <i class="fa-solid fa-pen-to-square"></i>
            </button>
        </div>
    {/if}
    <div class="content-item border-2 p-4 rounded-xl bg-white w-full">
        {@html htmlContent}
    </div>
</div>
