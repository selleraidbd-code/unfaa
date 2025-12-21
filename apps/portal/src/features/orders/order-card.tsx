"use client";

import { useCallback } from "react";

import { Badge } from "@workspace/ui/components/badge";
import { cn } from "@workspace/ui/lib/utils";
import { Check, Download, Package } from "lucide-react";

import { Order } from "@/types/order-type";

interface OrderCardProps {
    order: Order;
    isSelected: boolean;
    isExporting: boolean;
    onToggleSelection: (orderId: string) => void;
    onExportPDF: (order: Order) => void;
}

export const OrderCard = ({ order, isSelected, isExporting, onToggleSelection, onExportPDF }: OrderCardProps) => {
    const handleCardClick = useCallback(
        (e: React.MouseEvent) => {
            // Don't toggle if clicking on the download button
            if ((e.target as HTMLElement).closest("[data-download-button]")) {
                return;
            }
            onToggleSelection(order.id);
        },
        [order.id, onToggleSelection]
    );

    const handleDownloadClick = useCallback(
        (e: React.MouseEvent) => {
            e.stopPropagation();
            onExportPDF(order);
        },
        [order, onExportPDF]
    );

    return (
        <div
            onClick={handleCardClick}
            className={cn(
                "group bg-card relative cursor-pointer rounded-xl border-2 p-5 transition-all duration-200",
                "hover:shadow-primary/5 hover:shadow-lg",
                isSelected
                    ? "border-primary bg-primary/5 shadow-primary/10 ring-primary/20 shadow-md ring-2"
                    : "border-border hover:border-primary/50"
            )}
        >
            {/* Selection Checkbox */}
            <div className="absolute top-4 right-4 z-10">
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onToggleSelection(order.id);
                    }}
                    className={cn(
                        "flex h-5 w-5 items-center justify-center rounded-md border-2 transition-all",
                        "focus:ring-primary focus:ring-2 focus:ring-offset-2 focus:outline-none",
                        isSelected
                            ? "border-primary bg-primary text-primary-foreground shadow-sm"
                            : "border-muted-foreground/40 bg-background hover:border-primary/60 hover:bg-accent"
                    )}
                    aria-label={isSelected ? "Deselect order" : "Select order"}
                >
                    {isSelected && <Check className="h-3.5 w-3.5" />}
                </button>
            </div>

            {/* Consignment ID - Prominent Badge */}
            {order.consignmentId && (
                <div className="border-primary/20 bg-primary/10 mt-2 mb-4 flex items-center justify-between rounded-lg border px-4 py-3">
                    <div className="flex items-center gap-2.5">
                        <div className="bg-primary/20 flex h-8 w-8 items-center justify-center rounded-md">
                            <Package className="text-primary h-4 w-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <div className="text-muted-foreground text-xs font-medium">Consignment ID</div>
                            <div className="text-primary truncate text-base font-bold">{order.consignmentId}</div>
                        </div>
                    </div>

                    <button
                        data-download-button
                        onClick={handleDownloadClick}
                        disabled={isExporting}
                        className={cn(
                            "bg-background/80 text-muted-foreground rounded-lg p-2",
                            "backdrop-blur-sm transition-all duration-200",
                            "hover:bg-primary hover:text-primary-foreground hover:shadow-md",
                            "focus:ring-primary focus:ring-2 focus:ring-offset-2 focus:outline-none",
                            "disabled:cursor-not-allowed disabled:opacity-50",
                            "group-hover:opacity-100"
                        )}
                        title="Download PDF"
                        aria-label="Download order PDF"
                    >
                        <Download className="h-4 w-4" />
                    </button>
                </div>
            )}

            {/* Product Items */}
            {order.orderItems && order.orderItems.length > 0 && (
                <div className="space-y-2.5">
                    {order.orderItems.map((item) => {
                        return (
                            <div
                                key={item.id}
                                className="border-border bg-muted/30 hover:bg-muted/50 rounded-lg border p-3 transition-colors"
                            >
                                <div className="flex items-start justify-between gap-2">
                                    <div className="min-w-0 flex-1 space-y-1">
                                        <h4 className="text-foreground truncate text-sm font-semibold">
                                            {item.productName}
                                        </h4>
                                        {item.orderItemVariant?.length > 0 && (
                                            <div className="flex flex-wrap gap-1.5">
                                                {item.orderItemVariant.map((ov, i) => (
                                                    <span
                                                        key={`${ov.productVariantName}-${ov.productVariantOptionName}-${i}`}
                                                        className="text-muted-foreground text-xs"
                                                    >
                                                        <span className="text-primary">{ov.productVariantName}:</span>{" "}
                                                        {ov.productVariantOptionName}
                                                        {typeof ov.productVariantOptionExtraPrice === "number" &&
                                                        ov.productVariantOptionExtraPrice > 0
                                                            ? ` (+${ov.productVariantOptionExtraPrice})`
                                                            : ""}{" "}
                                                        ,
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <div className="bg-primary/10 flex shrink-0 items-center gap-1.5 rounded-md px-2.5 py-1">
                                        <span className="text-muted-foreground text-xs font-medium">Qty:</span>
                                        <span className="text-primary text-sm font-bold">{item.quantity}</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Order Number Footer */}
            <div className="border-border mt-4 flex items-center justify-between border-t pt-3">
                <span className="text-muted-foreground text-xs font-medium">Order #{order.orderNumber}</span>
                {order.totalAmount && (
                    <span className="text-foreground text-xs font-semibold">
                        {new Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: "BDT",
                            minimumFractionDigits: 0,
                        }).format(order.discountedPrice ?? order.totalAmount ?? 0)}
                    </span>
                )}
            </div>
        </div>
    );
};
