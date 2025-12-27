import Image from "next/image";

import { CourierStatusBadge } from "@/features/orders/courier-status-badge";
import { OrderStatusBadge } from "@/features/orders/order-status-badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@workspace/ui/components/accordion";
import { formatDateWithTime } from "@workspace/ui/lib/formateDate";

import { CustomerOrderItem, CustomerOrderItemVariant } from "@/types/order-type";

interface PreviousOrdersSectionProps {
    orders: CustomerOrderItem[];
    orderId: string;
}

export const PreviousOrdersSection = ({ orders, orderId }: PreviousOrdersSectionProps) => {
    const filteredOrders = orders.filter((order) => order.id !== orderId);

    if (!filteredOrders || filteredOrders.length === 0) {
        return null;
    }

    return (
        <Accordion type="single" collapsible className="w-full rounded-sm border px-3 sm:rounded-lg sm:px-4">
            <AccordionItem value="previous-orders">
                <AccordionTrigger className="text-base hover:no-underline">
                    View Previous Orders ({filteredOrders.length})
                </AccordionTrigger>

                <AccordionContent>
                    <div className="max-h-96 space-y-2 overflow-y-auto sm:space-y-4 sm:pt-2">
                        {filteredOrders.map((prevOrder, index) => (
                            <div key={index} className="space-y-2 rounded-sm border p-2.5 sm:rounded-lg sm:p-3">
                                <div className="flex items-center justify-between border-b pb-2">
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium">{prevOrder.customerName}</p>
                                        <p className="text-muted-foreground text-xs">
                                            {formatDateWithTime(prevOrder.createdAt)}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <OrderStatusBadge status={prevOrder.orderStatus} />
                                        <CourierStatusBadge status={prevOrder.courierStatus} />
                                        {(prevOrder.discountedPrice || prevOrder.totalAmount) && (
                                            <p className="text-sm font-semibold">
                                                ৳ {prevOrder.discountedPrice || prevOrder.totalAmount}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div className="space-y-2">
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
                </AccordionContent>
            </AccordionItem>
        </Accordion>
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
        <div className="bg-muted/30 flex items-center gap-2 rounded-md p-2">
            <Image
                src={productImage || "/placeholder.jpg"}
                alt={productName || ""}
                width={40}
                height={40}
                className="size-10 rounded-sm object-cover"
            />

            <div className="min-w-0 flex-1">
                <p className="line-clamp-1 text-sm font-medium">{productName}</p>

                <div className="flex flex-wrap items-center gap-1">
                    {/* <span className="text-muted-foreground text-xs">x {quantity}</span> */}
                    <span className="text-muted-foreground text-xs">
                        <span className="text-primary">Qty:</span> {quantity}
                    </span>
                    ,
                    {orderItemVariant?.length > 0 && (
                        <p className="flex flex-wrap gap-1">
                            {orderItemVariant.map((ov, i) => (
                                <span key={i} className="text-xs">
                                    <span className="text-primary">{ov.productVariantName}:</span>{" "}
                                    {ov.productVariantOptionName}
                                    {typeof ov.productVariantOptionExtraPrice === "number" &&
                                    ov.productVariantOptionExtraPrice > 0
                                        ? ` (+${ov.productVariantOptionExtraPrice})`
                                        : ""}{" "}
                                    ,
                                </span>
                            ))}
                        </p>
                    )}
                </div>
            </div>

            <div className="text-right">
                <p className="text-sm font-medium">৳ {productPrice}</p>
            </div>
        </div>
    );
};
