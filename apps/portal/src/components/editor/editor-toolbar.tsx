import { Editor } from "@tiptap/react";
import {
    AlignCenter,
    AlignJustify,
    AlignLeft,
    AlignRight,
    Bold,
    Italic,
    List,
    ListOrdered,
    Redo2,
    Tally1,
    Underline,
    Undo2,
} from "lucide-react";

import { cn } from "@workspace/ui/lib/utils";
import { Toggle } from "@workspace/ui/components/toggle";

export const Toolbar = ({ editor }: { editor: Editor | null }) => {
    if (!editor) {
        return null;
    }

    const iconClassName = "size-4 text-icon 2xl:size-5";

    return (
        <div className="flex flex-wrap items-center justify-center gap-2 rounded-t-sm border border-b-transparent bg-muted py-1 shadow-xs lg:px-2 xl:px-3 2xl:gap-3 2xl:px-4">
            <Toggle
                className="px-2"
                pressed={editor.isActive("none")}
                onPressedChange={() => editor.chain().focus().undo().run()}
                disabled={!editor.can().undo()}
            >
                <Undo2 className={iconClassName} />
            </Toggle>
            <Toggle
                className="px-2"
                pressed={editor.isActive("none")}
                onPressedChange={() => editor.chain().focus().redo().run()}
                disabled={!editor.can().redo()}
            >
                <Redo2 className={iconClassName} />
            </Toggle>
            <Tally1 className={cn(iconClassName, "text-border")} />

            <Toggle
                className="px-2"
                pressed={editor.isActive("bold")}
                onPressedChange={() =>
                    editor.chain().focus().toggleBold().run()
                }
                disabled={!editor.can().toggleBold()}
            >
                <Bold className={iconClassName} />
            </Toggle>
            <Toggle
                className="px-2"
                pressed={editor.isActive("italic")}
                onPressedChange={() =>
                    editor.chain().focus().toggleItalic().run()
                }
                disabled={!editor.can().toggleItalic()}
            >
                <Italic className={iconClassName} />
            </Toggle>
            <Toggle
                className="px-2"
                pressed={editor.isActive("underline")}
                onPressedChange={() =>
                    editor.chain().focus().toggleUnderline().run()
                }
                disabled={!editor.can().toggleUnderline()}
            >
                <Underline className={iconClassName} />
            </Toggle>

            <Tally1 className={cn(iconClassName, "text-border")} />

            <Toggle
                className="px-2"
                pressed={editor.isActive("bulletList")}
                onPressedChange={() =>
                    editor.chain().focus().toggleBulletList().run()
                }
                disabled={!editor.can().toggleBulletList()}
            >
                <List className={iconClassName} />
            </Toggle>
            <Toggle
                className="px-2"
                pressed={editor.isActive("orderedList")}
                onPressedChange={() =>
                    editor.chain().focus().toggleOrderedList().run()
                }
                disabled={!editor.can().toggleOrderedList()}
            >
                <ListOrdered className={iconClassName} />
            </Toggle>
            <Tally1 className={cn(iconClassName, "text-border")} />

            <Toggle
                className="px-2"
                pressed={editor.isActive({ textAlign: "left" })}
                onPressedChange={() =>
                    editor.chain().focus().setTextAlign("left").run()
                }
                disabled={!editor.can().setTextAlign("left")}
            >
                <AlignLeft className={iconClassName} />
            </Toggle>
            <Toggle
                className="px-2"
                pressed={editor.isActive({ textAlign: "center" })}
                onPressedChange={() =>
                    editor.chain().focus().setTextAlign("center").run()
                }
                disabled={!editor.can().setTextAlign("center")}
            >
                <AlignCenter className={iconClassName} />
            </Toggle>
            <Toggle
                className="px-2"
                pressed={editor.isActive({ textAlign: "right" })}
                onPressedChange={() =>
                    editor.chain().focus().setTextAlign("right").run()
                }
                disabled={!editor.can().setTextAlign("right")}
            >
                <AlignRight className={iconClassName} />
            </Toggle>
            <Toggle
                className="px-2"
                pressed={editor.isActive({ textAlign: "justify" })}
                onPressedChange={() =>
                    editor.chain().focus().setTextAlign("justify").run()
                }
                disabled={!editor.can().setTextAlign("justify")}
            >
                <AlignJustify className={iconClassName} />
            </Toggle>
        </div>
    );
};
