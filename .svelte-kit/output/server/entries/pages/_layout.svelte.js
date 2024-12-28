import "clsx";
import { p as pop, a as push, e as ensure_array_like, b as bind_props } from "../../chunks/index2.js";
import { e as escape_html } from "../../chunks/escaping.js";
import "../../chunks/client2.js";
import "../../chunks/client.js";
import { s as supabase } from "../../chunks/supabaseClient.js";
import { a as attr } from "../../chunks/attributes.js";
function Footer($$payload, $$props) {
  push();
  $$payload.out += `<footer class="px-6 py-6 flex items-center bg-gray-900 justify-between z-40 relative"><div class="container mx-auto flex flex-col md:flex-row justify-between items-center"><div class="flex gap-4"><a href="https://instagram.com" target="_blank" rel="noopener noreferrer" class="hover-text-green" aria-label="Visit Instagram"><i class="fa-brands fa-instagram"></i></a> <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" class="hover-text-green" aria-label="Visit Facebook"><i class="fa-brands fa-facebook"></i></a> <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" class="hover-text-green" aria-label="Visit Twitter"><i class="fa-brands fa-x-twitter"></i></a></div> <div class="text-center mt-4 md:mt-0"><p class="text-sm">© ${escape_html((/* @__PURE__ */ new Date()).getFullYear())} FriCapsule. All rights reserved.</p></div> <div class="flex gap-4 text-sm mt-4 md:mt-0"><a href="/about" class="hover-text-green underline-animation">O nás</a> <a href="/tester" class="hover-text-green underline-animation">Tester</a> <a href="/contact" class="hover-text-green underline-animation">Kontakt</a></div></div></footer>`;
  pop();
}
function Header($$payload, $$props) {
  push();
  let session = $$props["session"];
  let getUserName;
  async function fetchUserName() {
    if (session) {
      const { user } = session;
      if (user) {
        const { data, error } = await supabase.from("profiles").select("username").eq("id", user.id).single();
        if (error) {
          console.error("Error fetching username:", error);
          getUserName = null;
        } else {
          getUserName = data?.username ?? null;
        }
      }
    }
  }
  fetchUserName();
  const each_array = ensure_array_like([
    { name: "Domov", link: "/" },
    { name: "Tester", link: "/tester" },
    { name: "O nás", link: "/about" },
    { name: "Novinky", link: "/novinky" },
    { name: "Rozvrh", link: "/schedule" }
  ]);
  $$payload.out += `<header class="sticky top-0 px-6 py-6 flex items-center bg-gray-900 justify-between z-30"><div class="left-0"><a href="/" class="flex items-center"><img src="/images/logo.png" alt="logo" class="w-12 mr-2"> <span class="text-white font-bold text-2xl"><span class="text-3xl font-medium">|</span> <span class="text-green-400">Fri</span>Capsule</span></a></div> <div class="text-l hidden sm:flex items-center gap-10"><!--[-->`;
  for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
    let tab = each_array[$$index];
    $$payload.out += `<a${attr("href", tab.link)} class="underline-animation hover-text-green"><p>${escape_html(tab.name)}</p></a>`;
  }
  $$payload.out += `<!--]--></div> <div class="hidden sm:flex items-center gap-4">`;
  if (session) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<div class="relative inline-block text-left"><button class="inline-flex justify-center w-full px-4 py-2 text-white font-bold">${escape_html(getUserName)} <svg class="-mr-1 ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg></button> `;
    {
      $$payload.out += "<!--[!-->";
    }
    $$payload.out += `<!--]--></div>`;
  } else {
    $$payload.out += "<!--[!-->";
    $$payload.out += `<a href="/auth/signin" class="py-2 px-3 rounded-full hover-text-green hover-border-green">Prihlásenie</a> <a href="/auth/signup" class="basic-button hover-bg-green bg-gray-500">Registrácia</a>`;
  }
  $$payload.out += `<!--]--></div></header>`;
  bind_props($$props, { session });
  pop();
}
function _layout($$payload, $$props) {
  push();
  let { data, children } = $$props;
  let { session, supabase: supabase2 } = data;
  $$payload.out += `<div class="relative flex flex-col mx-auto w-full text-sm sm:text-base min-h-screen">`;
  Header($$payload, { session });
  $$payload.out += `<!----> <main class="flex-grow z-20 relative">`;
  children($$payload);
  $$payload.out += `<!----></main> `;
  Footer($$payload);
  $$payload.out += `<!----></div>`;
  pop();
}
export {
  _layout as default
};
