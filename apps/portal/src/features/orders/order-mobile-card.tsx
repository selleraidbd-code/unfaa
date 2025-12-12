"use client";

import Link from "next/link";

import { Checkbox } from "@workspace/ui/components/checkbox";
import { CustomTextCopy } from "@workspace/ui/components/custom/custom-text-copy";
import { formatDateShortWithTime } from "@workspace/ui/lib/formateDate";
import { cn } from "@workspace/ui/lib/utils";
import { MapPin, Phone, PhoneCall, User } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa6";

import { CourierStatus, Order, OrderStatus } from "@/types/order-type";

const getStatusColor = (status: OrderStatus) => {
    switch (status) {
        case OrderStatus.PLACED:
            return "bg-blue-100 text-blue-800";
        case OrderStatus.CONFIRMED:
            return "bg-green-100 text-green-800";
        case OrderStatus.CANCELLED:
            return "bg-red-100 text-red-800";
        case OrderStatus.SEND:
            return "bg-purple-100 text-purple-800";
        case OrderStatus.HOLD:
            return "bg-yellow-100 text-yellow-800";
        case OrderStatus.WAITING:
            return "bg-orange-100 text-orange-800";
        case OrderStatus.RECEIVED:
            return "bg-emerald-100 text-emerald-800";
        case OrderStatus.PROCESSING:
            return "bg-indigo-100 text-indigo-800";
        case OrderStatus.NZC:
            return "bg-gray-100 text-gray-800";
        case OrderStatus.RETURN:
            return "bg-pink-100 text-pink-800";
        case OrderStatus.INCOMPLETE:
            return "bg-slate-100 text-slate-800";
        default:
            return "bg-gray-100 text-gray-800";
    }
};

const getCourierStatusColor = (status: CourierStatus) => {
    switch (status) {
        case CourierStatus.PENDING:
            return "bg-yellow-100 text-yellow-800";
        case CourierStatus.DELIVERED:
            return "bg-green-100 text-green-800";
        case CourierStatus.PARTIAL_DELIVERED:
            return "bg-orange-100 text-orange-800";
        case CourierStatus.CANCELLED:
            return "bg-red-100 text-red-800";
        case CourierStatus.UNKNOWN:
            return "bg-red-100 text-red-800";
        default:
            return "bg-muted text-muted-foreground";
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
                "group bg-card relative cursor-pointer rounded-sm border-2 p-4 transition-all duration-200",
                "hover:shadow-primary/5 hover:shadow-lg",
                isSelected
                    ? "border-primary bg-primary/5 shadow-primary/10 ring-primary/20 shadow-md ring-2"
                    : "border-border hover:border-primary/50"
            )}
        >
            {/* Selection Checkbox */}
            {enableSelection && (
                <div className="absolute top-4 right-4 z-10" data-action-button onClick={handleCheckboxClick}>
                    <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => onToggleSelection(order.id)}
                        aria-label={isSelected ? "Deselect order" : "Select order"}
                        className="size-5"
                    />
                </div>
            )}

            {/* Order Number Header */}
            <div className="mb-4 flex items-center justify-between border-b pb-3">
                <div>
                    <span className="text-muted-foreground text-xs font-medium">Order Number</span>
                    <p className="text-lg font-bold">#{order.orderNumber}</p>
                </div>
                <div className="text-right">
                    <span className="text-muted-foreground text-xs font-medium">Total</span>
                    <p className="text-lg font-semibold">
                        ৳{(order.discountedPrice ?? order.totalAmount).toLocaleString()}
                    </p>
                </div>
            </div>

            {/* Customer Information */}
            <div className="mb-4 space-y-3">
                {/* Phone Number */}
                <div className="flex items-center gap-2">
                    <Phone className="text-muted-foreground h-4 w-4 flex-shrink-0" />
                    <span className="flex-1 text-sm font-medium">{phoneNumber}</span>
                    <div className="flex items-center gap-1" data-action-button>
                        <Link
                            href={`tel:${phoneNumber}`}
                            target="_blank"
                            className="p-1.5"
                            title="Call"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <PhoneCall className="text-primary size-4" />
                        </Link>
                        <Link
                            href={`https://wa.me/${formatPhoneForWhatsApp(phoneNumber)}`}
                            target="_blank"
                            className="p-1.5"
                            title="WhatsApp"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <FaWhatsapp className="size-4 text-green-600" />
                        </Link>
                    </div>
                </div>

                {/* Customer Name */}
                <div className="flex items-center gap-2">
                    <User className="text-muted-foreground h-4 w-4 flex-shrink-0" />
                    <CustomTextCopy text={order.customerName} textClassName="text-sm font-normal" />
                </div>

                {/* Address */}
                <div className="flex items-start gap-2">
                    <MapPin className="text-muted-foreground mt-0.5 h-4 w-4 flex-shrink-0" />
                    <span className="text-muted-foreground line-clamp-2 flex-1 text-sm">{order.customerAddress}</span>
                </div>
            </div>

            {/* Status Badges */}
            <div className="mb-4 flex flex-wrap items-center gap-2">
                <span className={cn("rounded-full px-2.5 py-1 text-xs font-medium", getStatusColor(order.orderStatus))}>
                    {order.orderStatus}
                </span>
                {order.courierStatus && (
                    <span
                        className={cn(
                            "rounded-full px-2.5 py-1 text-xs font-medium",
                            getCourierStatusColor(order.courierStatus)
                        )}
                    >
                        {order.courierStatus}
                    </span>
                )}
            </div>

            {/* Items and Date Footer */}
            <div className="flex items-center justify-between border-t pt-3">
                <div>
                    <span className="text-muted-foreground text-xs font-medium">Items</span>
                    <p className="text-sm font-semibold">{order.orderItems?.length || 0} items</p>
                </div>
                <div className="text-right">
                    <span className="text-muted-foreground text-xs font-medium">Created</span>
                    <p className="text-muted-foreground text-xs">{formatDateShortWithTime(order.createdAt)}</p>
                </div>
            </div>
        </div>
    );
};
