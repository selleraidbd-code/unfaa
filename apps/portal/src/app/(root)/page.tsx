"use client";

import { CourierOrderStats } from "@/features/dashboard/CourierOrderStats";
import { OrderSourceChart } from "@/features/dashboard/OrderSourceChart";
import { OrderStatusStats } from "@/features/dashboard/OrderStatusStats";
import { ShopCurrentDetailsStats } from "@/features/dashboard/ShopCurrentDetailsStats";
import { useGetShopOverviewQuery } from "@/redux/api/shop-api";
import { useAppSelector } from "@/redux/store/hook";
import { Skeleton } from "@workspace/ui/components/skeleton";

const Page = () => {
    const user = useAppSelector((state) => state.auth.user);
    const shopId = user?.shop.id || "";

    const { data: shopOverview, isLoading: isShopOverviewLoading } = useGetShopOverviewQuery({ shopId });

    if (isShopOverviewLoading) {
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
            {/* Shop Current Details Stats */}
            <ShopCurrentDetailsStats data={shopCurrentDetails} />

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

export default Page;
