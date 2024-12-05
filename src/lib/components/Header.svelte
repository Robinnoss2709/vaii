<script>
	let tabs = [
		{ name: 'Domov', link: '/' },
		{ name: 'Tester', link: '/tester' },
		{ name: 'O nás', link: '/about' },
		{ name: 'Novinky', link: '/novinky' },
		{ name: 'Rozvrh', link: '/schedule' }
	];

	let isOpen = false;
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

	<div class="text-l hidden sm:flex items-center gap-10 transition-all duration-200 ease-in-out">
		{#each tabs as tab}
			<a href={tab.link} class="underline-animation hover-text-green">
				<p>{tab.name}</p>
			</a>
		{/each}
	</div>

	<div class="hidden sm:flex items-center gap-4">
		<a href="/login" class="py-2 px-3 rounded-full hover-text-green hover-border-green">
			Prihlásenie
		</a>

		<a href="/register" class="basic-button hover-bg-green"> Registrácia </a>
	</div>

	<button
		class="sm:hidden text-white text-2xl"
		on:click={() => (isOpen = !isOpen)}
		aria-label="Toggle navigation menu"
	>
		<i class="fa-solid fa-bars"></i>
	</button>
</header>

{#if isOpen}
	<div
		class="bg-gray-900 fixed top-16 left-0 right-0 flex flex-col items-end gap-4 px-6 py-4 transition-opacity duration-200 z-50"
	>
		{#each tabs as tab}
			<a
				href={tab.link}
				class="text-white hover-text-green py-2"
				on:click={() => (isOpen = !isOpen)}
			>
				{tab.name}
			</a>
		{/each}
		<a
			href="/login"
			class="text-white hover-text-green py-1 border-2 border-transparent rounded-3xl hover:border-green-400"
			on:click={() => (isOpen = !isOpen)}
		>
			Prihlásenie
		</a>
		<a
			href="/register"
			class="font-bold bg-slate-500 text-white font-popins hover:text-slate-700 py-2 px-4 rounded hover-bg-yellow"
			on:click={() => (isOpen = !isOpen)}
		>
			Registrácia
		</a>
	</div>
{/if}
