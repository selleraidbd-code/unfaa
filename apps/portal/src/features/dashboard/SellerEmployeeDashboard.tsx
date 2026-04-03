"use client";

import { useEffect, useState } from "react";

import { useGetShopOverviewQuery } from "@/redux/api/shop-api";
import { useAppSelector } from "@/redux/store/hook";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { DateRange } from "react-day-picker";

import { DateRangePicker } from "@/components/date-range-picker";

import { CourierOrderStats } from "./CourierOrderStats";
import { OrderSourceChart } from "./OrderSourceChart";
import { OrderStatusStats } from "./OrderStatusStats";
import { ShopCurrentDetailsStats } from "./ShopCurrentDetailsStats";

interface SellerEmployeeDashboardProps {
    shopId: string;
    isOwner: boolean;
}

export const SellerEmployeeDashboard = ({ shopId, isOwner }: SellerEmployeeDashboardProps) => {
    const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
    const [debouncedDateRange, setDebouncedDateRange] = useState<DateRange | undefined>(undefined);

    // Debounce date range changes
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedDateRange(dateRange);
        }, 500); // 500ms debounce delay

        return () => clearTimeout(timer);
    }, [dateRange]);

    // Format dates to YYYY-MM-DD string for API
    const formatDateForApi = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    // Single API query with optional date filters
    const { data: shopOverview, isLoading } = useGetShopOverviewQuery(
        {
            shopId,
            startingDate: debouncedDateRange?.from ? formatDateForApi(debouncedDateRange.from) : undefined,
            endDate: debouncedDateRange?.to ? formatDateForApi(debouncedDateRange.to) : undefined,
        },
        { skip: !shopId }
    );

    if (isLoading) {
        return (
            <div className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
                    {[...Array(6)].map((_, i) => (
                        <Skeleton key={i} className="h-24 w-full" />
                    ))}
                </div>
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                    <Skeleton className="h-[280px] w-full" />
                    <Skeleton className="h-[280px] w-full" />
                </div>
                <Skeleton className="h-[300px] w-full" />
            </div>
        );
    }

    if (!shopOverview?.data) {
        return (
            <div className="flex items-center justify-center p-8">
                <p className="text-muted-foreground">No shop overview data available</p>
            </div>
        );
    }

    const { shopCurrentDetails, orderSourceData, orderStatusData } = shopOverview.data;

    return (
        <div className="flex flex-col gap-4">
            {/* Shop Current Details Stats - Always Static */}
            <ShopCurrentDetailsStats data={shopCurrentDetails} isOwner={isOwner} />

            {/* Date Range Picker */}
            <div className="bg-card flex items-center justify-between gap-4 rounded-lg border p-3 max-sm:flex-col">
                <div className="flex-1">
                    <h3 className="text-sm font-medium">Filter Orders by Date</h3>
                    <p className="text-muted-foreground text-xs">
                        Select a date range to filter order statistics and analytics
                    </p>
                </div>
                <DateRangePicker dateRange={dateRange} onDateRangeChange={setDateRange} />
            </div>

            {/* Two Column Layout for Courier and Order Status */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                {/* Courier Order Stats */}
                <CourierOrderStats
                    data={{
                        totalOrderCuriourPending: shopCurrentDetails.totalOrderCuriourPending,
                        totalOrderCuriourInReview: shopCurrentDetails.totalOrderCuriourInReview,
                        totalOrderCuriourDelivered: shopCurrentDetails.totalOrderCuriourDelivered,
                        totalOrderCuriourPartialDelivered: shopCurrentDetails.totalOrderCuriourPartialDelivered,
                        totalOrderCuriourCancelled: shopCurrentDetails.totalOrderCuriourCancelled,
                        totalOrderCuriourUnknown: shopCurrentDetails.totalOrderCuriourUnknown,
                    }}
                />

                {/* Order Status Stats */}
                <OrderStatusStats data={orderStatusData} />
            </div>

            {/* Order Source Chart */}
            <OrderSourceChart data={orderSourceData} />
        </div>
    );
};
