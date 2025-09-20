import { ProductVariant } from "@/types/product-type";

export type CartItem = {
    productId: string;
    shopId: string;
    quantity: number;
    name?: string;
    price?: number | null;
    photoURL?: string;
    selectedVariants: SelectedVariant[];
};

export type SelectedVariant = {
    variantId: string;
    variantName: string;
    optionId: string;
    optionName: string;
    extraPrice: number;
};

export type VariantSelection = {
    [variantId: string]: string; // variantId -> optionId
};

const CART_STORAGE_KEY = "shopping_cart_items";

export const MAX_QUANTITY = 20;

export const calculateItemTotal = (item: CartItem) => {
    const basePrice = item.price || 0;
    const variantExtraPrice = item.selectedVariants.reduce(
        (sum, variant) => sum + variant.extraPrice,
        0
    );
    return (basePrice + variantExtraPrice) * item.quantity;
};

export const calculateSubtotal = (items: CartItem[]) => {
    return items.reduce((sum, item) => sum + calculateItemTotal(item), 0);
};

export const cartStorage = {
    getCart: (): CartItem[] => {
        if (typeof window === "undefined") return [];

        const cart = localStorage.getItem(CART_STORAGE_KEY);
        return cart ? JSON.parse(cart) : [];
    },

    addItem: (item: CartItem) => {
        const cart = cartStorage.getCart();
        const existingItemIndex = cart.findIndex(
            (i) =>
                i.productId === item.productId &&
                i.shopId === item.shopId &&
                JSON.stringify(i.selectedVariants) ===
                    JSON.stringify(item.selectedVariants)
        );

        if (existingItemIndex !== -1) {
            const existingItem = cart[existingItemIndex];
            if (!existingItem) return;

            const newQuantity = existingItem.quantity + item.quantity;
            if (newQuantity > MAX_QUANTITY) {
                console.warn(
                    `Cannot add more items. Maximum quantity of ${MAX_QUANTITY} would be exceeded`
                );
                return;
            }
            if (cart[existingItemIndex]) {
                cart[existingItemIndex].quantity = newQuantity;
            }
        } else {
            if (item.quantity > MAX_QUANTITY) {
                console.warn(
                    `Cannot add items. Maximum quantity of ${MAX_QUANTITY} would be exceeded`
                );
                return;
            }
            cart.push(item);
        }

        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    },

    removeItem: (
        productId: string,
        shopId: string,
        selectedVariants: SelectedVariant[]
    ) => {
        const cart = cartStorage.getCart();
        const updatedCart = cart.filter(
            (item) =>
                !(
                    item.productId === productId &&
                    item.shopId === shopId &&
                    JSON.stringify(item.selectedVariants) ===
                        JSON.stringify(selectedVariants)
                )
        );
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(updatedCart));
    },

    updateQuantity: (
        productId: string,
        shopId: string,
        selectedVariants: SelectedVariant[],
        newQuantity: number
    ) => {
        if (newQuantity > MAX_QUANTITY) {
            console.warn(`Maximum quantity of ${MAX_QUANTITY} exceeded`);
            return;
        }

        const cart = cartStorage.getCart();
        const updatedCart = cart.map((item) =>
            item.productId === productId &&
            item.shopId === shopId &&
            JSON.stringify(item.selectedVariants) ===
                JSON.stringify(selectedVariants)
                ? { ...item, quantity: newQuantity }
                : item
        );
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(updatedCart));
    },

    clearCart: () => {
        localStorage.removeItem(CART_STORAGE_KEY);
    },

    getTotalItems: (): number => {
        const cart = cartStorage.getCart();
        return cart.reduce((total, item) => total + item.quantity, 0);
    },

    getSubtotal: (): number => {
        const items = cartStorage.getCart();
        return calculateSubtotal(items);
    },

    getCartSummary: () => {
        const items = cartStorage.getCart();
        const subtotal = calculateSubtotal(items);
        const shipping = 0; // Free shipping
        const total = subtotal + shipping;

        return {
            subtotal,
            shipping,
            total,
            itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
        };
    },
};

// Helper functions for variant selection
export const getDefaultVariantSelection = (
    variants: ProductVariant[]
): VariantSelection => {
    const selection: VariantSelection = {};

    variants.forEach((variant) => {
        if (variant.isRequired && variant.options.length > 0) {
            // Auto-select first option for required variants
            const firstOption = variant.options[0];
            if (firstOption) {
                selection[variant.id] = firstOption.id;
            }
        }
    });

    return selection;
};

export const createSelectedVariants = (
    variants: ProductVariant[],
    selection: VariantSelection
): SelectedVariant[] => {
    return variants
        .filter((variant) => selection[variant.id])
        .map((variant) => {
            const option = variant.options.find(
                (opt) => opt.id === selection[variant.id]
            );
            if (!option) return null;

            return {
                variantId: variant.id,
                variantName: variant.name,
                optionId: option.id,
                optionName: option.name,
                extraPrice: option.extraPrice,
            };
        })
        .filter((item): item is SelectedVariant => item !== null);
};

export const validateVariantSelection = (
    variants: ProductVariant[],
    selection: VariantSelection
): { isValid: boolean; missingRequired: string[] } => {
    const missingRequired: string[] = [];

    variants.forEach((variant) => {
        if (variant.isRequired && !selection[variant.id]) {
            missingRequired.push(variant.name);
        }
    });

    return {
        isValid: missingRequired.length === 0,
        missingRequired,
    };
};

// Convert cart items to order format
export const convertCartToOrderFormat = (cartItems: CartItem[]) => {
    if (cartItems.length === 0) return null;

    const firstItem = cartItems[0];
    if (!firstItem) return null;

    const shopId = firstItem.shopId;

    const orderItems = cartItems.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        orderItemVariant: item.selectedVariants.map((variant) => ({
            productVariantId: variant.variantId,
            productVariantOptionId: variant.optionId,
        })),
    }));

    return {
        shopId,
        orderItems,
    };
};
