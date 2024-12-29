<script lang="ts">
    import { page } from "$app/state";
    import { onMount } from "svelte";

    let name = ""; // Variable to hold the username

    // On mount, initialize name from page data
    onMount(() => {
        name = page.data.username ?? ""; // Set name to username from page data, or empty string
    });

    async function saveProfile(event: Event) {
        event.preventDefault(); // Prevent default form submission

        const res = await fetch("/profile", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username: name }), // Send username in request body
        });

        if (res.ok) {
            location.reload();

            alert("Profil bol aktualizovaný!");
        } else {
            alert("Zlyhalo aktualizovanie profilu.");
        }
    }
</script>

<main class="max-w-4xl mx-auto mt-10 p-6 rounded-lg shadow-md">
    <h1 class="text-2xl font-bold mb-4">Profil užívateľa</h1>

    <form class="space-y-6" on:submit={saveProfile}>
        <!-- Bind onSubmit to saveProfile -->
        <div>
            <label for="name" class="block text-sm font-medium text-green-400"
                >Meno</label
            >
            <input
                id="name"
                type="text"
                class="mt-1 rounded-lg p-1 text-gray-900"
                bind:value={name}
            />
        </div>

        <div>
            <button
                type="submit"
                class="basic-button hover-bg-green bg-gray-500"
            >
                Uložiť zmeny
            </button>
        </div>
    </form>
</main>
