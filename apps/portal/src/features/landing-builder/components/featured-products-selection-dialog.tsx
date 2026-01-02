"use client";

import { useEffect, useState } from "react";

import { ProductSelectionCard } from "@/features/products/product-selection-card";
import { useGetProductsQuery } from "@/redux/api/product-api";
import { CustomSearch } from "@workspace/ui/components/custom/custom-search";
import {
    Dialog,
    DialogClose,
    DialogContainer,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@workspace/ui/components/dialog";
import { ScrollArea } from "@workspace/ui/components/scroll-area";

import { CustomButton } from "@/components/ui/custom-button";
import { DataStateHandler } from "@/components/shared/data-state-handler";

type FeaturedProductsSelectionDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    selectedProductIds: string[];
    onSelectionChange: (productIds: string[]) => void;
    shopId: string;
};

export const FeaturedProductsSelectionDialog = ({
    open,
    onOpenChange,
    selectedProductIds,
    onSelectionChange,
    shopId,
}: FeaturedProductsSelectionDialogProps) => {
    const [productSearchTerm, setProductSearchTerm] = useState("");
    const [tempSelectedIds, setTempSelectedIds] = useState<string[]>(selectedProductIds);

    const {
        data: productsData,
        isLoading: productsLoading,
        isError: productsError,
    } = useGetProductsQuery({
        shopId: shopId || "",
        limit: 50,
        searchTerm: productSearchTerm || undefined,
    });

    const products = productsData?.data || [];

    // Sync temp selection with prop when dialog opens
    useEffect(() => {
        if (open) {
            setTempSelectedIds(selectedProductIds);
        }
    }, [open, selectedProductIds]);

    const handleToggleProductSelection = (productId: string) => {
        if (tempSelectedIds.includes(productId)) {
            setTempSelectedIds(tempSelectedIds.filter((id) => id !== productId));
        } else {
            setTempSelectedIds([...tempSelectedIds, productId]);
        }
    };

    const handleSave = () => {
        onSelectionChange(tempSelectedIds);
        onOpenChange(false);
        setProductSearchTerm("");
    };

    const handleCancel = () => {
        setTempSelectedIds(selectedProductIds);
        onOpenChange(false);
        setProductSearchTerm("");
    };

    return (
        <Dialog open={open} onOpenChange={handleCancel}>
            <DialogContent className="lg:max-w-4xl">
                <DialogHeader>
                    <DialogTitle>Select Featured Products</DialogTitle>
                    <DialogDescription>Choose products to feature on your landing page</DialogDescription>
                </DialogHeader>

                <CustomSearch
                    onSearch={setProductSearchTerm}
                    placeholder="Search products by name..."
                    className="w-full"
                />

                <ScrollArea className="max-h-[60vh]">
                    <DataStateHandler
                        data={products}
                        isLoading={productsLoading}
                        isError={productsError}
                        isEmpty={products.length === 0}
                        emptyDescription={
                            productSearchTerm ? "No products found matching your search" : "No products available"
                        }
                    >
                        {(productsData) => (
                            <DialogContainer className="flex flex-wrap gap-4 py-4">
                                {productsData.map((product) => (
                                    <ProductSelectionCard
                                        key={product.id}
                                        product={product}
                                        isSelected={tempSelectedIds.includes(product.id)}
                                        onSelect={() => handleToggleProductSelection(product.id)}
                                    />
                                ))}
                            </DialogContainer>
                        )}
                    </DataStateHandler>
                </ScrollArea>

                <DialogFooter>
                    <DialogClose asChild>
                        <CustomButton variant="outline" onClick={handleCancel}>
                            Cancel
                        </CustomButton>
                    </DialogClose>
                    <CustomButton onClick={handleSave}>Save ({tempSelectedIds.length} selected)</CustomButton>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
