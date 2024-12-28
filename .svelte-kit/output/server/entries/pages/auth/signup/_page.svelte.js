import { a as attr } from "../../../../chunks/attributes.js";
import { p as pop, a as push } from "../../../../chunks/index2.js";
import "../../../../chunks/client.js";
import { z } from "zod";
function _page($$payload, $$props) {
  push();
  let email = "";
  let password = "";
  let confirmPassword = "";
  z.object({
    email: z.string().email("Neplatný formát emailovej adresy."),
    password: z.string().min(8, "Heslo musí mať aspoň 8 znakov.").max(
      50,
      // minimálna dĺžka 8 znakov
      "Heslo môže mať maximálne 50 znakov."
    ).regex(
      /[A-Z]/,
      // maximálna dĺžka 50 znakov
      "Heslo musí obsahovať aspoň jedno veľké písmeno."
    ).regex(
      /[a-z]/,
      // obsahuje veľké písmeno
      "Heslo musí obsahovať aspoň jedno malé písmeno."
    ).regex(
      /[0-9]/,
      // obsahuje malé písmeno
      "Heslo musí obsahovať aspoň jedno číslo."
    ).regex(
      /[\W_]/,
      // obsahuje číslo
      "Heslo musí obsahovať aspoň jeden špeciálny znak."
    ),
    // obsahuje špeciálny znak (neabecedný znak)
    confirmPassword: z.string()
  }).refine((data) => data.password === data.confirmPassword, {
    message: "Heslá sa nezhodujú!",
    path: ["confirmPassword"]
  });
  $$payload.out += `<div class="bg-gray-200 min-h-screen"><div class="flex flex-col justify-center items-center text-green-400 p-6"><h1 class="font-bold text-3xl text-gray-900 mb-6">Registrácia</h1> <form class="flex flex-col gap-4 w-full max-w-sm"><label><input${attr("value", email)} type="email" placeholder="Email" class="basic-input text-gray-900" required> `;
  {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--></label> <label><input${attr("value", password)} type="password" placeholder="Heslo" class="basic-input text-gray-900" required> `;
  {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--></label> <label><input${attr("value", confirmPassword)} type="password" placeholder="Potvrďte heslo" class="basic-input text-gray-900" required> `;
  {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--></label> <button type="submit" class="py-2 px-4 rounded-md bg-green-500 text-white font-bold transition duration-300 hover:bg-green-600 w-full">Registruj sa</button></form></div> `;
  {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--></div>`;
  pop();
}
export {
  _page as default
};
