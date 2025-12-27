"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { AddNewVariants } from "@/features/products/add-new-variants";
import { updateProductSchema } from "@/features/products/product-schema";
import { useGetBrandsQuery } from "@/redux/api/brand-api";
import { useGetCategoriesQuery } from "@/redux/api/category-api";
import {
    useDeleteProductVariantMutation,
    useGetProductByIdQuery,
    useUpdateProductMutation,
    useUpdateProductVariantMutation,
} from "@/redux/api/product-api";
import { useAppSelector } from "@/redux/store/hook";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@workspace/ui/components/button";
import { CustomCollapsible } from "@workspace/ui/components/custom/custom-collapsible";
import { CustomFormInput } from "@workspace/ui/components/custom/custom-form-input";
import { CustomFormSearchMultiSelect } from "@workspace/ui/components/custom/custom-form-search-multi-select";
import { CustomFormSearchSelect } from "@workspace/ui/components/custom/custom-form-search-select";
import { CustomFormSwitch } from "@workspace/ui/components/custom/custom-form-switch";
import { CustomFormTextarea } from "@workspace/ui/components/custom/custom-form-textarea";
import { CustomLoading } from "@workspace/ui/components/custom/custom-loading";
import { Form } from "@workspace/ui/components/form";
import { Label } from "@workspace/ui/components/label";
import { toast } from "@workspace/ui/components/sonner";
import { cn } from "@workspace/ui/lib/utils";
import { Pencil, Plus, Save, Trash2, X } from "lucide-react";
import { useForm, UseFormReturn } from "react-hook-form";
import { z } from "zod";

import { ProductVariantUpdate } from "@/types/product-type";
import { getChangedFields } from "@/lib/get-changes-fields";
import { useAlert } from "@/hooks/useAlert";
import { HeaderBackButton } from "@/components/ui/custom-back-button";
import { CustomButton } from "@/components/ui/custom-button";
import { CustomFormImage } from "@/components/ui/custom-form-image";
import { CustomFormImages } from "@/components/ui/custom-form-images";
import { Editor } from "@/components/editor";

type UpdateProductFormType = z.infer<typeof updateProductSchema>;

const EditProduct = () => {
    const router = useRouter();
    const { id } = useParams();
    const { fire } = useAlert();
    const productId = id as string;
    const user = useAppSelector((state) => state.auth.user);
    const shopId = user?.shop.id || "";

    const { data: product, isLoading: isLoadingProduct } = useGetProductByIdQuery({
        id: productId,
    });

    const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
    const [deleteProductVariant, { isLoading: isDeletingVariant }] = useDeleteProductVariantMutation();

    const form = useForm<UpdateProductFormType>({
        resolver: zodResolver(updateProductSchema),
        values: product?.data
            ? {
                  name: product.data.name || "",
                  banglaName: product.data.banglaName || "",
                  price: product.data.price || 0,
                  discountPrice: product.data.discountPrice || 0,
                  photoURL: product.data.photoURL || "",
                  images: product.data.images || [],
                  keywords: product.data.keywords || "",
                  stock: product.data.stock || 0,
                  categoryIds: product?.data?.categories?.map((category) => category.categoryId) || [],
                  description: product.data.description || "",
                  videoLink: product.data.videoLink || "",
                  fullDescription: product.data.fullDescription || "",
                  productVariant:
                      product.data.productVariant?.map((variant) => ({
                          id: variant.id || "",
                          name: variant.name,
                          isRequired: false,
                          productVariantOptions: variant.options.map((option) => ({
                              id: option.id || "",
                              name: option.name,
                              sku: option.sku || "",
                              extraPrice: option.extraPrice || 0,
                              imgUrl: option.imgUrl || "",
                          })),
                      })) || [],
                  activeStatus: product.data.activeStatus || "active",
                  brandId: product.data.brandId || "",
                  sku: product.data.sku || "",
                  unitName: product.data.unitName || "",
                  warranty: product.data.warranty || "",
              }
            : undefined,
    });

    const { data } = useGetCategoriesQuery({
        shopId,
        limit: 100,
    });

    const { data: brands } = useGetBrandsQuery({
        shopId,
        limit: 100,
    });

    const brandOptions = brands?.data.map((brand) => ({
        value: brand.id,
        label: brand.name,
    }));

    const categories = data?.data.map((category) => ({
        value: category.id,
        label: category.name,
    }));

    // Helper function to get original product data in the same format as form
    const getOriginalProductData = (): UpdateProductFormType | null => {
        if (!product?.data) return null;

        return {
            name: product.data.name || "",
            banglaName: product.data.banglaName || "",
            price: product.data.price || 0,
            discountPrice: product.data.discountPrice || 0,
            photoURL: product.data.photoURL || "",
            images: product.data.images || [],
            keywords: product.data.keywords || "",
            stock: product.data.stock || 0,
            categoryIds: product?.data?.categories?.map((category) => category.categoryId) || [],
            description: product.data.description || "",
            videoLink: product.data.videoLink || "",
            fullDescription: product.data.fullDescription || "",
            productVariant:
                product.data.productVariant?.map((variant) => ({
                    id: variant.id || "",
                    name: variant.name,
                    isRequired: false,
                    productVariantOptions: variant.options.map((option) => ({
                        id: option.id || "",
                        name: option.name,
                        sku: option.sku || "",
                        extraPrice: option.extraPrice || 0,
                        imgUrl: option.imgUrl || "",
                    })),
                })) || [],
            activeStatus: product.data.activeStatus || "active",
            brandId: product.data.brandId || "",
            sku: product.data.sku || "",
            unitName: product.data.unitName || "",
            warranty: product.data.warranty || "",
        };
    };

    const onSubmit = async (data: UpdateProductFormType) => {
        // Get original product data for comparison
        const originalData = getOriginalProductData();

        if (!originalData) {
            toast.error("Unable to determine changes. Please refresh the page.");
            return;
        }

        // Get only the changed fields using our custom comparison
        const changedFields = getChangedFields(originalData, data);

        // Check if there are any changes
        if (Object.keys(changedFields).length === 0) {
            toast.info("You haven't made any changes");
            return;
        }

        const payload = {
            ...changedFields,
            productVariant: undefined,
        };

        await updateProduct({ id: productId, payload })
            .unwrap()
            .then(() => {
                toast.success("Product updated successfully");
                form.reset();
                router.push("/products");
            })
            .catch(() => {
                toast.error("Failed to update product");
            });
    };

    if (isLoadingProduct) {
        return <CustomLoading />;
    }

    const productVariants = form.watch("productVariant");

    const handleDeleteVariant = async (index: number) => {
        const variant = productVariants[index];
        if (!variant) return toast.error("Product Variant not found");
        const variantId = variant.id || "";

        fire({
            title: "Delete Product Variant",
            description: "Are you sure you want to delete this product variant?",
            onConfirm: async () => {
                await deleteProductVariant({ id: variantId })
                    .unwrap()
                    .then(() => {
                        if (productVariants) {
                            productVariants.splice(index, 1);
                            form.setValue("productVariant", productVariants);
                        }
                        toast.success("Product variant deleted successfully");
                    })
                    .catch(() => {
                        toast.error("Failed to delete product variant");
                    });
            },
        });
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
                <div className="flex items-center gap-4">
                    <HeaderBackButton title="Back to Products" href="/products" />

                    <DiscardAndSaveButton form={form} isUpdating={isUpdating} className="hidden md:ml-auto md:flex" />
                </div>

                <div className="grid gap-4">
                    <CustomCollapsible
                        title="General Information"
                        content={
                            <div className="grid grid-cols-2 gap-x-6 gap-y-4 pt-2">
                                <CustomFormInput
                                    label="Product Name (English)"
                                    name="name"
                                    control={form.control}
                                    required
                                    placeholder="Enter Your name"
                                />
                                <CustomFormInput
                                    label="Product Name (Native) "
                                    name="banglaName"
                                    control={form.control}
                                    required
                                    placeholder="Enter Your name"
                                />

                                <CustomFormSearchMultiSelect
                                    label="Category"
                                    name="categoryIds"
                                    control={form.control}
                                    options={categories || []}
                                    required
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
                            <div className="grid gap-4 pt-2">
                                <CustomFormImage
                                    name="photoURL"
                                    control={form.control}
                                    required
                                    label="Main Image"
                                    limit={1}
                                />
                                <CustomFormImages
                                    name="images"
                                    control={form.control}
                                    required
                                    label="Product Images"
                                    limit={5}
                                />
                            </div>
                        }
                    />

                    <CustomCollapsible
                        title="Price & Inventory"
                        content={
                            <div className="grid grid-cols-2 gap-x-6 gap-y-4 pt-2">
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
                            <div className="grid gap-6 pt-1">
                                <p className="text-muted-foreground">
                                    You can add multiple variant for a single product here. Like Size, Color, and Weight
                                    etc.
                                </p>

                                {productVariants?.map((variant, index) => (
                                    <VariantCard
                                        key={index}
                                        index={index}
                                        variant={variant}
                                        deleteVariant={() => handleDeleteVariant(index)}
                                        form={form}
                                        isDeletingVariant={isDeletingVariant}
                                    />
                                ))}

                                {product?.data && <AddNewVariants productId={productId} />}
                            </div>
                        }
                    />

                    <CustomCollapsible
                        title="Product Details"
                        content={
                            <div className="grid grid-cols-2 gap-x-6 gap-y-4 pt-2">
                                <CustomFormInput
                                    label="Video Link"
                                    name="videoLink"
                                    type="url"
                                    control={form.control}
                                    placeholder="Enter Your video link"
                                />

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
                                    <Label className="title">Product Description</Label>
                                    <Editor
                                        content={form.watch("fullDescription") || product?.data?.fullDescription}
                                        onChange={(content) => {
                                            form.setValue("fullDescription", content);
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

                <DiscardAndSaveButton form={form} isUpdating={isUpdating} className="flex justify-end border-t p-4" />
            </form>
        </Form>
    );
};

export default EditProduct;

const VariantCard = ({
    variant,
    deleteVariant,
    index,
    form,
    isDeletingVariant,
}: {
    variant: UpdateProductFormType["productVariant"][number];
    deleteVariant: () => void;
    index: number;
    form: UseFormReturn<UpdateProductFormType>;
    isDeletingVariant: boolean;
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [updateProductVariant, { isLoading: isUpdatingVariant }] = useUpdateProductVariantMutation();

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
                variant.productVariantOptions.filter((_, idx) => idx !== optionIndex)
            );
        } else {
            toast.error("At least one option is required for each variant");
        }
    };

    const onSubmit = async () => {
        const variantId = variant.id || "";
        if (!variantId) {
            toast.error("These are not a valid variant");
            return;
        }
        const payload: ProductVariantUpdate = {
            name: variant.name,
            isRequired: variant.isRequired,
            options: variant.productVariantOptions.map((option) => ({
                id: option.id,
                productVariantId: variantId,
                name: option.name,
                sku: option.sku,
                extraPrice: option.extraPrice,
                imgUrl: option.imgUrl,
            })),
        };

        await updateProductVariant({ id: variantId, payload })
            .unwrap()
            .then(() => {
                toast.success("Product variant updated successfully");
                setIsEditing(false);
            })
            .catch(() => {
                toast.error("Failed to update product variant");
            });
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
                    disabled={!isEditing}
                />
                <Button
                    onClick={deleteVariant}
                    disabled={isDeletingVariant}
                    variant="destructiveOutline"
                    size="icon"
                    type="button"
                >
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
                disabled={!isEditing}
            />

            {variant.productVariantOptions.map((_option, optionIndex) => (
                <div key={optionIndex} className="flex gap-6 pt-4">
                    <CustomFormInput
                        label="Name"
                        name={`productVariant.${index}.productVariantOptions.${optionIndex}.name`}
                        control={form.control}
                        placeholder="Enter variant option (e.g., Red, Large, Cotton)"
                        required
                        disabled={!isEditing}
                    />
                    <CustomFormInput
                        label="SKU"
                        name={`productVariant.${index}.productVariantOptions.${optionIndex}.sku`}
                        control={form.control}
                        placeholder="Enter variant option (e.g., Red, Large, Cotton)"
                        disabled={!isEditing}
                    />
                    <CustomFormInput
                        label="Extra Price"
                        name={`productVariant.${index}.productVariantOptions.${optionIndex}.extraPrice`}
                        control={form.control}
                        type="number"
                        placeholder="Enter the extra price of the variant"
                        disabled={!isEditing}
                    />
                    {isEditing && (
                        <CustomFormImage
                            name={`productVariant.${index}.productVariantOptions.${optionIndex}.imgUrl`}
                            control={form.control}
                            label="Image"
                            className=""
                            limit={1}
                            isMinimal
                        />
                    )}
                    <Button
                        onClick={() => handleDeleteOption(optionIndex)}
                        variant="destructiveOutline"
                        size="icon"
                        type="button"
                        className="mt-6"
                        disabled={!isEditing}
                    >
                        <X />
                    </Button>
                </div>
            ))}

            <div className={cn("flex items-center", isEditing ? "justify-between" : "justify-end")}>
                {isEditing && (
                    <Button onClick={handleAddOption} variant="accent" className="mt-6 w-fit" type="button">
                        <Plus className="size-4" />
                        Add New Option
                    </Button>
                )}

                {isEditing ? (
                    <div className="flex items-center gap-4">
                        <Button
                            onClick={() => setIsEditing(false)}
                            className="mt-6 w-fit"
                            type="button"
                            variant="outline"
                        >
                            <X className="size-4" />
                            Cancel
                        </Button>
                        <CustomButton
                            onClick={onSubmit}
                            className="mt-6 w-fit"
                            type="button"
                            isLoading={isUpdatingVariant}
                        >
                            <Save className="size-4" />
                            Save Changes
                        </CustomButton>
                    </div>
                ) : (
                    <Button onClick={() => setIsEditing(true)} className="mt-6 w-fit" type="button">
                        <Pencil className="size-4" />
                        Edit Variants
                    </Button>
                )}
            </div>
        </div>
    );
};

const DiscardAndSaveButton = ({
    form,
    isUpdating,
    className,
}: {
    form: UseFormReturn<UpdateProductFormType>;
    isUpdating: boolean;
    className?: string;
}) => {
    return (
        <div className={cn("items-center gap-2", className)}>
            <CustomButton
                href="/products"
                variant="outline"
                type="button"
                disabled={form.formState.isSubmitting || isUpdating}
            >
                Discard
            </CustomButton>
            <CustomButton isLoading={form.formState.isSubmitting || isUpdating} type="submit">
                Save Product
            </CustomButton>
        </div>
    );
};
