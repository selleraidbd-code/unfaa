"use client";

import { useEffect, useMemo, useState } from "react";

import { PlaceOrder } from "@/features/create-order/place-order";
import { ProductOrderControls } from "@/features/create-order/product-order-controls";
import { ProductSelectionModal } from "@/features/create-order/product-selection-modal";
import { CustomerState } from "@/features/create-order/types";
import { useLazyGetProductByIdQuery } from "@/redux/api/product-api";
import { ResponseObject } from "@/redux/type";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { toast } from "@workspace/ui/components/sonner";
import { Plus, ShoppingCart } from "lucide-react";

import { FraudCheckerData } from "@/types/customer-type";
import { AIOrderGenerationProductInfo, OrderDetailsType, OrderItem, OrderSource } from "@/types/order-type";
import { Product } from "@/types/product-type";

import { isValidId } from "./lib";

interface Props {
    customerInfo: CustomerState;
    productInfo: AIOrderGenerationProductInfo[];
    onReset: () => void;
    orderDetails: OrderDetailsType;
    setOrderDetails: (orderDetails: OrderDetailsType) => void;
    fraudState?: FraudCheckerData | null;
    orderSource: OrderSource;
}

export const ProductInfoOrder = ({
    customerInfo,
    productInfo,
    onReset,
    orderDetails,
    setOrderDetails,
    fraudState,
    orderSource,
}: Props) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [orderItems, setOrderItems] = useState<OrderItem[]>([]);

    const [isModalOpen, setIsModalOpen] = useState(false);

    const [triggerGetProductById] = useLazyGetProductByIdQuery();

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

    // When a valid productId exists, fetch full product
    useEffect(() => {
        const fetchProducts = async () => {
            if (!productInfo?.length) return;

            // Filter out invalid or missing product IDs
            const validProducts = productInfo.filter((p) => isValidId(p.productId));

            if (!validProducts.length) return;

            // Fetch all valid products in parallel
            const productResponses = await Promise.all(
                validProducts.map((p) =>
                    triggerGetProductById({ id: p.productId! })
                        .unwrap()
                        .then((data) => ({ data, quantity: p.productQuantity }))
                        .catch(() => null)
                )
            );

            // Filter out failed responses
            const fetchedProducts = productResponses.filter(
                (res): res is { data: ResponseObject<Product>; quantity: number } => !!res
            );

            // Set products
            setProducts(fetchedProducts.map((res) => res.data.data));

            // Map to orderItems
            const items: OrderItem[] = fetchedProducts.map(({ data, quantity }) => ({
                id: data.data.id,
                name: data.data.name,
                price: data.data.discountPrice ?? data.data.price ?? 0,
                quantity,
                selectedVariants: [], // can be filled later
            }));

            setOrderItems(items);
        };

        fetchProducts();
    }, [productInfo, triggerGetProductById]);

    const upsertSelectedVariant = (
        productId: string,
        variantId: string,
        variantName: string,
        optionId: string,
        optionName: string,
        extraPrice: number
    ) => {
        setOrderItems((prev) => {
            const next = [...prev];
            const idx = next.findIndex((o) => o.id === productId);
            if (idx === -1) return prev;
            const currentItem = next[idx] as OrderItem;
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
            } as OrderItem;
            return next;
        });
    };

    const updateQuantity = (productId: string, quantity: number) => {
        setOrderItems((prev) => {
            const next = [...prev];
            const idx = next.findIndex((o) => o.id === productId);
            if (idx === -1) return prev;
            const normalized = Number.isFinite(quantity) && quantity > 0 ? Math.floor(quantity) : 1;
            next[idx] = { ...next[idx], quantity: normalized } as OrderItem;
            return next;
        });
    };

    const handleSelectProduct = (product: Product) => {
        setOrderItems([
            ...orderItems,
            {
                id: product.id,
                name: product.name,
                price: product.discountPrice ?? product.price ?? 0,
                quantity: 1,
            },
        ]);
        setProducts([...products, product]);
        setIsModalOpen(false);
    };

    const removeProduct = (productId: string) => {
        if (products.length === 1 || orderItems.length === 1) {
            toast.error("You cannot remove the last product");
            return;
        }
        setProducts((prev) => prev.filter((p) => p.id !== productId));
        setOrderItems((prev) => prev.filter((o) => o.id !== productId));
    };

    return (
        <>
            <div className="space-y-3 rounded-md md:space-y-6 md:border md:p-4 lg:p-6">
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

                <div className="space-y-3 md:space-y-6">
                    {products.map((product) => {
                        const item = orderItems.find((oi) => oi.id === product.id);
                        return (
                            <ProductOrderControls
                                key={product.id}
                                product={product}
                                item={item}
                                onUpdateQuantity={(q) => updateQuantity(product.id, q)}
                                onSelectVariant={(variantId, variantName, optionId, optionName, extraPrice) =>
                                    upsertSelectedVariant(
                                        product.id,
                                        variantId,
                                        variantName,
                                        optionId,
                                        optionName,
                                        extraPrice
                                    )
                                }
                                onRemove={() => removeProduct(product.id)}
                            />
                        );
                    })}
                </div>

                <div className="flex items-center justify-end gap-2">
                    <span className="text-sm md:text-base"> Total:</span>
                    <span className="text-base font-semibold">{grandTotal.toLocaleString()}</span>
                </div>

                <div className="ms-auto flex gap-2 md:max-w-md">
                    <Label className="flex-shrink-0" htmlFor="cod-amount">
                        COD Amount (optional)
                    </Label>
                    <Input
                        id="cod-amount"
                        type="number"
                        placeholder="Enter COD amount"
                        value={orderDetails.discountedPrice ?? ""}
                        onChange={(e) => {
                            const nextValue = e.target.value;
                            const parsed = Number(nextValue);
                            setOrderDetails({
                                ...orderDetails,
                                discountedPrice: nextValue === "" || !Number.isFinite(parsed) ? undefined : parsed,
                            });
                        }}
                        onWheel={(e) => {
                            e.currentTarget.blur();
                        }}
                    />
                </div>

                {orderDetails.discountedPrice !== undefined && orderDetails.discountedPrice !== null && (
                    <div className="flex flex-col items-end gap-2">
                        <p>
                            <span className="pr-2 text-sm md:text-base">Discount:</span>
                            <span>
                                {orderDetails.discountedPrice !== undefined && orderDetails.discountedPrice !== null
                                    ? (grandTotal - orderDetails.discountedPrice).toLocaleString()
                                    : "Not set"}
                            </span>
                        </p>
                        {orderDetails.discountedPrice > grandTotal && (
                            <p className="text-destructive text-xs md:text-sm">Please enter a valid discount amount</p>
                        )}
                    </div>
                )}
            </div>

            <PlaceOrder
                onReset={onReset}
                customerInfo={customerInfo}
                orderItems={orderItems}
                orderDetails={orderDetails}
                setOrderDetails={setOrderDetails}
                fraudState={fraudState}
                orderSource={orderSource}
            />

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
