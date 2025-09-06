import { CustomFormImage } from "@/components/ui/custom-form-image";
import { productVariantSchema } from "@/features/products/product-schema";
import { useCreateProductVariantBulkMutation } from "@/redux/api/product-api";
import { ProductVariantBulkPayload } from "@/types/product-type";
import { Button } from "@workspace/ui/components/button";
import { CustomFormInput } from "@workspace/ui/components/custom/custom-form-input";
import { CustomFormSwitch } from "@workspace/ui/components/custom/custom-form-switch";
import {
    Dialog,
    DialogContainer,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@workspace/ui/components/dialog";
import { Plus, Trash2, X } from "lucide-react";
import { useState } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

type ProductVariantFormType = z.infer<typeof productVariantSchema>;

type ProductVariantsFormType = {
    variants: ProductVariantFormType[];
};

export const AddNewVariants = ({ productId }: { productId: string }) => {
    const [open, setOpen] = useState(false);
    const form = useForm<ProductVariantsFormType>({
        defaultValues: {
            variants: [
                {
                    name: "",
                    isRequired: false,
                    productVariantOptions: [
                        { name: "", sku: "", extraPrice: 0, imgUrl: "" },
                    ],
                },
            ],
        },
    });

    const [createProductVariantBulk, { isLoading: isCreatingVariantBulk }] =
        useCreateProductVariantBulkMutation();

    const productVariants = form.watch("variants");

    const handleDeleteVariant = (index: number) => {
        const currentVariants = form.getValues("variants");
        if (currentVariants.length > 1) {
            form.setValue(
                "variants",
                currentVariants.filter((_, i) => i !== index)
            );
        } else {
            toast.error("At least one variant is required");
        }
    };

    const handleAddVariant = () => {
        const currentVariants = form.getValues("variants");
        form.setValue("variants", [
            ...currentVariants,
            {
                name: "",
                isRequired: false,
                productVariantOptions: [
                    { name: "", sku: "", extraPrice: 0, imgUrl: "" },
                ],
            },
        ]);
    };

    const onSubmit = async () => {
        const data = form.getValues();
        const payload: ProductVariantBulkPayload[] = data.variants.map(
            (variant) => ({
                name: variant.name,
                isRequired: variant.isRequired,
                productId: productId,
                options: variant.productVariantOptions,
            })
        );

        await createProductVariantBulk({
            id: productId,
            payload,
        })
            .unwrap()
            .then((res) => {
                console.log("res", res);
                toast.success("Product variants created successfully");
                form.reset();
                setOpen(false);
            })
            .catch(() => {
                toast.error("Failed to create product variants");
            });
    };

    return (
        <Dialog onOpenChange={setOpen} open={open}>
            <DialogTrigger asChild>
                <Button className="w-fit" type="button">
                    <Plus className="size-4" />
                    Add New Variants
                </Button>
            </DialogTrigger>

            <DialogContent className="lg:max-w-5xl">
                <DialogHeader>
                    <DialogTitle>Add New Variants</DialogTitle>
                    <DialogDescription>
                        You can add new variants to the product here.
                    </DialogDescription>
                </DialogHeader>

                <DialogContainer className="space-y-6">
                    {productVariants.map((variant, index) => (
                        <VariantCard
                            key={index}
                            variantIndex={index}
                            variant={variant}
                            deleteVariant={() => handleDeleteVariant(index)}
                            form={form}
                        />
                    ))}
                </DialogContainer>
                <div className="flex justify-between items-center">
                    <Button
                        onClick={handleAddVariant}
                        variant="accent"
                        className="w-fit"
                        type="button"
                    >
                        <Plus className="size-4" />
                        Add Another Variant
                    </Button>

                    <Button
                        className="w-fit"
                        disabled={isCreatingVariantBulk}
                        onClick={onSubmit}
                    >
                        Save Variants
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

const VariantCard = ({
    variant,
    deleteVariant,
    variantIndex,
    form,
}: {
    variant: ProductVariantFormType;
    deleteVariant: () => void;
    variantIndex: number;
    form: UseFormReturn<ProductVariantsFormType>;
}) => {
    const handleAddOption = () => {
        const currentVariants = form.getValues("variants");
        const updatedVariants = [...currentVariants];
        const currentVariant = updatedVariants[variantIndex];
        if (currentVariant) {
            updatedVariants[variantIndex] = {
                ...currentVariant,
                productVariantOptions: [
                    ...currentVariant.productVariantOptions,
                    { name: "", sku: "", extraPrice: 0, imgUrl: "" },
                ],
            };
            form.setValue("variants", updatedVariants);
        }
    };

    const handleDeleteOption = (optionIndex: number) => {
        if (variant.productVariantOptions.length > 1) {
            const currentVariants = form.getValues("variants");
            const updatedVariants = [...currentVariants];
            const currentVariant = updatedVariants[variantIndex];
            if (currentVariant) {
                updatedVariants[variantIndex] = {
                    ...currentVariant,
                    productVariantOptions: variant.productVariantOptions.filter(
                        (_, index) => index !== optionIndex
                    ),
                };
                form.setValue("variants", updatedVariants);
            }
        } else {
            toast.error("At least one option is required for each variant");
        }
    };

    return (
        <div className="border rounded-lg max-w-6xl p-6 border-primary">
            <div className="flex justify-between">
                <CustomFormSwitch
                    name={`variants.${variantIndex}.isRequired`}
                    control={form.control}
                    label="Make this variant mandatory"
                    labelClassName="text-base"
                    description="Toggle this on if you want your customer to select at
                        least one of the variant options"
                    parentClassName="justify-between max-w-[96%]"
                />
                <Button
                    onClick={deleteVariant}
                    variant="destructiveOutline"
                    size="icon"
                    type="button"
                >
                    <Trash2 className="h-3.5 w-3.5" />
                </Button>
            </div>

            <CustomFormInput
                label="Title"
                name={`variants.${variantIndex}.name`}
                className="pt-6 mb-4"
                control={form.control}
                placeholder="Enter the name of the variant (e.g. Size, Color, Material, etc.)"
                required
            />

            {variant.productVariantOptions.map((_option, optionIndex) => (
                <div key={optionIndex} className="flex  gap-6 pt-4">
                    <CustomFormInput
                        label="Name"
                        name={`variants.${variantIndex}.productVariantOptions.${optionIndex}.name`}
                        control={form.control}
                        placeholder="Enter variant option (e.g., Red, Large, Cotton)"
                        required
                    />
                    <CustomFormInput
                        label="SKU"
                        name={`variants.${variantIndex}.productVariantOptions.${optionIndex}.sku`}
                        control={form.control}
                        placeholder="Enter variant option (e.g., Red, Large, Cotton)"
                    />
                    <CustomFormInput
                        label="Extra Price"
                        name={`variants.${variantIndex}.productVariantOptions.${optionIndex}.extraPrice`}
                        control={form.control}
                        type="number"
                        placeholder="Enter the extra price of the variant"
                    />
                    <CustomFormImage
                        name={`variants.${variantIndex}.productVariantOptions.${optionIndex}.imgUrl`}
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

            <Button
                onClick={handleAddOption}
                variant="accent"
                className="w-fit mt-6"
                type="button"
            >
                <Plus className="size-4" />
                Add New Option
            </Button>
        </div>
    );
};
