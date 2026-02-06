import { ProductVariant } from "@/types/product-type";

export type CartItem = {
    productId: string;
    shopId: string;
    shopSlug: string;
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

const CART_STORAGE_KEY = "cart_";

const getCartKey = (shopSlug: string) => `${CART_STORAGE_KEY}${shopSlug}`;

export const MAX_QUANTITY = 20;

export const calculateItemTotal = (item: CartItem) => {
    const basePrice = item.price || 0;
    const variantExtraPrice = item.selectedVariants.reduce((sum, variant) => sum + variant.extraPrice, 0);
    return (basePrice + variantExtraPrice) * item.quantity;
};

export const calculateSubtotal = (items: CartItem[]) => {
    return items.reduce((sum, item) => sum + calculateItemTotal(item), 0);
};

export const cartStorage = {
    getCart: (shopSlug: string): CartItem[] => {
        if (typeof window === "undefined") return [];
        const key = getCartKey(shopSlug);
        const cart = localStorage.getItem(key);
        return cart ? JSON.parse(cart) : [];
    },

    addItem: (item: CartItem) => {
        const key = getCartKey(item.shopSlug);
        const cart = cartStorage.getCart(item.shopSlug);
        const existingItemIndex = cart.findIndex(
            (i) =>
                i.productId === item.productId &&
                i.shopId === item.shopId &&
                JSON.stringify(i.selectedVariants) === JSON.stringify(item.selectedVariants)
        );

        if (existingItemIndex !== -1) {
            const existingItem = cart[existingItemIndex];
            if (!existingItem) return;

            const newQuantity = existingItem.quantity + item.quantity;
            if (newQuantity > MAX_QUANTITY) {
                console.warn(`Cannot add more items. Maximum quantity of ${MAX_QUANTITY} would be exceeded`);
                return;
            }
            if (cart[existingItemIndex]) {
                cart[existingItemIndex].quantity = newQuantity;
            }
        } else {
            if (item.quantity > MAX_QUANTITY) {
                console.warn(`Cannot add items. Maximum quantity of ${MAX_QUANTITY} would be exceeded`);
                return;
            }
            cart.push(item);
        }

        localStorage.setItem(key, JSON.stringify(cart));
        window.dispatchEvent(new CustomEvent("cart-updated"));
    },

    removeItem: (productId: string, shopSlug: string, selectedVariants: SelectedVariant[]) => {
        const key = getCartKey(shopSlug);
        const cart = cartStorage.getCart(shopSlug);
        const updatedCart = cart.filter(
            (item) =>
                !(
                    item.productId === productId &&
                    JSON.stringify(item.selectedVariants) === JSON.stringify(selectedVariants)
                )
        );
        localStorage.setItem(key, JSON.stringify(updatedCart));
        window.dispatchEvent(new CustomEvent("cart-updated"));
    },

    updateQuantity: (productId: string, shopSlug: string, selectedVariants: SelectedVariant[], newQuantity: number) => {
        if (newQuantity > MAX_QUANTITY) {
            console.warn(`Maximum quantity of ${MAX_QUANTITY} exceeded`);
            return;
        }

        const key = getCartKey(shopSlug);
        const cart = cartStorage.getCart(shopSlug);
        const updatedCart = cart.map((item) =>
            item.productId === productId &&
            JSON.stringify(item.selectedVariants) === JSON.stringify(selectedVariants)
                ? { ...item, quantity: newQuantity }
                : item
        );
        localStorage.setItem(key, JSON.stringify(updatedCart));
        window.dispatchEvent(new CustomEvent("cart-updated"));
    },

    clearCart: (shopSlug: string) => {
        localStorage.removeItem(getCartKey(shopSlug));
        window.dispatchEvent(new CustomEvent("cart-updated"));
    },

    getTotalItems: (shopSlug: string): number => {
        const cart = cartStorage.getCart(shopSlug);
        return cart.reduce((total, item) => total + item.quantity, 0);
    },

    getSubtotal: (shopSlug: string): number => {
        const items = cartStorage.getCart(shopSlug);
        return calculateSubtotal(items);
    },

    getCartSummary: (shopSlug: string) => {
        const items = cartStorage.getCart(shopSlug);
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
export const getDefaultVariantSelection = (variants: ProductVariant[]): VariantSelection => {
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

export const createSelectedVariants = (variants: ProductVariant[], selection: VariantSelection): SelectedVariant[] => {
    return variants
        .filter((variant) => selection[variant.id])
        .map((variant) => {
            const option = variant.options.find((opt) => opt.id === selection[variant.id]);
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
