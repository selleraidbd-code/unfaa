"use client";

import { useEffect, useMemo, useState } from "react";

import { AiPlaceOrder } from "@/features/ai-order/ai-place-order";
import { ProductSelectionModal } from "@/features/ai-order/product-selection-modal";
import { CustomerState } from "@/features/ai-order/types";
import { useLazyGetProductByIdQuery } from "@/redux/api/product-api";
import { ResponseObject } from "@/redux/type";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
// removed Select-based UI in favor of button options
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { Separator } from "@workspace/ui/components/separator";
import { toast } from "@workspace/ui/components/sonner";
import { cn } from "@workspace/ui/lib/utils";
import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";

import { AIOrderGenerationProductInfo, OrderDetailsType, OrderItem } from "@/types/order-type";
import { Product } from "@/types/product-type";

import { isValidId } from "./lib";

interface Props {
    customerInfo: CustomerState;
    productInfo: AIOrderGenerationProductInfo[];
    onReset: () => void;
    orderDetails: OrderDetailsType;
    setOrderDetails: (orderDetails: OrderDetailsType) => void;
}

export const ProductInfoOrder = ({ customerInfo, productInfo, onReset, orderDetails, setOrderDetails }: Props) => {
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

            <AiPlaceOrder
                onReset={onReset}
                customerInfo={customerInfo}
                orderItems={orderItems}
                orderDetails={orderDetails}
                setOrderDetails={setOrderDetails}
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

// Subcomponent: product block with quantity and variant selectors
interface ProductOrderControlsProps {
    product: Product;
    item?: OrderItem;
    onUpdateQuantity: (quantity: number) => void;
    onSelectVariant: (
        variantId: string,
        variantName: string,
        optionId: string,
        optionName: string,
        extraPrice: number
    ) => void;
    onRemove: () => void;
}

const ProductOrderControls = ({
    product,
    item,
    onUpdateQuantity,
    onSelectVariant,
    onRemove,
}: ProductOrderControlsProps) => {
    const quantity = item?.quantity ?? 1;
    const hasMissingRequiredVariant = (() => {
        const requiredVariantIds = (product?.productVariant ?? []).filter((v) => v.isRequired).map((v) => String(v.id));
        if (requiredVariantIds.length === 0) return false;
        const selectedVariantIds = new Set((item?.selectedVariants ?? []).map((sv) => String(sv.variantId)));
        return requiredVariantIds.some((id) => !selectedVariantIds.has(id));
    })();

    const handleDecrement = () => {
        const next = Math.max(1, quantity - 1);
        onUpdateQuantity(next);
    };

    const handleIncrement = () => {
        const next = Math.max(1, quantity + 1);
        onUpdateQuantity(next);
    };

    const handleInputChange = (val: string) => {
        const num = Number(val);
        onUpdateQuantity(Number.isFinite(num) && num > 0 ? Math.floor(num) : 1);
    };

    const getSelectedOptionId = (variantId: string) => {
        return item?.selectedVariants?.find((sv) => sv.variantId === String(variantId))?.optionId ?? undefined;
    };

    return (
        <div className={cn("rounded-md border p-4", hasMissingRequiredVariant && "border-destructive")}>
            <div className="flex items-start justify-between gap-2 max-md:flex-col md:gap-4">
                <div className="flex min-w-0 flex-1 items-start gap-1.5 sm:gap-3">
                    {product?.photoURL ? (
                        <img
                            src={product.photoURL}
                            alt={product.name}
                            className="size-20 rounded object-cover max-md:size-16 max-sm:size-14"
                        />
                    ) : (
                        <div className="bg-muted size-20 rounded max-md:size-16 max-sm:size-14" />
                    )}

                    <div className="min-w-0 space-y-1">
                        <h3 className="line-clamp-2 text-sm font-medium md:text-base">{product.name}</h3>
                        <p className="text-muted-foreground max-md:text-sm">
                            Base price:{" "}
                            <span className="text-primary font-medium">
                                {product.discountPrice ?? product.price ?? 0}
                            </span>
                        </p>

                        {/* Selected variants/options */}
                        {product.productVariant.length > 0 ? (
                            item?.selectedVariants && item.selectedVariants.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {item.selectedVariants.map((sv, i) => (
                                        <Badge key={`${sv.variantName}-${sv.optionName}-${i}`} variant="secondary">
                                            <span className="text-primary">{sv.variantName}:</span> {sv.optionName}
                                            {typeof sv.extraPrice === "number" && sv.extraPrice > 0
                                                ? ` (+${sv.extraPrice})`
                                                : ""}
                                        </Badge>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-destructive text-sm">No variant selected</p>
                            )
                        ) : null}
                    </div>
                </div>

                <div className="ms-auto space-y-1.5 sm:space-y-3">
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                            <Label htmlFor={`qty-${product.id}`} className="text-sm max-sm:hidden">
                                Quantity
                            </Label>
                            <div className="flex items-center gap-1">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    onClick={handleDecrement}
                                    aria-label="Decrease quantity"
                                >
                                    <Minus className="size-4" />
                                </Button>
                                <Input
                                    id={`qty-${product.id}`}
                                    type="number"
                                    min={1}
                                    className="w-16 text-center"
                                    value={quantity}
                                    onChange={(e) => handleInputChange(e.target.value)}
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    onClick={handleIncrement}
                                    aria-label="Increase quantity"
                                >
                                    <Plus className="size-4" />
                                </Button>
                            </div>
                        </div>

                        <Button
                            type="button"
                            variant="destructiveOutline"
                            size="icon"
                            onClick={onRemove}
                            aria-label="Remove product"
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>

                    {/* Total price */}
                    {(() => {
                        const basePrice = Number(product.discountPrice ?? product.price ?? 0);
                        const extras = (item?.selectedVariants ?? []).reduce(
                            (sum, sv) => sum + (Number(sv.extraPrice ?? 0) || 0),
                            0
                        );
                        const unitPrice = basePrice + extras;
                        const total = unitPrice * (item?.quantity ?? 1);
                        return (
                            <div className="flex items-center justify-end gap-2">
                                <span className="">
                                    Unit: {unitPrice.toLocaleString()} x {item?.quantity ?? 1}
                                </span>{" "}
                                =<span className="text-base font-semibold">Total: {total.toLocaleString()}</span>
                            </div>
                        );
                    })()}
                </div>
            </div>

            <Separator className="my-3" />

            {/* Variant selection with buttons */}
            {product && Array.isArray(product.productVariant) && product.productVariant.length > 0 ? (
                <div className="mt-3 space-y-2 sm:space-y-3">
                    {product.productVariant.map((v) => {
                        const activeOptionId = getSelectedOptionId(String(v.id));
                        return (
                            <div key={v.id} className="space-y-1 sm:space-y-2">
                                <Label className="text-muted-foreground text-sm">{v.name}</Label>
                                <div className="flex flex-wrap gap-2">
                                    {v.options.map((o) => {
                                        const isActive = String(o.id) === String(activeOptionId);
                                        return (
                                            <Button
                                                key={String(o.id)}
                                                type="button"
                                                size="sm"
                                                variant={isActive ? "default" : "outline"}
                                                className={cn(
                                                    "max-md:text-xs",
                                                    isActive ? "bg-primary text-primary-foreground" : ""
                                                )}
                                                aria-pressed={isActive}
                                                onClick={() =>
                                                    onSelectVariant(
                                                        String(v.id),
                                                        v.name,
                                                        String(o.id ?? ""),
                                                        o.name,
                                                        Number(o.extraPrice ?? 0)
                                                    )
                                                }
                                            >
                                                {o.name}
                                                {typeof o.extraPrice === "number" && o.extraPrice > 0
                                                    ? ` (+${o.extraPrice})`
                                                    : ""}
                                            </Button>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : null}
        </div>
    );
};
