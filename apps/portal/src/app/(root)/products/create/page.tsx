"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";

import { DiscardAndSaveButton } from "@/features/products/create/discard-and-save-button";
import { ProductFormType, VariantCard } from "@/features/products/create/variant-card";
import { createProductSchema } from "@/features/products/product-schema";
import { useGetBrandsQuery } from "@/redux/api/brand-api";
import { useGetCategoriesQuery } from "@/redux/api/category-api";
import { useGetDeliveriesQuery } from "@/redux/api/delivery-api";
import { useCreateProductMutation } from "@/redux/api/product-api";
import { useAppSelector } from "@/redux/store/hook";
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
import { toast } from "@workspace/ui/components/sonner";
import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";

import { ProductCeratePayload } from "@/types/product-type";
import { loadDraft } from "@/lib/product-draft-utils";
import { useProductDraft } from "@/hooks/useProductDraft";
import { HeaderBackButton } from "@/components/ui/custom-back-button";
import { Editor } from "@/components/editor";
import { PhotoGridUpload } from "@/components/file-upload/photo-grid-upload";

const AddProduct = () => {
    const user = useAppSelector((state) => state.auth.user);
    const shopId = user?.shop.id || "";
    const router = useRouter();

    // Load draft data synchronously for form initialization
    const draftData = loadDraft();
    const defaultValues: ProductFormType = draftData || {
        name: "",
        banglaName: "",
        price: 0,
        discountPrice: 0,
        photoURL: "",
        images: [],
        stock: 0,
        categoryIds: [],
        description: "",
        videoLink: "",
        fullDescription: "",
        productVariant: [],
        activeStatus: "active",
        deliveryId: undefined,
    };

    const form = useForm<ProductFormType>({
        resolver: zodResolver(createProductSchema),
        defaultValues,
    });

    console.log("form errors", form.formState.errors);

    // Initialize draft hook
    const { saveDraft, autoSave, debouncedAutoSave, clearDraft } = useProductDraft({
        form,
        silentAutoSave: true,
    });

    const { data } = useGetCategoriesQuery({
        shopId,
        limit: 100,
    });

    const { data: brands } = useGetBrandsQuery({
        shopId,
        limit: 100,
    });

    const { data: deliveries } = useGetDeliveriesQuery({
        shopId,
        limit: 100,
    });

    const categories = data?.data.map((category) => ({
        value: category.id,
        label: category.name,
    }));

    const brandOptions = brands?.data.map((brand) => ({
        value: brand.id,
        label: brand.name,
    }));

    const deliveryOptions =
        deliveries?.data?.map((delivery) => ({
            value: delivery.id,
            label: delivery.name,
        })) || [];

    const productVariants = form.watch("productVariant");

    // Auto-save handler for onBlur events (optimized - only saves when field loses focus)
    const handleFieldBlur = useCallback(() => {
        // Small delay to ensure form state is updated after blur
        setTimeout(() => {
            autoSave(form.getValues());
        }, 100);
    }, [form, autoSave]);

    const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();

    const handleAddVariant = () => {
        form.setValue("productVariant", [
            ...(form.getValues("productVariant") || []),
            {
                name: "",
                isRequired: false,
                productVariantOptions: [{ name: "", sku: "", extraPrice: 0, imgUrl: "" }],
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
        const payload: ProductCeratePayload = {
            shopId,
            ...data,
        };

        if (payload.productVariant.length === 0 && !payload.price) {
            toast.error("Price is required when there are no variants");
            return;
        }
        await createProduct(payload)
            .unwrap()
            .then(() => {
                toast.success("Product created successfully");
                clearDraft(); // Clear draft after successful creation
                form.reset();
                router.push("/products");
            })
            .catch(() => {
                toast.error("Failed to create Product");
            });
    };

    // Handle image changes with immediate auto-save
    const handlePhotoURLChange = useCallback(
        (url: string) => {
            form.setValue("photoURL", url);
            // Auto-save immediately for image changes
            setTimeout(() => autoSave(form.getValues()), 100);
        },
        [form, autoSave]
    );

    const handleImagesChange = useCallback(
        (images: string[]) => {
            form.setValue("images", images);
            // Auto-save immediately for image changes
            setTimeout(() => autoSave(form.getValues()), 100);
        },
        [form, autoSave]
    );

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} onBlur={handleFieldBlur} className="grid gap-4">
                <div className="flex items-center gap-4">
                    <HeaderBackButton title="Back to Products" href="/products" />

                    <DiscardAndSaveButton
                        form={form}
                        isCreating={isCreating}
                        onSaveDraft={saveDraft}
                        className="hidden sm:ml-auto sm:flex"
                    />
                </div>

                <div className="grid gap-4">
                    <CustomCollapsible
                        title="General Information"
                        content={
                            <div className="grid gap-x-6 gap-y-4 pt-2 md:grid-cols-2">
                                <CustomFormInput
                                    label="Product Name (English)"
                                    name="name"
                                    control={form.control}
                                    required
                                    placeholder="Enter Your name"
                                />
                                <CustomFormInput
                                    label="Product Name (Display Name)"
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
                        title="Product Images"
                        content={
                            <div className="max-w-6xl space-y-2 sm:pt-2">
                                {form.formState.errors.photoURL && (
                                    <p className="text-red-500">{form.formState.errors.photoURL.message}</p>
                                )}
                                {form.formState.errors.images && (
                                    <p className="text-red-500">{form.formState.errors.images.message}</p>
                                )}
                                <PhotoGridUpload
                                    photoURL={form.watch("photoURL")}
                                    images={form.watch("images")}
                                    onPhotoURLChange={handlePhotoURLChange}
                                    onImagesChange={handleImagesChange}
                                />
                            </div>
                        }
                    />

                    <CustomCollapsible
                        title="Price & Inventory"
                        content={
                            <div className="grid gap-x-6 gap-y-4 pt-2 md:grid-cols-2">
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
                            <div className="grid gap-4 pt-1 md:gap-6">
                                <p className="text-muted-foreground">
                                    You can add multiple variant for a single product here. Like Size, Color, and Weight
                                    etc.
                                </p>

                                {productVariants.map((variant, index) => (
                                    <VariantCard
                                        key={index}
                                        index={index}
                                        variant={variant}
                                        deleteVariant={() => handleDeleteVariant(index)}
                                        form={form}
                                    />
                                ))}

                                <Button onClick={handleAddVariant} variant="accent" className="w-fit" type="button">
                                    <Plus className="size-4" />
                                    Add New Variant
                                </Button>
                            </div>
                        }
                    />

                    <CustomCollapsible
                        title="Product Details"
                        content={
                            <div className="grid gap-x-6 gap-y-4 pt-2 md:grid-cols-2">
                                <CustomFormSearchSelect
                                    label="Delivery Charge"
                                    name="deliveryId"
                                    control={form.control}
                                    options={deliveryOptions}
                                    placeholder="Select delivery charge"
                                />

                                <CustomFormTextarea
                                    label="Video Link"
                                    name="videoLink"
                                    rows={2}
                                    control={form.control}
                                    placeholder="Enter Your video link"
                                />

                                <div className="col-span-2 space-y-2.5">
                                    <Label className="title">Short Description (SEO & Data Feed)</Label>
                                    <Editor
                                        content={form.watch("description")}
                                        onChange={(content) => {
                                            form.setValue("description", content);
                                            // Use debounced auto-save for editor
                                            debouncedAutoSave(form.getValues());
                                        }}
                                    />

                                    {form.formState.errors.description && (
                                        <p className="text-red-500">{form.formState.errors.description.message}</p>
                                    )}
                                </div>
                                <div className="col-span-2 space-y-2.5">
                                    <Label className="title">Product Description</Label>
                                    <Editor
                                        content={form.watch("fullDescription")}
                                        onChange={(content) => {
                                            form.setValue("fullDescription", content);
                                            // Use debounced auto-save for editor
                                            debouncedAutoSave(form.getValues());
                                        }}
                                    />

                                    {form.formState.errors.fullDescription && (
                                        <p className="text-red-500">{form.formState.errors.fullDescription.message}</p>
                                    )}
                                </div>
                            </div>
                        }
                    />
                </div>

                <DiscardAndSaveButton
                    form={form}
                    isCreating={isCreating}
                    onSaveDraft={saveDraft}
                    className="flex justify-end border-t p-4"
                />
            </form>
        </Form>
    );
};

export default AddProduct;
