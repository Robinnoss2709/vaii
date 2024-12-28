import { e as ensure_array_like } from "../../../chunks/index2.js";
import { e as escape_html } from "../../../chunks/escaping.js";
function _page($$payload) {
  let articles = [
    {
      title: "Novinka 1",
      date: "20. október 2024",
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec a diam lectus. Sed sit amet ipsum mauris."
    },
    {
      title: "Novinka 2",
      date: "19. október 2024",
      content: "Maecenas nec odio et ante tincidunt tempus. Donec vitae sapien ut libero venenatis faucibus."
    },
    {
      title: "Novinka 3",
      date: "18. október 2024",
      content: "Sed egestas, ante et vulputate volutpat, eros pede semper est, vitae luctus metus libero."
    }
  ];
  const each_array = ensure_array_like(articles);
  $$payload.out += `<div class="min-h-screen flex flex-col items-center justify-center bg-gray-200 p-6"><h1 class="font-bold text-3xl text-gray-900 mb-6">Novinky</h1> <div class="max-w-3xl w-full"><!--[-->`;
  for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
    let article = each_array[$$index];
    $$payload.out += `<div class="bg-white shadow-md rounded-lg p-6 mb-4"><h2 class="font-semibold text-2xl text-green-500 mb-2">${escape_html(article.title)}</h2> <p class="text-gray-500 text-sm mb-4">${escape_html(article.date)}</p> <p class="text-gray-700">${escape_html(article.content)}</p></div>`;
  }
  $$payload.out += `<!--]--></div></div>`;
}
export {
  _page as default
};
