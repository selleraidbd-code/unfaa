"use client";

import { useState } from "react";

import { ProductCardSkeleton, ProductSelectionCard } from "@/features/create-order/product-selection-card";
import { useGetProductsQuery } from "@/redux/api/product-api";
import { useAppSelector } from "@/redux/store/hook";
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
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
} from "@workspace/ui/components/drawer";
import { ScrollArea } from "@workspace/ui/components/scroll-area";
import { useBreakpoint } from "@workspace/ui/hooks/use-breakpoint";
import { Package } from "lucide-react";

import { Product } from "@/types/product-type";
import { CustomPagination, PaginationMeta } from "@/components/ui/custom-pagination";
import { DataStateHandler } from "@/components/shared/data-state-handler";

interface ProductSelectionModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSelectProduct: (product: Product) => void;
}

export const ProductSelectionModal = ({ open, onOpenChange, onSelectProduct }: ProductSelectionModalProps) => {
    const user = useAppSelector((state) => state.auth.user);
    const isMobile = useBreakpoint();
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const { data, isLoading, isError } = useGetProductsQuery({
        page: currentPage,
        limit: 20,
        shopSlug: user?.shop?.slug || "",
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

    const content = (
        <>
            {/* Search */}
            <CustomSearch
                onSearch={handleSearch}
                placeholder="Search products by name, category, or SKU..."
                className="md:w-full"
                autoFocus={false}
            />

            <DataStateHandler
                data={products}
                isLoading={isLoading}
                loadingComponent={
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        {Array.from({ length: 6 }).map((_, index) => (
                            <ProductCardSkeleton key={index} />
                        ))}
                    </div>
                }
                isError={isError}
                isEmpty={products.length === 0}
                emptyDescription={searchTerm ? "No products found matching your search" : "No products found"}
            >
                {(products) => (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
        </>
    );

    if (isMobile) {
        return (
            <Drawer open={open} onOpenChange={onOpenChange}>
                <DrawerContent>
                    <DrawerHeader className="pb-0">
                        <DrawerTitle className="pb-0 text-left">Select Product</DrawerTitle>
                        <DrawerDescription className="sr-only">
                            Choose a product from your inventory or search for a specific one.
                        </DrawerDescription>
                    </DrawerHeader>

                    <ScrollArea className="flex-1 overflow-auto">
                        <div className="space-y-4 p-4">{content}</div>
                    </ScrollArea>
                </DrawerContent>
            </Drawer>
        );
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="flex flex-col md:max-w-4xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Package className="h-5 w-5" />
                        Select Product
                    </DialogTitle>
                    <DialogDescription>
                        Choose a product from your inventory or search for a specific one.
                    </DialogDescription>
                </DialogHeader>

                <DialogContainer className="space-y-4">{content}</DialogContainer>
            </DialogContent>
        </Dialog>
    );
};
