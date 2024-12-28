import { a as attr } from "../../../../chunks/attributes.js";
import { p as pop, a as push } from "../../../../chunks/index2.js";
import "../../../../chunks/client.js";
function _page($$payload, $$props) {
  push();
  let email = "";
  let password = "";
  $$payload.out += `<div class="bg-gray-200 min-h-screen"><div class="flex flex-col justify-center items-center text-green-400 p-6"><h1 class="font-bold text-3xl text-gray-900 mb-6">Prihlásenie</h1> <form class="flex flex-col gap-4 w-full max-w-sm">`;
  {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--> <div><label for="email" class="block text-sm font-medium text-gray-700">Email</label> <input type="email" id="email" placeholder="Email"${attr("value", email)} class="basic-input text-gray-900" required></div> <div><label for="password" class="block text-sm font-medium text-gray-700">Password</label> <input type="password" id="password" placeholder="Heslo"${attr("value", password)} class="basic-input text-gray-900" required></div> <button type="submit" class="py-2 px-4 rounded-md bg-green-500 text-white font-bold transition duration-300 hover:bg-green-600 w-full">Sign In</button></form> <p class="mt-4 text-center text-sm text-gray-600">Nemáš účet? <a href="/auth/signup" class="text-blue-600 hover:underline">Zaregistruj sa!</a></p></div></div>`;
  pop();
}
export {
  _page as default
};
