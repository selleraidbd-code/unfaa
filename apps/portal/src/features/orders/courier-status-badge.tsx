import { cn } from "@workspace/ui/lib/utils";

import { CourierStatus } from "@/types/order-type";

interface CourierStatusBadgeProps {
    status: CourierStatus;
    className?: string;
}

const getCourierStatusColor = (status: CourierStatus) => {
    switch (status) {
        case CourierStatus.PENDING:
            // Yellow - Pending, waiting
            return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
        case CourierStatus.IN_REVIEW:
            // Blue - In review, being checked
            return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
        case CourierStatus.DELIVERED:
            // Green - Positive, delivered successfully
            return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
        case CourierStatus.PARTIAL_DELIVERED:
            // Orange - Partial delivery, incomplete
            return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300";
        case CourierStatus.CANCELLED:
            // Red - Negative, cancelled
            return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
        case CourierStatus.UNKNOWN:
            // Red - Error state, unknown status
            return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
        default:
            // Gray - Default neutral
            return "bg-muted text-muted-foreground dark:bg-muted/50 dark:text-muted-foreground";
    }
};

export const CourierStatusBadge = ({ status, className }: CourierStatusBadgeProps) => {
    return (
        <span
            className={cn(
                "rounded-full px-2 py-1 text-xs font-medium capitalize",
                getCourierStatusColor(status),
                className
            )}
        >
            {status?.split("_")?.join(" ")}
        </span>
    );
};
