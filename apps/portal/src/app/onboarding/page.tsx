"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";

import { createShopAction } from "@/actions/auth-actions";
import { ShopTypeEnum, shopTypes } from "@/data/shop-data";
import { logoutThunkWithoutReload, setUser } from "@/redux/slices/auth-slice";
import { useAppDispatch } from "@/redux/store/hook";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { CustomFormInput } from "@workspace/ui/components/custom/custom-form-input";
import { CustomFormSelect } from "@workspace/ui/components/custom/custom-form-select";
import { CustomFormTextarea } from "@workspace/ui/components/custom/custom-form-textarea";
import { Form } from "@workspace/ui/components/form";
import { toast } from "@workspace/ui/components/sonner";
import { ArrowLeft, Store } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { CreateShop, ShopType } from "@/types/shop-type";

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

    const getShopIdToClone = async (shopType: ShopTypeEnum) => {
        switch (shopType) {
            case ShopTypeEnum.CLOTHING_APPAREL:
                return "0b52674b-086e-4069-922c-6310cc1d8e21";
            case ShopTypeEnum.SHOES_FOOTWEAR:
                return "2e26af52-5a7e-4b6e-988f-1120a628e87a";
            case ShopTypeEnum.ACCESSORIES_JEWELRY:
                return "8df283f6-637d-4a52-af4f-b0584afef679";
            case ShopTypeEnum.BEAUTY_COSMETICS:
                return "22b0358c-e435-4a17-8acd-da85d8ac82fe";
            case ShopTypeEnum.ELECTRONICS_GADGETS:
                return "35cb5e89-36d5-4f8e-bbdb-f97e7c51b344";
            case ShopTypeEnum.HEALTH_WELLNESS:
                return "9ee2ae15-234f-4a39-bd91-a6962967b7f1";
            case ShopTypeEnum.HOME_FURNITURE:
                return "6827f3d2-cc66-4766-8b14-94abf4cce11f";
            case ShopTypeEnum.BOOKS_MEDIA:
                return "abf6852b-de08-4bf3-b16a-fc1951f2befc";
            case ShopTypeEnum.TOYS_GAMES:
                return "93e2b90e-16e1-4a2b-8b1d-8edeb7ccf4bb";
            case ShopTypeEnum.SPORTS_OUTDOORS:
                return "67df99a9-7f18-478a-ac90-c2cd7dee4a2c";
            case ShopTypeEnum.FOOD_BEVERAGES:
                return "87825ac7-935e-40ce-9dd0-15e855a6580f";
            case ShopTypeEnum.PET_SUPPLIES_EQUIPMENT:
                return "1c7d6168-70a0-4b04-9907-00abe7a93c5d";
            case ShopTypeEnum.GROCERIES_HOUSEHOLD:
                return "45aaad4e-0d97-4a31-9066-d9b6275e57b2";
            case ShopTypeEnum.OTHER:
                return "d8681360-e9dc-46d4-8bba-f4a5b60deac3";
        }
    };

    const onSubmit = async (data: z.infer<typeof onboardingFormSchema>) => {
        const shopIdToClone = await getShopIdToClone(data.shopType as ShopTypeEnum);

        const shopData: CreateShop = {
            name: data.name,
            description: data.description || "",
            shopType: data.shopType as ShopType,
            // photoURL: data.photoUrl || "",
            // banner: data.banner || "",
            shopIdToClone,
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

    const handleBackToSignIn = () => {
        dispatch(logoutThunkWithoutReload());
        setTimeout(() => {
            router.push("/auth/sign-in");
        }, 100);
    };

    return (
        <div className="bg-background flex min-h-screen items-center justify-center p-4">
            <div className="w-full max-w-2xl">
                <div className="mb-8 text-center">
                    <div className="bg-accent mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
                        <Store className="h-8 w-8 text-blue-600" />
                    </div>
                    <h1 className="mb-2 text-3xl font-bold">Set up your shop</h1>
                    <p className="text-muted-foreground">Let&apos;s get your shop ready for customers</p>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        {/* Basic Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Store className="h-5 w-5" />
                                    Basic Information
                                </CardTitle>
                                <CardDescription>Tell us about your shop and what makes it special</CardDescription>
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
                            <Button type="submit" className="flex-1" disabled={isPending}>
                                {isPending ? "Setting up your shop..." : "Complete Setup"}
                            </Button>
                        </div>
                    </form>
                </Form>

                <div className="my-4 flex justify-center gap-4">
                    Go back to{" "}
                    <button className="text-primary underline underline-offset-1" onClick={handleBackToSignIn}>
                        Sign In
                    </button>
                </div>

                <p className="text-center text-sm text-gray-500">
                    You can always update this information later in your shop settings
                </p>
            </div>
        </div>
    );
};

export default Page;
