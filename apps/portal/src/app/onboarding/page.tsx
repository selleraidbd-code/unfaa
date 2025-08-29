"use client";

import type React from "react";

import { zodResolver } from "@hookform/resolvers/zod";

import { shopCategories } from "@/data/shop-data";
import { useCreateShopMutation } from "@/redux/api/shop-api";
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
import { Label } from "@workspace/ui/components/label";
import { CheckCircle, ImageIcon, Store, Upload } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const onboardingFormSchema = z.object({
    name: z.string().min(3, { message: "Please enter a valid shop name" }),
    description: z.string().optional(),
    shopType: z.string().min(3, { message: "Please enter a valid shop type" }),
    photoUrl: z.string().optional(),
    banner: z.string().optional(),
});

export default function ShopOnboarding() {
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

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        shopType: "",
        photoUrl: "",
        banner: "",
    });
    const [dragActive, setDragActive] = useState({
        photo: false,
        banner: false,
    });
    const [isComplete, setIsComplete] = useState(false);

    const [createShop, { isLoading }] = useCreateShopMutation();

    const handleInputChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleDrag = (e: React.DragEvent, type: "photo" | "banner") => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive((prev) => ({ ...prev, [type]: true }));
        } else if (e.type === "dragleave") {
            setDragActive((prev) => ({ ...prev, [type]: false }));
        }
    };

    const handleDrop = (e: React.DragEvent, type: "photo" | "banner") => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive((prev) => ({ ...prev, [type]: false }));

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            handleInputChange(
                type === "photo" ? "photoUrl" : "banner",
                file.name
            );
        }
    };

    const handleFileSelect = (
        e: React.ChangeEvent<HTMLInputElement>,
        type: "photo" | "banner"
    ) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            handleInputChange(
                type === "photo" ? "photoUrl" : "banner",
                file.name
            );
        }
    };

    const onSubmit = async (data: z.infer<typeof onboardingFormSchema>) => {
        console.log(data);
        const shopData = {
            name: data.name,
            description: data.description || "",
            shopType: data.shopType || "",
            photoURL: data.photoUrl || "",
            banner: data.banner || "",
        };

        await createShop(shopData)
            .unwrap()
            .then((res) => {
                console.log(res);
                setIsComplete(true);
                toast.success("🎉 Shop created successfully");
            })
            .catch((err) => {
                console.log(err);
                toast.error("Error creating shop");
            });
    };

    if (isComplete) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-4">
                <Card className="w-full max-w-md text-center">
                    <CardContent className="pt-6">
                        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                            <CheckCircle className="w-8 h-8 text-green-600" />
                        </div>
                        <h2 className="text-2xl font-bold mb-2">
                            Welcome to your shop!
                        </h2>
                        <p className="text-muted-foreground mb-6">
                            Your shop has been successfully set up. You can now
                            start adding products and managing your store.
                        </p>
                        <Link href="/">
                            <Button className="w-full"> Go to Dashboard</Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        );
    }

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
                                    // required
                                />

                                <CustomFormSelect
                                    label="Shop Type"
                                    name="shopType"
                                    options={shopCategories}
                                    control={form.control}
                                    required
                                />
                            </CardContent>
                        </Card>

                        {/* Images */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <ImageIcon className="w-5 h-5" />
                                    Shop Images
                                </CardTitle>
                                <CardDescription>
                                    Add a logo and banner to make your shop
                                    stand out
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Shop Logo */}
                                <div className="space-y-2">
                                    <Label>Shop Logo</Label>
                                    <div
                                        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                                            dragActive.photo
                                                ? "border-blue-400 bg-blue-50"
                                                : "border-gray-300 hover:border-gray-400"
                                        }`}
                                        onDragEnter={(e) =>
                                            handleDrag(e, "photo")
                                        }
                                        onDragLeave={(e) =>
                                            handleDrag(e, "photo")
                                        }
                                        onDragOver={(e) =>
                                            handleDrag(e, "photo")
                                        }
                                        onDrop={(e) => handleDrop(e, "photo")}
                                    >
                                        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                                        <div className="space-y-2">
                                            <p className="text-sm font-medium">
                                                {formData.photoUrl
                                                    ? formData.photoUrl
                                                    : "Drop your logo here, or click to browse"}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                PNG, JPG up to 10MB
                                            </p>
                                        </div>
                                        <input
                                            type="file"
                                            className="hidden"
                                            accept="image/*"
                                            onChange={(e) =>
                                                handleFileSelect(e, "photo")
                                            }
                                            id="photo-upload"
                                        />
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            className="mt-2"
                                            onClick={() =>
                                                document
                                                    .getElementById(
                                                        "photo-upload"
                                                    )
                                                    ?.click()
                                            }
                                        >
                                            Choose File
                                        </Button>
                                    </div>
                                </div>

                                {/* Shop Banner */}
                                <div className="space-y-2">
                                    <Label>Shop Banner</Label>
                                    <div
                                        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                                            dragActive.banner
                                                ? "border-blue-400 bg-blue-50"
                                                : "border-gray-300 hover:border-gray-400"
                                        }`}
                                        onDragEnter={(e) =>
                                            handleDrag(e, "banner")
                                        }
                                        onDragLeave={(e) =>
                                            handleDrag(e, "banner")
                                        }
                                        onDragOver={(e) =>
                                            handleDrag(e, "banner")
                                        }
                                        onDrop={(e) => handleDrop(e, "banner")}
                                    >
                                        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                                        <div className="space-y-2">
                                            <p className="text-sm font-medium">
                                                {formData.banner
                                                    ? formData.banner
                                                    : "Drop your banner here, or click to browse"}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                PNG, JPG up to 10MB
                                                (Recommended: 1200x400px)
                                            </p>
                                        </div>
                                        <input
                                            type="file"
                                            className="hidden"
                                            accept="image/*"
                                            onChange={(e) =>
                                                handleFileSelect(e, "banner")
                                            }
                                            id="banner-upload"
                                        />
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            className="mt-2"
                                            onClick={() =>
                                                document
                                                    .getElementById(
                                                        "banner-upload"
                                                    )
                                                    ?.click()
                                            }
                                        >
                                            Choose File
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="flex gap-4">
                            <Button
                                type="submit"
                                className="flex-1"
                                disabled={isLoading}
                            >
                                {isLoading
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
}
