"use client";

import { EditorContent, useEditor } from "@tiptap/react";

import { editorExtensions } from "@/components/editor/editor-extensions";
import { Toolbar } from "@/components/editor/editor-toolbar";

export const Editor = ({
    content,
    onChange,
}: {
    content?: string;
    onChange?: (content: string) => void;
}) => {
    const editor = useEditor({
        immediatelyRender: false,
        extensions: editorExtensions,
        content: content,
        editorProps: {
            attributes: {
                class: "rounded-md border-none outline-hidden ring-0 p-4",
            },
        },
        onUpdate: ({ editor }) => {
            onChange?.(editor.getHTML());
        },
        autofocus: "start",
    });

    return (
        <div className="rounded-sm">
            <Toolbar editor={editor} />
            <div
                id="editor"
                className={`no-scrollbar [&_.ProseMirror]:prose [&_.ProseMirror]:font-inherit min-h-40 max-h-[60dvh] overflow-auto rounded-b-sm border border-t-transparent [&_.ProseMirror]:max-w-none [&_.ProseMirror_.is-editor-empty]:text-muted-foreground [&_.ProseMirror_p[style*="text-align"]]:my-0!`}
                onClick={() => editor?.chain().focus().run()}
            >
                <EditorContent editor={editor} />
            </div>
        </div>
    );
};
