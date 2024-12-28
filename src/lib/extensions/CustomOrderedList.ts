import { OrderedList } from "@tiptap/extension-ordered-list";

export const CustomOrderedList = OrderedList.extend({
    addAttributes() {
        return {
            level: {
                default: 1,
                parseHTML: (element) =>
                    parseInt(element.getAttribute("data-level") || "1", 10),
                renderHTML: (attributes) => {
                    return {
                        "data-level": attributes.level, // Generuje úroveň zoznamu
                    };
                },
            },
        };
    },
}).configure({
    HTMLAttributes: {
        class: "ordered-list",
    },
});
