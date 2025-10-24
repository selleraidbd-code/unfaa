"use client";

import { Product, ProductActiveStatus } from "@/types/product-type";
import { Badge } from "@workspace/ui/components/badge";
import {
    Dialog,
    DialogClose,
    DialogContainer,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@workspace/ui/components/dialog";
import { ScrollArea } from "@workspace/ui/components/scroll-area";
import { Separator } from "@workspace/ui/components/separator";
import Image from "next/image";
import { Package, Tag, Calendar, Barcode, Shield } from "lucide-react";
import { Button } from "@workspace/ui/components/button";

interface ProductViewDialogProps {
    product: Product;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const ProductViewDialog = ({
    product,
    open,
    onOpenChange,
}: ProductViewDialogProps) => {
    const displayPrice = product.discountPrice || product.price;
    const hasDiscount =
        product.discountPrice && product.discountPrice < (product.price || 0);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl">
                <DialogHeader>
                    <DialogTitle>Product Details</DialogTitle>
                </DialogHeader>

                <DialogContainer>
                    <div className="p-2 pb-0 space-y-6">
                        {/* Images Section */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="relative aspect-square w-full overflow-hidden rounded-lg border bg-gray-100">
                                <Image
                                    src={product.photoURL}
                                    alt={product.name}
                                    fill
                                    className="object-cover"
                                />
                            </div>

                            {product.images && product.images.length > 0 && (
                                <div className="grid grid-cols-2 gap-2">
                                    {product.images
                                        .slice(0, 4)
                                        .map((img, idx) => (
                                            <div
                                                key={idx}
                                                className="relative aspect-square overflow-hidden rounded-lg border bg-gray-100"
                                            >
                                                <Image
                                                    src={img}
                                                    alt={`${product.name} ${idx + 1}`}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                        ))}
                                </div>
                            )}
                        </div>

                        {/* Basic Info */}
                        <div className="space-y-3">
                            <div className="flex items-start justify-between gap-4">
                                <div className="space-y-1">
                                    <h3 className="text-2xl font-bold">
                                        {product.banglaName || product.name}
                                    </h3>
                                    {product.banglaName && (
                                        <p className="text-muted-foreground">
                                            {product.name}
                                        </p>
                                    )}
                                </div>
                                <Badge
                                    variant={
                                        product.activeStatus ===
                                        ProductActiveStatus.ACTIVE
                                            ? "default"
                                            : "destructive"
                                    }
                                >
                                    {product.activeStatus ===
                                    ProductActiveStatus.ACTIVE
                                        ? "Active"
                                        : "Inactive"}
                                </Badge>
                            </div>

                            <div className="flex items-baseline gap-3">
                                <span className="text-3xl font-bold text-primary">
                                    ৳{displayPrice?.toLocaleString() || "N/A"}
                                </span>
                                {hasDiscount && (
                                    <>
                                        <span className="text-xl text-muted-foreground line-through">
                                            ৳{product.price?.toLocaleString()}
                                        </span>
                                        <Badge variant="destructive">
                                            {Math.round(
                                                ((product.price! -
                                                    product.discountPrice!) /
                                                    product.price!) *
                                                    100
                                            )}
                                            % OFF
                                        </Badge>
                                    </>
                                )}
                            </div>
                        </div>

                        <Separator />

                        {/* Quick Info Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                                    <Package className="size-4" />
                                    <span>Stock</span>
                                </div>
                                <p className="text-lg font-semibold">
                                    {product.stock}{" "}
                                    {product.unitName || "units"}
                                </p>
                            </div>

                            {product.sku && (
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 text-muted-foreground text-sm">
                                        <Barcode className="size-4" />
                                        <span>SKU</span>
                                    </div>
                                    <p className="text-lg font-semibold font-mono">
                                        {product.sku}
                                    </p>
                                </div>
                            )}

                            {product.warranty && (
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 text-muted-foreground text-sm">
                                        <Shield className="size-4" />
                                        <span>Warranty</span>
                                    </div>
                                    <p className="text-lg font-semibold">
                                        {product.warranty}
                                    </p>
                                </div>
                            )}

                            <div className="space-y-1">
                                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                                    <Calendar className="size-4" />
                                    <span>Created</span>
                                </div>
                                <p className="text-sm font-medium">
                                    {new Date(
                                        product.createdAt
                                    ).toLocaleDateString()}
                                </p>
                            </div>
                        </div>

                        <Separator />

                        {/* Description */}
                        {product.description && (
                            <div className="space-y-2">
                                <h4 className="font-semibold text-lg">
                                    Description
                                </h4>
                                <p className="text-muted-foreground leading-relaxed">
                                    {product.description}
                                </p>
                            </div>
                        )}

                        {/* Full Description */}
                        {product.fullDescription && (
                            <div className="space-y-2">
                                <h4 className="font-semibold text-lg">
                                    Full Description
                                </h4>
                                <div
                                    className="text-muted-foreground leading-relaxed prose prose-sm max-w-none"
                                    dangerouslySetInnerHTML={{
                                        __html: product.fullDescription,
                                    }}
                                />
                            </div>
                        )}

                        {/* Categories */}
                        {product.categories &&
                            product.categories.length > 0 && (
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-muted-foreground text-sm">
                                        <Tag className="size-4" />
                                        <span className="font-semibold text-foreground">
                                            Categories
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {product.categories.map((cat) => (
                                            <Badge
                                                key={cat.categoryId}
                                                variant="secondary"
                                            >
                                                {cat.category.name}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}

                        {/* Variants */}
                        {product.productVariant &&
                            product.productVariant.length > 0 && (
                                <div className="space-y-3">
                                    <h4 className="font-semibold text-lg">
                                        Product Variants
                                    </h4>
                                    {product.productVariant.map((variant) => (
                                        <div
                                            key={variant.id}
                                            className="space-y-2 p-3 rounded-lg border bg-muted/30"
                                        >
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium">
                                                    {variant.name}
                                                </span>
                                                {variant.isRequired && (
                                                    <Badge
                                                        variant="outline"
                                                        className="text-xs"
                                                    >
                                                        Required
                                                    </Badge>
                                                )}
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {variant.options.map(
                                                    (option, idx) => (
                                                        <div
                                                            key={
                                                                option.id || idx
                                                            }
                                                            className="px-3 py-1.5 rounded-md bg-background border text-sm"
                                                        >
                                                            <span className="font-medium">
                                                                {option.name}
                                                            </span>
                                                            {option.extraPrice &&
                                                                option.extraPrice >
                                                                    0 && (
                                                                    <span className="text-muted-foreground ml-2">
                                                                        +৳
                                                                        {
                                                                            option.extraPrice
                                                                        }
                                                                    </span>
                                                                )}
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                        {/* Keywords */}
                        {product.keywords && (
                            <div className="space-y-2">
                                <h4 className="font-semibold text-sm text-muted-foreground">
                                    Keywords
                                </h4>
                                <p className="text-sm text-muted-foreground">
                                    {product.keywords}
                                </p>
                            </div>
                        )}
                    </div>
                </DialogContainer>

                <DialogFooter>
                    <DialogClose>
                        <Button>Close</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
