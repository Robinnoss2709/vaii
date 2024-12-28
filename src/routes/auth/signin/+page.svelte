<script lang="ts">
  import { enhance } from "$app/forms";
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";

  let email = "";
  let password = "";
  let errorMsg = "";

  async function handleSubmit() {
    const { data, error } = await $page.data.supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      errorMsg = error.message;
      return;
    } else {
      location.reload();
    }

    if (data) goto("/");
  }
</script>

<div class="bg-gray-200 min-h-screen">
  <div class="flex flex-col justify-center items-center text-green-400 p-6">
    <h1 class="font-bold text-3xl text-gray-900 mb-6">Prihlásenie</h1>

    <form
      on:submit|preventDefault={handleSubmit}
      class="flex flex-col gap-4 w-full max-w-sm"
    >
      {#if errorMsg}
        <div
          class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded"
        >
          {errorMsg}
        </div>
      {/if}

      <div>
        <label for="email" class="block text-sm font-medium text-gray-700"
          >Email</label
        >
        <input
          type="email"
          id="email"
          placeholder="Email"
          bind:value={email}
          class="basic-input text-gray-900"
          required
        />
      </div>

      <div>
        <label for="password" class="block text-sm font-medium text-gray-700"
          >Password</label
        >
        <input
          type="password"
          id="password"
          placeholder="Heslo"
          bind:value={password}
          class="basic-input text-gray-900"
          required
        />
      </div>

      <button
        type="submit"
        class="py-2 px-4 rounded-md bg-green-500 text-white font-bold transition duration-300 hover:bg-green-600 w-full"
      >
        Sign In
      </button>
    </form>

    <p class="mt-4 text-center text-sm text-gray-600">
      Nemáš účet?
      <a href="/auth/signup" class="text-blue-600 hover:underline"
        >Zaregistruj sa!</a
      >
    </p>
  </div>
</div>
