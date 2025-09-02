"use client";

import { RatingsReviews } from "@/features/products/Ratings&Reviews";
import { Product } from "@/types/product-type";
import { Button } from "@workspace/ui/components/button";
import { Card } from "@workspace/ui/components/card";
import { Label } from "@workspace/ui/components/label";
import {
    RadioGroup,
    RadioGroupItem,
} from "@workspace/ui/components/radio-group";
import {
    Droplet,
    Facebook,
    FlaskRoundIcon as Flask,
    Instagram,
    Leaf,
    Linkedin,
    Package,
    Scissors,
    Shirt,
    Star,
    Twitter,
    User,
    Wrench,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export const ProductDetailPage = ({ product }: { product?: Product }) => {
    console.log("product", product);
    const images = [
        "http://multi-media-server.naimurrhman.com/uploads/img/1744627430617-339961119.jpg",
        "http://multi-media-server.naimurrhman.com/uploads/img/1744566154755-14651985.jpg",
        "http://multi-media-server.naimurrhman.com/uploads/img/1745580373811-76572101.jpg",
        "http://multi-media-server.naimurrhman.com/uploads/img/1744566154755-14651985.jpg",
        "http://multi-media-server.naimurrhman.com/uploads/img/1745580373811-76572101.jpg",
    ];
    const [selectedImage, setSelectedImage] = useState(images[0]);

    return (
        <div className="container mx-auto px-4 py-6 md:px-6 lg:py-12">
            {/* Breadcrumb */}
            <nav className="mb-6 text-sm text-muted-foreground">
                <ol className="flex items-center space-x-1">
                    <li>
                        <Link href="#" className="hover:underline">
                            Home
                        </Link>
                    </li>
                    <li>
                        <span className="mx-1">/</span>
                    </li>
                    <li>
                        <Link href="#" className="hover:underline">
                            Makeup
                        </Link>
                    </li>
                    <li>
                        <span className="mx-1">/</span>
                    </li>
                    <li className="font-medium text-foreground">
                        Water Drop BB Foundation - Lightweight, Oil-Free Formula
                        with SPF 15
                    </li>
                </ol>
            </nav>

            <div className="grid gap-8 lg:grid-cols-[1fr_300px] xl:grid-cols-[1fr_350px]">
                {/* Main Product Content */}
                <div>
                    <div className="grid gap-8 lg:grid-cols-2">
                        <div className="grid gap-4">
                            {/* Main Image */}
                            <Image
                                src={selectedImage ?? ""}
                                alt="Selected Product"
                                width={500}
                                height={500}
                                className="aspect-square w-full rounded-lg object-cover"
                            />

                            {/* Thumbnails */}
                            <div className="flex gap-2 pb-2">
                                {images.map((img, index) => (
                                    <Image
                                        key={index}
                                        src={img}
                                        alt={`Product thumbnail ${index + 1}`}
                                        width={100}
                                        height={100}
                                        onClick={() => setSelectedImage(img)}
                                        className={`aspect-square cursor-pointer rounded-md object-cover transition ring-offset-2 ${
                                            selectedImage === img
                                                ? "ring-2 ring-primary"
                                                : "ring-1 ring-transparent"
                                        }`}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Product Details */}
                        <div className="grid gap-6">
                            <h1 className="text-2xl font-bold md:text-3xl">
                                Water Drop BB Foundation - Lightweight, Oil-Free
                                Formula with SPF 15
                            </h1>
                            <div className="text-sm text-muted-foreground">
                                <p>
                                    <span className="font-medium text-foreground">
                                        Category:
                                    </span>{" "}
                                    Makeup
                                </p>
                                <p>
                                    <span className="font-medium text-foreground">
                                        Warranty:
                                    </span>{" "}
                                    1 year
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="flex items-center gap-0.5">
                                    <Star className="h-4 w-4 fill-primary text-primary" />
                                    <Star className="h-4 w-4 fill-primary text-primary" />
                                    <Star className="h-4 w-4 fill-primary text-primary" />
                                    <Star className="h-4 w-4 fill-primary text-primary" />
                                    <Star className="h-4 w-4 fill-muted stroke-muted-foreground" />
                                </div>
                                <span className="text-sm text-muted-foreground">
                                    (1 Reviews)
                                </span>
                            </div>
                            <div className="flex items-baseline gap-2">
                                <span className="text-4xl font-bold text-red-600">
                                    ৳400
                                </span>
                                <span className="text-lg text-muted-foreground line-through">
                                    ৳1000
                                </span>
                            </div>
                            <div className="text-sm text-muted-foreground">
                                <p>
                                    <span className="font-medium text-foreground">
                                        Total:
                                    </span>{" "}
                                    20
                                </p>
                                <p>
                                    <span className="font-medium text-foreground">
                                        Sold:
                                    </span>{" "}
                                    5
                                </p>
                                <p className="font-medium text-green-600">
                                    In Stock
                                </p>
                            </div>
                            <p className="text-sm leading-relaxed text-muted-foreground">
                                Achieve a flawless, radiant look with the Water
                                Drop BB Foundation, the ultimate multi-tasking
                                beauty essential designed to simplify your
                                skincare and makeup routine. This...
                            </p>

                            {/* Size Selection */}
                            <div className="grid gap-2">
                                <Label htmlFor="size" className="text-base">
                                    Size
                                </Label>
                                <RadioGroup
                                    id="size"
                                    defaultValue="200ml"
                                    className="flex flex-wrap gap-2"
                                >
                                    <Label
                                        htmlFor="size-200ml"
                                        className="flex cursor-pointer items-center justify-center rounded-md border px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground [&:has(:checked)]:bg-primary [&:has(:checked)]:text-primary-foreground"
                                    >
                                        <RadioGroupItem
                                            id="size-200ml"
                                            value="200ml"
                                            className="sr-only"
                                        />
                                        200ml
                                    </Label>
                                    <Label
                                        htmlFor="size-50ml"
                                        className="flex cursor-pointer items-center justify-center rounded-md border px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground [&:has(:checked)]:bg-primary [&:has(:checked)]:text-primary-foreground"
                                    >
                                        <RadioGroupItem
                                            id="size-50ml"
                                            value="50ml"
                                            className="sr-only"
                                        />
                                        50ml
                                    </Label>
                                    <Label
                                        htmlFor="size-300ml"
                                        className="flex cursor-pointer items-center justify-center rounded-md border px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground [&:has(:checked)]:bg-primary [&:has(:checked)]:text-primary-foreground"
                                    >
                                        <RadioGroupItem
                                            id="size-300ml"
                                            value="300ml"
                                            className="sr-only"
                                        />
                                        300ml
                                    </Label>
                                    <Label
                                        htmlFor="size-500ml"
                                        className="flex cursor-pointer items-center justify-center rounded-md border px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground [&:has(:checked)]:bg-primary [&:has(:checked)]:text-primary-foreground"
                                    >
                                        <RadioGroupItem
                                            id="size-500ml"
                                            value="500ml"
                                            className="sr-only"
                                        />
                                        500ml
                                    </Label>
                                </RadioGroup>
                            </div>

                            {/* Color Selection */}
                            <div className="flex gap-2">
                                <Label htmlFor="color" className="text-base">
                                    Color
                                </Label>
                                <RadioGroup
                                    id="color"
                                    defaultValue="rose-pink"
                                    className="flex flex-wrap gap-2"
                                >
                                    <Label
                                        htmlFor="color-rose-pink"
                                        className="flex cursor-pointer items-center justify-center rounded-md border px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground [&:has(:checked)]:bg-primary [&:has(:checked)]:text-primary-foreground"
                                    >
                                        <RadioGroupItem
                                            id="color-rose-pink"
                                            value="rose-pink"
                                            className="sr-only"
                                        />
                                        Rose Pink
                                    </Label>
                                </RadioGroup>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-4">
                                <Button className="flex-1 bg-red-600 hover:bg-red-700 text-white">
                                    Add To Cart
                                </Button>
                                <Button className="flex-1 bg-black hover:bg-gray-800 text-white">
                                    Buy Now
                                </Button>
                            </div>

                            {/* Social Media Share */}
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                Share Social Media:-
                                <div className="flex gap-2">
                                    <Link
                                        href="#"
                                        className="text-gray-600 hover:text-blue-600"
                                    >
                                        <Facebook className="h-5 w-5" />
                                    </Link>
                                    <Link
                                        href="#"
                                        className="text-gray-600 hover:text-blue-400"
                                    >
                                        <Twitter className="h-5 w-5" />
                                    </Link>
                                    <Link
                                        href="#"
                                        className="text-gray-600 hover:text-pink-600"
                                    >
                                        <Instagram className="h-5 w-5" />
                                    </Link>
                                    <Link
                                        href="#"
                                        className="text-gray-600 hover:text-blue-700"
                                    >
                                        <Linkedin className="h-5 w-5" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                    <RatingsReviews />
                </div>

                {/* Sidebar */}
                <div className="flex flex-col gap-6">
                    {/* Related Products */}
                    <Card>
                        <h2 className="text-xl pl-4 font-bold">
                            Related Products
                        </h2>
                        <div className="flex  gap-4 pl-4">
                            <Image
                                src="http://multi-media-server.naimurrhman.com/uploads/img/1744627430617-339961119.jpg"
                                alt="FOCALLURE Skin Evolution Liquid Foundation"
                                width={80}
                                height={80}
                                className="aspect-square rounded-md object-cover"
                            />
                            <div className="grid gap-1">
                                <h3 className="font-medium">
                                    FOCALLURE Skin Evolution Liquid...
                                </h3>
                                <p className="text-lg font-bold text-red-600">
                                    ৳400
                                </p>
                                <div className="flex items-center gap-0.5">
                                    <Star className="h-3 w-3 fill-primary text-primary" />
                                    <Star className="h-3 w-3 fill-primary text-primary" />
                                    <Star className="h-3 w-3 fill-primary text-primary" />
                                    <Star className="h-3 w-3 fill-primary text-primary" />
                                    <Star className="h-3 w-3 fill-muted stroke-muted-foreground" />
                                    <span className="text-xs text-muted-foreground">
                                        (1 Reviews)
                                    </span>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Categories */}
                    <Card className="">
                        <h2 className="text-xl ml-2 font-bold">Categories</h2>
                        <div className="grid gap-2">
                            <Link
                                href="#"
                                className="flex items-center gap-3 rounded-md p-2 hover:bg-accent"
                            >
                                <Package className="h-5 w-5 text-muted-foreground" />
                                Makeup
                            </Link>
                            <Link
                                href="#"
                                className="flex items-center gap-3 rounded-md p-2 hover:bg-accent"
                            >
                                <Shirt className="h-5 w-5 text-muted-foreground" />
                                Skincare
                            </Link>
                            <Link
                                href="#"
                                className="flex items-center gap-3 rounded-md p-2 hover:bg-accent"
                            >
                                <Scissors className="h-5 w-5 text-muted-foreground" />
                                Haircare
                            </Link>
                            <Link
                                href="#"
                                className="flex items-center gap-3 rounded-md p-2 hover:bg-accent"
                            >
                                <Flask className="h-5 w-5 text-muted-foreground" />
                                Fragrances
                            </Link>
                            <Link
                                href="#"
                                className="flex items-center gap-3 rounded-md p-2 hover:bg-accent"
                            >
                                <Droplet className="h-5 w-5 text-muted-foreground" />
                                Bath & Body
                            </Link>
                            <Link
                                href="#"
                                className="flex items-center gap-3 rounded-md p-2 hover:bg-accent"
                            >
                                <User className="h-5 w-5 text-muted-foreground" />
                                Men&apos;s Grooming
                            </Link>
                            <Link
                                href="#"
                                className="flex items-center gap-3 rounded-md p-2 hover:bg-accent"
                            >
                                <Wrench className="h-5 w-5 text-muted-foreground" />
                                Beauty Tools & Accessories
                            </Link>
                            <Link
                                href="#"
                                className="flex items-center gap-3 rounded-md p-2 hover:bg-accent"
                            >
                                <Leaf className="h-5 w-5 text-muted-foreground" />
                                Wellness & Self-Care
                            </Link>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};
