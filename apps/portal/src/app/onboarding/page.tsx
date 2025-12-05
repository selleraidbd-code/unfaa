"use client";

import { zodResolver } from "@hookform/resolvers/zod";

import { createShopAction } from "@/actions/auth-actions";
import { shopTypes } from "@/data/shop-data";
import { setUser } from "@/redux/slices/auth-slice";
import { useAppDispatch } from "@/redux/store/hook";
import { CreateShop, ShopType } from "@/types/shop-type";
import { Button } from "@workspace/ui/components/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@workspace/ui/components/card";
import { CustomFormInput } from "@workspace/ui/components/custom/custom-form-input";
import { CustomFormSelect } from "@workspace/ui/components/custom/custom-form-select";
import { CustomFormTextarea } from "@workspace/ui/components/custom/custom-form-textarea";
import { Form } from "@workspace/ui/components/form";
import { toast } from "@workspace/ui/components/sonner";
import { Store } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const onboardingFormSchema = z.object({
    name: z.string().min(3, { message: "Please enter a valid shop name" }),
    description: z.string().optional(),
    shopType: z.string().min(3, { message: "Please enter a valid shop type" }),
    photoUrl: z.string().optional(),
    banner: z.string().optional(),
});

const Page = () => {
    const router = useRouter();
    const dispatch = useAppDispatch();

    const form = useForm<z.infer<typeof onboardingFormSchema>>({
        resolver: zodResolver(onboardingFormSchema),
        defaultValues: {
            name: "",
            description: "",
            shopType: "",
            photoUrl: "",
            banner: "",
        },
    });

    const [isPending, startTransition] = useTransition();

    // const getShopIdToClone = async (shopType: ShopTypeEnum) => {
    //     switch (shopType) {
    //         case ShopTypeEnum.CLOTHING_APPAREL:
    //             return "be52c3b4-a534-4b88-a9ac-a02a9b25886a";
    //         case ShopTypeEnum.SHOES_FOOTWEAR:
    //             return "2";
    //         case ShopTypeEnum.ACCESSORIES_JEWELRY:
    //             return "3";
    //         case ShopTypeEnum.BEAUTY_COSMETICS:
    //             return "4";
    //         case ShopTypeEnum.ELECTRONICS_GADGETS:
    //             return "5";
    //         case ShopTypeEnum.HEALTH_WELLNESS:
    //             return "6";
    //         case ShopTypeEnum.HOME_FURNITURE:
    //             return "7";
    //         case ShopTypeEnum.BOOKS_MEDIA:
    //             return "8";
    //         case ShopTypeEnum.TOYS_GAMES:
    //             return "9";
    //         case ShopTypeEnum.SPORTS_OUTDOORS:
    //             return "10";
    //         case ShopTypeEnum.FOOD_BEVERAGES:
    //             return "11";
    //         case ShopTypeEnum.PET_SUPPLIES_EQUIPMENT:
    //             return "12";
    //         case ShopTypeEnum.GROCERIES_HOUSEHOLD:
    //             return "13";
    //         case ShopTypeEnum.OTHER:
    //             return "14";
    //     }
    // };

    // Timer countdown when loading or complete

    const onSubmit = async (data: z.infer<typeof onboardingFormSchema>) => {
        const shopData: CreateShop = {
            name: data.name,
            description: data.description || "",
            shopType: data.shopType as ShopType,
            // photoURL: data.photoUrl || "",
            // banner: data.banner || "",
            // shopIdToClone: await getShopIdToClone(
            //     data.shopType as ShopTypeEnum
            // ),
        };

        startTransition(async () => {
            const response = await createShopAction(shopData);
            if (response.status === "success") {
                dispatch(setUser(response.data));
                toast.success("🎉 Shop created successfully");
                router.push("/");
            } else {
                toast.error(response.error || "Error creating shop");
            }
        });
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="w-full max-w-2xl">
                <div className="text-center mb-8">
                    <div className="mx-auto w-16 h-16 bg-accent rounded-full flex items-center justify-center mb-4">
                        <Store className="w-8 h-8 text-blue-600" />
                    </div>
                    <h1 className="text-3xl font-bold  mb-2">
                        Set up your shop
                    </h1>
                    <p className="text-muted-foreground">
                        Let&apos;s get your shop ready for customers
                    </p>
                </div>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-6"
                    >
                        {/* Basic Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Store className="w-5 h-5" />
                                    Basic Information
                                </CardTitle>
                                <CardDescription>
                                    Tell us about your shop and what makes it
                                    special
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <CustomFormInput
                                    label="Shop Name"
                                    name="name"
                                    placeholder="Enter your shop name"
                                    control={form.control}
                                    required
                                />

                                <CustomFormTextarea
                                    label="Description"
                                    name="description"
                                    placeholder="Describe your shop, products, and what makes you unique..."
                                    control={form.control}
                                    description="This will help customers understand what your shop is about"
                                    required
                                />

                                <CustomFormSelect
                                    label="Shop Type"
                                    name="shopType"
                                    options={shopTypes}
                                    control={form.control}
                                    required
                                />
                            </CardContent>
                        </Card>

                        <div className="flex gap-4">
                            <Button
                                type="submit"
                                className="flex-1"
                                disabled={isPending}
                            >
                                {isPending
                                    ? "Setting up your shop..."
                                    : "Complete Setup"}
                            </Button>
                        </div>
                    </form>
                </Form>

                <p className="text-center text-sm text-gray-500 mt-6">
                    You can always update this information later in your shop
                    settings
                </p>
            </div>
        </div>
    );
};

export default Page;
