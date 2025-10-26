import { useState } from "react";
import { ChevronDown, Settings } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@workspace/ui/components/popover";
import { Badge } from "@workspace/ui/components/badge";
import { ProductVariant } from "@/types/product-type";
import { OrderItem } from "@/types/order-type";

interface VariantSelectorProps {
    product: {
        id: string;
        name: string;
        productVariant: ProductVariant[];
    };
    orderItem: OrderItem;
    onVariantChange: (
        itemId: string,
        selectedVariants: OrderItem["selectedVariants"]
    ) => void;
}

export const VariantSelector = ({
    product,
    orderItem,
    onVariantChange,
}: VariantSelectorProps) => {
    const [isOpen, setIsOpen] = useState(false);

    // Initialize selected variants from orderItem or create empty selections
    const [selectedVariants, setSelectedVariants] = useState<
        OrderItem["selectedVariants"]
    >(orderItem.selectedVariants || []);

    const handleVariantOptionSelect = (
        variantId: string,
        variantName: string,
        optionId: string,
        optionName: string,
        extraPrice: number
    ) => {
        const newSelectedVariants = selectedVariants?.filter(
            (v) => v.variantId !== variantId
        );

        newSelectedVariants?.push({
            variantId,
            variantName,
            optionId,
            optionName,
            extraPrice,
        });

        setSelectedVariants(newSelectedVariants);
        onVariantChange(orderItem.id, newSelectedVariants);
    };

    const handleVariantOptionDeselect = (variantId: string) => {
        const newSelectedVariants = selectedVariants?.filter(
            (v) => v.variantId !== variantId
        );

        setSelectedVariants(newSelectedVariants);
        onVariantChange(orderItem.id, newSelectedVariants);
    };

    const getSelectedOptionForVariant = (variantId: string) => {
        return selectedVariants?.find((v) => v.variantId === variantId);
    };

    const getTotalExtraPrice = () => {
        return selectedVariants?.reduce(
            (sum, variant) => sum + variant.extraPrice,
            0
        );
    };

    const hasRequiredVariants = () => {
        const requiredVariants = product.productVariant.filter(
            (v) => v.isRequired
        );
        return requiredVariants.every((variant) =>
            selectedVariants?.some((sv) => sv.variantId === variant.id)
        );
    };

    const getDisplayText = () => {
        if (selectedVariants?.length === 0) {
            return "Select variants";
        }

        const variantTexts = selectedVariants?.map(
            (v) => `${v.variantName}: ${v.optionName}`
        );
        return variantTexts?.join(", ") || "";
    };

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    className="h-8 text-xs justify-between min-w-[120px] max-w-[200px]"
                >
                    <span className="truncate">{getDisplayText()}</span>
                    <ChevronDown className="h-3 w-3 ml-1 flex-shrink-0" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-4" align="start">
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <Settings className="h-4 w-4" />
                        <h3 className="font-medium">Product Variants</h3>
                    </div>

                    <div className="space-y-3 max-h-[30dvh] scrollbar-thin overflow-y-auto">
                        {product.productVariant.map((variant) => {
                            const selectedOption = getSelectedOptionForVariant(
                                variant.id
                            );

                            return (
                                <div key={variant.id} className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <label className="text-sm font-medium">
                                            {variant.name}
                                            {variant.isRequired && (
                                                <span className="text-red-500 ml-1">
                                                    *
                                                </span>
                                            )}
                                        </label>
                                        {selectedOption && (
                                            <Badge
                                                variant="secondary"
                                                className="text-xs"
                                            >
                                                {selectedOption.optionName}
                                                {selectedOption.extraPrice >
                                                    0 && (
                                                    <span className="ml-1">
                                                        (+৳
                                                        {
                                                            selectedOption.extraPrice
                                                        }
                                                        )
                                                    </span>
                                                )}
                                            </Badge>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-2 gap-2">
                                        {variant.options.map((option) => (
                                            <Button
                                                key={option.id}
                                                variant={
                                                    selectedOption?.optionId ===
                                                    option.id
                                                        ? "default"
                                                        : "outline"
                                                }
                                                size="sm"
                                                className="h-8 text-xs justify-start"
                                                onClick={() => {
                                                    if (
                                                        selectedOption?.optionId ===
                                                        option.id
                                                    ) {
                                                        handleVariantOptionDeselect(
                                                            variant.id
                                                        );
                                                    } else {
                                                        handleVariantOptionSelect(
                                                            variant.id,
                                                            variant.name,
                                                            option.id!,
                                                            option.name,
                                                            option.extraPrice ||
                                                                0
                                                        );
                                                    }
                                                }}
                                            >
                                                {option.name}
                                                {option.extraPrice &&
                                                    option.extraPrice > 0 && (
                                                        <span className="ml-1 text-xs opacity-70">
                                                            (+৳
                                                            {option.extraPrice})
                                                        </span>
                                                    )}
                                            </Button>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {selectedVariants?.length &&
                        selectedVariants?.length > 0 && (
                            <div className="border-t pt-3">
                                <div className="flex items-center justify-between text-sm">
                                    <span>Total Extra Price:</span>
                                    <span className="font-medium">
                                        ৳
                                        {getTotalExtraPrice()?.toLocaleString() ||
                                            0}
                                    </span>
                                </div>
                            </div>
                        )}

                    {!hasRequiredVariants() && (
                        <div className="text-xs text-red-500">
                            Please select all required variants
                        </div>
                    )}
                </div>
            </PopoverContent>
        </Popover>
    );
};
