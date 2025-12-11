"use client";

import { useState } from "react";

import { OrderInputProps } from "@/features/ai-order/types";
import { Button } from "@workspace/ui/components/button";
import { Label } from "@workspace/ui/components/label";
import { toast } from "@workspace/ui/components/sonner";
import { Textarea } from "@workspace/ui/components/textarea";
import { Bot, CircleXIcon, Clipboard, ClipboardPaste, Loader2 } from "lucide-react";

export const OrderInput = ({ onGenerate, isProcessing, onReset, hasData }: OrderInputProps) => {
    const [orderText, setOrderText] = useState("");

    const handlePaste = async () => {
        try {
            const text = await navigator.clipboard.readText();
            setOrderText(text);
        } catch (err) {
            console.error("Failed to read clipboard:", err);
        }
    };

    const handleGenerate = () => {
        if (!orderText.trim()) {
            toast.error("Please enter order information");
            return;
        }
        onGenerate(orderText);
    };

    const handleReset = () => {
        console.log("handleReset");
        setOrderText("");
        onReset();
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2">
                <Clipboard className="h-5 w-5" />
                <Label htmlFor="order-text">Paste Order Details</Label>
            </div>

            <Textarea
                id="order-text"
                value={orderText}
                onChange={(e) => setOrderText(e.target.value)}
                disabled={isProcessing || hasData}
                className="mt-2 min-h-[120px] !text-base"
                placeholder="Paste order details here..."
            />

            <div className="flex justify-center gap-2 lg:gap-4">
                <Button
                    onClick={handlePaste}
                    disabled={isProcessing || hasData}
                    variant="outline"
                    className="flex items-center gap-2"
                >
                    <ClipboardPaste className="h-4 w-4" />
                    Paste
                </Button>
                <Button
                    onClick={handleGenerate}
                    disabled={isProcessing || !orderText.trim() || hasData}
                    className="flex items-center gap-2 max-md:flex-1 md:px-10!"
                >
                    {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Bot className="h-4 w-4" />}
                    {isProcessing ? "Processing..." : "Generate Order"}
                </Button>

                {(hasData || orderText.trim()) && (
                    <Button variant="outline" onClick={handleReset}>
                        <span className="max-sm:hidden">Reset</span>
                        <CircleXIcon className="h-4 w-4" />
                    </Button>
                )}
            </div>
        </div>
    );
};
