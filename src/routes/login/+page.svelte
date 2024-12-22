<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	export let data;
	let { supabase, session } = data;

	$: ({ supabase, session } = data);

	// Lokálne premenne
	let email = '';
	let password = '';
	let errorMessage = '';
	let successMessage = '';

	// Funkcia na spracovanie formulára
	const handleLogin = async (event: Event) => {
		event.preventDefault();
		errorMessage = '';
		successMessage = '';

		const { error } = await supabase.auth.signInWithPassword({
			email,
			password
		});

		if (error) {
			errorMessage = 'Chyba pri prihlasovaní: ' + error.message;
		} else {
			successMessage = 'Úspešne ste sa prihlásili!';
			location.reload();
		}
	};
</script>

<!-- HTML kód -->
<div class="bg-gray-200 min-h-screen">
	<div class="flex flex-col justify-center items-center text-green-400 p-6">
		<h1 class="font-bold text-3xl text-gray-900 mb-6">Prihlásenie</h1>

		<form class="flex flex-col gap-4 w-full max-w-sm" on:submit|preventDefault={handleLogin}>
			<label>
				<input
					bind:value={email}
					type="email"
					placeholder="Email"
					class="basic-input text-gray-900"
					required
				/>
			</label>
			<label>
				<input
					bind:value={password}
					type="password"
					placeholder="Heslo"
					class="basic-input text-gray-900"
					required
				/>
			</label>
			<button
				type="submit"
				class="py-2 px-4 rounded-md bg-green-500 text-white font-bold transition duration-300 hover:bg-green-600 w-full"
			>
				Prihlás sa
			</button>
		</form>

		<!-- Zobrazenie správy o stave -->
		{#if errorMessage}
			<p class="text-red-500 mt-4 text-center">{errorMessage}</p>
		{:else if successMessage}
			<p class="text-green-500 mt-4 text-center">{successMessage}</p>
		{/if}
	</div>
</div>
