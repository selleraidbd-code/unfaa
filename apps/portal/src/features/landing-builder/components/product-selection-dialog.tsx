"use client";

import { useState } from "react";

import { ProductSelectionCard } from "@/features/products/product-selection-card";
import { useGetProductsQuery } from "@/redux/api/product-api";
import { CustomSearch } from "@workspace/ui/components/custom/custom-search";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@workspace/ui/components/dialog";
import { ScrollArea } from "@workspace/ui/components/scroll-area";

import { Product } from "@/types/product-type";
import { CustomButton } from "@/components/ui/custom-button";
import { DataStateHandler } from "@/components/shared/data-state-handler";

type ProductSelectionDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    shopId: string;
    title?: string;
    description?: string;
    onSelect: (product: Product) => void;
    excludeProductIds?: string[];
    showSearch?: boolean;
    footerAction?: React.ReactNode;
};

export const ProductSelectionDialog = ({
    open,
    onOpenChange,
    shopId,
    title = "Select Product",
    description = "Choose a product",
    onSelect,
    excludeProductIds = [],
    showSearch = false,
    footerAction,
}: ProductSelectionDialogProps) => {
    const [searchTerm, setSearchTerm] = useState("");

    const {
        data: productsData,
        isLoading: productsLoading,
        isError: productsError,
    } = useGetProductsQuery({
        shopId: shopId || "",
        limit: 50,
        searchTerm: searchTerm || undefined,
    });

    const products = productsData?.data || [];
    const availableProducts = products.filter((p) => !excludeProductIds.includes(p.id));

    const handleProductSelect = (product: Product) => {
        onSelect(product);
        onOpenChange(false);
        setSearchTerm("");
    };

    const handleClose = () => {
        onOpenChange(false);
        setSearchTerm("");
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="lg:max-w-[810px]">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>

                {showSearch && (
                    <CustomSearch
                        onSearch={setSearchTerm}
                        placeholder="Search products by name..."
                        className="w-full"
                    />
                )}

                <ScrollArea className="max-h-[60vh]">
                    <DataStateHandler
                        data={availableProducts}
                        isLoading={productsLoading}
                        isError={productsError}
                        isEmpty={availableProducts.length === 0}
                        emptyDescription={
                            searchTerm ? "No products found matching your search" : "No products available"
                        }
                    >
                        {(products) => (
                            <div className="flex flex-wrap gap-4">
                                {products.map((product) => (
                                    <ProductSelectionCard
                                        key={product.id}
                                        product={product}
                                        onSelect={() => handleProductSelect(product)}
                                    />
                                ))}
                            </div>
                        )}
                    </DataStateHandler>
                </ScrollArea>

                <DialogFooter>
                    {footerAction || (
                        <CustomButton variant="outline" onClick={handleClose}>
                            Close
                        </CustomButton>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
