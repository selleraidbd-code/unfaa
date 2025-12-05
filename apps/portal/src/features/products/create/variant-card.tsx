import { createProductSchema } from "@/features/products/product-schema";
import { Button } from "@workspace/ui/components/button";
import { CustomFormInput } from "@workspace/ui/components/custom/custom-form-input";
import { CustomFormSwitch } from "@workspace/ui/components/custom/custom-form-switch";
import { toast } from "@workspace/ui/components/sonner";
import { Plus, Trash2, X } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";

import { CustomFormImage } from "@/components/ui/custom-form-image";

export type ProductFormType = z.infer<typeof createProductSchema>;

interface VariantCardProps {
    variant: ProductFormType["productVariant"][number];
    deleteVariant: () => void;
    index: number;
    form: UseFormReturn<ProductFormType>;
}

export const VariantCard = ({ variant, deleteVariant, index, form }: VariantCardProps) => {
    const handleAddOption = () => {
        form.setValue(`productVariant.${index}.productVariantOptions`, [
            ...variant.productVariantOptions,
            { name: "", sku: "", extraPrice: 0, imgUrl: "" },
        ]);
    };

    const handleDeleteOption = (optionIndex: number) => {
        if (variant.productVariantOptions.length > 1) {
            form.setValue(
                `productVariant.${index}.productVariantOptions`,
                variant.productVariantOptions.filter((_, index) => index !== optionIndex)
            );
        } else {
            toast.error("At least one option is required for each variant");
        }
    };

    return (
        <div className="border-primary max-w-6xl rounded-lg border p-6">
            <div className="flex justify-between">
                <CustomFormSwitch
                    name={`productVariant.${index}.isRequired`}
                    control={form.control}
                    label="Make this variant mandatory"
                    labelClassName="text-base"
                    description="Toggle this on if you want your customer to select at
                        least one of the variant options"
                    parentClassName="justify-between max-w-[96%]"
                />
                <Button onClick={deleteVariant} variant="destructiveOutline" size="icon" type="button">
                    <Trash2 className="h-3.5 w-3.5" />
                </Button>
            </div>

            <CustomFormInput
                label="Title"
                name={`productVariant.${index}.name`}
                className="mb-4 pt-6"
                control={form.control}
                placeholder="Enter the name of the variant (e.g. Size, Color, Material, etc.)"
                required
            />

            {variant.productVariantOptions.map((_option, optionIndex) => (
                <div key={optionIndex} className="flex gap-6 pt-4">
                    <CustomFormInput
                        label="Name"
                        name={`productVariant.${index}.productVariantOptions.${optionIndex}.name`}
                        control={form.control}
                        placeholder="Enter variant option (e.g., Red, Large, Cotton)"
                        required
                    />
                    <CustomFormInput
                        label="SKU"
                        name={`productVariant.${index}.productVariantOptions.${optionIndex}.sku`}
                        control={form.control}
                        placeholder="Enter variant option (e.g., Red, Large, Cotton)"
                    />
                    <CustomFormInput
                        label="Extra Price"
                        name={`productVariant.${index}.productVariantOptions.${optionIndex}.extraPrice`}
                        control={form.control}
                        type="number"
                        placeholder="Enter the extra price of the variant"
                    />
                    <CustomFormImage
                        name={`productVariant.${index}.productVariantOptions.${optionIndex}.imgUrl`}
                        control={form.control}
                        label="Image"
                        className=""
                        limit={1}
                        isMinimal
                    />
                    <Button
                        onClick={() => handleDeleteOption(optionIndex)}
                        variant="destructiveOutline"
                        size="icon"
                        type="button"
                        className="mt-6"
                    >
                        <X />
                    </Button>
                </div>
            ))}

            <Button onClick={handleAddOption} variant="accent" className="mt-6 w-fit" type="button">
                <Plus className="size-4" />
                Add New Option
            </Button>
        </div>
    );
};
