import { useState } from "react";

import { ProductListInProductStep } from "@/features/make-order/product-step/product-list-in-product-step";
import { OrderItemInProductStep } from "@/features/make-order/product-step/sales-item-in-product-step";
import { useGetProductsQuery } from "@/redux/api/product-api";

import { OrderStepIndicator } from "@/types/order-type";
import { OrderItem } from "@/types/order-type";
import { Product } from "@/types/product-type";

interface ProductsStepProps {
    orderItems: OrderItem[];
    updateQuantity: (id: string, quantity: number) => void;
    removeOrderItem: (id: string) => void;
    updateOrderItemVariants: (
        id: string,
        selectedVariants: OrderItem["selectedVariants"]
    ) => void;
    addProductToOrder: (product: Product) => void;
    setActiveStep: (step: OrderStepIndicator) => void;
    calculateTotal: () => number;
    shopId: string;
}

export const ProductsStep = ({
    orderItems,
    addProductToOrder,
    updateQuantity,
    removeOrderItem,
    updateOrderItemVariants,
    setActiveStep,
    calculateTotal,
    shopId,
}: ProductsStepProps) => {
    const [searchTerm, setSearchTerm] = useState("");

    const { data, isLoading } = useGetProductsQuery({
        searchTerm: searchTerm || undefined,
        limit: 100,
        shopId,
    });

    return (
        <div className="grid gap-8 lg:grid-cols-12">
            <ProductListInProductStep
                products={data?.data || []}
                isLoading={isLoading}
                onSearch={setSearchTerm}
                addProductToOrder={addProductToOrder}
            />

            <OrderItemInProductStep
                products={data?.data || []}
                orderItems={orderItems}
                updateQuantity={updateQuantity}
                removeOrderItem={removeOrderItem}
                updateOrderItemVariants={updateOrderItemVariants}
                calculateTotal={calculateTotal}
                setActiveStep={setActiveStep}
            />
        </div>
    );
};
