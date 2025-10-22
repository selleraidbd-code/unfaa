"use client";

import { ProductCard } from "@/features/shop/home-page/product-card";
import { getLink } from "@/lib/get-link";
import { Product } from "@/types/product-type";
import { Search } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

type SearchResultsPageProps = {
    products: Product[];
    searchQuery: string;
};

export const SearchResultsPage = ({
    products,
    searchQuery,
}: SearchResultsPageProps) => {
    const { domain } = useParams();
    return (
        <div className="container py-6 space-y-5 pb-12">
            <h1 className="text-xl font-semibold text-muted-foreground">
                Search Results for{" "}
                <span className="text-foreground">
                    &quot;{searchQuery}&quot;
                </span>
            </h1>

            {products.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {products.map((product, index) => (
                        <ProductCard
                            key={index}
                            product={product}
                            shopSlug={domain as string}
                        />
                    ))}
                </div>
            ) : (
                <div className="h-[60vh] center py-12">
                    <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">
                        No products found
                    </h3>
                    <p className="text-muted-foreground mb-4">
                        Try searching with different keywords or check your
                        spelling.
                    </p>
                    <Link
                        href={getLink({
                            shopSlug: domain as string,
                            path: "/products",
                        })}
                        className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                    >
                        Browse All Products
                    </Link>
                </div>
            )}
        </div>
    );
};
