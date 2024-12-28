<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import { Editor } from "@tiptap/core";
    import StarterKit from "@tiptap/starter-kit";
    import Highlight from "@tiptap/extension-highlight";
    import Link from "@tiptap/extension-link";
    import Underline from "@tiptap/extension-underline";
    import Color from "@tiptap/extension-color";
    import TextAlign from "@tiptap/extension-text-align";
    import ListItem from "@tiptap/extension-list-item";
    import BulletList from "@tiptap/extension-bullet-list";
    import { TextStyleExtended } from "$lib/extensions/TextStyleExtended";
    import { Extension } from "@tiptap/core";
    import OrderedList from "@tiptap/extension-ordered-list";
    import { CustomOrderedList } from "$lib/extensions/CustomOrderedList";
    import { CustomKeyMap } from "$lib/extensions/CustomKeyMap";

    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();

    export let selectedContent: number;
    export let subtabId: number | undefined;
    export let link: string;
    export let initialContent: string;

    type ContentItem = {
        id: number;
        content: string;
    };
    export let editingContent: ContentItem | null = null;

    if (initialContent == "") {
        initialContent = "<p>Start writing your content here!</p>";
    }

    async function saveContentToDatabase(content: any) {
        try {
            const url = `/subjects/${link}/tabs/subtabs/content`;
            const method = editingContent ? "PATCH" : "POST"; // Rozlišujeme PATCH a POST
            const body = editingContent
                ? JSON.stringify({ id: editingContent.id, content }) // PATCH potrebuje ID
                : JSON.stringify({
                      content,
                      selectedContent,
                      subtabId,
                      contentType: "article", // Typ obsahu
                  });

            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                },
                body,
            });

            let result = null;
            if (response.ok) {
                // Skontrolujeme, či je telo odpovede dostupné
                if (
                    response.headers
                        .get("Content-Type")
                        ?.includes("application/json")
                ) {
                    result = await response.json();
                }
                console.log("Obsah bol úspešne uložený:", result);

                // Emituj udalosť o uložení obsahu
                dispatch("contentSaved", {
                    content,
                    id: result?.id || editingContent?.id || Date.now(), // Použijeme ID zo servera, ak je dostupné
                    isNew: !editingContent, // Informácia, či ide o nový obsah
                });
            } else {
                const errorData = await response.json();
                console.error("Chyba pri ukladaní obsahu:", errorData.message);
            }
        } catch (error) {
            console.error("Chyba pri ukladaní obsahu:", error);
        }
    }

    function exportContent() {
        if (editor) {
            const content = editor.getJSON(); // Exportujeme obsah do JSON formátu
            saveContentToDatabase(content); // Zavoláme funkciu na uloženie na server
            dispatch("closeEditor");
        } else {
            console.error("Editor je null");
        }
    }

    function cancelEdit() {
        dispatch("cancelEdit");
    }

    export let editable: boolean = true;

    let element: HTMLElement | null = null;
    let editor: Editor | null = null;

    const fonts = [
        { name: "Poppins", value: "", classa: "poppins" },
        { name: "Arial", value: "Arial", classa: "font-sans" },
        { name: "Georgia", value: "Georgia", classa: "font-serif" },
        {
            name: "Times New Roman",
            value: "Times New Roman",
            classa: "font-serif",
        },
        { name: "Courier New", value: "Courier New", classa: "font-mono" },
        { name: "Verdana", value: "Verdana", classa: "font-sans" },
    ];

    onMount(() => {
        if (element) {
            editor = new Editor({
                element,
                editable,
                extensions: [
                    StarterKit.configure({
                        bulletList: false, // Zakázať predvolený bullet list
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
                            class: "bullet-list",
                        },
                    }),
                    CustomOrderedList,
                    ListItem.configure({
                        HTMLAttributes: {
                            class: "list-item",
                        },
                    }),
                    CustomKeyMap, // Importované rozšírenie
                ],

                content: initialContent,
            });
        }
    });

    onDestroy(() => {
        editor?.destroy();
    });

    $: if (editor) {
        editor.setEditable(editable);
    }

    let textColor = "#000000"; // Default color

    function setTextColor(color: string) {
        editor?.chain().focus().setColor(color).run();
        textColor = color;
    }

    let backGroundColor = "#000000"; // Default color

    function setBackgroundColor(color: string) {
        editor?.chain().focus().setBackgroundColor(color).run();
        backGroundColor = color;
    }

    function toggleBulletList() {
        editor?.chain().focus().toggleBulletList().run();
    }

    function toggleOrderedList() {
        editor?.chain().focus().toggleOrderedList().run();
    }

    function setFontSize(size: string) {
        editor?.chain().focus().setFontSize(size).run();
    }

    function setFontFamily(font: string) {
        editor?.chain().focus().setFontFamily(font).run();
    }

    function indent() {
        if (editor?.isActive("listItem")) {
            const currentLevel = editor.state.selection.$from.depth; // Získanie aktuálnej úrovne zoznamu
            if (currentLevel >= 8) return false; // Ak je úroveň 4 alebo vyššia, zablokujeme ďalšie odsadenie
            editor.chain().focus().sinkListItem("listItem").run();
        } else {
            // Pri normálnom texte pridaním tabulátora, udržíme správnu pozíciu
            editor
                ?.chain()
                .focus()
                .insertContentAt(editor.state.selection.from, "\t")
                .run();
        }
    }

    function outdent() {
        if (!editor) return false;

        if (editor.isActive("listItem")) {
            const currentLevel = editor.state.selection.$from.depth; // Získanie aktuálnej úrovne zoznamu
            if (currentLevel <= 1) return false; // Ak je úroveň 1 alebo nižšia, zablokujeme zmenšovanie
            editor.chain().focus().liftListItem("listItem").run();
        } else {
            // Odstránime tabulátor pri texte
            const { from, to } = editor.state.selection;
            const prevChar = editor.state.doc.textBetween(from - 1, from, "\n");
            if (prevChar === "\t") {
                editor
                    .chain()
                    .focus()
                    .deleteRange({ from: from - 1, to })
                    .run();
            }
        }
        return true;
    }
</script>

<div class="space-y-4 border rounded-lg border-gray-900 p-5">
    <div class="flex flex-col gap-2 border p-2 rounded bg-gray-200">
        {#if editor}
            <!-- Formátovanie textu -->
            <div class="flex gap-2">
                <div class="flex gap-2 border p-1 rounded border-gray-900">
                    <div class="flex items-center gap-2">
                        <!-- Font family -->
                        <select
                            id="font-family"
                            class="basic-input"
                            on:change={(e) => {
                                const target = e.target as HTMLSelectElement;
                                if (target?.value) {
                                    editor
                                        ?.chain()
                                        .focus()
                                        .setFontFamily(target.value)
                                        .run();
                                }
                            }}
                        >
                            {#each fonts as { name, value, classa }}
                                <option {value} class={classa}>{name}</option>
                            {/each}
                        </select>
                    </div>
                    <!-- Font size -->
                    <div class="flex items-center gap-2">
                        <input
                            id="font-size"
                            type="number"
                            min="10"
                            max="100"
                            step="1"
                            value="16"
                            class="basic-input"
                            on:input={(e) => {
                                const target = e.target as HTMLInputElement;
                                if (target?.value) {
                                    setFontSize(target.value);
                                }
                            }}
                        />
                    </div>
                </div>

                <div class="flex gap-2 border p-1 rounded border-gray-900">
                    <!-- Left Align -->
                    <button
                        on:click={() =>
                            editor?.chain().focus().setTextAlign("left").run()}
                        aria-label="Left align"
                        class="px-4 py-2 border rounded text-sm font-medium bg-gray-100 text-gray-900 hover:bg-blue-100 hover:border-green-500"
                    >
                        <i class="fa-solid fa-align-left"></i>
                    </button>
                    <!-- Center Align -->
                    <button
                        on:click={() =>
                            editor
                                ?.chain()
                                .focus()
                                .setTextAlign("center")
                                .run()}
                        aria-label="Center align"
                        class="px-4 py-2 border rounded text-sm font-medium bg-gray-100 text-gray-900 hover:bg-blue-100 hover:border-green-500"
                    >
                        <i class="fa-solid fa-align-center"></i>
                    </button>
                    <!-- Left Align -->
                    <button
                        on:click={() =>
                            editor?.chain().focus().setTextAlign("right").run()}
                        aria-label="Right align"
                        class="px-4 py-2 border rounded text-sm font-medium bg-gray-100 text-gray-900 hover:bg-blue-100 hover:border-green-500"
                    >
                        <i class="fa-solid fa-align-right"></i>
                    </button>
                    <!-- Justify Align -->
                    <button
                        on:click={() =>
                            editor
                                ?.chain()
                                .focus()
                                .setTextAlign("justify")
                                .run()}
                        aria-label="Justify align"
                        class="px-4 py-2 border rounded text-sm font-medium bg-gray-100 text-gray-900 hover:bg-blue-100 hover:border-green-500"
                    >
                        <i class="fa-solid fa-align-justify"></i>
                    </button>
                </div>
                <div class="flex gap-2 border p-1 rounded border-gray-900">
                    <!-- Bullet List -->
                    <button
                        on:click={toggleBulletList}
                        aria-label="Bulltet list"
                        class="px-4 py-2 border rounded text-sm font-medium bg-gray-100 text-gray-900 hover:bg-blue-100 hover:border-green-500"
                    >
                        <i class="fa-solid fa-list"></i>
                    </button>
                    <!-- Ordered List -->
                    <button
                        on:click={toggleOrderedList}
                        aria-label="Ordered list"
                        class="px-4 py-2 border rounded text-sm font-medium bg-gray-100 hover:bg-blue-100 text-gray-900 hover:border-green-500"
                    >
                        <i class="fa-solid fa-list-ol"></i>
                    </button>
                    <!-- Indent -->
                    <button
                        on:click={indent}
                        aria-label="Indent"
                        class="px-4 py-2 border rounded text-sm font-medium bg-gray-100 hover:bg-blue-100 text-gray-900 hover:border-green-500"
                    >
                        <i class="fa-solid fa-indent"></i>
                    </button>
                    <!-- Outdent -->
                    <button
                        on:click={outdent}
                        aria-label="Outdent"
                        class="px-4 py-2 border rounded text-sm font-medium bg-gray-100 hover:bg-blue-100 text-gray-900 hover:border-green-500"
                    >
                        <i class="fa-solid fa-outdent"></i>
                    </button>
                </div>
            </div>
            <!-- Font modify -->
            <div class="flex flex-row gap-2">
                <div class="flex gap-2 border p-1 rounded border-gray-900">
                    <!-- Bold -->
                    <button
                        on:click={() =>
                            editor?.chain().focus().toggleBold().run()}
                        aria-label="Bold"
                        class="px-4 py-2 border rounded text-sm font-medium bg-gray-100 active:bg-gray-300 text-gray-900 hover:bg-blue-100 hover:border-green-500"
                        class:active={editor?.isActive("bold")}
                    >
                        <i class="fa-solid fa-bold"></i>
                    </button>
                    <!-- Italic -->
                    <button
                        on:click={() =>
                            editor?.chain().focus().toggleItalic().run()}
                        aria-label="Italic"
                        class="px-4 py-2 border rounded text-sm font-medium bg-gray-100 active:bg-gray-300 text-gray-900 hover:bg-blue-100 hover:border-green-500"
                        class:active={editor?.isActive("italic")}
                    >
                        <i class="fa-solid fa-italic"></i>
                    </button>
                    <!-- Underline -->
                    <button
                        on:click={() =>
                            editor?.chain().focus().toggleUnderline().run()}
                        aria-label="Underline"
                        class="px-4 py-2 border rounded text-sm font-medium bg-gray-100 active:bg-gray-300 text-gray-900 hover:bg-blue-100 hover:border-green-500"
                        class:active={editor?.isActive("underline")}
                    >
                        <i class="fa-solid fa-underline"></i>
                    </button>
                </div>
                <div class="flex gap-2 border p-1 rounded border-gray-900">
                    <div
                        class="flex items-center gap-2 border px-2 rounded bg-gray-100 hover:bg-blue-100 hover:border-green-500"
                    >
                        <button
                            aria-label="text color"
                            class="text-sm font-medium"
                            on:click={() => setTextColor(textColor)}
                        >
                            <i class="fa-solid fa-a" style="color: {textColor};"
                            ></i>
                        </button>
                        <input
                            id="text-color"
                            type="color"
                            class="border rounded p-1 cursor-pointer"
                            on:input={(e) =>
                                setTextColor(
                                    (e.target as HTMLInputElement).value,
                                )}
                        />
                    </div>

                    <!-- Farba pozadia -->
                    <div
                        class="flex items-center gap-2 border px-2 rounded bg-gray-100 hover:bg-blue-100 hover:border-green-500"
                    >
                        <button
                            aria-label="background color"
                            class="text-sm font-medium"
                            on:click={() => setBackgroundColor(backGroundColor)}
                            ><i
                                class="fa-solid fa-fill-drip"
                                style="color: {backGroundColor};"
                            ></i></button
                        >
                        <input
                            id="background-color"
                            type="color"
                            class="border rounded p-1 cursor-pointer"
                            on:input={(e) =>
                                setBackgroundColor(
                                    (e.target as HTMLInputElement).value,
                                )}
                        />
                    </div>
                </div>
            </div>
        {/if}
    </div>

    <style>
        .ProseMirror ::selection {
            background-color: rgba(156, 163, 175, 0.3); /* voliteľné */
        }
        .ProseMirror {
            color: black;
            outline: none;
            padding: 8px;
            min-height: 200px;
            font-family: Arial, sans-serif;
            font-size: 16px;
            tab-size: 4; /* Nastavenie dĺžky jedného tabulátora */
            white-space: pre-wrap; /* Zachovanie tabulátorov v texte */
            word-wrap: break-word; /* Zalomenie dlhých slov */
            overflow-wrap: break-word; /* Zalomenie dlhých slov (moderný spôsob) */
            max-width: 100%; /* Obmedzenie maximálnej šírky na kontajner */
            box-sizing: border-box; /* Zabezpečenie správneho správania padding/margin */
        }

        .ProseMirror a {
            color: #1a73e8; /* Modrá farba odkazu */
            text-decoration: underline; /* Podčiarknutie odkazu */
        }

        .ProseMirror a:hover {
            color: #0c56d1; /* Tmavšia modrá pri hover */
            text-decoration: underline; /* Podčiarknutie pri hover */
            cursor: pointer;
        }
        .bullet-list {
            list-style-type: disc;
            margin-left: 1.5rem;
        }

        .list-item {
            margin-bottom: 0.5rem;
        }
        .ordered-list {
            counter-reset: section; /* Resetujeme číslovanie pre každý zoznam */
            list-style: none; /* Odstránime predvolené číslovanie */
            margin-left: 0;
        }

        /* Základný štýl pre každý prvok zoznamu */
        .ordered-list > .list-item {
            margin-bottom: 0.5rem;
            display: block; /* Zabezpečíme, že text nebude blokovaný flexom */
            margin-left: 1.5rem; /* Odsadenie pre zoznam */
            word-wrap: break-word; /* Zabezpečíme, že dlhý text sa správne zalomí */
            padding-left: 1.5rem; /* Odsadenie pre text za číslovaním */
        }

        /* Číslovanie v rámci zoznamu */
        .ordered-list > .list-item:before {
            content: counters(section, ".") "."; /* Číslovanie s bodkou */
            counter-increment: section; /* Zvyšujeme číslovanie pri každom zozname */
            position: absolute; /* Umistíme číslovanie na začiatok */
            margin-left: -1.5rem; /* Posunutie na začiatok riadku */
        }

        /* Text v zozname */
        .ordered-list > .list-item p {
            margin: 0;
            padding-left: 1rem; /* Pridanie malej medzery medzi číslovaním a textom */
        }

        /* Pre vnútorné zoznamy (sub-úrovne) pridáme ďalšie odsadenie */
        .ordered-list .ordered-list {
            margin-left: 2rem; /* Odsadenie pre vnútorné zoznamy */
        }
        /* Pre viacúrovňové zoznamy obmedzíme šírku */
        .ordered-list .ordered-list .ordered-list {
            margin-left: 3rem; /* Odsadenie pre 3. úroveň */
        }
        .ordered-list .ordered-list .ordered-list .ordered-list {
            margin-left: 4rem; /* Odsadenie pre 4. úroveň */
        }
    </style>

    <div
        bind:this={element}
        class="ProseMirror border-2 p-4 min-h-[200px]"
    ></div>

    <!-- Tlačidlo na exportovanie obsahu -->
    <div>
        <button
            class="basic-button hover-bg-green bg-green-500"
            on:click={exportContent}
        >
            {editingContent ? "Uložiť zmeny" : "Pridať obsah"}
        </button>
        <button
            on:click={cancelEdit}
            class="basic-button bg-red-500 hover:bg-red-700"
        >
            Zruš
        </button>
    </div>
</div>
