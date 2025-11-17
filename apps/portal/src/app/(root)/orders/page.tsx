"use client";

import { PaginationState } from "@tanstack/react-table";
import { Bot, DownloadCloud, Plus, Truck } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import { Meta } from "@/components/table/data-table";
import { CustomButton } from "@/components/ui/custom-button";
import { orderStatusOptions } from "@/features/orders/data";
import { OrderDetailsModal } from "@/features/orders/order-details-modal";
import useGetUser from "@/hooks/useGetUser";
import { useCourierEntryMutation } from "@/redux/api/couriar-api";
import { useGetOrdersQuery } from "@/redux/api/order-api";
import { Order, OrderStatus } from "@/types/order-type";
import {
    CustomTabs,
    CustomTabsList,
    CustomTabsTrigger,
} from "@workspace/ui/components/custom/custom-tabs";
import { OrderTable } from "@/features/orders/order-table";

interface FilterParams {
    searchTerm?: string;
}

const OrdersPage = () => {
    const user = useGetUser();
    const router = useRouter();
    const searchParams = useSearchParams();
    const status = searchParams.get("status") || "all";

    const [filterParams, setFilterParams] = useState<FilterParams>({});
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [activeTab, setActiveTab] = useState<string>(status);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(10);

    const { data, isLoading, isError } = useGetOrdersQuery({
        shopId: user?.shop?.id,
        ...filterParams,
        orderStatus: status === "all" ? undefined : status,
        page: currentPage,
        limit: pageSize,
    });

    const [courierEntry, { isLoading: isCourierEntryLoading }] =
        useCourierEntryMutation();

    const handleSearch = (value: string) => {
        setFilterParams({ ...filterParams, searchTerm: value });
        setCurrentPage(1);
    };

    const handleRowClick = (row: Order) => {
        setSelectedOrder(row);
    };

    const handleTabClick = (tab: string) => {
        setActiveTab(tab);
        router.replace(`/orders?status=${tab}`);
        setCurrentPage(1);
    };

    const handlePaginationChange = (state: PaginationState) => {
        setCurrentPage(state.pageIndex + 1);
    };

    const handleCourierEntry = async (selectedRows: Order[]) => {
        if (!user?.shop?.id) return;
        const confirmedIds = selectedRows
            .filter((o) => o.orderStatus === OrderStatus.CONFIRMED)
            .map((o) => o.id);
        if (confirmedIds.length === 0) return;
        try {
            await courierEntry({
                ids: confirmedIds,
                shopId: user.shop?.id,
            }).unwrap();
        } catch (error) {
            console.error("Courier entry failed", error);
        }
    };

    const meta: Meta = {
        total: data?.meta?.total || 0,
        page: currentPage,
        limit: pageSize,
    };

    const bulkActions =
        activeTab === OrderStatus.CONFIRMED
            ? [
                  {
                      label: "Courier Entry",
                      onClick: handleCourierEntry,
                      icon: Truck,
                  },
              ]
            : [];

    return (
        <>
            <div className="grid gap-4 md:gap-8">
                <div className="flex justify-between items-center">
                    <h1 className="title">
                        Orders ( {data?.meta?.total || 0} )
                    </h1>

                    <div className="flex items-center gap-4">
                        <CustomButton variant="accent">
                            <DownloadCloud />
                            Export
                        </CustomButton>

                        <CustomButton href="/ai-order">
                            <Bot />
                            AI Order
                        </CustomButton>

                        <CustomButton href="/make-order">
                            <Plus />
                            Create Order
                        </CustomButton>
                    </div>
                </div>

                <CustomTabs value={activeTab} onValueChange={handleTabClick}>
                    <CustomTabsList>
                        {orderStatusOptions.map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <CustomTabsTrigger
                                    key={tab.value}
                                    value={tab.value}
                                    icon={
                                        Icon ? (
                                            <Icon className="size-4 lg:size-5" />
                                        ) : undefined
                                    }
                                >
                                    {tab.label}
                                </CustomTabsTrigger>
                            );
                        })}
                    </CustomTabsList>
                </CustomTabs>

                <OrderTable
                    data={data?.data || []}
                    isLoading={isLoading}
                    isError={isError}
                    meta={meta}
                    onSearch={handleSearch}
                    onPaginationChange={handlePaginationChange}
                    onRowClick={handleRowClick}
                />
            </div>

            {selectedOrder && (
                <OrderDetailsModal
                    open={!!selectedOrder}
                    onOpenChange={() => setSelectedOrder(null)}
                    order={selectedOrder}
                />
            )}
        </>
    );
};

export default OrdersPage;
