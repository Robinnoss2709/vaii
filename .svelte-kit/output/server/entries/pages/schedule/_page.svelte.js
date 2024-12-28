import { b as bind_props, p as pop, a as push, e as ensure_array_like, s as store_get, u as unsubscribe_stores } from "../../../chunks/index2.js";
import { w as writable } from "../../../chunks/index4.js";
import { z } from "zod";
import { a as attr } from "../../../chunks/attributes.js";
import { e as escape_html } from "../../../chunks/escaping.js";
z.object({
  subject: z.string().max(7, "Predmet môže mať maximálne 7 znakov"),
  teacher: z.string().max(20, "Učiteľ môže mať maximálne 20 znakov").regex(/^\w+(\s+\w+)?$/, "Učiteľ musí mať iba meno alebo aj priezvisko"),
  classroom: z.string().max(6, "Miestnosť môže mať maximálne 6 znakov")
});
const colors = {
  blue: "bg-blue-500",
  red: "bg-red-500",
  yellow: "bg-yellow-400",
  green: "bg-green-700",
  orange: "bg-orange-400",
  pink: "bg-pink-400",
  purple: "bg-purple-400",
  gray: "bg-gray-400",
  lightBlue: "bg-blue-300",
  lime: "bg-green-400"
};
function ScheduleItem($$payload, $$props) {
  push();
  let item = $$props["item"];
  let isEditingSchedule = $$props["isEditingSchedule"];
  let onDelete = $$props["onDelete"];
  let onEdit = $$props["onEdit"];
  $$payload.out += `<div${attr("class", `relative h-full ${item.color} text-gray-900 rounded p-1 border-2 border-gray-900`)}><p class="font-semibold">${escape_html(item.subject)}</p> <p class="text-sm">${escape_html(item.teacher)}</p> `;
  if (item.type === "lecture") {
    $$payload.out += "<!--[-->";
    $$payload.out += `<p class="text-sm">Pr.(${escape_html(item.classroom)})</p>`;
  } else {
    $$payload.out += "<!--[!-->";
    if (item.type === "exercise") {
      $$payload.out += "<!--[-->";
      $$payload.out += `<p class="text-sm">Cv.(${escape_html(item.classroom)})</p>`;
    } else {
      $$payload.out += "<!--[!-->";
    }
    $$payload.out += `<!--]-->`;
  }
  $$payload.out += `<!--]--> `;
  if (isEditingSchedule) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<span class="absolute top-0 right-0 border-1 text-red-900 hover:text-red-800 cursor-pointer" role="button" tabindex="0" aria-label="Odstrániť"><i class="fas fa-times w-4 h-4"></i></span> <span class="absolute bottom-0 right-0 text-green-900 hover:text-green-800 pr-1 cursor-pointer text-sm" role="button" tabindex="0" aria-label="Upraviť"><i class="fa-solid fa-pen-to-square"></i></span>`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--></div>`;
  bind_props($$props, { item, isEditingSchedule, onDelete, onEdit });
  pop();
}
function _page($$payload, $$props) {
  push();
  var $$store_subs;
  let formErrors = writable({});
  let data = $$props["data"];
  const schedule = writable(data.scheduleItems);
  const showModal = writable(false);
  let formData = {
    day: "",
    hour: "",
    subject: "",
    teacher: "",
    classroom: "",
    type: "lecture",
    color: "bg-gray-400"
  };
  let isEditing = false;
  let isEditingSchedule = false;
  async function fetchSchedule() {
    const response = await fetch("/schedule");
    if (response.ok) {
      const items = await response.json();
      schedule.set(items);
    }
  }
  function openModalForEdit(item) {
    formData = { ...item };
    isEditing = true;
    item.id;
    showModal.set(true);
  }
  async function deleteItem(id) {
    try {
      await fetch(`/schedule?id=${id}`, { method: "DELETE" });
      await fetchSchedule();
    } catch (err) {
      console.error("Error deleting item:", err);
    }
  }
  const each_array = ensure_array_like(Array.from({ length: 13 }, (_, i) => 7 + i));
  const each_array_1 = ensure_array_like([
    "Pondelok",
    "Utorok",
    "Streda",
    "Štvrtok",
    "Piatok"
  ]);
  $$payload.out += `<div class="min-h-screen bg-gray-200"><div class="container mx-auto py-6 px-3"><h1 class="font-bold text-3xl text-gray-900 mb-6 text-center">Rozvrh Hodín</h1> <div class="mb-4 text-center"><button type="button"${attr("class", `py-1 px-4 rounded-md font-bold transition duration-300 border-2 border-gray-900 ${"bg-blue-500 hover:bg-blue-600 text-gray-900"}`)}>${escape_html("Upraviť rozvrh")}</button></div> <div class="overflow-x-auto"><div class="grid grid-cols-[100px_repeat(13,_minmax(0,1fr))] grid-rows-[50px_repeat(5,100px)] border-2 border-gray-900 rounded-sm shadow-md"><div class="text-gray-900 p-2 font-bold sticky left-0 top-0 z-20 border-2 border-gray-900"></div> <!--[-->`;
  for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
    let hour = each_array[$$index];
    $$payload.out += `<div class="bg-green-500 text-gray-900 p-2 font-bold sticky top-0 z-10 border-2 border-gray-900">${escape_html(hour)}:00</div>`;
  }
  $$payload.out += `<!--]--> <!--[-->`;
  for (let $$index_3 = 0, $$length = each_array_1.length; $$index_3 < $$length; $$index_3++) {
    let day = each_array_1[$$index_3];
    const each_array_2 = ensure_array_like(Array.from({ length: 13 }, (_, i) => 7 + i));
    $$payload.out += `<div class="border-2 border-gray-900 p-2 bg-slate-300 text-gray-900 font-bold sticky left-0 z-10">${escape_html(day)}</div> <!--[-->`;
    for (let $$index_2 = 0, $$length2 = each_array_2.length; $$index_2 < $$length2; $$index_2++) {
      let hour = each_array_2[$$index_2];
      const each_array_3 = ensure_array_like(store_get($$store_subs ??= {}, "$schedule", schedule).filter((item) => item.day === day && item.hour === `${hour}:00`));
      $$payload.out += `<button type="button"${attr("class", `w-full border-2 border-gray-900 p-1 cursor-pointer text-left relative ${"cursor-auto bg-gray-200 text-gray-400"}`)}><!--[-->`;
      for (let $$index_1 = 0, $$length3 = each_array_3.length; $$index_1 < $$length3; $$index_1++) {
        let item = each_array_3[$$index_1];
        ScheduleItem($$payload, {
          item,
          isEditingSchedule,
          onDelete: deleteItem,
          onEdit: openModalForEdit
        });
      }
      $$payload.out += `<!--]--></button>`;
    }
    $$payload.out += `<!--]-->`;
  }
  $$payload.out += `<!--]--></div></div></div> `;
  if (store_get($$store_subs ??= {}, "$showModal", showModal)) {
    $$payload.out += "<!--[-->";
    const each_array_4 = ensure_array_like(Object.entries(colors));
    $$payload.out += `<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10"><div class="bg-gray-200 text-gray-900 rounded-lg p-6 shadow-lg border-2 border-slate-900 mx-8 w-full max-w-md"><h2 class="text-xl font-bold mb-4 text-center">${escape_html(isEditing ? "Uprav predmet" : "Pridaj predmet")}</h2> <form class="flex flex-col gap-4"><div><label for="day" class="block text-sm font-bold mb-1">Deň</label> <input id="day" class="basic-input bg-gray-300 cursor-default" type="text" placeholder="Zadajte deň"${attr("value", formData.day)} readonly></div> <div><label for="hour" class="block text-sm font-bold mb-1">Hodina</label> <input id="hour" class="basic-input bg-gray-300 cursor-default" type="text" placeholder="Zadajte hodinu"${attr("value", formData.hour)} readonly></div> <div><label for="subject" class="block text-sm font-bold mb-1">Predmet</label> <input id="subject" class="basic-input bg-gray-300" type="text" placeholder="Zadajte predmet"${attr("value", formData.subject)} required> <p class="text-red-500 text-sm mt-1">${escape_html(store_get($$store_subs ??= {}, "$formErrors", formErrors).subject)}</p></div> <div><label for="teacher" class="block text-sm font-bold mb-1">Učiteľ</label> <input id="teacher" class="basic-input bg-gray-300" type="text" placeholder="Zadajte učiteľa"${attr("value", formData.teacher)} required> <p class="text-red-500 text-sm mt-1">${escape_html(store_get($$store_subs ??= {}, "$formErrors", formErrors).teacher)}</p></div> <div><label for="classroom" class="block text-sm font-bold mb-1">Miestnosť</label> <input id="classroom" class="basic-input bg-gray-300" type="text" placeholder="Zadajte miestnosť"${attr("value", formData.classroom)} required> <p class="text-red-500 text-sm mt-1">${escape_html(store_get($$store_subs ??= {}, "$formErrors", formErrors).classroom)}</p></div> <div><p class="block text-sm font-bold mb-1">Typ výučby</p> <div class="flex items-center gap-4"><label class="flex items-center gap-2"><input type="radio" name="type" value="lecture"${attr("checked", formData.type === "lecture", true)} class="border-2 border-gray-500 rounded-full p-2"> <span>Prednáška</span></label> <label class="flex items-center gap-2"><input type="radio" name="type" value="exercise"${attr("checked", formData.type === "exercise", true)} class="border-2 border-gray-500 rounded-full p-2"> <span>Cvičenie</span></label></div></div> <div><p class="block text-sm font-bold mb-1">Farba</p> <div class="flex justify-between"><!--[-->`;
    for (let $$index_4 = 0, $$length = each_array_4.length; $$index_4 < $$length; $$index_4++) {
      let [colorName, colorClass] = each_array_4[$$index_4];
      $$payload.out += `<button type="button"${attr("class", `rounded-md border-2 border-slate-900 p-3 focus:border-green-400 focus:border-2 ${colorClass}`)}${attr("aria-label", colorName)}></button>`;
    }
    $$payload.out += `<!--]--></div></div> <div>`;
    if (Object.keys(store_get($$store_subs ??= {}, "$formErrors", formErrors)).length > 0) {
      $$payload.out += "<!--[-->";
      $$payload.out += `<div class="text-red-500 text-sm mt-1">Opravte chyby vo formulári a skúste znova.</div>`;
    } else {
      $$payload.out += "<!--[!-->";
    }
    $$payload.out += `<!--]--></div> <div class="flex justify-end gap-2"><button type="button" class="py-2 px-4 rounded-md bg-red-600 text-gray-900 font-bold transition duration-300 hover:bg-red-800 border-2 border-gray-900">Zrušiť</button> <button type="submit" class="py-2 px-4 rounded-md bg-green-400 text-gray-900 font-bold transition duration-300 hover:bg-green-600 border-2 border-gray-900">Uložiť</button></div></form></div></div>`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--></div>`;
  if ($$store_subs) unsubscribe_stores($$store_subs);
  bind_props($$props, { data });
  pop();
}
export {
  _page as default
};
