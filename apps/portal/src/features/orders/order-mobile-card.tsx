"use client";

import Link from "next/link";

import { CourierStatusBadge } from "@/features/orders/courier-status-badge";
import { CustomerOrderStatsChart } from "@/features/orders/customer-order-stats-chart";
import { OrderStatusBadge } from "@/features/orders/order-status-badge";
import { Checkbox } from "@workspace/ui/components/checkbox";
import { CustomTextCopy } from "@workspace/ui/components/custom/custom-text-copy";
import { formatDateShortWithTime } from "@workspace/ui/lib/formateDate";
import { cn } from "@workspace/ui/lib/utils";
import { BookText, NotebookText, NotepadText, Phone, PhoneCall, User } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa6";

import { Order, OrderStatus } from "@/types/order-type";

const getCardBackgroundColor = (status: OrderStatus) => {
    switch (status) {
        case OrderStatus.RECEIVED:
            return "bg-emerald-50/50 border-emerald-200 dark:bg-emerald-950/30 dark:border-emerald-800/50";
        case OrderStatus.CONFIRMED:
            return "bg-green-50/50 border-green-200 dark:bg-green-950/30 dark:border-green-800/50";
        case OrderStatus.PLACED:
            return "bg-blue-50/50 border-blue-200 dark:bg-blue-950/30 dark:border-blue-800/50";
        case OrderStatus.PROCESSING:
            return "bg-indigo-50/50 border-indigo-200 dark:bg-indigo-950/30 dark:border-indigo-800/50";
        case OrderStatus.SEND:
            return "bg-purple-50/50 border-purple-200 dark:bg-purple-950/30 dark:border-purple-800/50";
        case OrderStatus.WAITING:
            return "bg-orange-50/50 border-orange-200 dark:bg-orange-950/30 dark:border-orange-800/50";
        case OrderStatus.HOLD:
            return "bg-yellow-50/50 border-yellow-200 dark:bg-yellow-950/30 dark:border-yellow-800/50";
        case OrderStatus.CANCELLED:
            return "bg-red-50/50 border-red-200 dark:bg-red-950/30 dark:border-red-800/50";
        case OrderStatus.RETURN:
            return "bg-pink-50/50 border-pink-200 dark:bg-pink-950/30 dark:border-pink-800/50";
        case OrderStatus.INCOMPLETE:
            return "bg-slate-50/50 border-slate-200 dark:bg-slate-950/30 dark:border-slate-800/50";
        case OrderStatus.NZC:
            return "bg-gray-50/50 border-gray-200 dark:bg-gray-950/30 dark:border-gray-800/50";
        default:
            return "bg-card border-border dark:bg-card dark:border-border";
    }
};

interface OrderMobileCardProps {
    order: Order;
    isSelected: boolean;
    enableSelection: boolean;
    onToggleSelection: (orderId: string) => void;
    onClick: (order: Order) => void;
}

export const OrderMobileCard = ({
    order,
    isSelected,
    enableSelection,
    onToggleSelection,
    onClick,
}: OrderMobileCardProps) => {
    const phoneNumber = order.customerPhoneNumber;

    const formatPhoneForWhatsApp = (phone: string) => {
        const cleaned = phone.replace(/\D/g, "");
        if (cleaned.startsWith("0")) {
            return "880" + cleaned.substring(1);
        }
        return cleaned;
    };

    const handleCardClick = (e: React.MouseEvent) => {
        // Don't trigger if clicking on checkbox or action buttons
        if ((e.target as HTMLElement).closest("[data-action-button]")) {
            return;
        }
        onClick(order);
    };

    const handleCheckboxClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onToggleSelection(order.id);
    };

    return (
        <div
            onClick={handleCardClick}
            className={cn(
                "group relative cursor-pointer rounded-sm border-2 p-3 transition-all duration-200",
                "hover:shadow-lg",
                isSelected
                    ? "border-primary bg-primary/5 shadow-primary/10 ring-primary/20 shadow-md ring-2"
                    : getCardBackgroundColor(order.orderStatus)
            )}
        >
            {/* Selection Checkbox */}
            {enableSelection && (
                <div className="absolute top-3 right-3 z-10" data-action-button onClick={handleCheckboxClick}>
                    <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => onToggleSelection(order.id)}
                        aria-label={isSelected ? "Deselect order" : "Select order"}
                        className="size-4"
                    />
                </div>
            )}

            {/* Top Row: Customer Name, Total, Status Badges */}
            <div className="flex items-start justify-between gap-2">
                <div>
                    <div className="mb-1 flex items-center gap-1.5">
                        <User className="text-muted-foreground h-3.5 w-3.5 flex-shrink-0" />
                        <CustomTextCopy text={order.customerName} textClassName="text-sm text-foreground truncate" />
                    </div>

                    <div className="mt-2 flex flex-wrap items-center gap-1.5">
                        <OrderStatusBadge status={order.orderStatus} />
                        {order.courierStatus && <CourierStatusBadge status={order.courierStatus} />}
                        <Link
                            href={`tel:${phoneNumber}`}
                            target="_blank"
                            className="p-1"
                            title="Call"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <PhoneCall className="text-primary size-4" />
                        </Link>
                        <Link
                            href={`https://wa.me/${formatPhoneForWhatsApp(phoneNumber)}`}
                            target="_blank"
                            className="p-1"
                            title="WhatsApp"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <FaWhatsapp className="size-4 text-green-600" />
                        </Link>
                    </div>
                </div>

                <div className="flex flex-shrink-0 flex-col items-end justify-between text-right">
                    <p className="text-base font-bold">
                        ৳{(order.discountedPrice ?? order.totalAmount).toLocaleString()}
                    </p>
                    <CustomerOrderStatsChart
                        confirmedOrders={order.customerTotalConfirmOrder}
                        cancelledOrders={order.customerTotalCancelOrder}
                    />
                </div>
            </div>

            <div className="text-muted-foreground mb-2 text-sm">
                {order.orderItems?.length > 0 &&
                    order.orderItems.map((item) => (
                        <p key={item.id}>
                            {item.productName} x {item.quantity} {item?.orderItemVariant?.length > 0 && " - "}
                            {item?.orderItemVariant?.map((variant) => variant.productVariantOptionName).join(", ")}
                        </p>
                    ))}

                {order.notes && (
                    <p>
                        <NotepadText className="inline-block size-3.5" /> {order.notes}
                    </p>
                )}
            </div>

            {/* Bottom Row: Items and Date */}
            <div className="flex items-center justify-between border-t pt-2">
                <span className="text-muted-foreground text-xs">{order.orderItems?.length || 0} items</span>
                <span className="text-muted-foreground text-xs">{formatDateShortWithTime(order.createdAt)}</span>
            </div>
        </div>
    );
};
