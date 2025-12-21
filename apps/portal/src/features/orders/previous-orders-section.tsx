import Image from "next/image";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@workspace/ui/components/accordion";
import { Badge } from "@workspace/ui/components/badge";

import { CustomerOrderItemVariant, OrderStatus } from "@/types/order-type";

type PreviousOrderItemType = {
    quantity: number;
    productName: string | null;
    productImage: string | null;
    productPrice: number;
    orderItemVariant: CustomerOrderItemVariant[];
};

type PreviousOrder = {
    orderStatus: OrderStatus;
    courierStatus: string | null;
    discountedPrice: number | null;
    createdAt: string;
    customerName: string;
    orderItems: PreviousOrderItemType[];
};

interface PreviousOrdersSectionProps {
    orders: PreviousOrder[];
}

export const PreviousOrdersSection = ({ orders }: PreviousOrdersSectionProps) => {
    if (!orders || orders.length === 0) {
        return null;
    }

    return (
        <Accordion type="single" collapsible className="w-full rounded-lg border px-4">
            <AccordionItem value="previous-orders">
                <AccordionTrigger className="text-base hover:no-underline">
                    View Previous Orders ({orders.length})
                </AccordionTrigger>

                <AccordionContent>
                    <div className="max-h-96 space-y-4 overflow-y-auto pt-2">
                        {orders.map((prevOrder, index) => (
                            <div key={index} className="space-y-2 rounded-lg border p-3">
                                <div className="flex items-center justify-between border-b pb-2">
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium">{prevOrder.customerName}</p>
                                        <p className="text-muted-foreground text-xs">
                                            {new Date(prevOrder.createdAt).toLocaleDateString("en-US", {
                                                year: "numeric",
                                                month: "short",
                                                day: "numeric",
                                            })}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Badge
                                            variant={
                                                prevOrder.orderStatus === OrderStatus.CONFIRMED
                                                    ? "default"
                                                    : prevOrder.orderStatus === OrderStatus.CANCELLED
                                                      ? "destructive"
                                                      : "secondary"
                                            }
                                        >
                                            {prevOrder.orderStatus}
                                        </Badge>
                                        {prevOrder.discountedPrice && (
                                            <p className="text-sm font-semibold">৳ {prevOrder.discountedPrice}</p>
                                        )}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    {prevOrder.orderItems.map((item, itemIndex) => (
                                        <PreviousOrderItem key={itemIndex} item={item} />
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

const PreviousOrderItem = ({ item }: { item: PreviousOrderItemType }) => {
    return (
        <div className="bg-muted/30 flex items-center gap-2 rounded-md p-2">
            <Image
                src={item.productImage || "/placeholder.jpg"}
                alt={item.productName || ""}
                width={40}
                height={40}
                className="size-10 rounded-sm object-cover"
            />

            <div className="min-w-0 flex-1 space-y-1">
                <p className="truncate text-sm font-medium">
                    {item.productName} <span className="text-muted-foreground text-xs">(Qty: {item.quantity})</span>
                </p>

                {item.orderItemVariant?.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                        {item.orderItemVariant.map((ov, i) => (
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

            <div className="text-right">
                <p className="text-sm font-medium">৳ {item.productPrice}</p>
            </div>
        </div>
    );
};
