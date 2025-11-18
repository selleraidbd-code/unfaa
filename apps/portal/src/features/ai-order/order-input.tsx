"use client";

import { Button } from "@workspace/ui/components/button";
import { Label } from "@workspace/ui/components/label";
import { Textarea } from "@workspace/ui/components/textarea";
import { Loader2, Bot, Package } from "lucide-react";
import { OrderInputProps } from "./types";

export const OrderInput = ({
    orderText,
    setOrderText,
    onGenerate,
    isProcessing,
    onReset,
    hasData,
}: OrderInputProps) => {
    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Order Information ( Customer Information and Product Information
                )
            </div>

            <Textarea
                id="order-text"
                value={orderText}
                onChange={(e) => setOrderText(e.target.value)}
                disabled={isProcessing || hasData}
                className="min-h-[120px] !text-base mt-2"
            />

            <div className="flex gap-2">
                <Button
                    onClick={onGenerate}
                    disabled={isProcessing || !orderText.trim() || hasData}
                    className="flex items-center gap-2"
                >
                    {isProcessing ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <Bot className="h-4 w-4" />
                    )}
                    {isProcessing ? "Processing..." : "Generate Order"}
                </Button>

                {hasData && (
                    <Button variant="outline" onClick={onReset}>
                        Reset
                    </Button>
                )}
            </div>
        </div>
    );
};
