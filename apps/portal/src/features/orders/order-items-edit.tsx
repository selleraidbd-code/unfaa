"use client";

import { useEffect, useMemo, useState } from "react";

import { ProductOrderControls } from "@/features/create-order/product-order-controls";
import { ProductSelectionModal } from "@/features/create-order/product-selection-modal";
import { useEditOrderItemsMutation } from "@/redux/api/order-api";
import { useLazyGetProductByIdQuery } from "@/redux/api/product-api";
import { Button } from "@workspace/ui/components/button";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { toast } from "@workspace/ui/components/sonner";
import { Plus, ShoppingCart, X } from "lucide-react";

import { OrderDetailsItem, OrderItem as OrderItemType } from "@/types/order-type";
import { Product } from "@/types/product-type";

interface OrderItemsEditProps {
    orderId: string;
    orderItems: OrderDetailsItem[];
    discountedPrice: number | null;
    onCancel: () => void;
    onSuccess?: () => void;
}

let editLineItemCounter = 0;
function generateEditLineItemId(): string {
    return `eli_${Date.now()}_${++editLineItemCounter}`;
}

export const OrderItemsEdit = ({
    orderId,
    orderItems: initialOrderItems,
    discountedPrice: initialDiscountedPrice,
    onCancel,
    onSuccess,
}: OrderItemsEditProps) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [orderItems, setOrderItems] = useState<OrderItemType[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [triggerGetProductById, { isLoading: isLoadingGetProductById }] = useLazyGetProductByIdQuery();
    const [editOrderItems, { isLoading }] = useEditOrderItemsMutation();

    useEffect(() => {
        if (initialOrderItems.length > 0) {
            const fetchProducts = async () => {
                const productResponses = await Promise.all(
                    initialOrderItems.map((item) =>
                        triggerGetProductById({ id: item.productId })
                            .unwrap()
                            .then((data) => ({ data: data.data, orderItem: item }))
                            .catch(() => null)
                    )
                );

                const fetchedProducts = productResponses.filter(
                    (res): res is { data: Product; orderItem: OrderDetailsItem } => !!res
                );

                const productsList = fetchedProducts.map((res) => res.data);
                setProducts(productsList);

                const items: OrderItemType[] = fetchedProducts.map(({ data, orderItem }) => {
                    const selectedVariants = orderItem.orderItemVariant.map((v) => ({
                        variantId: v.productVariantId,
                        variantName: v.productVariantName || "",
                        optionId: v.productVariantOptionId,
                        optionName: v.productVariantOptionName || "",
                        extraPrice: v.productVariantOptionExtraPrice || 0,
                    }));

                    return {
                        id: generateEditLineItemId(),
                        productId: data.id,
                        name: data.name,
                        price: orderItem.productPrice,
                        quantity: orderItem.quantity,
                        selectedVariants,
                    };
                });

                setOrderItems(items);
            };

            fetchProducts();
        }
    }, [initialOrderItems, triggerGetProductById]);

    const grandTotal = useMemo(() => {
        return orderItems.reduce((sum, item) => {
            const basePrice = Number(item.price ?? 0);
            const extras = (item.selectedVariants ?? []).reduce(
                (acc, sv) => acc + (Number(sv.extraPrice ?? 0) || 0),
                0
            );
            const unitPrice = basePrice + extras;
            const quantity = Number(item.quantity ?? 1) || 1;
            return sum + unitPrice * quantity;
        }, 0);
    }, [orderItems]);

    const handleSelectProduct = (product: Product) => {
        setOrderItems([
            ...orderItems,
            {
                id: generateEditLineItemId(),
                productId: product.id,
                name: product.name,
                price: product.discountPrice ?? product.price ?? 0,
                quantity: 1,
            },
        ]);
        setProducts([...products, product]);
        setIsModalOpen(false);
    };

    const removeProduct = (itemId: string) => {
        if (orderItems.length === 1) {
            toast.error("You cannot remove the last product");
            return;
        }
        setOrderItems((prev) => prev.filter((o) => o.id !== itemId));
    };

    const updateQuantity = (itemId: string, quantity: number) => {
        setOrderItems((prev) => {
            const next = [...prev];
            const idx = next.findIndex((o) => o.id === itemId);
            if (idx === -1) return prev;
            const normalized = Number.isFinite(quantity) && quantity > 0 ? Math.floor(quantity) : 1;
            next[idx] = { ...next[idx], quantity: normalized } as OrderItemType;
            return next;
        });
    };

    const upsertSelectedVariant = (
        itemId: string,
        variantId: string,
        variantName: string,
        optionId: string,
        optionName: string,
        extraPrice: number
    ) => {
        setOrderItems((prev) => {
            const next = [...prev];
            const idx = next.findIndex((o) => o.id === itemId);
            if (idx === -1) return prev;
            const currentItem = next[idx] as OrderItemType;
            const list = currentItem.selectedVariants ?? [];
            const existingIdx = list.findIndex((sv) => sv.variantId === variantId);
            const updated =
                existingIdx === -1
                    ? [
                          ...list,
                          {
                              variantId,
                              variantName,
                              optionId,
                              optionName,
                              extraPrice,
                          },
                      ]
                    : list.map((sv, i) => (i === existingIdx ? { ...sv, optionId, optionName, extraPrice } : sv));
            next[idx] = {
                ...currentItem,
                selectedVariants: updated,
            } as OrderItemType;
            return next;
        });
    };

    const handleSave = async () => {
        if (orderItems.length === 0) {
            toast.error("At least one product is required");
            return;
        }

        try {
            // Calculate total amount from all order items
            const calculatedTotalAmount = grandTotal;

            // Use initial discounted price if set, otherwise total
            const finalPayableAmount =
                initialDiscountedPrice !== null && initialDiscountedPrice !== undefined
                    ? initialDiscountedPrice
                    : calculatedTotalAmount;

            // Transform order items to EditOrderItem format
            const transformedOrderItems = orderItems.map((item) => {
                const extras = (item.selectedVariants ?? []).reduce(
                    (sum, sv) => sum + (Number(sv.extraPrice ?? 0) || 0),
                    0
                );
                const unitPrice = Number(item.price ?? 0) + extras;

                return {
                    productId: String(item.productId),
                    productPrice: unitPrice,
                    quantity: Number(item.quantity) || 1,
                    orderItemVariant: (item.selectedVariants ?? []).map((sv) => ({
                        productVariantId: String(sv.variantId),
                        productVariantOptionId: String(sv.optionId),
                        productVariantOptionExtraPrice: Number(sv.extraPrice ?? 0),
                    })),
                };
            });

            // Prepare order info
            const orderInfo = {
                discountedPrice: initialDiscountedPrice ?? calculatedTotalAmount,
                finalPayableAmount,
                paidAmount: 0, // This might need to be retrieved from the current order if available
                totalAmount: calculatedTotalAmount,
            };

            // Send all order items at once
            await editOrderItems({
                id: orderId,
                payload: {
                    orderItems: transformedOrderItems,
                    orderInfo,
                },
            })
                .unwrap()
                .then((res) => {
                    toast.success("Order updated successfully");
                    onSuccess?.();
                })
                .catch((error) => {
                    toast.error(error?.data?.message || "Failed to update order");
                });
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to update order");
        }
    };

    if (isLoadingGetProductById) {
        return <OrderItemsEditSkeleton />;
    }

    return (
        <>
            <div className="md:card space-y-3 rounded-sm border p-3 md:space-y-4 md:p-4">
                <div className="flex items-center justify-between">
                    <h2 className="flex items-center gap-2">
                        <ShoppingCart className="h-5 w-5 max-sm:hidden" /> Product
                        <span className="max-sm:hidden">Information</span>
                    </h2>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2"
                    >
                        <Plus className="h-4 w-4" />
                        Add Product
                    </Button>
                </div>

                <div className="space-y-3 md:space-y-4">
                    {orderItems.map((item) => {
                        const product = products.find((p) => p.id === item.productId);
                        if (!product) return null;
                        return (
                            <ProductOrderControls
                                key={item.id}
                                product={product}
                                item={item}
                                onUpdateQuantity={(q) => updateQuantity(item.id, q)}
                                onSelectVariant={(variantId, variantName, optionId, optionName, extraPrice) =>
                                    upsertSelectedVariant(
                                        item.id,
                                        variantId,
                                        variantName,
                                        optionId,
                                        optionName,
                                        extraPrice
                                    )
                                }
                                onRemove={() => removeProduct(item.id)}
                            />
                        );
                    })}
                </div>

                <div className="flex items-center justify-end gap-2">
                    <span className="text-sm md:text-base"> Total:</span>
                    <span className="text-base font-semibold">{grandTotal.toLocaleString()}</span>
                </div>

                <div className="flex justify-end gap-4">
                    <Button variant="outline" onClick={onCancel} disabled={isLoading}>
                        <X className="h-4 w-4" />
                        Cancel
                    </Button>
                    <Button onClick={handleSave} disabled={isLoading || orderItems.length === 0}>
                        {isLoading ? "Saving..." : "Save Changes"}
                    </Button>
                </div>
            </div>

            {/* Product Selection Modal */}
            {isModalOpen && (
                <ProductSelectionModal
                    open={isModalOpen}
                    onOpenChange={setIsModalOpen}
                    onSelectProduct={handleSelectProduct}
                />
            )}
        </>
    );
};

const OrderItemsEditSkeleton = () => {
    return (
        <div className="md:card space-y-3 rounded-sm border p-3 md:space-y-4 md:p-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Skeleton className="h-5 w-5 max-sm:hidden" />
                    <Skeleton className="h-6 w-32" />
                </div>
                <Skeleton className="h-9 w-32" />
            </div>

            <div className="space-y-3 md:space-y-4">
                {Array.from({ length: 2 }).map((_, i) => (
                    <div key={i} className="rounded-md border p-3 md:p-4">
                        <div className="flex items-start justify-between gap-2 max-md:flex-col md:gap-4">
                            <div className="flex min-w-0 flex-1 items-start gap-1.5 sm:gap-3">
                                <Skeleton className="size-14 rounded md:size-16 lg:size-20" />
                                <div className="min-w-0 flex-1 space-y-1">
                                    <Skeleton className="h-5 w-3/4" />
                                    <Skeleton className="h-4 w-1/2" />
                                    <div className="flex flex-wrap gap-2 pt-1">
                                        <Skeleton className="h-5 w-20" />
                                        <Skeleton className="h-5 w-24" />
                                    </div>
                                </div>
                            </div>
                            <div className="ms-auto space-y-1.5 sm:space-y-3">
                                <div className="flex items-center gap-6">
                                    <div className="flex items-center gap-1">
                                        <Skeleton className="h-9 w-9" />
                                        <Skeleton className="h-9 w-16" />
                                        <Skeleton className="h-9 w-9" />
                                    </div>
                                    <Skeleton className="h-9 w-9" />
                                </div>
                                <Skeleton className="h-5 w-32" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex items-center justify-end gap-2">
                <Skeleton className="h-5 w-12" />
                <Skeleton className="h-6 w-20" />
            </div>

            <div className="flex justify-end gap-4">
                <Skeleton className="h-10 w-24" />
                <Skeleton className="h-10 w-32" />
            </div>
        </div>
    );
};
