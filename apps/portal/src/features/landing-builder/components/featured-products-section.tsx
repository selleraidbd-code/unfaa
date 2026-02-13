"use client";

import Image from "next/image";
import { Button } from "@workspace/ui/components/button";
import { Package, Plus, X } from "lucide-react";

export type FeaturedProductItem = {
    id: string;
    name: string;
    photoURL: string | null;
};

type FeaturedProductsSectionProps = {
    selectedProducts: FeaturedProductItem[];
    onOpenSelectModal: () => void;
    onRemoveProduct: (productId: string) => void;
};

export const FeaturedProductsSection = ({
    selectedProducts,
    onOpenSelectModal,
    onRemoveProduct,
}: FeaturedProductsSectionProps) => {
    return (
        <div className="bg-card space-y-4 rounded-lg border p-4 lg:space-y-6 lg:p-6">
            <div>
                <h2 className="mb-2 text-lg font-semibold">Featured Products</h2>
                <p className="text-muted-foreground text-sm max-sm:hidden">
                    Select products to feature on your landing page
                </p>
            </div>

            {selectedProducts.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 text-center">
                    <div className="bg-muted mb-4 rounded-full p-4">
                        <Package className="text-muted-foreground h-8 w-8" />
                    </div>
                    <h3 className="mb-2 text-lg font-semibold">No featured products</h3>
                    <p className="text-muted-foreground mb-4 text-sm">
                        Add products to showcase on your landing page
                    </p>
                    <Button type="button" variant="outline" onClick={onOpenSelectModal}>
                        <Plus className="mr-2 h-4 w-4" />
                        Select Products
                    </Button>
                </div>
            ) : (
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <p className="text-muted-foreground text-sm">
                            {selectedProducts.length} product{selectedProducts.length !== 1 ? "s" : ""} selected
                        </p>
                        <Button type="button" variant="outline" size="sm" onClick={onOpenSelectModal}>
                            <Plus className="mr-2 h-4 w-4" />
                            Add More
                        </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                        {selectedProducts.map((product) => (
                            <div key={product.id} className="relative rounded-lg border p-3">
                                <button
                                    type="button"
                                    onClick={() => onRemoveProduct(product.id)}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90 absolute -top-2 -right-2 rounded-full p-1"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                                <div className="bg-muted relative mb-2 aspect-square w-full overflow-hidden rounded-md">
                                    <Image
                                        src={product.photoURL || "/placeholder.jpg"}
                                        alt={product.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <p className="line-clamp-2 text-sm font-medium">{product.name}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
