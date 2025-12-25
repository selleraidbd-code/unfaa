"use client";

import Image from "next/image";

import { Badge } from "@workspace/ui/components/badge";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { Check, DollarSign, ImageIcon, Package, Package2, ShoppingCart, Tag } from "lucide-react";

import { Product } from "@/types/product-type";

interface ProductSelectionCardProps {
    product: Product;
    onSelectProduct: (product: Product) => void;
    currentProductId?: string;
}

export const ProductSelectionCard = ({ product, onSelectProduct, currentProductId }: ProductSelectionCardProps) => {
    const isSelected = product.id === currentProductId;
    const productImage = product.images?.[0] || product.photoURL;

    return (
        <div
            className={`group relative cursor-pointer overflow-hidden rounded-lg border bg-white transition-all duration-200 hover:shadow-md ${
                isSelected
                    ? "border-primary ring-primary/20 shadow-md ring-2"
                    : "hover:border-primary/40 border-gray-200"
            }`}
            onClick={() => onSelectProduct(product)}
        >
            {/* Selection indicator */}
            {isSelected && (
                <div className="bg-primary absolute top-2 right-2 z-10 flex h-6 w-6 items-center justify-center rounded-full shadow-md">
                    <Check className="h-3.5 w-3.5 text-white" />
                </div>
            )}

            <div className="flex gap-3 p-3">
                {/* Product Image */}
                <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                    {productImage ? (
                        <Image src={productImage} alt={product.name} fill className="object-cover" sizes="80px" />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center">
                            <ImageIcon className="h-8 w-8 text-gray-400" />
                        </div>
                    )}
                </div>

                {/* Product Info */}
                <div className="flex min-w-0 flex-1 flex-col justify-between">
                    {/* Title and Category */}
                    <div>
                        <h3 className="mb-1 truncate text-sm font-semibold text-gray-900">{product.name}</h3>
                        {product.categories && product.categories.length > 0 && (
                            <Badge variant="secondary" className="h-5 px-2 py-0.5 text-xs">
                                {product.categories[0]?.category?.name || "No category"}
                            </Badge>
                        )}
                    </div>

                    {/* Price and Stock */}
                    <div className="mt-2 flex items-center gap-3">
                        <div className="flex items-center gap-1">
                            <DollarSign className="h-3.5 w-3.5 text-green-600" />
                            <span className="text-sm font-bold text-green-700">{product.price || "0"}</span>
                        </div>
                        <div className="h-3 w-px bg-gray-300" />
                        <div className="flex items-center gap-1">
                            <Package2 className="h-3.5 w-3.5 text-gray-500" />
                            <span
                                className={`text-xs font-medium ${
                                    (product.stock || 0) > 10
                                        ? "text-green-600"
                                        : (product.stock || 0) > 0
                                          ? "text-yellow-600"
                                          : "text-red-600"
                                }`}
                            >
                                {product.stock || 0}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Selected Overlay Indicator */}
            {isSelected && <div className="bg-primary/5 pointer-events-none absolute inset-0" />}
        </div>
    );
};

interface SelectedProductCardProps {
    product: Product;
    className?: string;
}

export const SelectedProductCard = ({ product, className }: SelectedProductCardProps) => {
    const productImage = product.images?.[0] || product.photoURL;

    return (
        <div
            className={`from-primary/10 to-primary/5 border-primary/40 rounded-lg border-2 bg-gradient-to-br p-4 shadow-md ${className}`}
        >
            <div className="mb-3 flex items-center gap-2">
                <div className="bg-primary/20 rounded-md p-1.5">
                    <ShoppingCart className="text-primary h-4 w-4" />
                </div>
                <Badge variant="default" className="bg-primary px-2 py-0.5 text-xs">
                    Currently Selected
                </Badge>
            </div>

            <div className="flex gap-3">
                {/* Product Image */}
                <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md bg-white">
                    {productImage ? (
                        <Image src={productImage} alt={product.name} fill className="object-cover" sizes="64px" />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center">
                            <ImageIcon className="h-6 w-6 text-gray-400" />
                        </div>
                    )}
                </div>

                {/* Product Info */}
                <div className="min-w-0 flex-1">
                    <h3 className="mb-2 truncate text-base font-bold text-gray-900">{product.name}</h3>
                    <div className="flex flex-wrap gap-x-3 gap-y-1.5 text-sm">
                        <div className="flex items-center gap-1.5">
                            <DollarSign className="h-3.5 w-3.5 text-green-600" />
                            <span className="font-semibold text-green-700">${product.price || "Not set"}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Package2 className="h-3.5 w-3.5 text-blue-600" />
                            <span className="font-semibold text-blue-700">{product.stock || 0} units</span>
                        </div>
                        {product.categories && product.categories.length > 0 && (
                            <Badge variant="secondary" className="h-5 px-2 text-xs">
                                {product.categories[0]?.category?.name || "No category"}
                            </Badge>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export const ProductCardSkeleton = () => {
    return (
        <div className="rounded-lg border border-gray-200 bg-white p-3">
            <div className="flex gap-3">
                {/* Image Skeleton */}
                <Skeleton className="h-20 w-20 flex-shrink-0 rounded-lg" />

                {/* Content Skeleton */}
                <div className="flex flex-1 flex-col justify-between">
                    <div>
                        <Skeleton className="mb-2 h-4 w-32" />
                        <Skeleton className="h-5 w-20 rounded" />
                    </div>
                    <div className="flex items-center gap-3">
                        <Skeleton className="h-4 w-12" />
                        <Skeleton className="h-4 w-12" />
                    </div>
                </div>
            </div>
        </div>
    );
};
