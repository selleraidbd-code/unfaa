"use client";

import { useState } from "react";

import { ordersColumns } from "@/features/orders/order-columns";
import { useGetOrdersQuery } from "@/redux/api/order-api";
import { PaginationState } from "@tanstack/react-table";
import { DownloadCloud, Plus } from "lucide-react";

import { DataTable } from "@/components/table/data-table";
import { CustomButton } from "@/components/ui/custom-button";
import { OrderDetails } from "@/features/orders/order-details";
import useGetUser from "@/hooks/useGetUser";
import { Order } from "@/types/order-type";
import { CustomSearch } from "@workspace/ui/components/custom/custom-search";
import { cn } from "@workspace/ui/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { orderStatusOptions } from "@/features/orders/data";

interface FilterParams {
    searchTerm?: string;
}

const OrdersPage = () => {
    const user = useGetUser();
    const router = useRouter();
    const searchParams = useSearchParams();
    const status = searchParams.get("status") || "";

    const [filterParams, setFilterParams] = useState<FilterParams>({});
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [activeTab, setActiveTab] = useState<string>(status);
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });

    const { data, isLoading, isError } = useGetOrdersQuery({
        shopId: user?.shop.id,
        ...filterParams,
        orderStatus: status === "all" ? undefined : status,
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
    });

    const handleSearch = (value: string) => {
        setFilterParams({ ...filterParams, searchTerm: value });
    };

    const handleRowClick = (row: Order) => {
        setSelectedOrder(row);
    };

    const handleTabClick = (tab: string) => {
        setActiveTab(tab);
        router.replace(`/orders?status=${tab}`);
    };

    return (
        <>
            <div className="grid gap-4 md:gap-8">
                <div className="flex justify-between items-center">
                    <h1 className="title">
                        Orders ( {data?.meta?.total || 0} )
                    </h1>
                    <div className="flex items-center gap-4">
                        <CustomSearch onSearch={handleSearch} />
                        <CustomButton variant="accent">
                            <DownloadCloud />
                            Export
                        </CustomButton>

                        <CustomButton href="/make-order">
                            <Plus />
                            Create Order
                        </CustomButton>
                    </div>
                </div>

                <div className="flex justify-center gap-2.5 flex-wrap text-sm w-full">
                    {orderStatusOptions.map((tab) => (
                        <button
                            key={tab.value}
                            value={tab.value}
                            className={cn(
                                "hover:bg-primary/90 hover:text-white cursor-pointer border rounded-md py-1.5 px-3.5 transition-all duration-300",
                                activeTab === tab.value &&
                                    "bg-primary text-primary-foreground border-primary"
                            )}
                            onClick={() => handleTabClick(tab.value)}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                <DataTable
                    isSubtitleShown={false}
                    data={data?.data || []}
                    columns={ordersColumns}
                    showViewOptions={false}
                    paginationMeta={data?.meta}
                    onPaginationChange={setPagination}
                    onRowClick={handleRowClick}
                    isLoading={isLoading}
                    isError={isError}
                />
            </div>

            {selectedOrder && (
                <OrderDetails
                    open={!!selectedOrder}
                    onOpenChange={() => setSelectedOrder(null)}
                    order={selectedOrder}
                />
            )}
        </>
    );
};

export default OrdersPage;
