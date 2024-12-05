<script>
	let name = '';
	let email = '';
	let message = '';
</script>

<div class="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
	<h1 class="text-4xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-6 text-center">Kontakt</h1>
	<div class="max-w-3xl w-full mb-8">
		<h2 class="font-semibold text-2xl text-green-500 mb-2">Naše informácie</h2>
		<p class="text-gray-700 mb-2">Email: support@nieco.com</p>
		<p class="text-gray-700 mb-2">Telefón: +421 123 456 789</p>
		<p class="text-gray-700">Adresa: Mrkvičku 2, Žilina, Slovensko</p>
	</div>

	<form class="flex flex-col gap-4 w-full max-w-sm">
		<label>
			<input bind:value={name} type="text" placeholder="Tvoje meno" class="basic-input" required />
		</label>
		<label>
			<input
				bind:value={email}
				type="email"
				placeholder="Tvoj email"
				class="basic-input"
				required
			/>
		</label>
		<label>
			<textarea bind:value={message} placeholder="Tvoja správa" class="basic-input" required
			></textarea>
		</label>
		<button type="submit" class="basic-button hover-bg-green"> Odoslať </button>
	</form>
</div>
