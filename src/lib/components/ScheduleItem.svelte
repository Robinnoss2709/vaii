<script lang="ts">
    import type { ScheduleItem } from "$lib/types/schedule";

    export let item: ScheduleItem;
    export let isEditingSchedule: boolean;
    export let onDelete: (id: number) => void;
    export let onEdit: (item: ScheduleItem) => void;
</script>

<div
    class={`relative h-full ${item.color} text-gray-900 rounded p-1 border-2 border-gray-900`}
>
    <p class="font-semibold">{item.subject}</p>
    <p class="text-sm">{item.teacher}</p>
    {#if item.type === "lecture"}
        <p class="text-sm">Pr.({item.classroom})</p>
    {:else if item.type === "exercise"}
        <p class="text-sm">Cv.({item.classroom})</p>
    {/if}

    {#if isEditingSchedule}
        <span
            class="absolute top-0 right-0 border-1 text-red-900 hover:text-red-800 cursor-pointer"
            role="button"
            tabindex="0"
            aria-label="Odstrániť"
            on:click={(e) => {
                e.stopPropagation();
                onDelete(item.id);
            }}
            on:keydown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    e.stopPropagation();
                    onDelete(item.id);
                }
            }}
        >
            <i class="fas fa-times w-4 h-4"></i>
        </span>

        <span
            class="absolute bottom-0 right-0 text-green-900 hover:text-green-800 pr-1 cursor-pointer text-sm"
            role="button"
            tabindex="0"
            aria-label="Upraviť"
            on:click={(e) => {
                e.stopPropagation();
                onEdit(item);
            }}
            on:keydown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    e.stopPropagation();
                    onEdit(item);
                }
            }}
        >
            <i class="fa-solid fa-pen-to-square"></i>
        </span>
    {/if}
</div>
