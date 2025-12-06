"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { orderStatusOptions } from "@/features/orders/data";
import { OrderDetailsModal } from "@/features/orders/order-details-modal";
import { OrderTable } from "@/features/orders/order-table";
import { useCourierEntryMutation } from "@/redux/api/couriar-api";
import { useGetOrdersQuery } from "@/redux/api/order-api";
import { useAppSelector } from "@/redux/store/hook";
import { PaginationState } from "@tanstack/react-table";
import { CustomSearch } from "@workspace/ui/components/custom/custom-search";
import { CustomTabs, CustomTabsList, CustomTabsTrigger } from "@workspace/ui/components/custom/custom-tabs";
import { toast } from "@workspace/ui/components/sonner";
import { Bot, DownloadCloud, Plus, Truck } from "lucide-react";

import { Order, OrderStatus } from "@/types/order-type";
import { CustomButton } from "@/components/ui/custom-button";
import { Meta } from "@/components/table/data-table";

interface FilterParams {
    searchTerm?: string;
}

const OrdersPage = () => {
    const user = useAppSelector((state) => state.auth.user);
    const router = useRouter();
    const searchParams = useSearchParams();
    const status = searchParams.get("status") || "all";

    const [filterParams, setFilterParams] = useState<FilterParams>({});
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [selectedRows, setSelectedRows] = useState<Order[]>([]);
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

    const [courierEntry, { isLoading: isCourierEntryLoading }] = useCourierEntryMutation();

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
        setSelectedRows([]);
    };

    const handlePaginationChange = (state: PaginationState) => {
        setCurrentPage(state.pageIndex + 1);
    };

    const handleCourierEntry = async () => {
        if (!user?.shop?.id || selectedRows.length === 0) return;

        const confirmedIds = selectedRows.filter((o) => o.orderStatus === OrderStatus.CONFIRMED).map((o) => o.id);

        if (confirmedIds.length === 0) return toast.error("No confirmed orders to send to courier");

        await courierEntry({
            ids: confirmedIds,
            shopId: user.shop?.id,
        })
            .unwrap()
            .then(() => {
                toast.success("Orders sent to courier successfully");
                setSelectedRows([]);
            })
            .catch((error) => {
                toast.error(error.data?.message || "Failed to send orders to courier");
                setSelectedRows([]);
            });
    };

    const meta: Meta = {
        total: data?.meta?.total || 0,
        page: currentPage,
        limit: pageSize,
    };

    return (
        <>
            <div className="grid gap-2 md:gap-4">
                <div className="flex items-center justify-between">
                    <h1 className="title">Orders ( {data?.meta?.total || 0} )</h1>

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
                                    icon={Icon ? <Icon className="size-4 lg:size-5" /> : undefined}
                                >
                                    {tab.label}
                                </CustomTabsTrigger>
                            );
                        })}
                    </CustomTabsList>
                </CustomTabs>

                <div className="flex items-center justify-between">
                    <CustomSearch onSearch={handleSearch} placeholder="Search orders" />

                    {activeTab === OrderStatus.CONFIRMED && (
                        <CustomButton
                            onClick={handleCourierEntry}
                            disabled={selectedRows.length === 0 || isCourierEntryLoading}
                        >
                            <Truck />
                            Send to Courier
                        </CustomButton>
                    )}
                </div>

                <OrderTable
                    data={data?.data || []}
                    isLoading={isLoading}
                    isError={isError}
                    meta={meta}
                    onPaginationChange={handlePaginationChange}
                    onRowClick={handleRowClick}
                    onSelectionChange={setSelectedRows}
                    enableSelection={activeTab === OrderStatus.CONFIRMED}
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
