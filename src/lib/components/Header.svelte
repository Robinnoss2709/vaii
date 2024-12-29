<script lang="ts">
	import { goto } from "$app/navigation";
	import type { Session, SupabaseClient } from "@supabase/supabase-js";
	import { onMount } from "svelte";

	export let session: Session | null;
	export let supabase: SupabaseClient;

	let getUserName: string | null;

	// Funkcia na odhlásenie používateľa
	async function handleLogout() {
		const response = await fetch("/auth/logout", { method: "POST" });
		if (response.ok) {
			location.reload();
		}
	}
	let isOpen = false;

	function toggleDropdown() {
		isOpen = !isOpen;
	}

	async function fetchUserName() {
		if (session) {
			const { user } = session;
			if (user) {
				const { data, error } = await supabase
					.from("profiles")
					.select("username")
					.eq("id", user.id)
					.single();

				if (error) {
					console.error("Error fetching username:", error);
					getUserName = null;
				} else {
					getUserName = data?.username ?? null;
				}
			}
		}
	}

	$: fetchUserName();

	let dropdown: HTMLDivElement | null = null; // Explicitly type dropdown as HTMLDivElement or null

	// Close dropdown if mouse leaves the dropdown area
	function handleMouseLeave() {
		isOpen = false;
	}

	function handleClickOutside(event: MouseEvent) {
		if (dropdown && !dropdown.contains(event.target as Node)) {
			isOpen = false;
		}
	}

	// Set event listeners to dropdown area
	onMount(() => {
		document.addEventListener("click", handleClickOutside);

		// Cleanup event listener on component destroy
		return () => {
			document.removeEventListener("click", handleClickOutside);
		};
	});
</script>

<header
	class="sticky top-0 px-6 py-6 flex items-center bg-gray-900 justify-between z-30"
>
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
		{#each [{ name: "Domov", link: "/" }, { name: "Tester", link: "/tester" }, { name: "O nás", link: "/about" }, { name: "Novinky", link: "/novinky" }, { name: "Rozvrh", link: "/schedule" }] as tab}
			<a href={tab.link} class="underline-animation hover-text-green">
				<p>{tab.name}</p>
			</a>
		{/each}
	</div>

	<div class="hidden sm:flex items-center gap-4">
		{#if session}
			<!-- Prihlásený používateľ -->
			<div class="relative inline-block text-left" bind:this={dropdown}>
				<!-- Button to toggle the dropdown -->
				<button
					class="inline-flex justify-center w-full px-4 py-2 text-white font-bold"
					on:click={toggleDropdown}
					aria-haspopup="true"
					aria-expanded={isOpen}
				>
					{getUserName}
					<svg
						class="-mr-1 ml-2 h-5 w-5"
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 20 20"
						fill="currentColor"
						aria-hidden="true"
					>
						<path
							fill-rule="evenodd"
							d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
							clip-rule="evenodd"
						/>
					</svg>
				</button>

				{#if isOpen}
					<div
						role="menu"
						tabindex="0"
						class="origin-top-right absolute right-0 mt-2 rounded-md shadow-lg bg-gray-900 p-2 border border-gray-700"
						on:mouseleave={handleMouseLeave}
					>
						<div class="py-1">
							<button
								role="menuitem"
								tabindex="0"
								on:click={(e) => {
									e.stopPropagation();
									goto("/profile");
								}}
								on:keydown={(e) => {
									if (e.key === "Enter" || e.key === " ") {
										e.preventDefault();
										e.stopPropagation();
										goto("/profile");
									}
								}}
								class="block px-4 py-2 hover-text-green hover:text-green w-full text-right"
							>
								Profil
							</button>
							<button
								role="menuitem"
								tabindex="0"
								class="block px-4 py-2 hover:text-red-500 w-full transition duration-200 ease-in-out"
								aria-label="Logout"
								on:click={(e) => {
									e.stopPropagation();
									handleLogout();
								}}
								on:keydown={(e) => {
									if (e.key === "Enter" || e.key === " ") {
										e.preventDefault();
										e.stopPropagation();
										handleLogout();
									}
								}}
							>
								Odhlásiť
							</button>
						</div>
					</div>
				{/if}
			</div>
		{:else}
			<!-- Neprihlásený používateľ -->
			<a
				href="/auth/signin"
				class="py-2 px-3 rounded-full hover-text-green hover-border-green"
			>
				Prihlásenie
			</a>
			<a
				href="/auth/signup"
				class="basic-button hover-bg-green bg-gray-500"
			>
				Registrácia
			</a>
		{/if}
	</div>
</header>
