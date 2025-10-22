"use client";

import { BuyNowDialog } from "@/features/shop/products/buy-now-dialog";
import {
    cartStorage,
    createSelectedVariants,
    getDefaultVariantSelection,
    SelectedVariant,
    validateVariantSelection,
    VariantSelection,
} from "@/lib/cart";
import { Product } from "@/types/product-type";
import { Button } from "@workspace/ui/components/button";
import { toast } from "@workspace/ui/components/sonner";
import { useCallback, useEffect, useMemo, useState } from "react";

export const ProductDetailsActionButtons = ({
    product,
}: {
    product: Product;
}) => {
    const variants = useMemo(
        () => product?.productVariant || [],
        [product?.productVariant]
    );
    const [variantSelection, setVariantSelection] = useState<VariantSelection>(
        {}
    );
    const [selectedVariants, setSelectedVariants] = useState<SelectedVariant[]>(
        []
    );
    const [isAddingToCart, setIsAddingToCart] = useState(false);
    const [cartQuantity, setCartQuantity] = useState(0);
    const [isInCart, setIsInCart] = useState(false);

    // Initialize variant selection with defaults
    useEffect(() => {
        const defaultSelection = getDefaultVariantSelection(variants);
        setVariantSelection(defaultSelection);
        setSelectedVariants(createSelectedVariants(variants, defaultSelection));
    }, [variants]);

    // Update selected variants when selection changes
    useEffect(() => {
        setSelectedVariants(createSelectedVariants(variants, variantSelection));
    }, [variantSelection, variants]);

    // Check if current item is in cart
    const checkCartStatus = useCallback(() => {
        const cart = cartStorage.getCart();
        const currentSelectedVariants = createSelectedVariants(
            variants,
            variantSelection
        );

        const existingItem = cart.find(
            (item) =>
                item.productId === product.id &&
                item.shopId === product.shopId &&
                JSON.stringify(item.selectedVariants) ===
                    JSON.stringify(currentSelectedVariants)
        );

        if (existingItem) {
            setIsInCart(true);
            setCartQuantity(existingItem.quantity);
        } else {
            setIsInCart(false);
            setCartQuantity(0);
        }
    }, [product.id, product.shopId, variants, variantSelection]);

    // Check cart status when variants change
    useEffect(() => {
        checkCartStatus();
    }, [checkCartStatus]);

    const handleVariantChange = (variantId: string, optionId: string) => {
        setVariantSelection((prev) => ({
            ...prev,
            [variantId]: optionId,
        }));
    };

    const handleAddToCart = async () => {
        const validation = validateVariantSelection(variants, variantSelection);

        if (!validation.isValid) {
            toast.error(
                `Please select: ${validation.missingRequired.join(", ")}`
            );
            return;
        }

        setIsAddingToCart(true);

        try {
            const cartItem = {
                productId: product.id,
                shopId: product.shopId,
                quantity: 1,
                name: product.name,
                price: product.discountPrice || product.price,
                photoURL: product.photoURL,
                selectedVariants: selectedVariants,
            };

            cartStorage.addItem(cartItem);
            checkCartStatus(); // Update cart status

            toast.success("Item added to cart successfully!");
        } catch (error) {
            console.error("Error adding to cart:", error);
            toast.error("Failed to add item to cart");
        } finally {
            setIsAddingToCart(false);
        }
    };

    const handleQuantityIncrease = () => {
        if (cartQuantity >= 20) {
            toast.warning("Maximum quantity of 20 reached");
            return;
        }

        const newQuantity = cartQuantity + 1;
        cartStorage.updateQuantity(
            product.id,
            product.shopId,
            selectedVariants,
            newQuantity
        );
        setCartQuantity(newQuantity);
        toast.success("Cart updated successfully!");
    };

    const handleQuantityDecrease = () => {
        if (cartQuantity <= 1) {
            // Remove item from cart
            cartStorage.removeItem(
                product.id,
                product.shopId,
                selectedVariants
            );
            setIsInCart(false);
            setCartQuantity(0);
            toast.success("Item removed from cart");
        } else {
            const newQuantity = cartQuantity - 1;
            cartStorage.updateQuantity(
                product.id,
                product.shopId,
                selectedVariants,
                newQuantity
            );
            setCartQuantity(newQuantity);
            toast.success("Cart updated successfully!");
        }
    };

    return (
        <div>
            <div className="space-y-4">
                {variants.length > 0 &&
                    variants.map((variant) => (
                        <div
                            key={variant.id}
                            className="flex items-center gap-2 flex-wrap"
                        >
                            <span className="font-semibold capitalize">
                                {variant.name} :
                                {variant.isRequired && (
                                    <sup className="text-red-500 ml-0.5">*</sup>
                                )}
                            </span>

                            <>
                                {variant.options.map((option) => (
                                    <button
                                        key={option.id}
                                        onClick={() =>
                                            handleVariantChange(
                                                variant.id,
                                                option.id
                                            )
                                        }
                                        className={`border capitalize text-sm rounded px-2.5 py-1 transition-colors ${
                                            variantSelection[variant.id] ===
                                            option.id
                                                ? "bg-blue-500 text-white border-blue-500"
                                                : "hover:bg-gray-100"
                                        }`}
                                    >
                                        {option.name}
                                        {option.extraPrice > 0 && (
                                            <span className="ml-0.5 text-xs">
                                                (+{option.extraPrice})
                                            </span>
                                        )}
                                    </button>
                                ))}
                            </>
                        </div>
                    ))}
            </div>

            <div className="grid md:grid-cols-2 gap-4 mt-6">
                {!isInCart ? (
                    <Button
                        size={"lg"}
                        onClick={handleAddToCart}
                        disabled={isAddingToCart}
                        className="w-full"
                    >
                        {isAddingToCart ? "Adding..." : "Add To Cart"}
                    </Button>
                ) : (
                    <div className="flex items-center justify-center gap-3 bg-purple-100 rounded-lg p-3 border border-purple-200">
                        <button
                            onClick={handleQuantityDecrease}
                            className="w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isAddingToCart}
                            title="Decrease quantity"
                        >
                            -
                        </button>
                        <span className="text-lg font-semibold text-purple-700 min-w-[2rem] text-center">
                            {cartQuantity}
                        </span>
                        <button
                            onClick={handleQuantityIncrease}
                            className="w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isAddingToCart}
                            title="Increase quantity"
                        >
                            +
                        </button>
                    </div>
                )}

                {product && <BuyNowDialog product={product} />}
            </div>
        </div>
    );
};
