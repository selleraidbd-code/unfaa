import { ProductVariant } from "@/types/product-type";

export type CartItem = {
    productId: string;
    variantId: string;
    quantity: number;
    name?: string;
    price?: number | null;
    photoURL?: string;
    variant?: ProductVariant | null;
};

const CART_STORAGE_KEY = "shopping_cart";

export const MAX_QUANTITY = 20;

export const calculateItemTotal = (item: CartItem) => {
    const price =
        item.variant?.options.find((option) => option.id === item.variantId)
            ?.extraPrice ||
        item.price ||
        0;
    return price * item.quantity;
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
                i.productId === item.productId && i.variantId === item.variantId
        );

        if (existingItemIndex !== -1) {
            const newQuantity =
                cart[existingItemIndex].quantity + item.quantity;
            if (newQuantity > MAX_QUANTITY) {
                console.warn(
                    `Cannot add more items. Maximum quantity of ${MAX_QUANTITY} would be exceeded`
                );
                return;
            }
            cart[existingItemIndex].quantity = newQuantity;
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

    removeItem: (productId: string, variantId: string) => {
        const cart = cartStorage.getCart();
        const updatedCart = cart.filter(
            (item) =>
                !(item.productId === productId && item.variantId === variantId)
        );
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(updatedCart));
    },

    updateQuantity: (
        productId: string,
        variantId: string,
        newQuantity: number
    ) => {
        if (newQuantity > MAX_QUANTITY) {
            console.warn(`Maximum quantity of ${MAX_QUANTITY} exceeded`);
            return;
        }

        const cart = cartStorage.getCart();
        const updatedCart = cart.map((item) =>
            item.productId === productId && item.variantId === variantId
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
