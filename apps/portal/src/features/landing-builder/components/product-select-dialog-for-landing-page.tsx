import { EmptyErrorLoadingHandler } from "@/components/shared/empty-error-loading-handler";
import { CustomButton } from "@/components/ui/custom-button";
import { ProductSelectionCard } from "@/features/products/product-selection-card";
import useGetUser from "@/hooks/useGetUser";
import { useGetProductsQuery } from "@/redux/api/product-api";
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
    const user = useGetUser();
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

                <EmptyErrorLoadingHandler
                    isLoading={isLoading}
                    isError={isError}
                    isEmpty={data?.data.length === 0}
                >
                    <DialogContainer className="space-y-4 flex flex-wrap gap-4">
                        {data?.data.map((product) => (
                            <ProductSelectionCard
                                key={product.id}
                                product={product}
                                isSelected={selectedProductId === product.id}
                                onSelect={(pId) => setSelectedProductId(pId)}
                            />
                        ))}
                    </DialogContainer>
                </EmptyErrorLoadingHandler>
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
