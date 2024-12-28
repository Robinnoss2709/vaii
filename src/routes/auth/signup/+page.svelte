<script lang="ts">
    import { goto } from "$app/navigation";
    import { page } from "$app/stores";
    import { z } from "zod"; // Import Zod na validáciu

    // Lokálne premenne
    let email = "";
    let password = "";
    let confirmPassword = "";
    let errorMessage = "";
    let successMessage = "";
    let showModal = false; // Premenná na kontrolu zobrazenia modálneho okna
    let isSubmitted = false; // Premenná na sledovanie, či bol formulár odoslaný

    // Definícia validačnej schémy pomocou Zod
    const registerSchema = z
        .object({
            email: z.string().email("Neplatný formát emailovej adresy."),
            password: z
                .string()
                .min(8, "Heslo musí mať aspoň 8 znakov.") // minimálna dĺžka 8 znakov
                .max(50, "Heslo môže mať maximálne 50 znakov.") // maximálna dĺžka 50 znakov
                .regex(
                    /[A-Z]/,
                    "Heslo musí obsahovať aspoň jedno veľké písmeno.",
                ) // obsahuje veľké písmeno
                .regex(
                    /[a-z]/,
                    "Heslo musí obsahovať aspoň jedno malé písmeno.",
                ) // obsahuje malé písmeno
                .regex(/[0-9]/, "Heslo musí obsahovať aspoň jedno číslo.") // obsahuje číslo
                .regex(
                    /[\W_]/,
                    "Heslo musí obsahovať aspoň jeden špeciálny znak.",
                ), // obsahuje špeciálny znak (neabecedný znak)
            confirmPassword: z.string(),
        })
        .refine((data) => data.password === data.confirmPassword, {
            message: "Heslá sa nezhodujú!",
            path: ["confirmPassword"],
        });

    // Funkcia na spracovanie registrácie
    const handleRegister = async (event: Event) => {
        event.preventDefault();
        isSubmitted = true; // Nastavíme, že formulár bol odoslaný

        errorMessage = "";
        successMessage = "";

        // Validácia vstupov
        const validationResult = registerSchema.safeParse({
            email,
            password,
            confirmPassword,
        });
        if (!validationResult.success) {
            // Ak validácia zlyhá, nastav chybovú správu
            errorMessage = validationResult.error.issues
                .map((issue) => issue.message)
                .join(" ");
            return;
        }

        const { error } = await $page.data.supabase.auth.signUp({
            email,
            password,
        });
        if (error) {
            errorMessage = "Chyba pri registrácii: " + error.message;
        } else {
            successMessage = "Úspešne ste sa zaregistrovali!";
            showModal = true;
            location.reload();

            setTimeout(() => {
                goto("/login");
            }, 10000);
        }
    };

    // Funkcia na zatvorenie modálneho okna
    const closeModal = () => {
        showModal = false;
    };
</script>

<!-- HTML kód -->
<div class="bg-gray-200 min-h-screen">
    <div class="flex flex-col justify-center items-center text-green-400 p-6">
        <h1 class="font-bold text-3xl text-gray-900 mb-6">Registrácia</h1>
        <form
            class="flex flex-col gap-4 w-full max-w-sm"
            on:submit|preventDefault={handleRegister}
        >
            <label>
                <input
                    bind:value={email}
                    type="email"
                    placeholder="Email"
                    class="basic-input text-gray-900"
                    required
                />
                {#if isSubmitted}
                    {#each registerSchema
                        .safeParse({ email })
                        .error?.issues.filter((issue) => issue.message !== "Required") || [] as issue}
                        <p class="text-red-500 text-sm">{issue.message}</p>
                    {/each}
                {/if}
            </label>
            <label>
                <input
                    bind:value={password}
                    type="password"
                    placeholder="Heslo"
                    class="basic-input text-gray-900"
                    required
                />
                {#if isSubmitted}
                    {#each registerSchema
                        .safeParse({ password })
                        .error?.issues.filter((issue) => issue.message !== "Required") || [] as issue}
                        <p class="text-red-500 text-sm">{issue.message}</p>
                    {/each}
                {/if}
            </label>
            <label>
                <input
                    bind:value={confirmPassword}
                    type="password"
                    placeholder="Potvrďte heslo"
                    class="basic-input text-gray-900"
                    required
                />
                {#if isSubmitted}
                    {#each registerSchema
                        .safeParse({ confirmPassword })
                        .error?.issues.filter((issue) => issue.message !== "Required") || [] as issue}
                        <p class="text-red-500 text-sm">{issue.message}</p>
                    {/each}

                    <!-- Chyba pre nesúhlasné heslá -->
                    {#if password !== confirmPassword}
                        <p class="text-red-500 text-sm">Heslá sa nezhodujú!</p>
                    {/if}
                {/if}
            </label>
            <button
                type="submit"
                class="py-2 px-4 rounded-md bg-green-500 text-white font-bold transition duration-300 hover:bg-green-600 w-full"
            >
                Registruj sa
            </button>
        </form>
    </div>

    <!-- Modálne okno na úspešnú registráciu -->
    {#if showModal}
        <div
            class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
        >
            <div class="bg-white p-6 rounded-lg w-96">
                <h2 class="text-xl font-bold text-green-500">
                    Úspešná registrácia!
                </h2>
                <p class="mt-4 text-gray-700">
                    Na váš email bol odoslaný potvrdzovací email. Skontrolujte
                    svoj inbox a potvrďte registráciu.
                </p>
                <div class="mt-6 flex justify-end">
                    <button
                        class="basic-button hover-bg-green"
                        on:click={closeModal}
                    >
                        Zatvoriť
                    </button>
                </div>
            </div>
        </div>
    {/if}
</div>
