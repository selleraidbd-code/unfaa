"use client";

import { DataStateHandler } from "@/components/shared/data-state-handler";
import {
    CustomPagination,
    PaginationMeta,
} from "@/components/ui/custom-pagination";
import {
    ProductCardSkeleton,
    ProductSelectionCard,
    SelectedProductCard,
} from "@/features/ai-order/product-card";
import useGetUser from "@/hooks/useGetUser";
import { useGetProductsQuery } from "@/redux/api/product-api";
import { Product } from "@/types/product-type";
import { Button } from "@workspace/ui/components/button";
import { CustomSearch } from "@workspace/ui/components/custom/custom-search";
import {
    Dialog,
    DialogContainer,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@workspace/ui/components/dialog";
import { Package } from "lucide-react";
import { useState } from "react";

interface ProductSelectionModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSelectProduct: (product: Product) => void;
}

export const ProductSelectionModal = ({
    open,
    onOpenChange,
    onSelectProduct,
}: ProductSelectionModalProps) => {
    const user = useGetUser();
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const { data, isLoading, isError } = useGetProductsQuery({
        page: currentPage,
        limit: 20,
        shopName: user?.shop?.name || "",
        searchTerm: searchTerm || undefined,
    });

    const handleSearch = (value: string) => {
        setSearchTerm(value);
        setCurrentPage(1);
    };

    const handleSelectProduct = (product: Product) => {
        onSelectProduct(product);
        onOpenChange(false);
    };

    const products = data?.data || [];
    const paginationMeta: PaginationMeta = {
        page: currentPage,
        limit: 20,
        total: data?.meta?.total || 0,
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="md:max-w-4xl flex flex-col">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Package className="h-5 w-5" />
                        Select Product
                    </DialogTitle>
                    <DialogDescription>
                        Choose a product from your inventory or search for a
                        specific one.
                    </DialogDescription>
                </DialogHeader>

                <DialogContainer className="space-y-4">
                    {/* Search */}
                    <CustomSearch
                        onSearch={handleSearch}
                        placeholder="Search products by name, category, or SKU..."
                        className="md:w-full"
                    />

                    <DataStateHandler
                        data={products}
                        isLoading={isLoading}
                        loadingComponent={
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {Array.from({ length: 6 }).map((_, index) => (
                                    <ProductCardSkeleton key={index} />
                                ))}
                            </div>
                        }
                        isError={isError}
                        isEmpty={products.length === 0}
                        emptyDescription={
                            searchTerm
                                ? "No products found matching your search"
                                : "No products found"
                        }
                    >
                        {(products) => (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {products.map((product) => (
                                    <ProductSelectionCard
                                        key={product.id}
                                        product={product}
                                        onSelectProduct={handleSelectProduct}
                                        currentProductId={undefined}
                                    />
                                ))}
                            </div>
                        )}
                    </DataStateHandler>
                </DialogContainer>

                <DialogFooter>
                    {/* Pagination */}
                    {products.length > 0 && (
                        <CustomPagination
                            paginationMeta={paginationMeta}
                            showRowSelection={false}
                            showRowsPerPage={false}
                            showPageCount={false}
                            onPageChange={setCurrentPage}
                            className="w-full justify-center"
                        />
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
