import Image from "next/image";

import { CourierStatusBadge } from "@/features/orders/courier-status-badge";
import { OrderStatusBadge } from "@/features/orders/order-status-badge";
import { Badge } from "@workspace/ui/components/badge";
import { formatDateNumeric } from "@workspace/ui/lib/formateDate";

import { CustomerOrderItem, CustomerOrderItemVariant } from "@/types/order-type";

interface PreviousOrdersSectionProps {
    orders: CustomerOrderItem[];
    orderId: string;
}

export const PreviousOrdersSection = ({ orders, orderId }: PreviousOrdersSectionProps) => {
    // Filter out the current order from the list
    const filteredOrders = orders.filter((order) => order.id !== orderId);

    if (!filteredOrders || filteredOrders.length === 0) {
        return null;
    }

    return (
        <div className="md:card space-y-2 pb-3 md:space-y-4 md:py-4">
            <h2 className="pb-2 text-base max-sm:text-sm md:border-b">Previous Orders ({filteredOrders.length})</h2>

            {filteredOrders.map((prevOrder, index) => (
                <div key={index} className="space-y-2 border-b pb-2 last:border-b-0">
                    <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 text-sm">
                            <span className="text-muted-foreground max-sm:hidden">Order {index + 1}:</span>
                            {prevOrder.discountedPrice && (
                                <p className="text-sm font-semibold">৳ {prevOrder.discountedPrice}</p>
                            )}
                            <OrderStatusBadge status={prevOrder.orderStatus} />
                            <CourierStatusBadge status={prevOrder.courierStatus} />
                        </div>
                        <span className="text-xs sm:text-sm">{formatDateNumeric(prevOrder.createdAt)}</span>
                    </div>

                    <div className="grid gap-2 sm:grid-cols-2">
                        {prevOrder.orderItems.map((item, itemIndex) => (
                            <OrderItem
                                key={itemIndex}
                                quantity={item.quantity}
                                productName={item.productName}
                                productImage={item.productImage}
                                productPrice={item.productPrice}
                                orderItemVariant={item.orderItemVariant}
                            />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

type OrderItemProps = {
    quantity: number;
    productName: string | null;
    productImage: string | null;
    productPrice: number;
    orderItemVariant: CustomerOrderItemVariant[];
};

export const OrderItem = ({ quantity, productName, productImage, productPrice, orderItemVariant }: OrderItemProps) => {
    return (
        <div className="flex items-center gap-2 rounded-md">
            <Image
                src={productImage || "/placeholder.jpg"}
                alt={productName || ""}
                width={40}
                height={40}
                className="size-6 rounded object-cover sm:size-8"
            />

            <div className="min-w-0 flex-1 space-y-1">
                <p className="flex flex-wrap items-center gap-x-2 truncate text-xs font-medium sm:text-sm">
                    <span className="">{productName}</span>
                    <span className="text-primary font-medium">৳ {productPrice}</span>
                    <span className="text-muted-foreground text-xs">x {quantity}</span>
                </p>

                {orderItemVariant?.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                        {orderItemVariant.map((ov, i) => (
                            <Badge key={i} variant="outline" className="h-5 text-xs">
                                <span className="text-primary">{ov.productVariantName}:</span>{" "}
                                {ov.productVariantOptionName}
                                {typeof ov.productVariantOptionExtraPrice === "number" &&
                                ov.productVariantOptionExtraPrice > 0
                                    ? ` (+${ov.productVariantOptionExtraPrice})`
                                    : ""}
                            </Badge>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
