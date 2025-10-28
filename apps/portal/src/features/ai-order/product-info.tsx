"use client";

import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@workspace/ui/components/select";
import { Button } from "@workspace/ui/components/button";
import { ShoppingCart, Package } from "lucide-react";
import { useGetProductsQuery } from "@/redux/api/product-api";
import useGetUser from "@/hooks/useGetUser";
import { ProductState } from "@/features/ai-order/types";
import { Product } from "@/types/product-type";
import { useState } from "react";
import { ProductSelectionModal } from "./product-selection-modal";

interface Props {
    productState: ProductState;
    onProductStateChange: (newState: ProductState) => void;
}

export const ProductInfo = ({ productState, onProductStateChange }: Props) => {
    const user = useGetUser();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentProductIndex, setCurrentProductIndex] = useState(0);

    // Fetch products data inside the component
    const { data: productsData } = useGetProductsQuery({
        shopName: user?.shop?.name || "",
        limit: 1000, // Get all products for search
    });

    const handleProductChange = (
        index: number,
        field: keyof any | "availableVariants",
        value: string | number | any[]
    ) => {
        if (!productState) return;

        const newState = {
            ...productState,
            productInfo: productState.productInfo.map((product, i) =>
                i === index ? { ...product, [field]: value } : product
            ),
        };
        onProductStateChange(newState);
    };

    const handleVariantSelection = (index: number, variantId: string) => {
        if (!productState) return;

        const newState = {
            ...productState,
            productInfo: productState.productInfo.map((product, i) =>
                i === index
                    ? { ...product, selectedVariantId: variantId }
                    : product
            ),
        };
        onProductStateChange(newState);
    };

    const handleOpenModal = (index: number) => {
        setCurrentProductIndex(index);
        setIsModalOpen(true);
    };

    const handleSelectProduct = (product: Product) => {
        const index = currentProductIndex;
        handleProductChange(index, "selectedProductId", product.id);
        handleProductChange(index, "productId", product.id);
        handleProductChange(index, "productName", product.name);
        handleProductChange(
            index,
            "availableVariants",
            product.productVariant || []
        );
    };

    return (
        <>
            <Card>
                <CardHeader className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                        <ShoppingCart className="h-5 w-5" />
                        Product Information
                    </CardTitle>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenModal(0)}
                        className="flex items-center gap-2"
                    >
                        <Package className="h-4 w-4" />
                        Change Product
                    </Button>
                </CardHeader>

                <CardContent className="space-y-6">
                    {productState.productInfo.map((product, index) => (
                        <div
                            key={index}
                            className="border rounded-lg p-4 space-y-4"
                        >
                            <div className="flex items-center justify-between">
                                <h4 className="font-semibold">
                                    Product {index + 1}
                                </h4>
                                <div className="flex items-center gap-2">
                                    <Badge variant="secondary">
                                        {product.productQuantity}{" "}
                                        {product.productQuantity === 1
                                            ? "item"
                                            : "items"}
                                    </Badge>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label>Product Name</Label>
                                    <Input
                                        value={product.productName}
                                        onChange={(e) =>
                                            handleProductChange(
                                                index,
                                                "productName",
                                                e.target.value
                                            )
                                        }
                                    />
                                </div>
                                <div>
                                    <Label>Quantity</Label>
                                    <Input
                                        type="number"
                                        min="1"
                                        value={product.productQuantity}
                                        onChange={(e) =>
                                            handleProductChange(
                                                index,
                                                "productQuantity",
                                                parseInt(e.target.value) || 1
                                            )
                                        }
                                    />
                                </div>
                            </div>

                            {/* Variant Selection */}
                            {product.availableVariants &&
                                product.availableVariants.length > 0 && (
                                    <div>
                                        <Label>Product Variant</Label>
                                        <Select
                                            value={product.selectedVariantId}
                                            onValueChange={(value) =>
                                                handleVariantSelection(
                                                    index,
                                                    value
                                                )
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select variant (optional)" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {product.availableVariants.map(
                                                    (variant: any) =>
                                                        variant.options?.map(
                                                            (option: any) => (
                                                                <SelectItem
                                                                    key={
                                                                        option.id
                                                                    }
                                                                    value={
                                                                        option.id
                                                                    }
                                                                >
                                                                    {
                                                                        variant.name
                                                                    }
                                                                    :{" "}
                                                                    {
                                                                        option.name
                                                                    }
                                                                    {option.extraPrice
                                                                        ? ` (+$${option.extraPrice})`
                                                                        : ""}
                                                                </SelectItem>
                                                            )
                                                        )
                                                )}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}
                        </div>
                    ))}
                </CardContent>
            </Card>

            {isModalOpen && (
                <ProductSelectionModal
                    open={isModalOpen}
                    onOpenChange={setIsModalOpen}
                    onSelectProduct={handleSelectProduct}
                    currentProductId={
                        productState.productInfo[currentProductIndex]
                            ?.selectedProductId
                    }
                />
            )}
        </>
    );
};
