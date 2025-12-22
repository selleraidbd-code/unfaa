"use client";

import { Product } from "@/types/product-type";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { Skeleton } from "@workspace/ui/components/skeleton";
import {
    Package,
    ShoppingCart,
    DollarSign,
    Package2,
    Tag,
    Check,
} from "lucide-react";

interface ProductSelectionCardProps {
    product: Product;
    onSelectProduct: (product: Product) => void;
    currentProductId?: string;
}

export const ProductSelectionCard = ({
    product,
    onSelectProduct,
    currentProductId,
}: ProductSelectionCardProps) => {
    const isSelected = product.id === currentProductId;

    return (
        <div
            className={`group relative bg-white border rounded-xl p-6 cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-[1.02] ${
                isSelected
                    ? "border-primary bg-gradient-to-br from-primary/5 to-primary/10 shadow-lg ring-2 ring-primary/30"
                    : "border-gray-200 hover:border-primary/50 hover:shadow-lg"
            }`}
            onClick={() => onSelectProduct(product)}
        >
            {/* Selection indicator */}
            {isSelected && (
                <div className="absolute -top-2 -right-2 w-7 h-7 bg-primary rounded-full flex items-center justify-center shadow-lg">
                    <Check className="w-4 h-4 text-white" />
                </div>
            )}

            <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                    {/* Product name and icon */}
                    <div className="flex items-center gap-3 mb-4">
                        <div
                            className={`p-3 rounded-xl transition-colors ${
                                isSelected
                                    ? "bg-primary/20 text-primary"
                                    : "bg-gray-100 text-gray-600 group-hover:bg-primary/10 group-hover:text-primary"
                            }`}
                        >
                            <Package className="h-5 w-5" />
                        </div>
                        <h3 className="font-semibold text-lg text-gray-900 truncate">
                            {product.name}
                        </h3>
                    </div>

                    {/* Product details */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-3 text-sm">
                            <div className="flex items-center gap-2">
                                <DollarSign className="h-4 w-4 text-green-600" />
                                <span className="text-gray-600 font-medium">
                                    Price
                                </span>
                            </div>
                            <span className="font-semibold text-green-700 text-base">
                                ${product.price || "Not set"}
                            </span>
                        </div>

                        <div className="flex items-center gap-3 text-sm">
                            <div className="flex items-center gap-2">
                                <Package2 className="h-4 w-4 text-blue-600" />
                                <span className="text-gray-600 font-medium">
                                    Stock
                                </span>
                            </div>
                            <span
                                className={`font-semibold text-base ${
                                    (product.stock || 0) > 10
                                        ? "text-green-700"
                                        : (product.stock || 0) > 0
                                          ? "text-yellow-700"
                                          : "text-red-700"
                                }`}
                            >
                                {product.stock || 0} units
                            </span>
                        </div>

                        {product.categories &&
                            product.categories.length > 0 && (
                                <div className="flex items-center gap-3 text-sm">
                                    <div className="flex items-center gap-2">
                                        <Tag className="h-4 w-4 text-purple-600" />
                                        <span className="text-gray-600 font-medium">
                                            Category
                                        </span>
                                    </div>
                                    <Badge
                                        variant="secondary"
                                        className="text-xs px-2 py-1"
                                    >
                                        {product.categories[0]?.category
                                            ?.name || "No category"}
                                    </Badge>
                                </div>
                            )}
                    </div>
                </div>

                <Button
                    size="sm"
                    variant={isSelected ? "default" : "outline"}
                    className={`ml-4 transition-all duration-200 ${
                        isSelected
                            ? "bg-primary hover:bg-primary/90 shadow-md"
                            : "hover:bg-primary hover:text-white hover:border-primary hover:shadow-md"
                    }`}
                >
                    {isSelected ? "Selected" : "Select"}
                </Button>
            </div>
        </div>
    );
};

interface SelectedProductCardProps {
    product: Product;
    className?: string;
}

export const SelectedProductCard = ({
    product,
    className,
}: SelectedProductCardProps) => {
    return (
        <div
            className={`bg-gradient-to-r from-primary/10 to-primary/5 border-2 border-primary/30 rounded-xl p-6 shadow-lg ${className}`}
        >
            <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-primary/20 rounded-lg">
                    <ShoppingCart className="h-5 w-5 text-primary" />
                </div>
                <Badge
                    variant="default"
                    className="text-xs px-3 py-1 bg-primary"
                >
                    Currently Selected
                </Badge>
            </div>

            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-900 mb-3">
                        {product.name}
                    </h3>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                            <DollarSign className="h-4 w-4 text-green-600" />
                            <span className="text-gray-600">Price:</span>
                            <span className="font-semibold text-green-700">
                                ${product.price || "Not set"}
                            </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                            <Package2 className="h-4 w-4 text-blue-600" />
                            <span className="text-gray-600">Stock:</span>
                            <span className="font-semibold text-blue-700">
                                {product.stock || 0} units
                            </span>
                        </div>
                        {product.categories &&
                            product.categories.length > 0 && (
                                <div className="flex items-center gap-2 text-sm">
                                    <Tag className="h-4 w-4 text-purple-600" />
                                    <span className="text-gray-600">
                                        Category:
                                    </span>
                                    <Badge
                                        variant="secondary"
                                        className="text-xs"
                                    >
                                        {product.categories[0]?.category
                                            ?.name || "No category"}
                                    </Badge>
                                </div>
                            )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export const ProductCardSkeleton = () => {
    return (
        <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                        <Skeleton className="h-11 w-11 rounded-xl" />
                        <Skeleton className="h-6 w-32" />
                    </div>
                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <Skeleton className="h-4 w-4" />
                            <Skeleton className="h-4 w-12" />
                            <Skeleton className="h-4 w-16" />
                        </div>
                        <div className="flex items-center gap-3">
                            <Skeleton className="h-4 w-4" />
                            <Skeleton className="h-4 w-12" />
                            <Skeleton className="h-4 w-20" />
                        </div>
                        <div className="flex items-center gap-3">
                            <Skeleton className="h-4 w-4" />
                            <Skeleton className="h-4 w-16" />
                            <Skeleton className="h-5 w-16 rounded" />
                        </div>
                    </div>
                </div>
                <Skeleton className="h-9 w-20 ml-4 rounded-lg" />
            </div>
        </div>
    );
};
