import { f as fallback, b as bind_props, p as pop, c as stringify, e as ensure_array_like, a as push } from "../../../../chunks/index2.js";
import { p as page } from "../../../../chunks/index3.js";
import StarterKit from "@tiptap/starter-kit";
import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import Color from "@tiptap/extension-color";
import TextAlign from "@tiptap/extension-text-align";
import BulletList from "@tiptap/extension-bullet-list";
import ListItem from "@tiptap/extension-list-item";
import OrderedList, { OrderedList as OrderedList$1 } from "@tiptap/extension-ordered-list";
import { generateHTML, Extension } from "@tiptap/core";
import TextStyle from "@tiptap/extension-text-style";
import { a as attr } from "../../../../chunks/attributes.js";
import { e as escape_html } from "../../../../chunks/escaping.js";
import "../../../../chunks/client2.js";
function html(value) {
  var html2 = String(value ?? "");
  var open = "<!---->";
  return open + html2 + "<!---->";
}
const TextStyleExtended = TextStyle.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      fontSize: {
        default: null,
        parseHTML: (element) => element.style.fontSize?.replace("px", ""),
        renderHTML: (attributes) => {
          if (!attributes.fontSize) {
            return {};
          }
          return {
            style: `font-size: ${attributes.fontSize}px`
          };
        }
      },
      backgroundColor: {
        default: null,
        parseHTML: (element) => element.style.backgroundColor || null,
        renderHTML: (attributes) => {
          if (!attributes.backgroundColor) {
            return {};
          }
          return {
            style: `background-color: ${attributes.backgroundColor}`
          };
        }
      },
      fontFamily: {
        default: null,
        parseHTML: (element) => element.style.fontFamily || null,
        renderHTML: (attributes) => {
          if (!attributes.fontFamily) {
            return {};
          }
          return {
            style: `font-family: ${attributes.fontFamily}`
          };
        }
      }
    };
  },
  addCommands() {
    return {
      ...this.parent?.(),
      setFontSize: (fontSize) => ({ commands }) => {
        return commands.setMark(this.name, { fontSize });
      },
      unsetFontSize: () => ({ chain }) => {
        return chain().setMark(this.name, { fontSize: null }).removeEmptyTextStyle().run();
      },
      setBackgroundColor: (color) => ({ commands }) => {
        return commands.setMark(this.name, { backgroundColor: color });
      },
      unsetBackgroundColor: () => ({ chain }) => {
        return chain().setMark(this.name, { backgroundColor: null }).removeEmptyTextStyle().run();
      },
      setFontFamily: (fontFamily) => ({ commands }) => {
        return commands.setMark(this.name, { fontFamily });
      },
      unsetFontFamily: () => ({ chain }) => {
        return chain().setMark(this.name, { fontFamily: null }).removeEmptyTextStyle().run();
      }
    };
  }
});
function renderJSONToHTML(content) {
  try {
    return generateHTML(content, [
      StarterKit.configure({
        bulletList: false
        // Zakázať predvolený bullet list (nahradíme vlastným)
      }),
      Highlight,
      Link.configure({
        autolink: true,
        openOnClick: true
      }),
      Underline,
      TextStyleExtended,
      Color,
      TextAlign.configure({
        types: ["heading", "paragraph"]
      }),
      BulletList.configure({
        HTMLAttributes: {
          class: "bullet-list"
          // Pridajte vlastnú triedu
        }
      }),
      OrderedList.configure({
        HTMLAttributes: {
          class: "ordered-list"
          // Pridajte vlastnú triedu
        }
      }),
      ListItem.configure({
        HTMLAttributes: {
          class: "list-item"
          // Pridajte vlastnú triedu
        }
      })
    ]);
  } catch (error) {
    console.error("Chyba pri generovaní HTML:", error);
    return `<p>Chybný obsah</p>`;
  }
}
OrderedList$1.extend({
  addAttributes() {
    return {
      level: {
        default: 1,
        parseHTML: (element) => parseInt(element.getAttribute("data-level") || "1", 10),
        renderHTML: (attributes) => {
          return {
            "data-level": attributes.level
            // Generuje úroveň zoznamu
          };
        }
      }
    };
  }
}).configure({
  HTMLAttributes: {
    class: "ordered-list"
  }
});
Extension.create({
  name: "CustomKeyMap",
  addKeyboardShortcuts() {
    return {
      Tab: () => {
        this.editor.commands.insertContent("	");
        return true;
      },
      "Shift-Tab": () => {
        return true;
      }
    };
  }
});
function SubjectContent($$payload, $$props) {
  push();
  let isAdmin = $$props["isAdmin"];
  let tabs = fallback($$props["tabs"], () => [], true);
  let selectedTab = fallback($$props["selectedTab"], null);
  let selectedSubTab = fallback($$props["selectedSubTab"], null);
  let link = $$props["link"];
  let content = [];
  let htmlContent = [];
  let loading = true;
  let errorMessage = "";
  tabs.find((tab) => tab.id === selectedTab)?.subtabs.find((subtab) => subtab.id === selectedSubTab)?.id;
  const fetchContent = async (subtabId) => {
    if (subtabId === null) return;
    loading = true;
    errorMessage = "";
    content = [];
    try {
      const response = await fetch(`/subjects/${link}/tabs/subtabs/content/?subtabId=${subtabId}`);
      if (!response.ok) {
        const data2 = await response.json();
        errorMessage = data2.message || "Chyba pri načítaní obsahu";
        return;
      }
      const data = await response.json();
      content = data.content;
      htmlContent = content.map((item) => renderJSONToHTML(item.content));
    } catch (error) {
      console.error("Chyba pri načítaní obsahu zo servera:", error);
      errorMessage = "Chyba pri načítaní obsahu zo servera.";
    } finally {
      loading = false;
    }
  };
  tabs.find((tab) => tab.id === selectedTab)?.subtabs.find((subtab) => subtab.id === selectedSubTab)?.id;
  {
    if (selectedSubTab !== null) {
      fetchContent(selectedSubTab);
    }
  }
  $$payload.out += `<div class="flex flex-col w-full"><div class="bg-green-600 text-white"><div class="flex justify-around"><button${attr("class", `w-full p-4 bg-green-600 hover:bg-green-700 drop-shadow-2xl ${stringify(["bg-green-700"].filter(Boolean).join(" "))}`)}>FriCapsule</button> <button${attr("class", `w-full p-4 bg-green-600 hover:bg-green-700 drop-shadow-2xl ${stringify([""].filter(Boolean).join(" "))}`)}>CommunityCapsule</button> <button${attr("class", `w-full p-4 bg-green-600 hover:bg-green-700 drop-shadow-2xl ${stringify([""].filter(Boolean).join(" "))}`)}>CapsuleNotes</button></div></div> <div class="mx-16 my-10"><div class="w-full max-w-[1200px] mx-auto overflow-hidden mt-5 text-gray-900"><div>`;
  if (selectedTab !== null) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<h2 class="text-2xl font-semibold text-center">${escape_html(tabs.find((tab) => tab.id === selectedTab)?.name)} `;
    if (selectedSubTab !== null) {
      $$payload.out += "<!--[-->";
      $$payload.out += `- ${escape_html(tabs.find((tab) => tab.id === selectedTab)?.subtabs.find((subtab) => subtab.id === selectedSubTab)?.name)}`;
    } else {
      $$payload.out += "<!--[!-->";
    }
    $$payload.out += `<!--]--></h2>`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--></div></div> <div class="flex flex-col w-full text-gray-900">`;
  if (loading) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<p>Načítavam obsah...</p>`;
  } else {
    $$payload.out += "<!--[!-->";
    if (errorMessage) {
      $$payload.out += "<!--[-->";
      $$payload.out += `<p class="text-red-500">${escape_html(errorMessage)}</p>`;
    } else {
      $$payload.out += "<!--[!-->";
      const each_array = ensure_array_like(content);
      $$payload.out += `<div class="flex-row"><!--[-->`;
      for (let index = 0, $$length = each_array.length; index < $$length; index++) {
        each_array[index];
        $$payload.out += `<div class="flex">`;
        if (isAdmin) {
          $$payload.out += "<!--[-->";
          $$payload.out += `<div class="flex flex-col mt-1"><button aria-label="Odstrániť" class="text-red-500"><i class="fas fa-times w-4 h-4"></i></button> <button aria-label="Upraviť" class="text-blue-500"><i class="fa-solid fa-pen-to-square"></i></button></div>`;
        } else {
          $$payload.out += "<!--[!-->";
        }
        $$payload.out += `<!--]--> <div class="content-item border-2 p-4 rounded-xl bg-white w-full">${html(htmlContent[index])}</div></div>`;
      }
      $$payload.out += `<!--]--></div>`;
    }
    $$payload.out += `<!--]-->`;
  }
  $$payload.out += `<!--]--></div> `;
  {
    $$payload.out += "<!--[!-->";
    if (isAdmin) {
      $$payload.out += "<!--[-->";
      $$payload.out += `<div class="flex gap-2 my-5"><select class="basic-button w-full bg-green-500 hover:bg-green-700 text-center"><option class="bg-gray-200 text-gray-900" value="">Pridaj</option><option class="bg-gray-200 text-gray-900" value="Text">Text</option></select> <button class="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700">Pridať komponent</button></div>`;
    } else {
      $$payload.out += "<!--[!-->";
    }
    $$payload.out += `<!--]-->`;
  }
  $$payload.out += `<!--]--></div></div>`;
  bind_props($$props, {
    isAdmin,
    tabs,
    selectedTab,
    selectedSubTab,
    link
  });
  pop();
}
function Subject($$payload, $$props) {
  push();
  let isAdmin = $$props["isAdmin"];
  let subject = $$props["subject"];
  let tabs = [];
  let selectedTab = null;
  let selectedSubTab = null;
  let newTabName = "";
  let editingTabId = null;
  let editingTabName = "";
  let newSubTabName = "";
  let editingSubTabId = null;
  let editingSubTabName = "";
  const each_array = ensure_array_like(tabs);
  $$payload.out += `<div class="flex flex-grow min-h-screen"><div${attr("class", `fixed left-0 bg-gray-200 text-gray-900 p-4 transition-transform duration-300 z-20 ${stringify([
    "",
    "translate-x-[0]"
  ].filter(Boolean).join(" "))}`)} style="width: 300px; height: 100vh;"><h2 class="font-bold mb-4">Témy predmetu</h2> `;
  if (isAdmin) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<div class="mb-4"><input type="text"${attr("value", newTabName)} placeholder="Názov nového tabu" class="w-full p-2 rounded-md border"> <button class="w-full mt-2 bg-green-500 text-white p-2 rounded-md hover:bg-green-600"><i class="fa-solid fa-plus"></i> Pridať Tab</button></div>`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--> <ul><!--[-->`;
  for (let $$index_1 = 0, $$length = each_array.length; $$index_1 < $$length; $$index_1++) {
    let tab = each_array[$$index_1];
    $$payload.out += `<li class="bg-gray-100 hover:bg-gray-300 rounded-lg p-1 m-1"><ul${attr("class", `flex justify-between rounded-lg my-1 px-2 svelte-r0rprk ${stringify([selectedTab === tab.id ? "selected" : ""].filter(Boolean).join(" "))}`)}>`;
    if (editingTabId === tab.id) {
      $$payload.out += "<!--[-->";
      $$payload.out += `<input type="text"${attr("value", editingTabName)} placeholder="Editovať názov tabu" class="w-full rounded-md border mx-2 px-1 text-gray-900"> `;
      if (isAdmin) {
        $$payload.out += "<!--[-->";
        $$payload.out += `<div class="flex flex-row gap-2 text-lg"><button aria-label="Upraviť" class="text-green-500"><i class="fa-solid fa-check"></i></button> <button aria-label="Odstrániť" class="text-red-500"><i class="fas fa-times w-4 h-4"></i></button></div>`;
      } else {
        $$payload.out += "<!--[!-->";
      }
      $$payload.out += `<!--]-->`;
    } else {
      $$payload.out += "<!--[!-->";
      $$payload.out += `<button>${escape_html(tab.name)}</button> `;
      if (isAdmin) {
        $$payload.out += "<!--[-->";
        $$payload.out += `<div class="flex flex-row gap-2 text-lg"><button aria-label="Upraviť" class="text-blue-500"><i class="fa-solid fa-pen-to-square"></i></button> <button aria-label="Odstrániť" class="text-red-500"><i class="fas fa-times w-4 h-4"></i></button></div>`;
      } else {
        $$payload.out += "<!--[!-->";
      }
      $$payload.out += `<!--]-->`;
    }
    $$payload.out += `<!--]--></ul> `;
    if (selectedTab === tab.id) {
      $$payload.out += "<!--[-->";
      const each_array_1 = ensure_array_like(tab.subtabs);
      $$payload.out += `<ul class="pl-4 mt-2"><!--[-->`;
      for (let $$index = 0, $$length2 = each_array_1.length; $$index < $$length2; $$index++) {
        let subtab = each_array_1[$$index];
        $$payload.out += `<li${attr("class", `flex justify-between items-center rounded-lg my-1 px-2 svelte-r0rprk ${stringify([selectedSubTab === subtab.id ? "selected" : ""].filter(Boolean).join(" "))}`)}>`;
        if (editingSubTabId === subtab.id) {
          $$payload.out += "<!--[-->";
          $$payload.out += `<input type="text"${attr("value", editingSubTabName)} placeholder="Editovať názov podtabu" class="w-full rounded-md border mx-2 px-1 text-gray-900"> `;
          if (isAdmin) {
            $$payload.out += "<!--[-->";
            $$payload.out += `<div class="flex flex-row gap-2 text-lg"><button aria-label="Upraviť" class="text-green-500"><i class="fa-solid fa-check"></i></button> <button aria-label="Zrušiť" class="text-red-500"><i class="fas fa-times w-4 h-4"></i></button></div>`;
          } else {
            $$payload.out += "<!--[!-->";
          }
          $$payload.out += `<!--]-->`;
        } else {
          $$payload.out += "<!--[!-->";
          $$payload.out += `<button${attr("class", `svelte-r0rprk ${stringify([selectedSubTab === subtab.id ? "selected" : ""].filter(Boolean).join(" "))}`)}>${escape_html(subtab.name)}</button> `;
          if (isAdmin) {
            $$payload.out += "<!--[-->";
            $$payload.out += `<div class="flex flex-row gap-2 text-lg"><button aria-label="Odstrániť" class="text-blue-500"><i class="fa-solid fa-pen-to-square"></i></button> <button aria-label="Odstrániť" class="text-red-500"><i class="fas fa-times w-4 h-4"></i></button></div>`;
          } else {
            $$payload.out += "<!--[!-->";
          }
          $$payload.out += `<!--]-->`;
        }
        $$payload.out += `<!--]--></li>`;
      }
      $$payload.out += `<!--]--></ul> `;
      if (isAdmin) {
        $$payload.out += "<!--[-->";
        $$payload.out += `<div class="mt-2"><input type="text"${attr("value", newSubTabName)} placeholder="Nový subtab" class="w-full p-2 rounded-md border"> <button class="w-full mt-2 bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"><i class="fa-solid fa-plus"></i> Pridať SubTab</button></div>`;
      } else {
        $$payload.out += "<!--[!-->";
      }
      $$payload.out += `<!--]-->`;
    } else {
      $$payload.out += "<!--[!-->";
    }
    $$payload.out += `<!--]--></li>`;
  }
  $$payload.out += `<!--]--></ul></div> <div${attr("class", `flex-grow bg-gray-100 transition-all duration-300 ml-0 ${stringify(["ml-[300px]"].filter(Boolean).join(" "))}`)} style="min-height: 100vh; overflow-x: hidden;">`;
  SubjectContent($$payload, {
    tabs,
    selectedTab,
    selectedSubTab,
    link: subject.link,
    isAdmin
  });
  $$payload.out += `<!----></div> <button class="fixed bottom-4 left-4 bg-green-500 text-white p-3 rounded-full shadow-lg hover:bg-green-600 transition-colors z-50"${attr("style", `bottom: ${stringify("4px")};`)}>`;
  {
    $$payload.out += "<!--[-->";
    $$payload.out += `<i class="fa-solid fa-chevron-left"></i>`;
  }
  $$payload.out += `<!--]--></button></div>`;
  bind_props($$props, { isAdmin, subject });
  pop();
}
function _page($$payload, $$props) {
  push();
  let data = $$props["data"];
  if (data.subject) {
    $$payload.out += "<!--[-->";
    Subject($$payload, {
      subject: data.subject,
      isAdmin: page.data.isAdmin
    });
  } else {
    $$payload.out += "<!--[!-->";
    $$payload.out += `<div class="p-6 text-red-500">Nepodarilo sa načítať predmet.</div>`;
  }
  $$payload.out += `<!--]-->`;
  bind_props($$props, { data });
  pop();
}
export {
  _page as default
};
