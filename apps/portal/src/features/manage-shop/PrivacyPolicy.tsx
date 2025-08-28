"use client";

import { Button } from "@workspace/ui/components/button";
import { Card, CardContent, CardHeader } from "@workspace/ui/components/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog";
import { Input } from "@workspace/ui/components/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@workspace/ui/components/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { Separator } from "@workspace/ui/components/separator";
import {
  Bold,
  Italic,
  Underline,
  Quote,
  List,
  ListOrdered,
  Link,
  Type,
  ChevronUp,
  ChevronDown,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from "lucide-react";
import { useCallback, useRef, useState } from "react";

interface EditableSection {
  id: string;
  content: string;
  type: "title" | "text" | "heading" | "date";
}

const colorPalette = [
  ["#000000", "#434343", "#666666", "#999999", "#b7b7b7", "#cccccc", "#d9d9d9"],
  ["#ffffff", "#ff0000", "#ff9900", "#ffff00", "#00ff00", "#00ffff", "#0099ff"],
  ["#0000ff", "#9900ff", "#ff00ff", "#ff3366", "#36c5f0", "#2eb67d", "#ecb22e"],
  ["#e01e5a", "#36c5f0", "#2eb67d", "#ecb22e", "#e01e5a", "#36c5f0", "#2eb67d"],
];

export default function PrivecyPolicy() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const editorRef = useRef<HTMLDivElement>(null);

  const [sections, setSections] = useState<EditableSection[]>([
    {
      id: "main-title",
      content: "Privacy Policy for Amr business",
      type: "title",
    },
    {
      id: "last-updated",
      content: "Last updated: 2025-06-30",
      type: "date",
    },
    {
      id: "welcome",
      content:
        'Welcome to Amr business ("us", "we", or "our"). This page informs you of our policies regarding the collection, use, and disclosure of Personal Information we receive from users of the site.',
      type: "text",
    },
    {
      id: "usage-policy",
      content:
        "We use your Personal Information only for providing and improving the site. By using the site, you agree to the collection and use of information by this policy.",
      type: "text",
    },
    {
      id: "info-collection-heading",
      content: "Information Collection and Use",
      type: "heading",
    },
    {
      id: "info-collection-text",
      content:
        'While using our site, we may ask you to provide us with certain personally identifiable information that can be used to contact or identify you. Personally identifiable information may include but is not limited to your name, email address, postal address, and phone number ("Personal Information").',
      type: "text",
    },
    {
      id: "log-data-heading",
      content: "Log Data",
      type: "heading",
    },
    {
      id: "log-data-text",
      content:
        'Like many site operators, we collect information that your browser sends whenever you visit our site ("Log Data"). This Log Data may include information such as your computer\'s Internet Protocol ("IP") address, browser type, browser version, the pages of our site that you visit, the time and date of your visit, the time spent on those pages, and other statistics.',
      type: "text",
    },
    {
      id: "cookies-heading",
      content: "Cookies",
      type: "heading",
    },
    {
      id: "cookies-text1",
      content:
        "Cookies are files with small amounts of data, which may include an anonymous unique identifier. Cookies are sent to your browser from a website and stored on your computer's hard drive.",
      type: "text",
    },
    {
      id: "cookies-text2",
      content:
        'Like many sites, we use "cookies" to collect information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our site.',
      type: "text",
    },
    {
      id: "security-heading",
      content: "Security",
      type: "heading",
    },
    {
      id: "security-text",
      content:
        "The security of your Personal Information is important to us, but remember that no method of transmission over the Internet, or method of electronic storage, is 100% secure. While we strive to use commercially acceptable means to protect your Personal Information, we cannot guarantee its absolute security.",
      type: "text",
    },
    {
      id: "changes-heading",
      content: "Changes to This Privacy Policy",
      type: "heading",
    },
    {
      id: "changes-text1",
      content:
        "This Privacy Policy is effective as of 2025-06-30 and will remain in effect except concerning any changes in its provisions in the future, which will be in effect immediately after being posted on this page.",
      type: "text",
    },
    {
      id: "changes-text2",
      content:
        "We reserve the right to update or change our Privacy Policy at any time, and you should check this Privacy Policy periodically. Your continued use of the service after we post any modifications to the Privacy Policy on this page will constitute your acknowledgment of the modifications and your consent to abide by and be bound by the modified Privacy Policy.",
      type: "text",
    },
    {
      id: "changes-text3",
      content:
        "If we make any material changes to this Privacy Policy, we will notify you either through the email address you have provided us or by placing a prominent notice on our website.",
      type: "text",
    },
    {
      id: "contact-heading",
      content: "Contact Us",
      type: "heading",
    },
    {
      id: "contact-text",
      content:
        "If you have any questions about this Privacy Policy, please contact us at",
      type: "text",
    },
  ]);

  const executeCommand = useCallback((command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  }, []);

  const handleFormatText = useCallback(
    (format: string) => {
      executeCommand(format);
    },
    [executeCommand]
  );

  const handleHeadingChange = useCallback(
    (value: string) => {
      switch (value) {
        case "heading1":
          executeCommand("formatBlock", "h1");
          break;
        case "heading2":
          executeCommand("formatBlock", "h2");
          break;
        case "heading3":
          executeCommand("formatBlock", "h3");
          break;
        default:
          executeCommand("formatBlock", "p");
          break;
      }
    },
    [executeCommand]
  );

  const handleQuote = useCallback(() => {
    executeCommand("formatBlock", "blockquote");
  }, [executeCommand]);

  const handleColorChange = useCallback(
    (color: string) => {
      executeCommand("foreColor", color);
    },
    [executeCommand]
  );

  const handleList = useCallback(
    (type: "ordered" | "unordered") => {
      if (type === "ordered") {
        executeCommand("insertOrderedList");
      } else {
        executeCommand("insertUnorderedList");
      }
    },
    [executeCommand]
  );

  const handleAlignment = useCallback(
    (align: string) => {
      executeCommand(`justify${align}`);
    },
    [executeCommand]
  );

  const handleInsertLink = useCallback(() => {
    if (linkUrl) {
      executeCommand("createLink", linkUrl);
      setLinkUrl("");
      setIsLinkDialogOpen(false);
    }
  }, [executeCommand, linkUrl]);

  const handleEdit = (id: string) => {
    setEditingId(id);
  };

  const handleSave = (id: string, newContent: string) => {
    setSections(
      sections.map((section) =>
        section.id === id ? { ...section, content: newContent } : section
      )
    );
    setEditingId(null);
  };

  const handleCancel = () => {
    setEditingId(null);
  };

  const renderEditableSection = (section: EditableSection) => {
    const isEditing = editingId === section.id;

    if (isEditing) {
      return (
        <EditingComponent
          key={section.id}
          section={section}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      );
    }

    return (
      <div
        key={section.id}
        className="cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
        onClick={() => handleEdit(section.id)}
      >
        {section.type === "title" && (
          <h1
            className="text-2xl font-bold mb-4"
            dangerouslySetInnerHTML={{ __html: section.content }}
          />
        )}
        {section.type === "heading" && (
          <h2
            className="text-lg font-semibold mt-6 mb-3"
            dangerouslySetInnerHTML={{ __html: section.content }}
          />
        )}
        {section.type === "date" && (
          <p
            className="text-sm text-gray-600 mb-4"
            dangerouslySetInnerHTML={{ __html: section.content }}
          />
        )}
        {section.type === "text" && (
          <p
            className="mb-4 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: section.content }}
          />
        )}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto py-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <h1 className="text-xl font-semibold">Privacy Policy</h1>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {isCollapsed ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronUp className="h-4 w-4" />
            )}
          </Button>
        </CardHeader>

        {!isCollapsed && (
          <CardContent>
            {/* Editor Toolbar */}
            <div className="flex items-center gap-2 p-3 border rounded-t-md bg-gray-50 flex-wrap">
              <Select onValueChange={handleHeadingChange} defaultValue="normal">
                <SelectTrigger className="w-24 h-8 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="heading1">Heading 1</SelectItem>
                  <SelectItem value="heading2">Heading 2</SelectItem>
                  <SelectItem value="heading3">Heading 3</SelectItem>
                </SelectContent>
              </Select>

              <Separator orientation="vertical" className="h-6" />

              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => handleFormatText("bold")}
                title="Bold"
              >
                <Bold className="h-4 w-4" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => handleFormatText("italic")}
                title="Italic"
              >
                <Italic className="h-4 w-4" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => handleFormatText("underline")}
                title="Underline"
              >
                <Underline className="h-4 w-4" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={handleQuote}
                title="Quote"
              >
                <Quote className="h-4 w-4" />
              </Button>

              <Separator orientation="vertical" className="h-6" />

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    title="Text Color"
                  >
                    <Type className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-48 p-2" align="start">
                  <div className="grid grid-cols-7 gap-1">
                    {colorPalette.flat().map((color, index) => (
                      <button
                        key={index}
                        className="w-6 h-6 rounded border border-gray-300 hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        style={{ backgroundColor: color }}
                        onClick={() => handleColorChange(color)}
                        title={color}
                      />
                    ))}
                  </div>
                  <div className="mt-2 pt-2 border-t">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full text-xs"
                      onClick={() => executeCommand("removeFormat")}
                    >
                      Remove Color
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>

              <Separator orientation="vertical" className="h-6" />

              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => handleList("unordered")}
                title="Bullet List"
              >
                <List className="h-4 w-4" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => handleList("ordered")}
                title="Numbered List"
              >
                <ListOrdered className="h-4 w-4" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => handleAlignment("Left")}
                title="Align Left"
              >
                <AlignLeft className="h-4 w-4" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => handleAlignment("Center")}
                title="Align Center"
              >
                <AlignCenter className="h-4 w-4" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => handleAlignment("Right")}
                title="Align Right"
              >
                <AlignRight className="h-4 w-4" />
              </Button>

              <Separator orientation="vertical" className="h-6" />

              <Dialog
                open={isLinkDialogOpen}
                onOpenChange={setIsLinkDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    title="Insert Link"
                  >
                    <Link className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Insert Link</DialogTitle>
                  </DialogHeader>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter URL..."
                      value={linkUrl}
                      onChange={(e: any) => setLinkUrl(e.target.value)}
                      onKeyDown={(e: any) => {
                        if (e.key === "Enter") {
                          handleInsertLink();
                        }
                      }}
                    />
                    <Button onClick={handleInsertLink}>Insert</Button>
                  </div>
                </DialogContent>
              </Dialog>

              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => executeCommand("removeFormat")}
                title="Clear Formatting"
              >
                <Type className="h-4 w-4" />
              </Button>
            </div>

            {/* Content */}
            <div className="space-y-2 border border-t-0 rounded-b-md p-4">
              {sections.map((section) => renderEditableSection(section))}
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}

function EditingComponent({
  section,
  onSave,
  onCancel,
}: {
  section: EditableSection;
  onSave: (id: string, content: string) => void;
  onCancel: () => void;
}) {
  const [content, setContent] = useState(section.content);
  const editorRef = useRef<HTMLDivElement>(null);

  const handleSave = () => {
    const htmlContent = editorRef.current?.innerHTML || content;
    onSave(section.id, htmlContent);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && e.ctrlKey) {
      handleSave();
    }
    if (e.key === "Escape") {
      onCancel();
    }
  };

  return (
    <div className="space-y-2 p-2 border rounded-lg bg-blue-50">
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        className="min-h-[100px] p-3 border rounded bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        dangerouslySetInnerHTML={{ __html: content }}
        onKeyDown={handleKeyDown}
        style={{
          fontSize:
            section.type === "title"
              ? "1.5rem"
              : section.type === "heading"
                ? "1.125rem"
                : "1rem",
          fontWeight:
            section.type === "title" || section.type === "heading"
              ? "600"
              : "400",
        }}
      />
      <div className="flex gap-2">
        <Button size="sm" onClick={handleSave}>
          Save
        </Button>
        <Button size="sm" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <span className="text-xs text-gray-500 self-center ml-2">
          Ctrl+Enter to save, Esc to cancel
        </span>
      </div>
    </div>
  );
}
