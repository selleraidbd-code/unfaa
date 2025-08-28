"use client";

import { Button } from "@workspace/ui/components/button";
import { Card } from "@workspace/ui/components/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@workspace/ui/components/accordion";
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
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  ChevronDown,
  ChevronUp,
  Italic,
  Link,
  List,
  ListOrdered,
  Quote,
  Type,
  Underline,
} from "lucide-react";
import { useCallback, useRef, useState } from "react";

export default function AboutUs() {
  const [isOpen, setIsOpen] = useState(true);
  const [linkUrl, setLinkUrl] = useState("");
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);

  const colorPalette = [
    // First row - main colors
    [
      "#000000",
      "#e60000",
      "#ff9900",
      "#ffff00",
      "#008a00",
      "#0066cc",
      "#9933ff",
    ],
    // Second row - lighter variants
    [
      "#ffffff",
      "#facccc",
      "#ffcc99",
      "#ffff99",
      "#99d6a3",
      "#99ccff",
      "#c999ff",
    ],
    // Third row - additional colors
    [
      "#666666",
      "#cc0000",
      "#cc6600",
      "#cccc00",
      "#006600",
      "#004499",
      "#6600cc",
    ],
    // Fourth row - muted colors
    [
      "#cccccc",
      "#ff6666",
      "#ffb366",
      "#ffff66",
      "#66b366",
      "#6699ff",
      "#b366ff",
    ],
  ];

  const editorRef = useRef<HTMLDivElement>(null);

  const executeCommand = useCallback((command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  }, []);

  const handleFormatText = useCallback(
    (command: string) => {
      executeCommand(command);
    },
    [executeCommand]
  );

  const handleHeadingChange = useCallback(
    (value: string) => {
      switch (value) {
        case "normal":
          executeCommand("formatBlock", "div");
          break;
        case "heading1":
          executeCommand("formatBlock", "h1");
          break;
        case "heading2":
          executeCommand("formatBlock", "h2");
          break;
        case "heading3":
          executeCommand("formatBlock", "h3");
          break;
      }
    },
    [executeCommand]
  );

  const handleAlignment = useCallback(
    (alignment: string) => {
      executeCommand(`justify${alignment}`);
    },
    [executeCommand]
  );

  const handleList = useCallback(
    (listType: "ordered" | "unordered") => {
      if (listType === "ordered") {
        executeCommand("insertOrderedList");
      } else {
        executeCommand("insertUnorderedList");
      }
    },
    [executeCommand]
  );

  const handleInsertLink = useCallback(() => {
    if (linkUrl.trim()) {
      executeCommand("createLink", linkUrl);
      setLinkUrl("");
      setIsLinkDialogOpen(false);
    }
  }, [executeCommand, linkUrl]);

  const handleQuote = useCallback(() => {
    executeCommand("formatBlock", "blockquote");
  }, [executeCommand]);

  const handleColorChange = useCallback(
    (color: string) => {
      executeCommand("foreColor", color);
    },
    [executeCommand]
  );

  return (
    <div className="w-full max-w-7xl mx-auto">
      <Card>
        <Accordion type="single" collapsible>
          <AccordionTrigger asChild>
            <div className="flex items-center justify-between p-4 hover:bg-gray-50 cursor-pointer">
              <h3 className="text-lg font-medium">About us</h3>
              {isOpen ? (
                <ChevronUp className="h-5 w-5 text-gray-500" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-500" />
              )}
            </div>
          </AccordionTrigger>

          <AccordionContent>
            <div className="px-4 pb-4">
              <Separator className="mb-4" />

              {/* Editor Toolbar */}
              <div className="flex items-center gap-2 p-3 border rounded-t-md bg-gray-50 flex-wrap">
                <Select
                  onValueChange={handleHeadingChange}
                  defaultValue="normal"
                >
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
                        onChange={(e) => setLinkUrl(e.target.value)}
                        onKeyDown={(e) => {
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

              {/* Editor Content Area */}
              <div className="relative">
                <div
                  ref={editorRef}
                  contentEditable
                  className="min-h-32 p-3 border italic border-t-0 rounded-b-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                  style={{
                    minHeight: "128px",
                    maxHeight: "400px",
                    overflowY: "auto",
                  }}
                  suppressContentEditableWarning={true}
                  onInput={(e) => {
                    // Handle content changes if needed
                  }}
                  data-placeholder="Write something..."
                />

                {/* Placeholder styling */}
                <style jsx>{`
                  [contenteditable]:empty:before {
                    content: attr(data-placeholder);
                    color: #9ca3af;
                    pointer-events: none;
                  }
                `}</style>
              </div>
            </div>
          </AccordionContent>
        </Accordion>
      </Card>
      <div className="mt-4 flex justify-end">
        <Button
          onClick={() => {
            const content = editorRef.current?.innerHTML || "";
            console.log("Saved content:", content);
            // You can add your save logic here
            alert("Content saved successfully!");
          }}
          className="px-6"
        >
          Save
        </Button>
      </div>
    </div>
  );
}
