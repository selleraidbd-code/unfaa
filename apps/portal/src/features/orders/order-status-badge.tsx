import { cn } from "@workspace/ui/lib/utils";

import { OrderStatus } from "@/types/order-type";

interface OrderStatusBadgeProps {
    status: OrderStatus;
    className?: string;
}

const getStatusColor = (status: OrderStatus) => {
    switch (status) {
        case OrderStatus.PLACED:
            // Blue - New order, informational
            return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
        case OrderStatus.CONFIRMED:
            // Green - Positive, confirmed
            return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
        case OrderStatus.CANCELLED:
            // Red - Negative, cancelled
            return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
        case OrderStatus.SEND:
            // Purple - Sent out, in transit
            return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300";
        case OrderStatus.HOLD:
            // Yellow/Amber - Warning, on hold
            return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
        case OrderStatus.WAITING:
            // Orange - Pending, waiting
            return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300";
        case OrderStatus.RECEIVED:
            // Emerald - Positive, received
            return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300";
        case OrderStatus.PROCESSING:
            // Indigo - In progress, processing
            return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300";
        case OrderStatus.NZC:
            // Gray - Neutral, no zone code
            return "bg-gray-100 text-gray-800 dark:bg-gray-800/50 dark:text-gray-300";
        case OrderStatus.RETURN:
            // Red - Negative, returned
            return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
        case OrderStatus.INCOMPLETE:
            // Slate - Neutral, incomplete
            return "bg-slate-100 text-slate-800 dark:bg-slate-800/50 dark:text-slate-300";
        default:
            // Gray - Default neutral
            return "bg-gray-100 text-gray-800 dark:bg-gray-800/50 dark:text-gray-300";
    }
};

export const OrderStatusBadge = ({ status, className }: OrderStatusBadgeProps) => {
    return (
        <span
            className={cn("rounded-full px-2 py-1 text-xs font-medium capitalize", getStatusColor(status), className)}
        >
            {status}
        </span>
    );
};
