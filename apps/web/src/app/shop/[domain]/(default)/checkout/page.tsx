"use client";

import { useEffect, useState } from "react";

import BillingDetails from "@/features/checkout/BillingDetails";
import CheckoutForm from "@/features/checkout/CheckoutForm";
import { CircleDot } from "lucide-react";

import { CustomErrorOrEmpty } from "@/components/ui/custom-error-or-empty";
import { CartItem, cartStorage } from "@/lib/cart";
import { Button } from "@workspace/ui/components/button";
import Image from "next/image";

const Page = () => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [summary, setSummary] = useState({
        subtotal: 0,
        shipping: 0,
        total: 0,
        itemCount: 0,
    });

    useEffect(() => {
        const updateCart = () => {
            const items = cartStorage.getCart();
            setCartItems(items);
            setSummary(cartStorage.getCartSummary());
        };

        updateCart();
        window.addEventListener("cart-updated", updateCart);
        return () => window.removeEventListener("cart-updated", updateCart);
    }, []);

    if (cartItems.length === 0) {
        return (
            <CustomErrorOrEmpty
                title="আপনি কোন প্রোডাক্ট যোগ করেননি"
                description="আপনার কার্টে কোন প্রোডাক্ট নেই। প্রোডাক্ট যোগ করতে নিচের বাটনে ক্লিক করুন।"
                href="/products"
                buttonText="প্রোডাক্টগুলো দেখুন"
                className="h-screen"
            />
        );
    }

    return (
        <CheckoutForm>
            <div className="container py-12 max-sm:px-3 lg:py-16">
                <div className="flex gap-10 max-lg:flex-col lg:gap-16">
                    <div className="w-full lg:w-[55%]">
                        <h2 className="font-medium lg:text-xl">
                            অর্ডার সম্পর্কিত তথ্য
                        </h2>
                        <BillingDetails />
                    </div>
                    <div className="w-full lg:w-[45%]">
                        <h2 className="font-medium lg:text-xl">আপনার অর্ডার</h2>
                        <div className="py-6">
                            <div className="flex items-center border-b border-dashed border-foreground/20 pb-3 max-lg:justify-between max-lg:text-sm lg:pb-4">
                                <p className="lg:w-[70%]">প্রোডাক্ট</p>
                                <p className="lg:w-[30%]">সাবটোটাল</p>
                            </div>
                            <div className="overflow-y-auto md:max-h-[50dvh]">
                                {cartItems.map((item) => (
                                    <div
                                        key={`${item.productId}-${item.selectedVariants[0]?.variantId || "no-variant"}`}
                                        className="flex items-center py-2.5"
                                    >
                                        <div className="flex w-[70%] items-center gap-2">
                                            <Image
                                                src={item.photoURL || ""}
                                                alt={item.name || ""}
                                                width={100}
                                                height={100}
                                                className="h-16 w-16 rounded-sm"
                                            />
                                            <div>
                                                <p>{item.name}</p>
                                                {item.selectedVariants.length >
                                                    0 && (
                                                    <p className="text-sm text-muted-foreground">
                                                        Variant:{" "}
                                                        {item.selectedVariants
                                                            .map(
                                                                (v) =>
                                                                    v.optionName
                                                            )
                                                            .join(", ")}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="w-[30%]">
                                            <span>
                                                {item.quantity} × ৳{" "}
                                                {item.price || 0}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-4 border-y border-dashed border-foreground/20 py-3 max-lg:text-sm">
                                <div className="flex items-center justify-between">
                                    <p className="w-[70%]">সাবটোটাল</p>
                                    <p className="w-[30%]">
                                        ৳ {summary.subtotal.toLocaleString()}
                                    </p>
                                </div>

                                <div className="flex items-center justify-between">
                                    <p className="w-[70%]">শিপিং প্রসেস</p>
                                    <p className="w-[30%]">Free Shipping</p>
                                </div>
                            </div>
                            <div className="flex items-center justify-between pt-3 font-medium">
                                <p className="w-[70%]">টোটাল</p>
                                <p className="w-[30%]">
                                    ৳ {summary.total.toLocaleString()}
                                </p>
                            </div>
                        </div>

                        <div className="bg-primary/10 p-4 lg:p-6">
                            <h2 className="flex items-center gap-3 pb-4 font-medium lg:text-lg">
                                <CircleDot className="size-5 text-primary" />
                                ক্যাশঅন ডেলিভারি
                            </h2>
                            <div className="relative flex items-center gap-2 bg-white p-2 px-3 max-lg:text-sm">
                                <p className="z-20">
                                    পন্য হাতে পেয়ে মূল্য পরিশোধ করবেন
                                </p>
                                <span className="absolute -top-px left-7 z-0 h-4 w-4 -translate-y-1/2 rotate-45 bg-white"></span>
                            </div>
                        </div>

                        <div className="pt-10">
                            <Button
                                type="submit"
                                className="h-12 w-full text-base lg:h-14 lg:text-lg"
                            >
                                অর্ডার করুন ৳ {summary.total.toLocaleString()}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </CheckoutForm>
    );
};

export default Page;
