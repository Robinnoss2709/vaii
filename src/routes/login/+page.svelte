<script lang="ts">
	import { Auth } from '@supabase/auth-ui-svelte';
	import { ThemeSupa } from '@supabase/auth-ui-shared';

	export let data;
	let { supabase, session } = data;

	$: ({ supabase, session } = data);

	supabase.auth.onAuthStateChange((event, session) => {
		if (session?.user) {
			if (event === 'SIGNED_IN') {
				console.log('Používateľ sa prihlásil:', session.user);
			} else if (event === 'SIGNED_OUT') {
				console.log('Používateľ sa odhlásil');
			}
		}
	});

	console.log(supabase);
	console.log(session);
</script>

<div class="flex flex-col justify-center items-center text-green-400 p-6">
	<h1 class="font-bold text-3xl text-gray-900 mb-6 uppercase">Prihlásenie</h1>
	<div class="flex flex-col gap-4 w-full max-w-sm">
		<Auth
			supabaseClient={supabase}
			appearance={{
				theme: ThemeSupa,
				style: {
					input: `
						padding: 0.5rem 0.75rem;
						border: 2px solid #333333;
						border-radius: 0.375rem;
						outline: none;
						width: 100%;
						transition: box-shadow 0.2s ease, border-color 0.2s ease;
					`,
					button: `
						py-2 px-4;
						border-radius: 0.375rem;
						background-color: #4CAF50;
						color: white;
						font-weight: bold;
						transition: background-color 0.3s ease;
					`
				}
			}}
		/>
	</div>
</div>

<!-- <script>
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
</div> -->
