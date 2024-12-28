<script lang="ts">
    import { page } from "$app/state";
    import Subject from "$lib/components/subjects/Subject.svelte";

    export let data; // automaticky obsahuje `subject` z `+page.server.ts`
</script>

{#if data.subject}
    <Subject subject={data.subject} isAdmin={page.data.isAdmin} />
{:else}
    <div class="p-6 text-red-500">Nepodarilo sa načítať predmet.</div>
{/if}
