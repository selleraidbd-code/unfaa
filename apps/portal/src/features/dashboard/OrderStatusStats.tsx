"use client";

import { cn } from "@workspace/ui/lib/utils";
import {
    AlertCircle,
    CheckCircle2,
    Icon,
    Loader2,
    LucideIcon,
    PackageCheck,
    PauseCircle,
    RotateCcw,
    ShoppingBag,
    XCircle,
} from "lucide-react";

import { OrderStatusData } from "@/types/shop-type";

interface OrderStatusStatsProps {
    data: OrderStatusData;
}

export type OrderStatusStatsItem = {
    key: keyof OrderStatusData;
    label: string;
    icon: LucideIcon;
    color: string;
};

const statusConfig: OrderStatusStatsItem[] = [
    {
        key: "totalOrderPlaced",
        label: "Placed",
        icon: ShoppingBag,
        color: "text-blue-600",
    },
    {
        key: "totalOrderConfirmed" as const,
        label: "Confirmed",
        icon: CheckCircle2,
        color: "text-emerald-600",
    },
    {
        key: "totalOrderProcessing" as const,
        label: "Processing",
        icon: Loader2,
        color: "text-orange-600",
    },
    {
        key: "totalOrderHold" as const,
        label: "On Hold",
        icon: PauseCircle,
        color: "text-amber-600",
    },
    {
        key: "totalOrderCancelled" as const,
        label: "Cancelled",
        icon: XCircle,
        color: "text-red-600",
    },
    {
        key: "totalOrderReceived" as const,
        label: "Received",
        icon: PackageCheck,
        color: "text-teal-600",
    },
    {
        key: "totalOrderReturn" as const,
        label: "Returned",
        icon: RotateCcw,
        color: "text-purple-600",
    },
    {
        key: "totalOrderNzc" as const,
        label: "NZC",
        icon: AlertCircle,
        color: "text-slate-600",
    },
];

export const OrderStatusStats = ({ data }: OrderStatusStatsProps) => {
    const totalOrders = Object.values(data).reduce((sum, val) => sum + val, 0);

    return (
        <div className="bg-card h-fit space-y-3 border-t pt-3 md:rounded-md md:border md:p-3 lg:p-4">
            <div className="flex items-center justify-between text-base font-semibold">
                <span>Order Status</span>
                <span className="text-lg font-bold md:text-xl xl:text-2xl">{totalOrders}</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
                {statusConfig.map((stat) => {
                    const value = data[stat.key];

                    return <OrderStatusStatsItem key={stat.key} stat={stat} value={value} totalOrders={totalOrders} />;
                })}
            </div>
        </div>
    );
};

const OrderStatusStatsItem = ({
    stat,
    value,
    totalOrders,
}: {
    stat: OrderStatusStatsItem;
    value: number;
    totalOrders: number;
}) => {
    const percentage = totalOrders > 0 ? ((value / totalOrders) * 100).toFixed(0) : "0";

    const Icon = stat.icon;

    return (
        <div
            key={stat.key}
            className="group hover:bg-accent/50 flex rounded-md border p-2 transition-colors max-sm:flex-col sm:items-center sm:justify-between lg:px-3 lg:py-2.5"
        >
            <div className="flex items-center gap-2">
                <Icon className={cn("size-4", stat.color)} />
                <span className="text-sm font-medium">{stat.label}</span>
            </div>

            <div className="flex items-center gap-3 max-sm:justify-end">
                <span className="text-muted-foreground min-w-[3ch] text-right text-xs font-medium">{percentage}%</span>
                <span className="min-w-[3ch] text-right text-lg font-bold">{value}</span>
            </div>
        </div>
    );
};
