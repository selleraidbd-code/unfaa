import { AIOrderGenerationData, AIOrderGenerationProductInfo } from "@/types/order-type";

// Separate customer state interface
export interface CustomerState {
    customerName: string;
    customerPhone: string;
    customerAddress: string;
    customerId: string;
}

// Separate product state interface
export interface ProductState {
    productInfo: (AIOrderGenerationProductInfo & {
        productId: string; // Make it non-null for editing
        selectedProductId?: string;
        selectedVariantId?: string;
        availableVariants?: any[];
    })[];
}

// Combined state for backward compatibility
export interface EditableOrderData extends AIOrderGenerationData {
    customerId: string; // Make it non-null for editing
    productInfo: (AIOrderGenerationProductInfo & {
        productId: string; // Make it non-null for editing
        selectedProductId?: string;
        selectedVariantId?: string;
        availableVariants?: any[];
    })[];
}
