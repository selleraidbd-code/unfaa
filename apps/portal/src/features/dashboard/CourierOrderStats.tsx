"use client";

import { cn } from "@workspace/ui/lib/utils";
import { CheckCircle, Clock, HelpCircle, LucideIcon, Package, Truck, XCircle } from "lucide-react";

import { ShopCurrentDetails } from "@/types/shop-type";

interface CourierOrderStatsProps {
    data: Pick<
        ShopCurrentDetails,
        | "totalOrderCuriourPending"
        | "totalOrderCuriourInReview"
        | "totalOrderCuriourDelivered"
        | "totalOrderCuriourPartialDelivered"
        | "totalOrderCuriourCancelled"
        | "totalOrderCuriourUnknown"
    >;
}

export type CourierOrderStatsItem = {
    key: keyof Pick<
        ShopCurrentDetails,
        | "totalOrderCuriourPending"
        | "totalOrderCuriourInReview"
        | "totalOrderCuriourDelivered"
        | "totalOrderCuriourPartialDelivered"
        | "totalOrderCuriourCancelled"
        | "totalOrderCuriourUnknown"
    >;
    label: string;
    icon: LucideIcon;
    color: string;
};

const courierStats: CourierOrderStatsItem[] = [
    {
        key: "totalOrderCuriourPending",
        label: "Pending",
        icon: Clock,
        color: "text-amber-600",
    },
    {
        key: "totalOrderCuriourInReview",
        label: "In Review",
        icon: Package,
        color: "text-blue-600",
    },
    {
        key: "totalOrderCuriourDelivered",
        label: "Delivered",
        icon: CheckCircle,
        color: "text-emerald-600",
    },
    {
        key: "totalOrderCuriourPartialDelivered",
        label: "Partial",
        icon: Truck,
        color: "text-orange-600",
    },
    {
        key: "totalOrderCuriourCancelled",
        label: "Cancelled",
        icon: XCircle,
        color: "text-red-600",
    },
    {
        key: "totalOrderCuriourUnknown",
        label: "Unknown",
        icon: HelpCircle,
        color: "text-slate-600",
    },
];

export const CourierOrderStats = ({ data }: CourierOrderStatsProps) => {
    const totalCourierOrders = courierStats.reduce((sum, stat) => sum + data[stat.key], 0);

    return (
        <div className="bg-card h-fit space-y-3 border-t pt-3 md:rounded-md md:border md:p-3 lg:p-4">
            <div className="flex items-center justify-between text-base font-semibold">
                <span>Courier Orders</span>
                <span className="text-lg font-bold md:text-xl xl:text-2xl">{totalCourierOrders}</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
                {courierStats.map((stat) => {
                    const Icon = stat.icon;
                    const value = data[stat.key];
                    const percentage = totalCourierOrders > 0 ? ((value / totalCourierOrders) * 100).toFixed(0) : "0";

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
                                <span className="text-muted-foreground min-w-[3ch] text-right text-xs font-medium">
                                    {percentage}%
                                </span>
                                <span className="min-w-[3ch] text-right text-lg font-bold">{value}</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
