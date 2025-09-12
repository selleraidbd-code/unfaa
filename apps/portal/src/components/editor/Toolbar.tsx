import { createContext, useContext, useRef, useState } from "react";

import { Editor } from "@tiptap/react";
import {
    AlignCenter,
    AlignJustify,
    AlignLeft,
    AlignRight,
    Bold,
    ChevronDown,
    CloudUpload,
    FolderOpen,
    Heading,
    Heading1,
    Heading2,
    Heading3,
    Heading4,
    Heading5,
    Heading6,
    Highlighter,
    ImagePlus,
    Italic,
    Link2,
    List,
    ListOrdered,
    Loader,
    LucideIcon,
    Minus,
    Redo2,
    Underline,
    Undo2,
} from "lucide-react";

import { Button } from "@workspace/ui/components/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@workspace/ui/components/dialog";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@workspace/ui/components/popover";
import { Toggle } from "@workspace/ui/components/toggle";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@workspace/ui/components/tooltip";
import { cn } from "@workspace/ui/lib/utils";

type Props = {
    editor: Editor;
    children: React.ReactNode;
    className?: string;
    iconClassName?: string;
    buttonClassName?: string;
    toggleClassName?: string;
};

export const Toolbar = ({
    editor,
    children,
    className,
    iconClassName,
    buttonClassName,
    toggleClassName,
}: Props) => {
    return (
        <ToolbarContext.Provider
            value={{ editor, iconClassName, buttonClassName, toggleClassName }}
        >
            <div
                className={cn(
                    "bg-background flex flex-wrap items-center justify-center gap-2 rounded-t-sm border py-1",
                    className
                )}
            >
                {children}
            </div>
        </ToolbarContext.Provider>
    );
};

const ToolbarContext = createContext<
    | {
          editor: Editor;
          iconClassName?: string;
          buttonClassName?: string;
          toggleClassName?: string;
      }
    | undefined
>(undefined);

const useToolbarContext = () => {
    const context = useContext(ToolbarContext);
    if (!context) {
        throw new Error(
            "useToolbarContext must be used within a ToolbarProvider"
        );
    }
    return context;
};

const ToolbarItem = (props: {
    isActive?: boolean;
    onClick: () => void;
    Icon?: LucideIcon;
    tooltipLabel: string;
    type: "button" | "toggle";
    iconClassName?: string;
}) => {
    const { isActive, onClick, Icon, tooltipLabel, type } = props;

    const { iconClassName, buttonClassName, toggleClassName } =
        useToolbarContext();

    const content = (
        <TooltipProvider>
            <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                    {Icon && (
                        <Icon
                            className={cn(
                                "size-5 text-muted-foreground",
                                iconClassName,
                                props.iconClassName
                            )}
                        />
                    )}
                </TooltipTrigger>
                <TooltipContent>
                    <p>{tooltipLabel}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );

    if (type === "button")
        return (
            <Button
                variant="ghost"
                onClick={onClick}
                className={cn("h-auto !p-2", buttonClassName)}
                disabled={!isActive}
            >
                {content}
            </Button>
        );

    return (
        <Toggle
            pressed={isActive}
            onPressedChange={onClick}
            className={cn("h-auto !p-2", toggleClassName)}
        >
            {content}
        </Toggle>
    );
};

const UndoItem = () => {
    const { editor } = useToolbarContext();
    return (
        <ToolbarItem
            onClick={() => editor.chain().focus().undo().run()}
            tooltipLabel="Undo"
            Icon={Undo2}
            type="button"
            isActive={editor.can().undo()}
        />
    );
};

const RedoItem = () => {
    const { editor } = useToolbarContext();
    return (
        <ToolbarItem
            onClick={() => editor.chain().focus().redo().run()}
            tooltipLabel="Redo"
            Icon={Redo2}
            type="button"
            isActive={editor.can().redo()}
        />
    );
};

const BoldItem = () => {
    const { editor } = useToolbarContext();
    return (
        <ToolbarItem
            onClick={() => editor.chain().focus().toggleBold().run()}
            tooltipLabel="Bold"
            Icon={Bold}
            type="toggle"
            isActive={editor.isActive("bold")}
        />
    );
};

const ItalicItem = () => {
    const { editor } = useToolbarContext();
    return (
        <ToolbarItem
            onClick={() => editor.chain().focus().toggleItalic().run()}
            tooltipLabel="Italic"
            Icon={Italic}
            type="toggle"
            isActive={editor.isActive("italic")}
        />
    );
};

const UnderlineItem = () => {
    const { editor } = useToolbarContext();
    return (
        <ToolbarItem
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            tooltipLabel="Underline"
            Icon={Underline}
            type="toggle"
            isActive={editor.isActive("underline")}
        />
    );
};

const HighlightItem = () => {
    const { editor } = useToolbarContext();
    return (
        <ToolbarItem
            onClick={() => editor.chain().focus().toggleHighlight().run()}
            tooltipLabel="Highlight"
            Icon={Highlighter}
            type="toggle"
            isActive={editor.isActive("highlight")}
        />
    );
};

const AlignLeftItem = () => {
    const { editor } = useToolbarContext();
    return (
        <ToolbarItem
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
            tooltipLabel="Align Left"
            Icon={AlignLeft}
            type="toggle"
            isActive={editor.isActive({ textAlign: "left" })}
        />
    );
};

const AlignCenterItem = () => {
    const { editor } = useToolbarContext();
    return (
        <ToolbarItem
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
            tooltipLabel="Align Center"
            Icon={AlignCenter}
            type="toggle"
            isActive={editor.isActive({ textAlign: "center" })}
        />
    );
};

const AlignRightItem = () => {
    const { editor } = useToolbarContext();
    return (
        <ToolbarItem
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
            tooltipLabel="Align Right"
            Icon={AlignRight}
            type="toggle"
            isActive={editor.isActive({ textAlign: "right" })}
        />
    );
};

const AlignJustifyItem = () => {
    const { editor } = useToolbarContext();
    return (
        <ToolbarItem
            onClick={() => editor.chain().focus().setTextAlign("justify").run()}
            tooltipLabel="Align Justify"
            Icon={AlignJustify}
            type="toggle"
            isActive={editor.isActive({ textAlign: "justify" })}
        />
    );
};

const BulletListItem = () => {
    const { editor } = useToolbarContext();
    return (
        <ToolbarItem
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            tooltipLabel="Bullet List"
            Icon={List}
            type="toggle"
            isActive={editor.isActive("bulletList")}
        />
    );
};

const OrderedListItem = () => {
    const { editor } = useToolbarContext();
    return (
        <ToolbarItem
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            tooltipLabel="Ordered List"
            Icon={ListOrdered}
            type="toggle"
            isActive={editor.isActive("orderedList")}
        />
    );
};

const HeadingItem = () => {
    const { editor } = useToolbarContext();
    const iconClassName = "size-[18px]";

    const contextMenus = [
        {
            label: "Normal text",
            shortcut: "Ctrl + Alt + 0",
            className: "text-sm",
            onClick: () => editor.chain().focus().setParagraph().run(),
        },
        {
            label: "Heading 1",
            shortcut: "Ctrl + Alt + 1",
            className: "text-2xl",
            onClick: () =>
                editor.chain().focus().toggleHeading({ level: 1 }).run(),
        },
        {
            label: "Heading 2",
            shortcut: "Ctrl + Alt + 2",
            className: "text-xl",
            onClick: () =>
                editor.chain().focus().toggleHeading({ level: 2 }).run(),
        },
        {
            label: "Heading 3",
            shortcut: "Ctrl + Alt + 3",
            className: "text-lg",
            onClick: () =>
                editor.chain().focus().toggleHeading({ level: 3 }).run(),
        },
        {
            label: "Heading 4",
            shortcut: "Ctrl + Alt + 4",
            className: "text-base",
            onClick: () =>
                editor.chain().focus().toggleHeading({ level: 4 }).run(),
        },
        {
            label: "Heading 5",
            shortcut: "Ctrl + Alt + 5",
            className: "text-sm",
            onClick: () =>
                editor.chain().focus().toggleHeading({ level: 5 }).run(),
        },
        {
            label: "Heading 6",
            shortcut: "Ctrl + Alt + 6",
            className: "text-xs",
            onClick: () =>
                editor.chain().focus().toggleHeading({ level: 6 }).run(),
        },
    ];

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Toggle
                    className={"flex items-center gap-1 px-1.5"}
                    pressed={editor.isActive("heading")}
                >
                    {editor.isActive("heading", { level: 1 }) ? (
                        <Heading1 className={iconClassName} />
                    ) : editor.isActive("heading", { level: 2 }) ? (
                        <Heading2 className={iconClassName} />
                    ) : editor.isActive("heading", { level: 3 }) ? (
                        <Heading3 className={iconClassName} />
                    ) : editor.isActive("heading", { level: 4 }) ? (
                        <Heading4 className={iconClassName} />
                    ) : editor.isActive("heading", { level: 5 }) ? (
                        <Heading5 className={iconClassName} />
                    ) : editor.isActive("heading", { level: 6 }) ? (
                        <Heading6 className={iconClassName} />
                    ) : (
                        <Heading className={iconClassName} />
                    )}
                    <ChevronDown className={iconClassName} />
                </Toggle>
            </PopoverTrigger>
            <PopoverContent>
                {contextMenus.map((menu) => (
                    <div
                        key={menu.label}
                        onClick={menu.onClick}
                        className="flex cursor-pointer items-center justify-between gap-5 rounded-sm px-2 py-1.5 text-xs hover:bg-accent"
                    >
                        <span className={menu.className}>{menu.label}</span>
                        <span className="text-xs text-muted-foreground">
                            {menu.shortcut}
                        </span>
                    </div>
                ))}
            </PopoverContent>
        </Popover>
    );
};

const SeparatorItem = () => {
    return <Minus className={"rotate-90 text-border"} />;
};

const LinkItem = () => {
    const { editor } = useToolbarContext();

    const textInputRef = useRef<HTMLInputElement>(null);
    const urlInputRef = useRef<HTMLInputElement>(null);
    const [error, setError] = useState<string | null>(null);

    const handleAddLink = () => {
        const url = urlInputRef.current?.value ?? "";
        const text =
            textInputRef.current?.value && textInputRef.current?.value !== ""
                ? textInputRef.current?.value
                : url;

        if (!url) {
            setError("url is required");
            return;
        }

        editor
            .chain()
            .focus()
            .insertContent(`<a href="${url}">${text}</a>`)
            .run();
        setOpen(false);
    };

    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <ToolbarItem
                    onClick={() => setOpen(true)}
                    tooltipLabel="Link"
                    Icon={Link2}
                    type="button"
                    isActive={true}
                />
            </DialogTrigger>
            <DialogContent className={"max-w-screen-sm"}>
                <DialogHeader className={"mb-0"}>
                    <DialogTitle>Add Link</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label>Text</Label>
                        <Input
                            placeholder="Text"
                            ref={textInputRef}
                            onFocus={() => setError(null)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    handleAddLink();
                                }
                            }}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>URL</Label>
                        <Input
                            placeholder="URL"
                            ref={urlInputRef}
                            onFocus={() => setError(null)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    handleAddLink();
                                }
                            }}
                        />
                    </div>
                </div>
                {error && (
                    <p className="pt-2 text-sm text-destructive">{error}</p>
                )}
                <DialogFooter className={"mt-2"}>
                    <Button
                        variant={"secondary"}
                        onClick={() => setOpen(false)}
                    >
                        Cancel
                    </Button>

                    <Button onClick={() => handleAddLink()}>Add</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

const ImageItem = ({
    onImageAdd,
}: {
    onImageAdd: (
        file: File,
        setError: (error: string) => void
    ) => Promise<string | null>;
}) => {
    const { editor } = useToolbarContext();

    const [open, setOpen] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleUploadMedia = async (file: File) => {
        setIsLoading(true);
        const response = await onImageAdd(file, setError);
        if (response) {
            editor
                .chain()
                .focus()
                .insertContent(`<img src="${response}" />`)
                .run();
            setOpen(false);
        }
        setIsLoading(false);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const droppedFile = e.dataTransfer.files[0];

            if (droppedFile.type.startsWith("image/")) {
                handleUploadMedia(droppedFile);
            } else {
                setError("Please upload an image file (JPEG, JPG, or PNG)");
            }
        }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            handleUploadMedia(e.target.files[0]);
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <ToolbarItem
                    onClick={() => setOpen(true)}
                    tooltipLabel="Image"
                    Icon={ImagePlus}
                    type="button"
                    isActive={true}
                />
            </DialogTrigger>
            <DialogContent className={"max-w-screen-sm"}>
                <div
                    className={`rounded-sm border-2 border-dashed p-8 text-center transition-colors duration-300 ${
                        isDragging ? "border-primary" : ""
                    }`}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                >
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileInput}
                        accept={"image/jpeg, image/jpg, image/png"}
                        className="hidden"
                    />
                    <CloudUpload
                        className="mx-auto mb-4 text-muted-foreground"
                        size={48}
                    />
                    <p className="mb-4 px-[10%] text-center text-sm text-muted-foreground">
                        Choose a file or Drag & drop it here. File must be in
                        &quot;JPEG, JPG or PNG&quot; format
                    </p>

                    {error && (
                        <p className="pt-2 text-sm text-destructive">{error}</p>
                    )}

                    {isLoading ? (
                        <Button size={"sm"} disabled>
                            <Loader className="animate-spin" size={20} />
                            Uploading...
                        </Button>
                    ) : (
                        <Button size={"sm"} onClick={triggerFileInput}>
                            <FolderOpen className="size-5" /> Browse
                        </Button>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};

Toolbar.UndoItem = UndoItem;
Toolbar.RedoItem = RedoItem;
Toolbar.BoldItem = BoldItem;
Toolbar.ItalicItem = ItalicItem;
Toolbar.UnderlineItem = UnderlineItem;
Toolbar.HighlightItem = HighlightItem;
Toolbar.AlignLeftItem = AlignLeftItem;
Toolbar.AlignCenterItem = AlignCenterItem;
Toolbar.AlignRightItem = AlignRightItem;
Toolbar.AlignJustifyItem = AlignJustifyItem;
Toolbar.BulletListItem = BulletListItem;
Toolbar.OrderedListItem = OrderedListItem;
Toolbar.HeadingItem = HeadingItem;
Toolbar.SeparatorItem = SeparatorItem;
Toolbar.LinkItem = LinkItem;
Toolbar.ImageItem = ImageItem;
