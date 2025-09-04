"use client";

import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { useGetCategoriesQuery } from "@/redux/api/category-api";
import {
  useGetProductByIdQuery,
  useUpdateProductMutation,
  useUpdateProductVariantMutation,
} from "@/redux/api/product-api";
import { PlusCircle, Trash2, Edit, Save, X, Plus } from "lucide-react";
import { useForm, UseFormReturn } from "react-hook-form";

import { Editor } from "@/components/editor";
import { productSchema } from "@/features/products/product-schema";
import useGetUser from "@/hooks/useGetUser";
import { zodResolver } from "@hookform/resolvers/zod";
import { CustomFormInput } from "@workspace/ui/components/custom/custom-form-input";
import { CustomFormSearchSelect } from "@workspace/ui/components/custom/custom-form-search-select";
import { CustomFormTextarea } from "@workspace/ui/components/custom/custom-form-textarea";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Form } from "@workspace/ui/components/form";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";
import { toast } from "sonner";
import { ProductFormType } from "../create/page";
import { CustomButton } from "@/components/ui/custom-button";
import { CustomLoading } from "@workspace/ui/components/custom/custom-loading";
import { cn } from "@workspace/ui/lib/utils";
import { HeaderBackButton } from "@/components/ui/custom-back-button";
import { CustomCollapsible } from "@workspace/ui/components/custom/custom-collapsible";
import { CustomFormSearchMultiSelect } from "@workspace/ui/components/custom/custom-form-search-multi-select";
import { CustomFormSwitch } from "@workspace/ui/components/custom/custom-form-switch";
import { useGetBrandsQuery } from "@/redux/api/brand-api";
import { CustomFormImage } from "@/components/ui/custom-form-image";
import { Label } from "@workspace/ui/components/label";
import { ManageVariants } from "@/features/products/manage-variants";

const EditProduct = () => {
  const router = useRouter();
  const { id } = useParams();
  const user = useGetUser();
  const shopId = user?.shop.id || "";

  const { data: product, isLoading: isLoadingProduct } = useGetProductByIdQuery(
    {
      id: id as string,
    }
  );

  console.log("product", product);

  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();

  const [updateProductVariant, { isLoading: isUpdatingVariant }] =
    useUpdateProductVariantMutation();

  console.log("product", product);

  const form = useForm<ProductFormType>({
    resolver: zodResolver(productSchema),
    values: product?.data
      ? {
          name: product.data.name || "",
          banglaName: product.data.banglaName || "",
          price: product.data.price || 0,
          discountPrice: product.data.discountPrice || 0,
          photoURL: product.data.photoURL || "",
          images: [],
          keywords: product.data.keywords || "",
          stock: product.data.stock || 0,
          categoryIds:
            product?.data?.categories?.map((category) => category.categoryId) ||
            [],
          description: product.data.description || "",
          fullDescription: product.data.fullDescription || "",
          productVariant:
            product.data.productVariant?.map((variant) => ({
              title: variant.name,
              options: [],
              isMandatory: false,
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
  });

  const { data: brands } = useGetBrandsQuery({
    shopId,
  });

  const brandOptions = brands?.data.map((brand) => ({
    value: brand.id,
    label: brand.name,
  }));

  const categories = data?.data.map((category) => ({
    value: category.id,
    label: category.name,
  }));

  const [editingVariants, setEditingVariants] = useState<Set<number>>(
    new Set()
  );
  const [savingVariants, setSavingVariants] = useState<Set<number>>(new Set());
  const [variants, setVariants] = useState<
    Array<{
      id: string;
      name: string;
      price: number;
      discountPrice: number;
      productId: string;
    }>
  >([]);

  const handleAddVariant = () => {
    setVariants((prev) => [
      ...prev,
      {
        id: "",
        name: "",
        price: 0,
        discountPrice: 0,
        productId: "",
      },
    ]);
  };

  const handleDeleteVariant = (index: number) => {
    setVariants((prev) => prev.filter((_, i) => i !== index));
  };

  const handleEditVariant = (index: number) => {
    setEditingVariants((prev) => new Set(prev).add(index));
  };

  const handleSaveVariant = async (index: number) => {
    try {
      setSavingVariants((prev) => new Set(prev).add(index));

      const variantData = variants[index];

      console.log("variantData", variantData);

      if (
        !variantData ||
        !variantData.name ||
        !variantData.price ||
        !variantData.discountPrice
      ) {
        toast.error("Please fill all variant fields");
        return;
      }

      await updateProductVariant({
        id: variantData.id,
        payload: {
          name: variantData.name,
          price: variantData.price,
          discountPrice: variantData.discountPrice,
          productId: variantData.productId,
        },
      });

      toast.success("Variant updated successfully");
    } catch (error) {
      console.log("error", error);
      toast.error("Failed to update variant");
    }
  };

  const handleCancelEdit = (index: number) => {
    // Reset the variant values to the original product data
    if (product?.data?.productVariant?.[index]) {
      const originalVariant = product.data.productVariant[index];
      setVariants((prev) =>
        prev.map((variant, i) =>
          i === index
            ? {
                ...variant,
                name: originalVariant.name,
                price: originalVariant.price,
                discountPrice: originalVariant.discountPrice,
              }
            : variant
        )
      );
    }

    setEditingVariants((prev) => {
      const newSet = new Set(prev);
      newSet.delete(index);
      return newSet;
    });
  };

  const handleVariantChange = (
    index: number,
    field: "name" | "price" | "discountPrice",
    value: string | number
  ) => {
    setVariants((prev) =>
      prev.map((variant, i) =>
        i === index ? { ...variant, [field]: value } : variant
      )
    );
  };

  const onSubmit = async (data: ProductFormType) => {
    const payload = {
      unitName: data.unitName,
      warranty: data.warranty,
    };

    // if (
    //     payload.productVariant.length === 0 &&
    //     (!payload.price || !payload.discountPrice)
    // ) {
    //     toast.error(
    //         "Price or discount price is required when there are no variants"
    //     );
    //     return;
    // }
    await updateProduct({ id: id as string, payload })
      .unwrap()
      .then(() => {
        toast.success("Product created successfully");
        form.reset();
        router.push("/products");
      })
      .catch(() => {
        toast.error("Failed to create passage");
      });
  };

  if (isLoadingProduct) {
    return <CustomLoading />;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
        <div className="flex items-center gap-4">
          <HeaderBackButton title="Back to Products" href="/products" />

          <DiscardAndSaveButton
            form={form}
            isUpdating={isUpdating}
            className="hidden md:ml-auto md:flex"
          />
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

          <div className="w-full flex justify-between items-center rounded-lg px-6 border p-4">
            <div className="space-y-2">
              <h2 className="cursor-pointer hover:no-underline text-base md:text-lg lg:text-xl font-medium">
                Product Variants
              </h2>
              <p className="text-muted-foreground">
                You can manage multiple variant for a single product here. Like
                Size, Color, and Weight etc.
              </p>
            </div>

            {product?.data && <ManageVariants product={product?.data} />}
          </div>

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
                  <Label className="title">Product Description</Label>
                  <Editor
                    content={
                      form.watch("fullDescription") ||
                      product?.data?.fullDescription
                    }
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

        <DiscardAndSaveButton
          form={form}
          isUpdating={isUpdating}
          className="flex border-t justify-end p-4"
        />
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

const DiscardAndSaveButton = ({
  form,
  isUpdating,
  className,
}: {
  form: UseFormReturn<ProductFormType>;
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
      <CustomButton
        isLoading={form.formState.isSubmitting || isUpdating}
        type="submit"
      >
        Save Product
      </CustomButton>
    </div>
  );
};
