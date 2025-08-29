"use client";

import { useGetCategoriesQuery } from "@/redux/api/category-api";
import { Plus, Trash2, X } from "lucide-react";

import { Editor } from "@/components/editor";
import { HeaderBackButton } from "@/components/ui/custom-back-button";
import { CustomButton } from "@/components/ui/custom-button";
import { CustomFormImage } from "@/components/ui/custom-form-image";
import { productSchema } from "@/features/products/product-schema";
import useGetUser from "@/hooks/useGetUser";
import { useGetBrandsQuery } from "@/redux/api/brand-api";
import { useCreateProductMutation } from "@/redux/api/product-api";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@workspace/ui/components/button";
import { CustomCollapsible } from "@workspace/ui/components/custom/custom-collapsible";
import { CustomFormInput } from "@workspace/ui/components/custom/custom-form-input";
import { CustomFormSearchMultiSelect } from "@workspace/ui/components/custom/custom-form-search-multi-select";
import { CustomFormSearchSelect } from "@workspace/ui/components/custom/custom-form-search-select";
import { CustomFormSwitch } from "@workspace/ui/components/custom/custom-form-switch";
import { CustomFormTextarea } from "@workspace/ui/components/custom/custom-form-textarea";
import { Form } from "@workspace/ui/components/form";
import { Label } from "@workspace/ui/components/label";
import { useForm, UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

export type ProductFormType = z.infer<typeof productSchema>;

const AddProduct = () => {
    const user = useGetUser();

    const form = useForm<ProductFormType>({
        resolver: zodResolver(productSchema),
        defaultValues: {
            name: "",
            banglaName: "",
            price: 0,
            discountPrice: 0,
            photoURL: "",
            images: [],
            keywords: "",
            stock: 0,
            categoryIds: [],
            description: "",
            fullDescription: "",
            productVariant: [],
            activeStatus: "active",
        },
    });

    const { data } = useGetCategoriesQuery({
        shopId: user?.shop.id,
    });
    const { data: brands } = useGetBrandsQuery({
        shopId: user?.shop.id,
    });

    const categories = data?.data.map((category) => ({
        value: category.id,
        label: category.name,
    }));

    const brandOptions = brands?.data.map((brand) => ({
        value: brand.id,
        label: brand.name,
    }));

    const productVariants = form.watch("productVariant");

    const [createProduct, { isLoading: isCreating }] =
        useCreateProductMutation();

    const handleAddVariant = () => {
        form.setValue("productVariant", [
            ...(form.getValues("productVariant") || []),
            {
                title: "",
                options: [{ name: "", sku: "", extraPrice: 0, imageURL: "" }],
            },
        ]);
    };

    const handleDeleteVariant = (index: number) => {
        if (productVariants) {
            productVariants.splice(index, 1);
            form.setValue("productVariant", productVariants);
        }
    };

    const onSubmit = async (data: ProductFormType) => {
        const payload = {
            ...data,
            images: [data.photoURL],
            productVariant: data.productVariant.map((variant) => ({
                ...variant,
            })),
            shopId: user?.shop.id,
        };

        if (payload.productVariant.length === 0 && !payload.price) {
            toast.error("Price is required when there are no variants");
            return;
        }
        await createProduct(payload)
            .unwrap()
            .then(() => {
                toast.success("Product created successfully");
                // form.reset();
                // router.push("/products");
            })
            .catch(() => {
                toast.error("Failed to create passage");
            });
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
                <div className="flex items-center gap-4">
                    <HeaderBackButton
                        title="Back to Products"
                        href="/products"
                    />

                    <div className="hidden items-center gap-2 md:ml-auto md:flex">
                        <CustomButton href="/products" variant="outline">
                            Discard
                        </CustomButton>
                        <CustomButton
                            disabled={form.formState.isSubmitting}
                            isLoading={isCreating}
                            type="submit"
                        >
                            Save Product
                        </CustomButton>
                    </div>
                </div>

                <div className="grid gap-4">
                    <CustomCollapsible
                        title="General Information"
                        content={
                            <div className="grid pt-2 grid-cols-2 gap-x-6 gap-y-4">
                                <CustomFormInput
                                    label="Product Name (English)"
                                    name="name"
                                    control={form.control}
                                    required
                                    placeholder="Enter Your name"
                                />
                                <CustomFormInput
                                    label="Product Name (Bangla)"
                                    name="banglaName"
                                    control={form.control}
                                    required
                                    placeholder="Enter Your name"
                                />

                                <CustomFormSearchMultiSelect
                                    label="Category"
                                    name="categoryIds"
                                    required
                                    control={form.control}
                                    options={categories || []}
                                />

                                <CustomFormSearchSelect
                                    label="Brand"
                                    name="brandId"
                                    control={form.control}
                                    options={brandOptions || []}
                                />

                                <CustomFormSwitch
                                    label="Show in Website - "
                                    name="activeStatus"
                                    control={form.control}
                                    valueMapping={{
                                        true: "active",
                                        false: "inactive",
                                    }}
                                />
                            </div>
                        }
                    />

                    <CustomCollapsible
                        title="Media"
                        content={
                            <div className="grid pt-2 gap-4">
                                <CustomFormImage
                                    name="photoURL"
                                    control={form.control}
                                    required
                                    label="Product Images"
                                    limit={6}
                                />
                            </div>
                        }
                    />

                    <CustomCollapsible
                        title="Price & Inventory"
                        content={
                            <div className="grid pt-2 grid-cols-2 gap-x-6 gap-y-4">
                                <CustomFormInput
                                    label="Sell / Current Price"
                                    name="discountPrice"
                                    type="number"
                                    min={0}
                                    control={form.control}
                                    placeholder="Enter Your  current price"
                                />
                                <CustomFormInput
                                    label="Regular / Old Price"
                                    name="price"
                                    type="number"
                                    min={0}
                                    control={form.control}
                                    placeholder="Enter Your regular price"
                                />
                                <CustomFormInput
                                    label="Quantity ( Stock )"
                                    name="stock"
                                    type="number"
                                    min={0}
                                    control={form.control}
                                    placeholder="Enter Your stock quantity"
                                    required
                                />
                                <CustomFormInput
                                    label="SKU / Product Code"
                                    name="sku"
                                    type="text"
                                    control={form.control}
                                    placeholder="Enter Your SKU / Product Code"
                                />
                                <CustomFormInput
                                    label="Unit Name"
                                    name="unitName"
                                    type="text"
                                    control={form.control}
                                    placeholder="Enter Your unit name (e.g. kg, g, ml, l, etc.)"
                                />
                                <CustomFormInput
                                    label="Warranty"
                                    name="warranty"
                                    type="text"
                                    control={form.control}
                                    placeholder="Enter Your warranty (e.g. 1 year)"
                                />
                            </div>
                        }
                    />

                    <CustomCollapsible
                        title="Product Variants"
                        content={
                            <div className="grid pt-1 gap-6">
                                <p className="text-muted-foreground">
                                    You can add multiple variant for a single
                                    product here. Like Size, Color, and Weight
                                    etc.
                                </p>

                                {productVariants.map((variant, index) => (
                                    <VariantCard
                                        key={index}
                                        index={index}
                                        variant={variant}
                                        deleteVariant={() =>
                                            handleDeleteVariant(index)
                                        }
                                        form={form}
                                    />
                                ))}

                                <Button
                                    onClick={handleAddVariant}
                                    variant="accent"
                                    className="w-fit"
                                    type="button"
                                >
                                    <Plus className="size-4" />
                                    Add New Variant
                                </Button>
                            </div>
                        }
                    />

                    <CustomCollapsible
                        title="Product Details"
                        content={
                            <div className="grid pt-2 grid-cols-2 gap-x-6 gap-y-4">
                                <CustomFormTextarea
                                    label="Short Description (SEO & Data Feed)"
                                    name="description"
                                    rows={5}
                                    control={form.control}
                                    placeholder="Enter Your description"
                                    required
                                    className="col-span-2"
                                />
                                <div className="col-span-2 space-y-2.5">
                                    <Label className="title">
                                        Product Description
                                    </Label>
                                    <Editor
                                        content={form.watch("fullDescription")}
                                        onChange={(content) => {
                                            form.setValue(
                                                "fullDescription",
                                                content
                                            );
                                        }}
                                    />
                                </div>
                                <CustomFormTextarea
                                    label="Keywords ( For SEO )"
                                    name="keywords"
                                    rows={3}
                                    control={form.control}
                                    placeholder="Enter Your keywords"
                                    required
                                    className="col-span-2"
                                />
                            </div>
                        }
                    />
                </div>

                <div className="flex border-t p-4 items-center justify-end gap-2 md:hidden">
                    <CustomButton
                        href="/products"
                        variant="outline"
                        type="button"
                    >
                        Discard
                    </CustomButton>
                    <CustomButton
                        disabled={form.formState.isSubmitting}
                        isLoading={isCreating}
                        type="submit"
                    >
                        Save Product
                    </CustomButton>
                </div>
            </form>
        </Form>
    );
};

export default AddProduct;

const VariantCard = ({
    variant,
    deleteVariant,
    index,
    form,
}: {
    variant: ProductFormType["productVariant"][number];
    deleteVariant: () => void;
    index: number;
    form: UseFormReturn<ProductFormType>;
}) => {
    const handleAddOption = () => {
        form.setValue(`productVariant.${index}.options`, [
            ...variant.options,
            { name: "", sku: "", extraPrice: 0, imageURL: "" },
        ]);
    };

    const handleDeleteOption = (optionIndex: number) => {
        form.setValue(
            `productVariant.${index}.options`,
            variant.options.filter((_, index) => index !== optionIndex)
        );
    };

    return (
        <div className="border rounded-lg max-w-6xl p-6 border-primary">
            <div className="flex justify-between">
                <CustomFormSwitch
                    name={`productVariant.${index}.isMandatory`}
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
                name={`productVariant.${index}.title`}
                className="pt-6 mb-4"
                control={form.control}
                placeholder="Enter the name of the variant (e.g. Size, Color, Material, etc.)"
                required
            />

            {variant.options.map((_option, optionIndex) => (
                <div key={optionIndex} className="flex  gap-6 pt-4">
                    <CustomFormInput
                        label="Name"
                        name={`productVariant.${index}.options.${optionIndex}.name`}
                        control={form.control}
                        placeholder="Enter variant option (e.g., Red, Large, Cotton)"
                        required
                    />
                    <CustomFormInput
                        label="SKU"
                        name={`productVariant.${index}.options.${optionIndex}.sku`}
                        control={form.control}
                        placeholder="Enter variant option (e.g., Red, Large, Cotton)"
                    />
                    <CustomFormInput
                        label="Extra Price"
                        name={`productVariant.${index}.options.${optionIndex}.extraPrice`}
                        control={form.control}
                        type="number"
                        placeholder="Enter the extra price of the variant"
                    />
                    <CustomFormImage
                        name={`productVariant.${index}.options.${optionIndex}.imageURL`}
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
