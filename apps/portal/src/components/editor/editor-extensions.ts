import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import StarterKit from "@tiptap/starter-kit";
import Highlight from "@tiptap/extension-highlight";

export const editorExtensions = [
    StarterKit,
    Underline,
    Highlight,
    TextAlign.configure({
        types: ["heading", "paragraph"],
        alignments: ["left", "center", "right", "justify"],
        defaultAlignment: "left",
    }),
];
