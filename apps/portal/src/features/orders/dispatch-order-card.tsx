"use client";

import { useCallback } from "react";

import { formatDate } from "@workspace/ui/lib/formateDate";
import { cn } from "@workspace/ui/lib/utils";
import { Check, Download, Package, User } from "lucide-react";

import { Order } from "@/types/order-type";

interface DispatchOrderCardProps {
    order: Order;
    isSelected: boolean;
    isExporting: boolean;
    onToggleSelection: (orderId: string) => void;
    onExportPDF: (order: Order) => void;
}

export const DispatchOrderCard = ({
    order,
    isSelected,
    isExporting,
    onToggleSelection,
    onExportPDF,
}: DispatchOrderCardProps) => {
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

    const totalItems = order.orderItems?.reduce((sum, item) => sum + item.quantity, 0) || 0;

    return (
        <div
            onClick={handleCardClick}
            className={cn(
                "group bg-card relative cursor-pointer rounded-lg border-2 p-3 transition-all duration-200",
                "hover:shadow-md",
                isSelected
                    ? "border-primary bg-primary/5 ring-primary/20 shadow-sm ring-1"
                    : "border-border hover:border-primary/50"
            )}
        >
            {/* Header: Checkbox + Consignment ID + Download */}
            <div className="mb-2 flex items-center justify-between gap-2">
                {/* Selection Checkbox */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onToggleSelection(order.id);
                        }}
                        className={cn(
                            "flex h-4 w-4 shrink-0 items-center justify-center rounded border-2 transition-all",
                            isSelected
                                ? "border-primary bg-primary text-primary-foreground"
                                : "border-muted-foreground/40 bg-background hover:border-primary/60"
                        )}
                        aria-label={isSelected ? "Deselect order" : "Select order"}
                    >
                        {isSelected && <Check className="h-3 w-3" />}
                    </button>

                    {/* Consignment ID */}
                    {order.consignmentId && (
                        <p className="text-primary text-base font-semibold">{order.consignmentId}</p>
                    )}
                </div>

                {/* Download Button */}
                <button
                    data-download-button
                    onClick={handleDownloadClick}
                    disabled={isExporting}
                    className={cn(
                        "text-muted-foreground shrink-0 rounded p-1.5 transition-all",
                        "hover:bg-primary hover:text-primary-foreground",
                        "disabled:cursor-not-allowed disabled:opacity-50"
                    )}
                    title="Download PDF"
                    aria-label="Download order PDF"
                >
                    <Download className="h-3.5 w-3.5" />
                </button>
            </div>

            {/* Customer Name */}
            <div className="mb-2 flex items-center gap-2">
                <div className="bg-accent flex h-6 w-6 shrink-0 items-center justify-center rounded">
                    <User className="text-accent-foreground h-3 w-3" />
                </div>
                <div className="min-w-0 flex-1">
                    <p className="text-foreground truncate text-sm font-semibold">{order.customerName}</p>
                </div>
            </div>

            {/* Product Items - Compact List */}
            {order.orderItems && order.orderItems.length > 0 && (
                <div className="mb-2 space-y-1">
                    {order.orderItems.map((item) => {
                        return (
                            <div key={item.id} className="flex items-center justify-between gap-2 text-xs">
                                <span className="min-w-0 flex-1 truncate">
                                    {item.productName}
                                    {item.orderItemVariant?.length > 0 && (
                                        <span className="text-primary ml-1">
                                            ({item.orderItemVariant.map((ov) => ov.productVariantOptionName).join(", ")}
                                            )
                                        </span>
                                    )}
                                </span>
                                <span className="text-primary shrink-0 font-semibold">×{item.quantity}</span>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Footer: Order Number + Total Items + Amount */}
            <div className="border-border flex items-center justify-between gap-2 border-t pt-2 text-xs">
                <p className="text-muted-foreground flex items-center gap-2">
                    <span>#{order.orderNumber}</span>
                    <span>{formatDate(order.createdAt)}</span>
                </p>
                {order.totalAmount && (
                    <span className="text-foreground font-semibold">
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
