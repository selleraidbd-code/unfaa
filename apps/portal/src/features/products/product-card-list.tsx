"use client";

import { Product } from "@/types/product-type";
import { ProductCard } from "./product-card";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { Card, CardContent } from "@workspace/ui/components/card";

interface ProductCardListProps {
    products: Product[];
    isLoading?: boolean;
    onDelete: (id: string) => void;
}

export const ProductCardList = ({
    products,
    isLoading,
    onDelete,
}: ProductCardListProps) => {
    if (isLoading) {
        return (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                {Array.from({ length: 10 }).map((_, i) => (
                    <ProductCardSkeleton key={i} />
                ))}
            </div>
        );
    }

    if (products.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="rounded-full bg-muted p-6 mb-4">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="48"
                        height="48"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-muted-foreground"
                    >
                        <circle cx="9" cy="21" r="1" />
                        <circle cx="20" cy="21" r="1" />
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                    </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">
                    No products found
                </h3>
                <p className="text-sm text-muted-foreground">
                    Try adjusting your filters or create a new product
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {products.map((product) => (
                <ProductCard
                    key={product.id}
                    product={product}
                    onDelete={onDelete}
                />
            ))}
        </div>
    );
};

const ProductCardSkeleton = () => {
    return (
        <Card className="overflow-hidden">
            <Skeleton className="aspect-square w-full" />
            <CardContent className="p-3 space-y-2">
                <Skeleton className="h-5 w-3/4" />
                <div className="flex justify-between items-center">
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-5 w-16" />
                </div>
                <div className="flex gap-1.5 pt-1">
                    <Skeleton className="h-8 flex-1" />
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-8 w-8" />
                </div>
            </CardContent>
        </Card>
    );
};
