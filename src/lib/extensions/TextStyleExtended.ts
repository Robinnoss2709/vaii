import TextStyle from '@tiptap/extension-text-style';

declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        fontSize: {
            /**
             * Set the font size
             */
            setFontSize: (size: string) => ReturnType;
            /**
             * Unset the font size
             */
            unsetFontSize: () => ReturnType;
        };
        backgroundColor: {
            /**
             * Set the background color
             */
            setBackgroundColor: (color: string) => ReturnType;
            /**
             * Unset the background color
             */
            unsetBackgroundColor: () => ReturnType;
        };
        fontFamily: {
            /**
             * Set the background color
             */
            setFontFamily: (fontFamily: string) => ReturnType;
            /**
             * Unset the background color
             */
            unsetFontFamily: () => ReturnType;
        };
    }
}

export const TextStyleExtended = TextStyle.extend({
    addAttributes() {
        return {
            ...this.parent?.(),
            fontSize: {
                default: null,
                parseHTML: (element) => element.style.fontSize?.replace('px', ''),
                renderHTML: (attributes) => {
                    if (!attributes.fontSize) {
                        return {};
                    }
                    return {
                        style: `font-size: ${attributes.fontSize}px`,
                    };
                },
            },
            backgroundColor: {
                default: null,
                parseHTML: (element) => element.style.backgroundColor || null,
                renderHTML: (attributes) => {
                    if (!attributes.backgroundColor) {
                        return {};
                    }
                    return {
                        style: `background-color: ${attributes.backgroundColor}`,
                    };
                },
            },
            fontFamily: {
                default: null,
                parseHTML: (element) => element.style.fontFamily || null,
                renderHTML: (attributes) => {
                    if (!attributes.fontFamily) {
                        return {};
                    }
                    return {
                        style: `font-family: ${attributes.fontFamily}`,
                    };
                },
            },
        };
    },

    addCommands() {
        return {
            ...this.parent?.(),
            setFontSize:
                (fontSize) =>
                    ({ commands }) => {
                        return commands.setMark(this.name, { fontSize });
                    },
            unsetFontSize:
                () =>
                    ({ chain }) => {
                        return chain()
                            .setMark(this.name, { fontSize: null })
                            .removeEmptyTextStyle()
                            .run();
                    },
            setBackgroundColor:
                (color) =>
                    ({ commands }) => {
                        return commands.setMark(this.name, { backgroundColor: color });
                    },
            unsetBackgroundColor:
                () =>
                    ({ chain }) => {
                        return chain()
                            .setMark(this.name, { backgroundColor: null })
                            .removeEmptyTextStyle()
                            .run();
                    },
            setFontFamily:
                (fontFamily) =>
                    ({ commands }) => {
                        return commands.setMark(this.name, { fontFamily });
                    },
            unsetFontFamily:
                () =>
                    ({ chain }) => {
                        return chain()
                            .setMark(this.name, { fontFamily: null })
                            .removeEmptyTextStyle()
                            .run();
                    },

        };
    },
});
