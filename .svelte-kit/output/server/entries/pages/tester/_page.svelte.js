import { e as ensure_array_like, b as bind_props, p as pop, a as push, s as store_get, u as unsubscribe_stores } from "../../../chunks/index2.js";
import { e as escape_html } from "../../../chunks/escaping.js";
import { a as attr } from "../../../chunks/attributes.js";
import { w as writable } from "../../../chunks/index4.js";
import { z } from "zod";
import { p as page } from "../../../chunks/index3.js";
function SubjectCard($$payload, $$props) {
  push();
  let subject = $$props["subject"];
  let isEditingSubjects = $$props["isEditingSubjects"];
  let onDelete = $$props["onDelete"];
  let onEdit = $$props["onEdit"];
  const each_array = ensure_array_like(subject.fields);
  $$payload.out += `<div class="bg-white p-6 rounded-lg shadow-xl hover:shadow-2xl hover:shadow-green-400 transition-shadow duration-300 text-gray-900 relative">`;
  if (isEditingSubjects) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<div><span class="absolute top-0 right-4 border-1 text-red-600 hover:text-red-800 cursor-pointe text-4xl" role="button" tabindex="0" aria-label="Odstrániť"><i class="fas fa-times w-4 h-4"></i></span> <span class="absolute bottom-0 right-0 text-green-600 hover:text-green-800 pr-1 cursor-pointer text-3xl" role="button" tabindex="0" aria-label="Upraviť"><i class="fa-solid fa-pen-to-square"></i></span></div>`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--> <h2 class="text-2xl font-bold">${escape_html(subject.name)}</h2> <div class="flex flex-auto gap-3 bg-gray-200 rounded-md pl-2 mt-2"><div><span class="text-red-500">${escape_html(subject.study)}</span></div> <div class="relative group"><span class="text-blue-400 cursor-pointer underline">Odbor</span> <span class="absolute left-0 mt-2 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-sm bg-gray-100 font-bold p-1 rounded-md z-10 whitespace-nowrap"><!--[-->`;
  for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
    let field = each_array[$$index];
    $$payload.out += `<div>${escape_html(field)}</div>`;
  }
  $$payload.out += `<!--]--></span></div> <div><span class="text-orange-400">${escape_html(subject.year)}. roč.</span></div> <div><span class="text-green-400">${escape_html(subject.semester)}</span></div></div> <p class="mt-4">Testuj svoje znalosti z predmetu ${escape_html(subject.name)}.</p> <a${attr("href", `/subjects/${subject.link}`)} class="mt-4 inline-block basic-button bg-gray-500 hover-bg-green">Otvoriť tester</a></div>`;
  bind_props($$props, {
    subject,
    isEditingSubjects,
    onDelete,
    onEdit
  });
  pop();
}
z.object({
  name: z.string().min(1, "Názov predmetu je povinný."),
  study: z.string().min(1, "Vyberte štúdium."),
  year: z.union([
    z.number().min(1, "Vyberte ročník."),
    z.null()
    // Povolenie null ako prípustnej hodnoty
  ]).refine((value) => value !== null, {
    message: "Vyberte ročník."
  }),
  semester: z.string().min(1, "Vyberte semester."),
  fields: z.array(z.string()).min(1, "Vyberte aspoň jeden odbor."),
  link: z.string().min(1, "Zadajte platný odkaz.")
});
function _page($$payload, $$props) {
  push();
  var $$store_subs;
  let formErrors = writable({});
  let data = $$props["data"];
  const subjects = writable(data.subjectCards);
  const showModal = writable(false);
  let formData = {
    name: "",
    study: "",
    fields: [],
    year: null,
    semester: "",
    link: ""
  };
  let isEditing = false;
  let isEditingSubjects = false;
  const bachelorFields = [
    "Informatika",
    "Informatika a riadenie",
    "Informačné a sieťové technológie",
    "Manažment",
    "Počítačové inžinierstvo"
  ];
  const engineerFields = [
    "Aplikované sieťové inžinierstvo",
    "Biomedicínska Informatika",
    "Inteligentné informačné systémy",
    "Informačné systémy",
    "Informačný manažment",
    "Počítačové inžinierstvo"
  ];
  const years = [1, 2, 3];
  const studies = ["Bc.", "Ing."];
  const semesters = ["Zimný", "Letný"];
  async function fetchSubjects() {
    const response = await fetch("/tester");
    if (response.ok) {
      const items = await response.json();
      subjects.set(items);
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
      await fetch(`/tester?id=${id}`, { method: "DELETE" });
      await fetchSubjects();
    } catch (err) {
      console.error("Error deleting subject:", err);
    }
  }
  let searchQuery = "";
  const each_array = ensure_array_like(studies);
  const each_array_3 = ensure_array_like(years);
  const each_array_4 = ensure_array_like(semesters);
  const each_array_10 = ensure_array_like(store_get($$store_subs ??= {}, "$subjects", subjects));
  $$payload.out += `<div class="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6"><h1 class="text-4xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-6 text-center">Vyber si svoj predmet</h1> `;
  if (page.data.isAdmin) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<div class="mb-6 gap-5 flex"><span role="button" tabindex="0" aria-label="Pridať" class="basic-button bg-green-600 hover:bg-green-400 text-2xl"><i class="fa-solid fa-plus"></i></span> <button type="button"${attr("class", `basic-button ${isEditing ? "bg-red-500 hover:bg-red-600 text-gray-900" : "bg-blue-500 hover:bg-blue-600  text-gray-900"}`)}>${escape_html(isEditing ? "Dokončiť úpravy" : "Upraviť karty")}</button></div>`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--> <div class="flex justify-center mb-5 text-gray-900 w-full max-w-4xl"><input type="text"${attr("value", searchQuery)} placeholder="Vyhľadaj predmet..." class="basic-input"></div> <div class="text-gray-900 flex flex-col sm:flex-row justify-center mb-5 gap-4"><div class="flex items-center mx-auto"><i class="fa-solid fa-filter mr-2"></i></div> <div class="flex items-center"><select class="basic-input"><option value="">Štúdium</option><!--[-->`;
  for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
    let study = each_array[$$index];
    $$payload.out += `<option${attr("value", study)}>${escape_html(study)}</option>`;
  }
  $$payload.out += `<!--]--></select></div> <div class="flex items-center"><select class="basic-input"><option value="">Odbor</option>`;
  {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]-->`;
  {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--></select></div> <div class="flex items-center"><select class="basic-input"><option value="">Ročník</option><!--[-->`;
  for (let $$index_3 = 0, $$length = each_array_3.length; $$index_3 < $$length; $$index_3++) {
    let year = each_array_3[$$index_3];
    $$payload.out += `<option${attr("value", year)}>${escape_html(year)}</option>`;
  }
  $$payload.out += `<!--]--></select></div> <div class="flex items-center"><select class="basic-input"><option value="">Semester</option><!--[-->`;
  for (let $$index_4 = 0, $$length = each_array_4.length; $$index_4 < $$length; $$index_4++) {
    let semester = each_array_4[$$index_4];
    $$payload.out += `<option${attr("value", semester)}>${escape_html(semester)}</option>`;
  }
  $$payload.out += `<!--]--></select></div> <button type="button" class="flex items-center underline text-green-400 font-light cursor-pointer justify-center">Zruš filtre</button></div> `;
  if (store_get($$store_subs ??= {}, "$showModal", showModal)) {
    $$payload.out += "<!--[-->";
    const each_array_5 = ensure_array_like(studies);
    const each_array_6 = ensure_array_like(years);
    const each_array_7 = ensure_array_like(semesters);
    $$payload.out += `<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"><div class="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg"><h2 class="text-2xl font-bold mb-4 text-gray-900">${escape_html("Pridaj nový predmet")}</h2> <form class="flex flex-col gap-4"><input id="name" type="text"${attr("value", formData.name)} placeholder="Názov predmetu" class="basic-input"> `;
    if (store_get($$store_subs ??= {}, "$formErrors", formErrors).name) {
      $$payload.out += "<!--[-->";
      $$payload.out += `<p class="text-red-500">${escape_html(store_get($$store_subs ??= {}, "$formErrors", formErrors).name)}</p>`;
    } else {
      $$payload.out += "<!--[!-->";
    }
    $$payload.out += `<!--]--> <select class="basic-input"><option value="">Štúdium</option><!--[-->`;
    for (let $$index_5 = 0, $$length = each_array_5.length; $$index_5 < $$length; $$index_5++) {
      let study = each_array_5[$$index_5];
      $$payload.out += `<option${attr("value", study)}>${escape_html(study)}</option>`;
    }
    $$payload.out += `<!--]--></select> `;
    if (store_get($$store_subs ??= {}, "$formErrors", formErrors).study) {
      $$payload.out += "<!--[-->";
      $$payload.out += `<p class="text-red-500">${escape_html(store_get($$store_subs ??= {}, "$formErrors", formErrors).study)}</p>`;
    } else {
      $$payload.out += "<!--[!-->";
    }
    $$payload.out += `<!--]--> <select class="basic-input"><option${attr("value", null)} disabled selected hidden>Ročník</option><!--[-->`;
    for (let $$index_6 = 0, $$length = each_array_6.length; $$index_6 < $$length; $$index_6++) {
      let year = each_array_6[$$index_6];
      $$payload.out += `<option${attr("value", year)}>${escape_html(year)}</option>`;
    }
    $$payload.out += `<!--]--></select> `;
    if (store_get($$store_subs ??= {}, "$formErrors", formErrors).year) {
      $$payload.out += "<!--[-->";
      $$payload.out += `<p class="text-red-500">${escape_html(store_get($$store_subs ??= {}, "$formErrors", formErrors).year)}</p>`;
    } else {
      $$payload.out += "<!--[!-->";
    }
    $$payload.out += `<!--]--> <select class="basic-input"><option value="">Semester</option><!--[-->`;
    for (let $$index_7 = 0, $$length = each_array_7.length; $$index_7 < $$length; $$index_7++) {
      let semester = each_array_7[$$index_7];
      $$payload.out += `<option${attr("value", semester)}>${escape_html(semester)}</option>`;
    }
    $$payload.out += `<!--]--></select> `;
    if (store_get($$store_subs ??= {}, "$formErrors", formErrors).semester) {
      $$payload.out += "<!--[-->";
      $$payload.out += `<p class="text-red-500">${escape_html(store_get($$store_subs ??= {}, "$formErrors", formErrors).semester)}</p>`;
    } else {
      $$payload.out += "<!--[!-->";
    }
    $$payload.out += `<!--]--> <select class="basic-input" multiple><option value="" disabled>Vyber odbory</option>`;
    if (formData.study === "Bc.") {
      $$payload.out += "<!--[-->";
      const each_array_8 = ensure_array_like(bachelorFields);
      $$payload.out += `<!--[-->`;
      for (let $$index_8 = 0, $$length = each_array_8.length; $$index_8 < $$length; $$index_8++) {
        let field = each_array_8[$$index_8];
        $$payload.out += `<option${attr("value", field)}>${escape_html(field)}</option>`;
      }
      $$payload.out += `<!--]-->`;
    } else {
      $$payload.out += "<!--[!-->";
    }
    $$payload.out += `<!--]-->`;
    if (formData.study === "Ing.") {
      $$payload.out += "<!--[-->";
      const each_array_9 = ensure_array_like(engineerFields);
      $$payload.out += `<!--[-->`;
      for (let $$index_9 = 0, $$length = each_array_9.length; $$index_9 < $$length; $$index_9++) {
        let field = each_array_9[$$index_9];
        $$payload.out += `<option${attr("value", field)}>${escape_html(field)}</option>`;
      }
      $$payload.out += `<!--]-->`;
    } else {
      $$payload.out += "<!--[!-->";
    }
    $$payload.out += `<!--]--></select> `;
    if (store_get($$store_subs ??= {}, "$formErrors", formErrors).fields) {
      $$payload.out += "<!--[-->";
      $$payload.out += `<p class="text-red-500">${escape_html(store_get($$store_subs ??= {}, "$formErrors", formErrors).fields)}</p>`;
    } else {
      $$payload.out += "<!--[!-->";
    }
    $$payload.out += `<!--]--> <input type="text"${attr("value", formData.link)} placeholder="Odkaz na tester" class="basic-input mb-2"> `;
    if (store_get($$store_subs ??= {}, "$formErrors", formErrors).link) {
      $$payload.out += "<!--[-->";
      $$payload.out += `<p class="text-red-500">${escape_html(store_get($$store_subs ??= {}, "$formErrors", formErrors).link)}</p>`;
    } else {
      $$payload.out += "<!--[!-->";
    }
    $$payload.out += `<!--]--> <div class="flex justify-end gap-4"><button type="button" class="basic-button hover-bg-green bg-gray-500">Zrušiť</button> <button type="submit" class="basic-button hover-bg-green bg-gray-500">${escape_html("Pridať predmet")}</button></div></form></div></div>`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--> <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"><!--[-->`;
  for (let $$index_10 = 0, $$length = each_array_10.length; $$index_10 < $$length; $$index_10++) {
    let subject = each_array_10[$$index_10];
    if (subject.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      $$payload.out += "<!--[-->";
      SubjectCard($$payload, {
        subject,
        isEditingSubjects,
        onDelete: deleteItem,
        onEdit: openModalForEdit
      });
    } else {
      $$payload.out += "<!--[!-->";
    }
    $$payload.out += `<!--]-->`;
  }
  $$payload.out += `<!--]--></div></div>`;
  if ($$store_subs) unsubscribe_stores($$store_subs);
  bind_props($$props, { data });
  pop();
}
export {
  _page as default
};
