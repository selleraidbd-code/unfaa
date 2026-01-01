"use client";

import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { Separator } from "@workspace/ui/components/separator";
import { cn } from "@workspace/ui/lib/utils";
import { Minus, Plus, Trash2 } from "lucide-react";

import { OrderItem } from "@/types/order-type";
import { Product } from "@/types/product-type";

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

export const ProductOrderControls = ({
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

    const isHaveProductVariant = product && Array.isArray(product.productVariant) && product.productVariant.length > 0;

    return (
        <div className={cn("rounded-md border p-3 md:p-4", hasMissingRequiredVariant && "border-destructive")}>
            <div className="flex items-start justify-between gap-2 max-md:flex-col md:gap-4">
                <div className="flex min-w-0 flex-1 items-start gap-1.5 sm:gap-3">
                    {product?.photoURL ? (
                        <img
                            src={product.photoURL}
                            alt={product.name}
                            className="size-14 rounded object-cover md:size-16 lg:size-20"
                        />
                    ) : (
                        <div className="bg-muted size-14 rounded md:size-16 lg:size-20" />
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

            {/* Variant selection with buttons */}
            {isHaveProductVariant && (
                <>
                    <Separator className="my-3" />

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
                </>
            )}
        </div>
    );
};
