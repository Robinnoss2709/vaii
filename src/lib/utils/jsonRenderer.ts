import StarterKit from "@tiptap/starter-kit";
import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import Color from "@tiptap/extension-color";
import TextAlign from "@tiptap/extension-text-align";
import BulletList from "@tiptap/extension-bullet-list";
import ListItem from "@tiptap/extension-list-item";
import OrderedList from "@tiptap/extension-ordered-list";
import { generateHTML } from "@tiptap/core";
import { TextStyleExtended } from "$lib/extensions/TextStyleExtended";

export function renderJSONToHTML(content: any): string {
    try {
        return generateHTML(content, [
            StarterKit.configure({
                bulletList: false, // Zakázať predvolený bullet list (nahradíme vlastným)
            }),
            Highlight,
            Link.configure({
                autolink: true,
                openOnClick: true,
            }),
            Underline,
            TextStyleExtended,
            Color,
            TextAlign.configure({
                types: ["heading", "paragraph"],
            }),
            BulletList.configure({
                HTMLAttributes: {
                    class: "bullet-list", // Pridajte vlastnú triedu
                },
            }),
            OrderedList.configure({
                HTMLAttributes: {
                    class: "ordered-list", // Pridajte vlastnú triedu
                },
            }),
            ListItem.configure({
                HTMLAttributes: {
                    class: "list-item", // Pridajte vlastnú triedu
                },
            }),
        ]);
    } catch (error) {
        console.error("Chyba pri generovaní HTML:", error);
        return `<p>Chybný obsah</p>`;
    }
}
