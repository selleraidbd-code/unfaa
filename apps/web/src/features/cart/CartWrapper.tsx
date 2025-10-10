"use client";

import { useEffect, useState } from "react";

import CartItems from "@/features/cart/CartItems";
import { CartSummary } from "@/features/cart/CartSummary";

import { cartStorage } from "@/lib/cart";
import { CustomErrorOrEmpty } from "@/components/ui/custom-error-or-empty";
import { useShop } from "@/contexts/shop-context";
import { getLink } from "@/lib/get-link";

const CartWrapper = () => {
    const { shop } = useShop();
    const [isEmpty, setIsEmpty] = useState(true);

    useEffect(() => {
        const updateCartState = () => {
            const items = cartStorage.getCart();
            setIsEmpty(items.length === 0);
        };

        updateCartState();
        window.addEventListener("cart-updated", updateCartState);
        return () =>
            window.removeEventListener("cart-updated", updateCartState);
    }, []);

    if (isEmpty) {
        return (
            <CustomErrorOrEmpty
                title="আপনি কোন প্রোডাক্ট যোগ করেননি"
                description="আপনার কার্টে কোন প্রোডাক্ট নেই। প্রোডাক্ট যোগ করতে নিচের বাটনে ক্লিক করুন।"
                buttonText="প্রোডাক্টগুলো দেখুন"
                href={getLink({ shopSlug: shop.slug, path: "/products" })}
            />
        );
    }

    return (
        <div className="container space-y-5 py-8 lg:py-16 min-h-[70dvh]">
            <h1 className="mb-6 text-2xl font-semibold lg:mb-12 lg:text-3xl">
                Shopping Cart
            </h1>
            <div className="grid gap-16 lg:grid-cols-3">
                <CartItems shopId={shop.id} shopSlug={shop.slug} />
                <CartSummary shopSlug={shop.slug} />
            </div>
        </div>
    );
};

export default CartWrapper;
