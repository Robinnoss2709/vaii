<script>
	let email = '';
	let password = '';
</script>

<div class="mt-20 flex flex-col justify-center items-center text-green-400 p-6">
	<h1 class="font-bold uppercase text-green-400 mb-6 text-2xl">Prihlásenie</h1>
	<form class="flex flex-col gap-4 w-full max-w-sm">
		<label>
			<input bind:value={email} type="text" placeholder="Email" class="basic-input" required />
		</label>
		<label>
			<input
				bind:value={password}
				type="password"
				placeholder="Heslo"
				class="basic-input"
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
</div>
