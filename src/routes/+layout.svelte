<script>
  import "../app.css";
  import Footer from "$lib/components/Footer.svelte";
  import Header from "$lib/components/Header.svelte";
  import { invalidate } from "$app/navigation";
  import { onMount } from "svelte";
  import { page } from "$app/state";

  let { data, children } = $props();
  let { session, supabase } = $derived(data);

  onMount(() => {
    const { data } = supabase.auth.onAuthStateChange((_, newSession) => {
      if (newSession?.expires_at !== session?.expires_at) {
        invalidate("supabase:auth");
      }
    });

    return () => data.subscription.unsubscribe();
  });
</script>

<div
  class="relative flex flex-col mx-auto w-full text-sm sm:text-base min-h-screen"
>
  <Header {session} {supabase} />
  <main class="flex-grow z-20 relative">
    {@render children()}
  </main>
  <Footer />
</div>
