<script lang="ts">
    export let selectedOption: string;
    export let openEditor: () => void;
</script>

<div class="flex gap-2 my-5">
    <select
        bind:value={selectedOption}
        class="basic-button w-full bg-green-500 hover:bg-green-700 text-center"
    >
        <option class="bg-gray-200 text-gray-900" value=""> Pridaj </option>
        <option class="bg-gray-200 text-gray-900" value="Text"> Text </option>
    </select>
    <button
        on:click={() => {
            if (selectedOption === "Text") {
                openEditor();
            } else {
                alert("Vyberte platnú možnosť pre pridanie komponentu.");
            }
        }}
        class="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700"
    >
        Pridať komponent
    </button>
</div>
