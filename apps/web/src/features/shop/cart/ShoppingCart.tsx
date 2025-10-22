"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { ShoppingBag, Trash2 } from "lucide-react";

import { CustomButton } from "@/components/ui/custom-button";
import { CartItem, cartStorage, SelectedVariant } from "@/lib/cart";
import { useShop } from "@/contexts/shop-context";
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@workspace/ui/components/hover-card";
import { ScrollArea } from "@workspace/ui/components/scroll-area";
import { Separator } from "@workspace/ui/components/separator";
import { getLink } from "@/lib/get-link";

export const ShoppingCart = () => {
    const { shop } = useShop();
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [summary, setSummary] = useState({
        subtotal: 0,
        total: 0,
        itemCount: 0,
    });

    useEffect(() => {
        const updateCart = () => {
            const items = cartStorage.getCart();
            setCartItems(items);

            if (items.length === 0) {
                setSummary({
                    subtotal: 0,
                    total: 0,
                    itemCount: 0,
                });
                return;
            }

            const cartSummary = cartStorage.getCartSummary();
            setSummary({
                subtotal: cartSummary.subtotal,
                total: cartSummary.total,
                itemCount: cartSummary.itemCount,
            });
        };

        updateCart();
        window.addEventListener("cart-updated", updateCart);
        return () => window.removeEventListener("cart-updated", updateCart);
    }, []);

    const handleRemoveItem = (
        productId: string,
        selectedVariants: SelectedVariant[]
    ) => {
        cartStorage.removeItem(productId, shop.id, selectedVariants);
        window.dispatchEvent(new Event("cart-updated"));
    };

    if (summary.itemCount === 0) {
        return (
            <Link href={getLink({ shopSlug: shop.slug, path: "/cart" })}>
                <ShoppingBag className="size-5 cursor-pointer hover:text-primary" />
            </Link>
        );
    }

    return (
        <HoverCard openDelay={200}>
            <HoverCardTrigger className="relative">
                <ShoppingBag className="size-5 cursor-pointer hover:text-primary" />
                <span className="absolute -right-2 -top-2 flex aspect-square size-4 items-center justify-center rounded-full bg-primary text-center text-xs text-primary-foreground">
                    {summary.itemCount}
                </span>
            </HoverCardTrigger>
            <HoverCardContent className="w-80 px-0" align="end">
                <div className="flex flex-col gap-2">
                    <ScrollArea className="flex max-h-[40dvh] flex-col gap-2 px-4">
                        {cartItems.map((item, index) => (
                            <div
                                key={`${item.productId}-${index}`}
                                className="flex items-center gap-2 py-1"
                            >
                                <Image
                                    src={item.photoURL || ""}
                                    alt={item.name || ""}
                                    width={56}
                                    height={56}
                                    className="aspect-square object-cover"
                                />
                                <div className="flex-1">
                                    <p className="text-sm font-medium">
                                        {item.name}
                                        {item.selectedVariants &&
                                            item.selectedVariants.length >
                                                0 && (
                                                <span className="text-xs text-white/70">
                                                    {" "}
                                                    -{" "}
                                                    {item.selectedVariants
                                                        .map(
                                                            (v) => v.optionName
                                                        )
                                                        .join(", ")}
                                                </span>
                                            )}
                                    </p>
                                    <div className="flex items-center justify-between font-medium">
                                        <p className="text-sm">
                                            {item.quantity} × ৳ {item.price}
                                        </p>
                                        <button
                                            onClick={() =>
                                                handleRemoveItem(
                                                    item.productId,
                                                    item.selectedVariants
                                                )
                                            }
                                            className="hover:text-destructive"
                                        >
                                            <Trash2 className="size-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </ScrollArea>
                    <Separator className="my-2 bg-white/20" />
                    <div className="flex items-center justify-between px-4">
                        <p className="text-sm font-medium">
                            Total Items: {summary.itemCount}
                        </p>
                        <p className="text-sm font-medium">
                            Total: ৳ {summary.total.toLocaleString()}
                        </p>
                    </div>
                    <Separator className="my-2 bg-white/20" />
                    <div className="grid w-full grid-cols-2 gap-4 px-4">
                        <CustomButton
                            href={getLink({
                                shopSlug: shop.slug,
                                path: "/cart",
                            })}
                            className="w-full"
                            disabled={summary.itemCount === 0}
                        >
                            View Cart
                        </CustomButton>
                        <CustomButton
                            href={getLink({
                                shopSlug: shop.slug,
                                path: "/checkout",
                            })}
                            className="w-full"
                            disabled={summary.itemCount === 0}
                        >
                            Checkout
                        </CustomButton>
                    </div>
                </div>
            </HoverCardContent>
        </HoverCard>
    );
};
