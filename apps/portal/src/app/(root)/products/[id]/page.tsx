"use client";

import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

import { useGetCategoriesQuery } from "@/redux/api/category-api";
import {
  useGetProductByIdQuery,
  useUpdateProductMutation,
  useUpdateProductVariantMutation,
} from "@/redux/api/product-api";
import { PlusCircle, Trash2, Edit, Save, X } from "lucide-react";
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

const EditProduct = () => {
  const router = useRouter();
  const { id } = useParams();
  const user = useGetUser();

  const { data: product, isLoading: isLoadingProduct } = useGetProductByIdQuery(
    {
      id: id as string,
    }
  );

  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();

  const [updateProductVariant, { isLoading: isUpdatingVariant }] =
    useUpdateProductVariantMutation();

  console.log("product", product);

  const form = useForm<ProductFormType>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      banglaName: "",
      price: 0,
      discountPrice: 0,
      photoURL: "",
      keywords: "",
      stock: 0,
      categoryIds: [],
      description: "",
      fullDescription: "",
      productVariant: [],
    },
  });

  const { data } = useGetCategoriesQuery({
    shopId: user?.shop.id,
  });

  const categories = data?.data.map((category) => ({
    value: category.id,
    label: category.name,
  }));

  // useEffect(() => {
  //   if (product) {
  //     form.reset({
  //       name: product.data.name,
  //       banglaName: product.data.banglaName,
  //       price: product.data.price || 0,
  //       discountPrice: product.data.discountPrice || 0,
  //       photoURL: product.data.photoURL,
  //       keywords: product.data.keywords,
  //       stock: product.data.stock,
  //       categoryIds: [product.data.categoryId],
  //       description: product.data.description,
  //       fullDescription: product.data.fullDescription,
  // productVariant: product.data.productVariant.map((variant) => ({
  //     title: variant.name,
  //     options: variant.options?.map((option) => ({
  //         attribute: option.attribute,
  //         extraPrice: option.extraPrice,
  //         imageURL: option.imageURL,
  //     })),
  // })),
  //     });
  //   }
  // }, [form, product]);

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

  // Initialize variants from product data
  // useEffect(() => {
  //   if (product?.data?.productVariant) {
  //     setVariants(
  //       product.data.productVariant.map((variant) => ({
  //         id: variant.id,
  //         name: variant.name,
  //         price: variant.price,
  //         discountPrice: variant.discountPrice,
  //         productId: product.data.id,
  //       }))
  //     );
  //   }
  // }, [product]);

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
      ...data,
    };

    if (
      payload.productVariant.length === 0 &&
      (!payload.price || !payload.discountPrice)
    ) {
      toast.error(
        "Price or discount price is required when there are no variants"
      );
      return;
    }
    // await updateProduct({ id: id as string, payload })
    //     .unwrap()
    //     .then(() => {
    //         toast.success("Product created successfully");
    //         form.reset();
    //         router.push("/products");
    //     })
    //     .catch(() => {
    //         toast.error("Failed to create passage");
    //     });
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
          <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
            <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Product Details</CardTitle>
                  <CardDescription>
                    Give your product a name and description
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                    <CustomFormSearchSelect
                      label="ক্যাটাগরি"
                      name="categoryIds"
                      required
                      control={form.control}
                      options={categories || []}
                    />

                    <CustomFormInput
                      label="নাম (ইংরেজি)"
                      name="name"
                      control={form.control}
                      required
                      placeholder="Enter Your name"
                    />

                    <CustomFormInput
                      label="নাম (বাংলা)"
                      name="banglaName"
                      control={form.control}
                      required
                      placeholder="Enter Your name"
                    />

                    <CustomFormInput
                      label="প্রতি পণ্যের দাম"
                      name="price"
                      type="number"
                      min={0}
                      control={form.control}
                      placeholder="Enter Your price"
                    />

                    <CustomFormInput
                      label="প্রতি পণ্যের ডিসকাউন্ট দাম"
                      name="discountPrice"
                      type="number"
                      min={0}
                      control={form.control}
                      placeholder="Enter Your discount price"
                    />

                    <CustomFormInput
                      label="স্টক"
                      name="stock"
                      type="number"
                      min={0}
                      control={form.control}
                      placeholder="Enter Your stock"
                      required
                    />

                    <CustomFormTextarea
                      label="কীওয়ার্ড"
                      name="keywords"
                      rows={3}
                      control={form.control}
                      placeholder="Enter Your keywords"
                      required
                      className="col-span-2"
                    />

                    <CustomFormTextarea
                      label="সংক্ষিপ্ত বিবরণ"
                      name="description"
                      rows={5}
                      control={form.control}
                      placeholder="Enter Your description"
                      required
                      className="col-span-2"
                    />

                    <div className="col-span-2">
                      <Editor content={product?.data?.fullDescription} />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>পণ্যের ভারিয়েন্ট</CardTitle>
                  <CardDescription>
                    পণ্যের ভারিয়েন্ট যেমন সাইজ, কালচার ইত্যাদি
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-1/4">নাম</TableHead>
                        <TableHead className="w-1/4">দাম</TableHead>
                        <TableHead className="w-1/4">ডিসকাউন্ট দাম</TableHead>
                        <TableHead className="w-1/4">অ্যাকশন</TableHead>
                      </TableRow>
                    </TableHeader>

                    <TableBody>
                      {variants.map((variant, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <input
                              type="text"
                              value={variant.name}
                              onChange={(e) =>
                                handleVariantChange(
                                  index,
                                  "name",
                                  e.target.value
                                )
                              }
                              disabled={!editingVariants.has(index)}
                              placeholder="Enter Your name"
                              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            />
                          </TableCell>
                          <TableCell>
                            <input
                              type="number"
                              min={0}
                              value={variant.price}
                              onChange={(e) =>
                                handleVariantChange(
                                  index,
                                  "price",
                                  Number(e.target.value)
                                )
                              }
                              disabled={!editingVariants.has(index)}
                              placeholder="Enter Your price"
                              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            />
                          </TableCell>
                          <TableCell>
                            <input
                              type="number"
                              min={0}
                              value={variant.discountPrice}
                              onChange={(e) =>
                                handleVariantChange(
                                  index,
                                  "discountPrice",
                                  Number(e.target.value)
                                )
                              }
                              disabled={!editingVariants.has(index)}
                              placeholder="Enter Your discount price"
                              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            />
                          </TableCell>

                          <TableCell>
                            <div className="flex items-center gap-2">
                              {editingVariants.has(index) ? (
                                <>
                                  <Button
                                    onClick={() => handleSaveVariant(index)}
                                    size="icon"
                                    variant="default"
                                    className="h-8 w-8"
                                    disabled={savingVariants.has(index)}
                                    type="button"
                                  >
                                    {savingVariants.has(index) ? (
                                      <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                    ) : (
                                      <Save className="h-3.5 w-3.5" />
                                    )}
                                    <span className="sr-only">Save</span>
                                  </Button>
                                  <Button
                                    onClick={() => handleCancelEdit(index)}
                                    size="icon"
                                    variant="outline"
                                    className="h-8 w-8"
                                    disabled={savingVariants.has(index)}
                                    type="button"
                                  >
                                    <X className="h-3.5 w-3.5" />
                                    <span className="sr-only">Cancel</span>
                                  </Button>
                                </>
                              ) : (
                                <Button
                                  onClick={() => handleEditVariant(index)}
                                  size="icon"
                                  variant="outline"
                                  className="h-8 w-8"
                                  type="button"
                                >
                                  <Edit className="h-3.5 w-3.5" />
                                  <span className="sr-only">Edit</span>
                                </Button>
                              )}
                              <Button
                                onClick={() => handleDeleteVariant(index)}
                                size="icon"
                                variant="destructive"
                                className="h-8 w-8"
                                type="button"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                                <span className="sr-only">Delete</span>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
                <CardFooter className="justify-center border-t p-4">
                  <Button
                    onClick={handleAddVariant}
                    size="sm"
                    variant="ghost"
                    className="gap-1"
                  >
                    <PlusCircle className="h-3.5 w-3.5" />
                    Add Variant
                  </Button>
                </CardFooter>
              </Card>
            </div>

            <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
              <Card className="overflow-hidden">
                <CardHeader>
                  <CardTitle>পণ্যের ছবি</CardTitle>
                  <CardDescription>
                    পণ্যের ছবি যেমন প্রথম ছবি, দ্বিতীয় ছবি ইত্যাদি
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-2">
                    {/* <FileUpload
                                            label="প্রথম ছবি"
                                            setValue={(value: string) => {
                                                form.setValue(
                                                    "photoURL",
                                                    value
                                                );
                                                form.clearErrors("photoURL");
                                            }}
                                            required={
                                                form.formState.errors.photoURL
                                                    ? true
                                                    : false
                                            }
                                        /> */}
                    {form.watch("photoURL") && (
                      <Image
                        alt="Product image"
                        className="aspect-square w-full rounded-md object-cover"
                        height="300"
                        src={form.watch("photoURL")}
                        width="300"
                      />
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 md:hidden">
            <CustomButton href="/products" variant="outline" size="sm">
              Discard
            </CustomButton>
            <CustomButton
              disabled={isUpdating}
              isLoading={isUpdating}
              size="sm"
            >
              Save Product
            </CustomButton>
          </div>
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
