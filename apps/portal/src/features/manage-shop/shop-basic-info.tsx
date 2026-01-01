"use client";

import { useState } from "react";

import { shopTypes } from "@/data/shop-data";
import { ShopBasicInfoSkeleton } from "@/features/manage-shop/shop-basic-info-skeleton";
import { useGetMyShopQuery, useUpdateShopMutation } from "@/redux/api/shop-api";
import { zodResolver } from "@hookform/resolvers/zod";
import { CustomCollapsible } from "@workspace/ui/components/custom/custom-collapsible";
import { CustomFormInput } from "@workspace/ui/components/custom/custom-form-input";
import { CustomFormSearchSelect } from "@workspace/ui/components/custom/custom-form-search-select";
import { CustomFormTextarea } from "@workspace/ui/components/custom/custom-form-textarea";
import { Form } from "@workspace/ui/components/form";
import { Label } from "@workspace/ui/components/label";
import { toast } from "@workspace/ui/components/sonner";
import { cn } from "@workspace/ui/lib/utils";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Shop, ShopType } from "@/types/shop-type";
import { CustomButton } from "@/components/ui/custom-button";
import { CustomFormImage } from "@/components/ui/custom-form-image";

const shopInfoSchema = z.object({
    name: z.string().min(1),
    description: z.string().min(1),
    shopEmail: z.string().email(),
    whatsappNumber: z.string(),
    // address: z.string().min(1),
    // topBarMessage: z.string().min(1),
    shopType: z.nativeEnum(ShopType),
    // vat: z.number().min(1),
    // orderNote: z.string().min(1),
    // maintainStockQuantity: z.boolean(),
    // showProductSoldCount: z.boolean(),
    photoURL: z.string().optional(),
    domain: z.string().trim().optional().or(z.literal("")),
    facebookPixelId: z.string().trim().optional().or(z.literal("")),
    facebookPixelAccessToken: z.string().trim().optional().or(z.literal("")),
    tiktokPixelId: z.string().trim().optional().or(z.literal("")),
    tiktokPixelAccessToken: z.string().trim().optional().or(z.literal("")),
});

export const ShopBasicInfo = ({ className }: { className?: string }) => {
    const { data: shop, isLoading: isLoadingShop } = useGetMyShopQuery();
    const shopData = shop?.data;
    const [theme, setTheme] = useState("#2563eb");

    const [updateShop, { isLoading: isUpdatingShop }] = useUpdateShopMutation();

    const form = useForm<z.infer<typeof shopInfoSchema>>({
        resolver: zodResolver(shopInfoSchema),
        values: {
            name: shopData?.name || "",
            shopEmail: shopData?.shopEmail || "",
            whatsappNumber: shopData?.whatsappNumber || "",
            description: shopData?.description || "",
            // address: shopData?.address || "",
            // topBarMessage: shopData?.topBarMessage || "",
            shopType: shopData?.shopType || ShopType.OTHER,
            // vat: shopData?.vat || 0,
            // orderNote: shopData?.orderNote || "",
            // maintainStockQuantity: shopData?.maintainStockQuantity || true,
            // showProductSoldCount: shopData?.showProductSoldCount || false,
            photoURL: shopData?.photoURL || "",
            domain: shopData?.domain || "",
            facebookPixelId: shopData?.facebookPixelId || "",
            facebookPixelAccessToken: shopData?.facebookPixelAccessToken || "",
            tiktokPixelId: shopData?.tiktokPixelId || "",
            tiktokPixelAccessToken: shopData?.tiktokPixelAccessToken || "",
        },
    });

    const onSubmit = async (data: z.infer<typeof shopInfoSchema>) => {
        const shopId = shopData?.id || "";
        if (!shopId) return toast.error("Shop ID not found");

        console.log(data);
        const payload: Partial<Shop> = {
            name: data.name,
            description: data.description,
            shopType: data.shopType,
            photoURL: data.photoURL,
            whatsappNumber: data.whatsappNumber,
            shopEmail: data.shopEmail,
            theme,
            domain: data.domain && data.domain.trim() !== "" ? data.domain.trim() : null,
            facebookPixelId:
                data.facebookPixelId && data.facebookPixelId.trim() !== "" ? data.facebookPixelId.trim() : undefined,
            facebookPixelAccessToken:
                data.facebookPixelAccessToken && data.facebookPixelAccessToken.trim() !== ""
                    ? data.facebookPixelAccessToken.trim()
                    : undefined,
            tiktokPixelId:
                data.tiktokPixelId && data.tiktokPixelId.trim() !== "" ? data.tiktokPixelId.trim() : undefined,
            tiktokPixelAccessToken:
                data.tiktokPixelAccessToken && data.tiktokPixelAccessToken.trim() !== ""
                    ? data.tiktokPixelAccessToken.trim()
                    : undefined,
        };
        await updateShop({
            id: shopId,
            payload,
        })
            .unwrap()
            .then(() => {
                toast.success("Shop updated successfully");
                form.reset();
            })
            .catch((err) => {
                toast.error(err?.data?.message || "Something went wrong");
            });
    };

    if (isLoadingShop) return <ShopBasicInfoSkeleton className={className} />;

    return (
        <div className={cn("space-y-4 lg:space-y-6", className)}>
            <CustomCollapsible
                collapsible={false}
                title="Shop Basic Info"
                content={
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <div className="grid-cols-2 gap-4 max-md:space-y-4 md:grid md:pt-2">
                                <CustomFormInput
                                    label="Shop Name"
                                    name="name"
                                    placeholder="Enter Shop Name"
                                    control={form.control}
                                />
                                <CustomFormSearchSelect
                                    label="Shop Type"
                                    name="shopType"
                                    options={shopTypes}
                                    placeholder="Select Shop Type"
                                    control={form.control}
                                />
                                <CustomFormInput
                                    label="Shop Email"
                                    name="shopEmail"
                                    type="email"
                                    placeholder="Enter Shop Email"
                                    control={form.control}
                                />
                                <CustomFormInput
                                    label="Shop Phone Number"
                                    name="whatsappNumber"
                                    placeholder="Enter Shop Phone Number"
                                    control={form.control}
                                />
                                <CustomFormTextarea
                                    label="Shop Details (SEO & Data Feed)"
                                    name="description"
                                    placeholder="Enter Shop Description"
                                    control={form.control}
                                    className="col-span-2"
                                />

                                <CustomFormInput
                                    label="Shop Domain"
                                    name="domain"
                                    placeholder="Enter Shop Domain (e.g., example.com)"
                                    control={form.control}
                                    className="col-span-2"
                                />

                                <CustomFormInput
                                    label="Facebook Pixel ID"
                                    name="facebookPixelId"
                                    placeholder="Enter Facebook Pixel ID"
                                    control={form.control}
                                />
                                <CustomFormInput
                                    label="Facebook Pixel Access Token"
                                    name="facebookPixelAccessToken"
                                    placeholder="Enter Facebook Pixel Access Token"
                                    control={form.control}
                                />
                                <CustomFormInput
                                    label="TikTok Pixel ID"
                                    name="tiktokPixelId"
                                    placeholder="Enter TikTok Pixel ID"
                                    control={form.control}
                                />
                                <CustomFormInput
                                    label="TikTok Pixel Access Token"
                                    name="tiktokPixelAccessToken"
                                    placeholder="Enter TikTok Pixel Access Token"
                                    control={form.control}
                                />

                                {/* <CustomFormTextarea
                                    label="Topbar Announcement Message"
                                    name="topBarMessage"
                                    className="col-span-2"
                                    placeholder="Enter Top Bar Message"
                                    control={form.control}
                                />

                                <div className="col-span-2 space-y-4">
                                    <CustomFormSwitch
                                        label="Maintain Stock Quantity"
                                        name="maintainStockQuantity"
                                        description="Enabling this option ensures that products with zero stock will be marked as 'Out of Stock' on the website."
                                        control={form.control}
                                        labelClassName="text-base"
                                        className="flex-col gap-3"
                                        descriptionClassName="text-base"
                                        parentClassName="justify-between"
                                    />
                                    <CustomFormSwitch
                                        label="Show Product Sold Count"
                                        name="showProductSoldCount"
                                        description="Enabling this option ensures that products will show sold count on your website."
                                        control={form.control}
                                        labelClassName="text-base"
                                        className="flex-col gap-3"
                                        descriptionClassName="text-base"
                                        parentClassName="justify-between"
                                    />
                                </div>
                                <CustomFormInput
                                    label="VAT / Tax Percentage"
                                    name="vat"
                                    type="number"
                                    placeholder="Enter VAT / Tax Percentage"
                                    control={form.control}
                                    min={0}
                                    max={100}
                                />
                                <CustomFormTextarea
                                    label="Order Process Message Note"
                                    name="orderNote"
                                    placeholder="Enter Order Process Message Note"
                                    control={form.control}
                                    className="col-span-2"
                                /> */}

                                <CustomFormImage label="Shop Logo" name="photoURL" control={form.control} />

                                <div className="space-y-2">
                                    <Label>Shop Theme Color</Label>

                                    <input
                                        type="color"
                                        value={theme}
                                        onChange={(e) => setTheme(e.target.value)}
                                        className="h-32 w-full rounded-md border-none ring-0 outline-none 2xl:h-40 [&::-moz-color-swatch]:rounded-md [&::-webkit-color-swatch]:rounded-md [&::-webkit-color-swatch-wrapper]:rounded-md"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end pt-4">
                                <CustomButton isLoading={isUpdatingShop} type="submit">
                                    Update Shop Info
                                </CustomButton>
                            </div>
                        </form>
                    </Form>
                }
            />
        </div>
    );
};
