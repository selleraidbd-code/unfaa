import { DataStateHandler } from "@/components/shared/data-state-handler";
import { CustomButton } from "@/components/ui/custom-button";
import { ProductSelectionCard } from "@/features/products/product-selection-card";
import useGetUser from "@/hooks/useGetUser";
import { useGetProductsQuery } from "@/redux/api/product-api";
import { useUpdateShopThemeSectionProductsMutation } from "@/redux/api/shop-theme-api";
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
    DialogTrigger,
} from "@workspace/ui/components/dialog";
import { useState } from "react";
import { toast } from "@workspace/ui/components/sonner";

export const SelectProductDialog = ({
    shopThemeId,
    shopSectionId,
    productIds,
    open,
    setOpen,
}: {
    shopThemeId: string;
    shopSectionId: string;
    productIds: string[];
    open: boolean;
    setOpen: (open: boolean) => void;
}) => {
    const user = useGetUser();
    const shopId = user?.shop.id;
    const [selectedProducts, setSelectedProducts] =
        useState<string[]>(productIds);

    const [searchTerm, setSearchTerm] = useState("");
    const { data, isLoading, isError } = useGetProductsQuery({
        shopId,
        limit: 20,
        searchTerm: searchTerm || undefined,
    });
    const products = data?.data || [];

    const [updateShopThemeSectionProducts, { isLoading: isUpdating }] =
        useUpdateShopThemeSectionProductsMutation();

    const handleSelectAndDeselect = (productId: string) => {
        if (selectedProducts.includes(productId)) {
            setSelectedProducts(
                selectedProducts.filter((id) => id !== productId)
            );
        } else {
            setSelectedProducts([...selectedProducts, productId]);
        }
    };

    const handleSaveAndClose = async () => {
        await updateShopThemeSectionProducts({
            shopThemeId,
            shopSectionId,
            productIds: selectedProducts,
        })
            .unwrap()
            .then(() => {
                toast.success("Products updated successfully");
                setOpen(false);
            })
            .catch((error) => {
                toast.error(error.data.message || "Something went wrong");
            });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <CustomButton>Select Product</CustomButton>
            </DialogTrigger>
            <DialogContent className="lg:max-w-4xl">
                <DialogHeader>
                    <DialogTitle>Select Product</DialogTitle>
                    <DialogDescription>
                        Select a product to add to the section
                    </DialogDescription>
                </DialogHeader>

                <CustomSearch
                    onSearch={setSearchTerm}
                    placeholder="Type product name and press enter"
                    className="md:w-full"
                />

                <DataStateHandler
                    data={products}
                    isLoading={isLoading}
                    isError={isError}
                    isEmpty={products.length === 0}
                >
                    {(productsData) => (
                        <DialogContainer className="space-y-4 flex flex-wrap gap-4">
                            {productsData.map((product) => (
                                <ProductSelectionCard
                                    key={product.id}
                                    product={product}
                                    isSelected={selectedProducts.includes(
                                        product.id
                                    )}
                                    onSelect={() =>
                                        handleSelectAndDeselect(product.id)
                                    }
                                />
                            ))}
                        </DialogContainer>
                    )}
                </DataStateHandler>

                <DialogFooter className="grid grid-cols-2 gap-4">
                    <DialogClose asChild>
                        <CustomButton variant="outline">Cancel</CustomButton>
                    </DialogClose>
                    <CustomButton
                        isLoading={isUpdating}
                        onClick={handleSaveAndClose}
                    >
                        Save & Close
                    </CustomButton>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
