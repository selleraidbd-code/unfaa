import { Editor } from "@tiptap/react";

import { Toolbar } from "@/components/editor/Toolbar";

export const EditorToolbar = ({ editor }: { editor: Editor | null }) => {
    if (!editor) {
        return null;
    }

    return (
        <Toolbar editor={editor}>
            <Toolbar.UndoItem />
            <Toolbar.RedoItem />
            <Toolbar.SeparatorItem />
            <Toolbar.HeadingItem />
            <Toolbar.BoldItem />
            <Toolbar.ItalicItem />
            <Toolbar.UnderlineItem />
            <Toolbar.HighlightItem />
            <Toolbar.SeparatorItem />
            <Toolbar.BulletListItem />
            <Toolbar.OrderedListItem />

            <Toolbar.SeparatorItem />

            <Toolbar.AlignLeftItem />
            <Toolbar.AlignCenterItem />
            <Toolbar.AlignRightItem />
            <Toolbar.AlignJustifyItem />

            <Toolbar.SeparatorItem />
            <Toolbar.LinkItem />
        </Toolbar>
    );
};
