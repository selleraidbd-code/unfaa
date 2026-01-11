import { useState } from "react";
import { useRouter } from "next/navigation";

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
import { Settings, Sparkles } from "lucide-react";

import { CustomButton } from "@/components/ui/custom-button";
import { DataStateHandler } from "@/components/shared/data-state-handler";

type ModeType = "easy" | "advanced" | null;

export const ProductSelectDialogForLandingPage = ({ open, onClose }: { open: boolean; onClose?: () => void }) => {
    const router = useRouter();
    const user = useAppSelector((state) => state.auth.user);
    const [selectedMode, setSelectedMode] = useState<ModeType>(null);
    const [selectedProductId, setSelectedProductId] = useState<string>();

    const { data, isLoading, isError } = useGetProductsQuery({
        shopId: user?.shop.id,
        limit: 50,
    });

    const handleSaveAndSelectTemplate = () => {
        if (!selectedProductId) {
            toast.error("Please select a product");
            return;
        }
        if (!selectedMode) {
            toast.error("Please select a mode");
            return;
        }
        router.push(`/landing-page/builder?productId=${selectedProductId}&mode=${selectedMode}`);
        onClose?.();
    };

    // Show mode selection first
    if (!selectedMode) {
        return (
            <Dialog open={open} onOpenChange={onClose}>
                <DialogContent className="md:max-w-3xl">
                    <DialogHeader>
                        <DialogTitle>Choose Your Building Mode</DialogTitle>
                        <DialogDescription>Select how you want to create your landing page</DialogDescription>
                    </DialogHeader>

                    <DialogContainer className="grid grid-cols-1 gap-4 py-4 sm:grid-cols-2">
                        <button
                            type="button"
                            onClick={() => setSelectedMode("easy")}
                            disabled={false}
                            className="group border-border bg-card hover:border-primary hover:bg-accent/50 focus:ring-primary disabled:hover:border-border disabled:hover:bg-card relative flex flex-col items-center justify-center rounded-lg border-2 p-8 transition-all focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 disabled:grayscale"
                        >
                            <div className="bg-primary/10 group-hover:bg-primary/20 disabled:group-hover:bg-primary/10 mb-4 rounded-full p-4 transition-colors">
                                <Sparkles className="text-primary h-8 w-8" />
                            </div>
                            <h3 className="mb-2 text-lg font-semibold">Easy</h3>
                            <p className="text-muted-foreground text-center text-sm">
                                Quick and simple template-based creation with guided steps
                            </p>
                        </button>

                        <button
                            type="button"
                            onClick={() => setSelectedMode("advanced")}
                            disabled={true}
                            className="group border-border bg-card hover:border-primary hover:bg-accent/50 focus:ring-primary disabled:hover:border-border disabled:hover:bg-card relative flex flex-col items-center justify-center rounded-lg border-2 p-8 transition-all focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 disabled:grayscale"
                        >
                            <div className="bg-primary/10 group-hover:bg-primary/20 disabled:group-hover:bg-primary/10 mb-4 rounded-full p-4 transition-colors">
                                <Settings className="text-primary h-8 w-8" />
                            </div>
                            <h3 className="mb-2 text-lg font-semibold">Advanced</h3>
                            <p className="text-muted-foreground text-center text-sm">
                                Full control with custom components and advanced customization options
                            </p>
                        </button>
                    </DialogContainer>

                    <DialogFooter>
                        <DialogClose asChild>
                            <CustomButton variant="outline">Cancel</CustomButton>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        );
    }

    // Show product selection after mode is selected
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="md:max-w-4xl xl:max-w-5xl">
                <DialogHeader>
                    <DialogTitle>Select Product</DialogTitle>
                    <DialogDescription>
                        Select a product to add to the landing page ({selectedMode === "easy" ? "Easy" : "Advanced"}{" "}
                        mode)
                    </DialogDescription>
                </DialogHeader>

                <DataStateHandler
                    data={data?.data}
                    isLoading={isLoading}
                    isError={isError}
                    isEmpty={data?.data.length === 0}
                >
                    {(products) => (
                        <DialogContainer className="flex flex-wrap gap-4 space-y-4">
                            {products.map((product) => (
                                <ProductSelectionCard
                                    key={product.id}
                                    product={product}
                                    isSelected={selectedProductId === product.id}
                                    onSelect={(pId) => setSelectedProductId(pId)}
                                />
                            ))}
                        </DialogContainer>
                    )}
                </DataStateHandler>
                <DialogFooter>
                    <CustomButton variant="outline" onClick={() => setSelectedMode(null)}>
                        Back
                    </CustomButton>
                    <DialogClose asChild>
                        <CustomButton variant="outline">Cancel</CustomButton>
                    </DialogClose>
                    <CustomButton onClick={handleSaveAndSelectTemplate}>Create Landing Page</CustomButton>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
