"use client";

import { Product } from "@/types/product-type";
import {
    Droplet,
    FlaskRoundIcon,
    Leaf,
    Package,
    Scissors,
    Shirt,
    Star,
    User,
    Wrench,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export const ProductDetailsSidebar = ({ product }: { product: Product }) => {
    const categories = [
        { label: "Makeup", Icon: Package },
        { label: "Skincare", Icon: Shirt },
        { label: "Haircare", Icon: Scissors },
        { label: "Fragrances", Icon: FlaskRoundIcon },
        { label: "Bath & Body", Icon: Droplet },
        { label: "Men's Grooming", Icon: User },
        { label: "Beauty Tools & Accessories", Icon: Wrench },
        { label: "Wellness & Self-Care", Icon: Leaf },
    ];

    return (
        <div className="flex flex-col gap-8 col-span-3">
            <div className="border p-5 shadow-lg  rounded-lg">
                <h2 className="text-xl  font-semibold">Related Products</h2>
                <div className="my-3 h-1 w-16 bg-primary"></div>

                <div className="flex gap-4">
                    <Image
                        src={product?.photoURL || ""}
                        alt="FOCALLURE Skin Evolution Liquid Foundation"
                        width={60}
                        height={40}
                        className="aspect-square w-20 h-20 border p-2   object-cover"
                    />
                    <div className="grid ">
                        <h3 className="text-base">FOCALLURE Skin Evolution</h3>
                        <p className="text-lg font-semibold text-primary">
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
            </div>

            {/* Categories */}
            <div className="border p-5 shadow-lg  rounded-lg">
                <h2 className="text-xl  font-semibold">Categories</h2>
                <div className="my-3 h-1 w-16 bg-primary"></div>
                <div className="grid gap-2">
                    {categories.map(({ label, Icon }) => (
                        <Link
                            key={label}
                            href="#"
                            className="flex items-center gap-3   p-4 hover:bg-accent border-b last:border-b-0"
                        >
                            <Icon className="h-7 w-7  text-primary" />
                            {label}
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};
