"use client";

import Link from "next/link";
import { HomeIcon, Search } from "lucide-react";
import { Product } from "@/types/product-type";
import { ProductCard } from "@/features/home-page/product-card";

type SearchResultsPageProps = {
    products: Product[];
    searchQuery: string;
};

export const SearchResultsPage = ({
    products,
    searchQuery,
}: SearchResultsPageProps) => {
    return (
        <div className="container mx-auto px-4 py-6">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
                <HomeIcon className="w-4 h-4" />
                <Link href="#" className="hover:underline">
                    Home
                </Link>
                <span>/</span>
                <span>Search</span>
                <span>/</span>
                <span className="text-gray-700 font-medium">
                    "{searchQuery}"
                </span>
            </div>

            {/* Search Header */}
            <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                    <Search className="w-5 h-5 text-gray-600" />
                    <h1 className="text-2xl font-semibold text-gray-900">
                        Search Results
                    </h1>
                </div>
                <p className="text-gray-600">
                    {products.length > 0
                        ? `Found ${products.length} product${products.length === 1 ? "" : "s"} for "${searchQuery}"`
                        : `No products found for "${searchQuery}"`}
                </p>
            </div>

            {/* Results */}
            {products.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-4">
                    {products.map((product, index) => (
                        <ProductCard key={index} product={product} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-12">
                    <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No products found
                    </h3>
                    <p className="text-gray-500 mb-4">
                        Try searching with different keywords or check your
                        spelling.
                    </p>
                    <Link
                        href="/products"
                        className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
                    >
                        Browse All Products
                    </Link>
                </div>
            )}
        </div>
    );
};
