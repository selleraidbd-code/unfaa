"use client";

import { HeaderBackButton } from "@/components/ui/custom-back-button";
import { CustomButton } from "@/components/ui/custom-button";
import { useGetMyShopQuery, useUpdateShopMutation } from "@/redux/api/shop-api";
import { Shop } from "@/types/shop-type";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader } from "@workspace/ui/components/card";
import { CustomFormInput } from "@workspace/ui/components/custom/custom-form-input";
import { CustomLoading } from "@workspace/ui/components/custom/custom-loading";
import { Form } from "@workspace/ui/components/form";
import { useForm } from "react-hook-form";
import { toast } from "@workspace/ui/components/sonner";
import { z } from "zod";

const socialLinksSchema = z.object({
    facebookLink: z.string(),
    twitterLink: z.string(),
    instagramLink: z.string(),
    youtubeLink: z.string(),
    tiktokLink: z.string(),
    darazLink: z.string(),
    discordLink: z.string(),
    amazonLink: z.string(),
    walmartLink: z.string(),
    linkedInLink: z.string(),
});

const SocialMediaLinks = () => {
    const { data: shop, isLoading: isLoadingShop } = useGetMyShopQuery();

    const form = useForm<z.infer<typeof socialLinksSchema>>({
        resolver: zodResolver(socialLinksSchema),
        values: {
            facebookLink: shop?.data?.facebookLink || "",
            twitterLink: shop?.data?.twitterLink || "",
            instagramLink: shop?.data?.instagramLink || "",
            youtubeLink: shop?.data?.youtubeLink || "",
            tiktokLink: shop?.data?.tiktokLink || "",
            darazLink: shop?.data?.darazLink || "",
            discordLink: shop?.data?.discordLink || "",
            amazonLink: shop?.data?.amazonLink || "",
            walmartLink: shop?.data?.walmartLink || "",
            linkedInLink: shop?.data?.linkedInLink || "",
        },
    });

    const [updateShop, { isLoading: isUpdatingShop }] = useUpdateShopMutation();

    const onSubmit = async (data: z.infer<typeof socialLinksSchema>) => {
        const shopId = shop?.data?.id || "";
        if (!shopId) return toast.error("Shop ID not found");

        const payload: Partial<Shop> = {
            facebookLink: data.facebookLink,
            twitterLink: data.twitterLink,
            instagramLink: data.instagramLink,
            youtubeLink: data.youtubeLink,
            tiktokLink: data.tiktokLink,
            darazLink: data.darazLink,
            discordLink: data.discordLink,
            amazonLink: data.amazonLink,
            walmartLink: data.walmartLink,
            linkedInLink: data.linkedInLink,
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

    if (isLoadingShop) return <CustomLoading />;

    return (
        <Card>
            <CardHeader className="pb-4">
                <HeaderBackButton title="Social Links" href="/manage-shop" />
            </CardHeader>
            <CardContent className="space-y-6">
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="lg:grid grid-cols-2 gap-6 max-lg:space-y-5"
                    >
                        <CustomFormInput
                            label="Facebook"
                            name="facebookLink"
                            type="url"
                            placeholder="https://www.facebook.com/myshop"
                            control={form.control}
                        />
                        <CustomFormInput
                            label="Twitter"
                            name="twitterLink"
                            type="url"
                            placeholder="https://www.twitter.com/myshop"
                            control={form.control}
                        />
                        <CustomFormInput
                            label="Instagram"
                            name="instagramLink"
                            type="url"
                            placeholder="https://www.instagram.com/myshop"
                            control={form.control}
                        />
                        <CustomFormInput
                            label="Youtube"
                            name="youtubeLink"
                            type="url"
                            placeholder="https://www.youtube.com/myshop"
                            control={form.control}
                        />
                        <CustomFormInput
                            label="Tiktok"
                            name="tiktokLink"
                            type="url"
                            placeholder="https://www.tiktok.com/myshop"
                            control={form.control}
                        />
                        <CustomFormInput
                            label="Daraz"
                            name="darazLink"
                            type="url"
                            placeholder="https://www.daraz.com.bd/myshop"
                            control={form.control}
                        />
                        <CustomFormInput
                            label="Discord"
                            name="discordLink"
                            type="url"
                            placeholder="https://www.discord.com/myshop"
                            control={form.control}
                        />
                        <CustomFormInput
                            label="Amazon"
                            name="amazonLink"
                            type="url"
                            placeholder="https://www.amazon.com/myshop"
                            control={form.control}
                        />
                        <CustomFormInput
                            label="Walmart"
                            name="walmartLink"
                            type="url"
                            placeholder="https://www.walmart.com/myshop"
                            control={form.control}
                        />
                        <CustomFormInput
                            label="LinkedIn"
                            name="linkedInLink"
                            type="url"
                            placeholder="https://www.linkedin.com/myshop"
                            control={form.control}
                        />

                        <div className="flex col-span-2 justify-end pt-4">
                            <CustomButton
                                size="lg"
                                type="submit"
                                isLoading={isUpdatingShop}
                            >
                                Update Social Links
                            </CustomButton>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
};

export default SocialMediaLinks;
