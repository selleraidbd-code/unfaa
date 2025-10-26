import { ChevronRight, Package, ShoppingCart, X } from "lucide-react";

import { OrderStepIndicator } from "@/types/order-type";
import { OrderItem } from "@/types/order-type";
import { Product } from "@/types/product-type";
import { Button } from "@workspace/ui/components/button";
import { VariantSelector } from "@/features/make-order/product-step/variant-selector";

type OrderItemInProductStepProps = {
    products: Product[];
    orderItems: OrderItem[];
    updateQuantity: (id: string, quantity: number) => void;
    removeOrderItem: (id: string) => void;
    updateOrderItemVariants: (
        id: string,
        selectedVariants: OrderItem["selectedVariants"]
    ) => void;
    calculateTotal: () => number;
    setActiveStep: (step: OrderStepIndicator) => void;
};

export const OrderItemInProductStep = ({
    products,
    orderItems,
    updateQuantity,
    removeOrderItem,
    updateOrderItemVariants,
    calculateTotal,
    setActiveStep,
}: OrderItemInProductStepProps) => {
    console.log(orderItems);
    return (
        <div className="col-span-7 space-y-4 py-4">
            <h2 className="sub-title">Order Items</h2>

            {orderItems.length > 0 ? (
                <div className="max-h-[calc(100vh-330px)] overflow-y-auto rounded-md border">
                    <table className="w-full">
                        <thead className="sticky top-0 bg-gray-50">
                            <tr className="border-b">
                                <th className="px-4 py-3 text-left text-sm font-medium">
                                    Product
                                </th>
                                <th className="px-4 py-3 text-center text-sm font-medium">
                                    Variants
                                </th>
                                <th className="px-4 py-3 text-right text-sm font-medium">
                                    Price
                                </th>
                                <th className="px-4 py-3 text-right text-sm font-medium">
                                    Quantity
                                </th>
                                <th className="px-4 py-3 text-right text-sm font-medium">
                                    Subtotal
                                </th>
                                <th className="px-4 py-3 text-right text-sm font-medium">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {orderItems.map((item) => {
                                const product = products.find(
                                    (p) => p.id === item.id
                                );
                                const extraPrice =
                                    item.selectedVariants?.reduce(
                                        (sum, variant) =>
                                            sum + variant.extraPrice,
                                        0
                                    ) || 0;
                                const finalPrice = item.price + extraPrice;
                                const itemSubtotal = finalPrice * item.quantity;

                                return (
                                    <tr key={item.id} className="border-b">
                                        <td className="px-4 py-3 text-sm">
                                            {item.name}
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            {product &&
                                            product.productVariant.length >
                                                0 ? (
                                                <VariantSelector
                                                    product={product}
                                                    orderItem={item}
                                                    onVariantChange={
                                                        updateOrderItemVariants
                                                    }
                                                />
                                            ) : (
                                                <span className="text-xs text-gray-400">
                                                    No variants
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-right text-sm">
                                            <div className="space-y-1">
                                                <div>
                                                    ৳{" "}
                                                    {item.price.toLocaleString()}
                                                </div>
                                                {extraPrice > 0 && (
                                                    <div className="text-xs text-green-600">
                                                        +৳{" "}
                                                        {extraPrice.toLocaleString()}
                                                    </div>
                                                )}

                                                {extraPrice > 0 && (
                                                    <div className="font-medium">
                                                        ৳{" "}
                                                        {finalPrice.toLocaleString()}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <div className="flex items-center justify-end">
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    className="h-7 w-7"
                                                    onClick={() =>
                                                        updateQuantity(
                                                            item.id,
                                                            item.quantity - 1
                                                        )
                                                    }
                                                >
                                                    -
                                                </Button>
                                                <span className="w-10 text-center">
                                                    {item.quantity}
                                                </span>
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    className="h-7 w-7"
                                                    onClick={() =>
                                                        updateQuantity(
                                                            item.id,
                                                            item.quantity + 1
                                                        )
                                                    }
                                                    disabled={
                                                        item.quantity >=
                                                        (products.find(
                                                            (p) =>
                                                                p.id === item.id
                                                        )?.stock || 0)
                                                    }
                                                >
                                                    +
                                                </Button>
                                            </div>
                                        </td>

                                        <td className="px-4 py-3 text-right text-sm font-medium">
                                            ৳ {itemSubtotal.toLocaleString()}
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-7 w-7 text-red-500"
                                                onClick={() =>
                                                    removeOrderItem(item.id)
                                                }
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="rounded-md border bg-gray-50 p-8 text-center">
                    <ShoppingCart className="mx-auto mb-2 h-12 w-12 text-gray-400" />
                    <h3 className="mb-1 text-lg font-medium">
                        Your order is empty
                    </h3>
                    <p className="mb-4 text-gray-500">
                        Search for products or add a custom item
                    </p>
                </div>
            )}

            <div className="flex justify-between">
                <p className="flex items-center gap-2 text-sm text-gray-800">
                    <Package className="size-5" /> Total Items: ({" "}
                    {orderItems.reduce((sum, item) => sum + item.quantity, 0)} )
                </p>
                <p className="text-lg font-semibold">
                    ৳ {calculateTotal().toLocaleString()}
                </p>
            </div>

            <div className="flex justify-between border-t pt-4 pb-0">
                <Button
                    variant="outline"
                    onClick={() => setActiveStep(OrderStepIndicator.CUSTOMER)}
                >
                    Back to Customer
                </Button>
                <Button
                    onClick={() => setActiveStep(OrderStepIndicator.DETAILS)}
                    disabled={orderItems.length === 0}
                >
                    Continue to Details
                    <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
            </div>
        </div>
    );
};
