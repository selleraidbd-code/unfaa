import { DataStateHandler } from "@/components/shared/data-state-handler";
import { CustomButton } from "@/components/ui/custom-button";
import { ProductSelectionCard } from "@/features/products/product-selection-card";
import { useGetProductsQuery } from "@/redux/api/product-api";
import { useAppSelector } from "@/redux/store/hook";
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
import { toast } from "@workspace/ui/components/sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";

export const ProductSelectDialogForLandingPage = ({
    open,
    onClose,
}: {
    open: boolean;
    onClose?: () => void;
}) => {
    const router = useRouter();
    const user = useAppSelector((state) => state.auth.user);
    const [selectedProductId, setSelectedProductId] = useState<string>();

    const { data, isLoading, isError } = useGetProductsQuery({
        shopId: user?.shop.id,
    });

    const handleSaveAndSelectTemplate = () => {
        if (!selectedProductId) {
            toast.error("Please select a product");
            return;
        }
        router.push(`/landing-page/builder?productId=${selectedProductId}`);
        onClose?.();
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="md:max-w-4xl xl:max-w-5xl">
                <DialogHeader>
                    <DialogTitle>Select Product</DialogTitle>
                </DialogHeader>
                <DialogDescription>
                    Select a product to add to the landing page
                </DialogDescription>

                <DataStateHandler
                    data={data?.data}
                    isLoading={isLoading}
                    isError={isError}
                    isEmpty={data?.data.length === 0}
                >
                    {(products) => (
                        <DialogContainer className="space-y-4 flex flex-wrap gap-4">
                            {products.map((product) => (
                                <ProductSelectionCard
                                    key={product.id}
                                    product={product}
                                    isSelected={
                                        selectedProductId === product.id
                                    }
                                    onSelect={(pId) =>
                                        setSelectedProductId(pId)
                                    }
                                />
                            ))}
                        </DialogContainer>
                    )}
                </DataStateHandler>
                <DialogFooter>
                    <DialogClose asChild>
                        <CustomButton variant="outline">Cancel</CustomButton>
                    </DialogClose>
                    <CustomButton onClick={handleSaveAndSelectTemplate}>
                        Create Landing Page
                    </CustomButton>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
