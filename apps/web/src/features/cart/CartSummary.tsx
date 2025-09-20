"use client";

import { useEffect, useState } from "react";

import { cartStorage } from "@/lib/cart";
import { CustomButton } from "@/components/ui/custom-button";
import { Separator } from "@workspace/ui/components/separator";

type CartSummaryData = {
    subtotal: number;
    shipping: number;
    total: number;
    itemCount: number;
};

const CartSummary: React.FC = () => {
    const [summary, setSummary] = useState<CartSummaryData>({
        subtotal: 0,
        shipping: 0,
        total: 0,
        itemCount: 0,
    });

    useEffect(() => {
        const updateSummary = () => {
            const items = cartStorage.getCart();
            if (items.length === 0) {
                setSummary({
                    subtotal: 0,
                    shipping: 0,
                    total: 0,
                    itemCount: 0,
                });
                return;
            }

            const cartSummary = cartStorage.getCartSummary();
            setSummary(cartSummary);
        };

        updateSummary();
        window.addEventListener("cart-updated", updateSummary);
        return () => window.removeEventListener("cart-updated", updateSummary);
    }, []);

    return (
        <div className="h-fit rounded-sm border-2 p-4 lg:p-6">
            <h2 className="mb-4 font-semibold lg:mb-6 lg:text-lg">
                Cart Summary
            </h2>
            <div className="space-y-4 pb-4">
                <div className="flex justify-between">
                    <span>Items ({summary.itemCount})</span>
                    <span>৳ {summary.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>
                        {summary.shipping === 0
                            ? "Free"
                            : `৳ ${summary.shipping.toLocaleString()}`}
                    </span>
                </div>
                <Separator className="bg-foreground/20" />
                <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>৳ {summary.total.toLocaleString()}</span>
                </div>
            </div>

            <CustomButton href="/checkout" className="w-full">
                Proceed to Checkout
            </CustomButton>
        </div>
    );
};

export default CartSummary;
