"use client";

import type React from "react";

import { useState, useRef, useCallback } from "react";

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
import { Card, CardContent, CardHeader } from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { Separator } from "@workspace/ui/components/separator";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@workspace/ui/components/popover";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog";
import { Input } from "@workspace/ui/components/input";

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

export default function ReturnAndCancellationPolicy() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const editorRef = useRef<HTMLDivElement>(null);

  const [sections, setSections] = useState<EditableSection[]>([
    {
      id: "main-title",
      content: "Return and Cancellation Policy for Amr business",
      type: "title",
    },
    {
      id: "last-updated",
      content: "Last updated: 2025-06-30",
      type: "date",
    },
    {
      id: "intro",
      content:
        "Thank you for shopping at Amr business. Please read this policy carefully. Your satisfaction is our priority, and we want to ensure a transparent and hassle-free experience for you.",
      type: "text",
    },
    {
      id: "refund-policy-heading",
      content: "1. Refund Policy",
      type: "heading",
    },
    {
      id: "refund-policy-intro",
      content:
        "We strive to provide products and services that meet or exceed your expectations. If for any reason, you are not completely satisfied with your purchase, you may be eligible for a refund under the following conditions:",
      type: "text",
    },
    {
      id: "damaged-products",
      content:
        "Damaged or Defective Products: If you receive a damaged or defective product, please contact our customer service team as soon as possible to receive the item. We will provide instructions on returning the product, and upon verification, a full refund or replacement will be issued.",
      type: "text",
    },
    {
      id: "incorrect-items",
      content:
        "Incorrect Items: If you receive an incorrect item, please notify us as soon as possible of receiving the product. We will arrange for the correct item to be shipped to you, and you may be required to return the incorrect item.",
      type: "text",
    },
    {
      id: "refund-note",
      content:
        "Please note that certain items, such as personalized or customized products, may not be eligible for a refund unless they are damaged or defective.",
      type: "text",
    },
    {
      id: "return-policy-heading",
      content: "2. Return Policy",
      type: "heading",
    },
    {
      id: "return-policy-process",
      content:
        "To initiate a return, please contact our customer service team at _. Our team will provide you with instructions on how to return the item. Please ensure that the item is securely packaged to prevent damage during transit.",
      type: "text",
    },
    {
      id: "return-processing",
      content:
        "Once we receive the returned item and verify its condition, we will process the refund or replacement accordingly. Refunds will be issued to the original payment method.",
      type: "text",
    },
    {
      id: "cancellation-policy-heading",
      content: "3. Cancellation Policy",
      type: "heading",
    },
    {
      id: "cancellation-policy-text",
      content:
        "You may cancel an order as soon as possible, provided that the order has not already been processed or shipped. To cancel an order, please contact our customer service team immediately at _. If the order has already been processed, you may need to follow our return policy upon receipt of the items.",
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
        "If you have any questions about our Refund, Return, and Cancellation Policy, please contact us at _. We are here to assist you and ensure your shopping experience with us is positive and satisfying.",
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
          <h1 className="text-xl font-semibold">
            Return and Cancellation Policy
          </h1>
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
