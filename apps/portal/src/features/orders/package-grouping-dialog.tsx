"use client";

import { useMemo } from "react";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@workspace/ui/components/dialog";
import { Package } from "lucide-react";

import { Order, OrderDetailsItem } from "@/types/order-type";

interface PackageGroup {
    signature: string;
    orders: Order[];
    items: OrderDetailsItem[];
}

interface PackageGroupingDialogProps {
    isOpen: boolean;
    onClose: () => void;
    orders: Order[];
}

export const PackageGroupingDialog = ({ isOpen, onClose, orders }: PackageGroupingDialogProps) => {
    // Create a signature for an order based on its items (productId, quantity, and variants)
    const createOrderSignature = (orderItems: OrderDetailsItem[]): string => {
        // Sort items by productId, then quantity, then variant signature for consistent comparison
        const sortedItems = [...orderItems].sort((a, b) => {
            // First sort by productId
            const productCompare = a.productId.localeCompare(b.productId);
            if (productCompare !== 0) return productCompare;

            // If same productId, sort by quantity
            const quantityCompare = a.quantity - b.quantity;
            if (quantityCompare !== 0) return quantityCompare;

            // If same productId and quantity, sort by variant signature
            const variantA = a.orderItemVariant
                .map((v) => `${v.productVariantId}-${v.productVariantOptionId}`)
                .sort()
                .join(",");
            const variantB = b.orderItemVariant
                .map((v) => `${v.productVariantId}-${v.productVariantOptionId}`)
                .sort()
                .join(",");

            return variantA.localeCompare(variantB);
        });

        return sortedItems
            .map((item) => {
                // Create variant signature by sorting variant IDs
                const variantSignature = item.orderItemVariant
                    .map((v) => `${v.productVariantId}-${v.productVariantOptionId}`)
                    .sort()
                    .join(",");

                // Create item signature: productId:quantity:variants
                return `${item.productId}:${item.quantity}:${variantSignature || "no-variants"}`;
            })
            .join("|");
    };

    // Group orders by their signature
    const packageGroups = useMemo<PackageGroup[]>(() => {
        const groupsMap = new Map<string, Order[]>();

        orders.forEach((order) => {
            const signature = createOrderSignature(order.orderItems);
            if (!groupsMap.has(signature)) {
                groupsMap.set(signature, []);
            }
            groupsMap.get(signature)!.push(order);
        });

        // Convert map to array and create PackageGroup objects
        return Array.from(groupsMap.entries()).map(([signature, orders]) => ({
            signature,
            orders,
            items: orders[0]?.orderItems || [], // All orders in a group have the same items
        }));
    }, [orders]);

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Package className="h-5 w-5" />
                        Package Grouping
                    </DialogTitle>
                    <DialogDescription className="sr-only">
                        Orders with the same products and quantities are grouped together for efficient packaging.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    {packageGroups.length === 0 ? (
                        <div className="text-muted-foreground py-8 text-center">
                            <p>No orders to group</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {packageGroups.map((group, index) => (
                                <div key={group.signature} className="bg-card space-y-3 rounded-lg border p-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Package className="text-primary h-4 w-4" />
                                            <h3 className="font-semibold">Package {index + 1}</h3>
                                        </div>

                                        <span className="bg-primary/10 text-primary rounded-full px-3 py-1 text-sm font-medium">
                                            Orders: {group.orders.length}
                                        </span>
                                    </div>

                                    <div className="space-y-2">
                                        <p className="text-muted-foreground text-sm font-medium">
                                            Products in this package:
                                        </p>
                                        <div className="space-y-1 pl-4">
                                            {group.items.map((item, itemIndex) => {
                                                const variantText =
                                                    item.orderItemVariant.length > 0
                                                        ? ` (${item.orderItemVariant
                                                              .map((v) => v.productVariantName || "")
                                                              .filter(Boolean)
                                                              .join(", ")})`
                                                        : "";

                                                return (
                                                    <div
                                                        key={item.id || itemIndex}
                                                        className="flex items-center justify-between text-sm"
                                                    >
                                                        <span className="text-foreground">
                                                            {item.productName}
                                                            {variantText && (
                                                                <span className="text-muted-foreground">
                                                                    {variantText}
                                                                </span>
                                                            )}
                                                        </span>
                                                        <span className="text-muted-foreground font-medium">
                                                            × {item.quantity}
                                                        </span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};
