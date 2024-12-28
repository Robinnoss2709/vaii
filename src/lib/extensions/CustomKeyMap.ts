import { Extension } from "@tiptap/core";

export const CustomKeyMap = Extension.create({
    name: "CustomKeyMap",

    addKeyboardShortcuts() {
        return {
            Tab: () => {
                this.editor.commands.insertContent("\t");
                return true;
            },
            "Shift-Tab": () => {
                // Implementácia pre Shift + Tab
                return true;
            },
        };
    },
});
