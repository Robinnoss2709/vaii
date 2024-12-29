<script lang="ts">
    export let selectedContent: number;
    export let switchContentButton: (index: number) => void;
</script>

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
