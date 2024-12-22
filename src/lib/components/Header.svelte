<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

	// Získaj session z page.data
	let session = $page.data.session;

	// Funkcia na odhlásenie používateľa
	async function handleLogout() {
		const response = await fetch('/auth/logout', { method: 'POST' });
		if (response.ok) {
			location.reload();
		}
	}
</script>

<header class="sticky top-0 px-6 py-6 flex items-center bg-gray-900 justify-between">
	<div class="left-0">
		<a href="/" class="flex items-center">
			<img src="/images/logo.png" alt="logo" class="w-12 mr-2" />
			<span class="text-white font-bold text-2xl">
				<span class="text-3xl font-medium">| </span>
				<span class="text-green-400">Fri</span>Capsule
			</span>
		</a>
	</div>

	<div class="text-l hidden sm:flex items-center gap-10">
		{#each [{ name: 'Domov', link: '/' }, { name: 'Tester', link: '/tester' }, { name: 'O nás', link: '/about' }, { name: 'Novinky', link: '/novinky' }, { name: 'Rozvrh', link: '/schedule' }] as tab}
			<a href={tab.link} class="underline-animation hover-text-green">
				<p>{tab.name}</p>
			</a>
		{/each}
	</div>

	<div class="hidden sm:flex items-center gap-4">
		{#if session?.user}
			<!-- Prihlásený používateľ -->
			<span class="text-white font-bold"
				>{session.user.user_metadata?.username || session.user.email}</span
			>
			<button class="py-2 px-3 rounded-full text-white hover:text-red-500" on:click={handleLogout}>
				Odhlásiť sa
			</button>
		{:else}
			<!-- Neprihlásený používateľ -->
			<a href="/login" class="py-2 px-3 rounded-full hover-text-green hover-border-green">
				Prihlásenie
			</a>
			<a href="/register" class="basic-button hover-bg-green bg-gray-500"> Registrácia </a>
		{/if}
	</div>
</header>
