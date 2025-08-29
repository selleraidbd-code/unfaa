import { useState } from "react";

import { ProductListInProductStep } from "@/features/make-order/product-step/product-list-in-product-step";
import { OrderItemInProductStep } from "@/features/make-order/product-step/sales-item-in-product-step";
import { useGetProductsQuery } from "@/redux/api/product-api";

import { OrderStepIndicator } from "@/types/order-type";
import { OrderItem } from "@/types/order-type copy";
import { Product } from "@/types/product-type";

interface ProductsStepProps {
    orderItems: OrderItem[];
    updateQuantity: (id: string, quantity: number) => void;
    removeOrderItem: (id: string) => void;
    addProductToOrder: (product: Product) => void;
    setActiveStep: (step: OrderStepIndicator) => void;
    calculateTotal: () => number;
}

export const ProductsStep = ({
    orderItems,
    addProductToOrder,
    updateQuantity,
    removeOrderItem,
    setActiveStep,
    calculateTotal,
}: ProductsStepProps) => {
    const [searchTerm, setSearchTerm] = useState("");

    const { data } = useGetProductsQuery({
        searchTerm: searchTerm || undefined,
        limit: 100,
    });

    return (
        <div className="grid gap-8 lg:grid-cols-12">
            <ProductListInProductStep
                products={data?.data || []}
                onSearch={setSearchTerm}
                addProductToOrder={addProductToOrder}
            />

            <OrderItemInProductStep
                products={data?.data || []}
                orderItems={orderItems}
                updateQuantity={updateQuantity}
                removeOrderItem={removeOrderItem}
                calculateTotal={calculateTotal}
                setActiveStep={setActiveStep}
            />
        </div>
    );
};
