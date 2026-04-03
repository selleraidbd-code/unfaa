"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { User } from "@/features/auth/auth-type";
import { orderStatusOptions, orderStatusOptionsMobile } from "@/features/orders/data";
import { OrderDetailsWrapper } from "@/features/orders/order-details-wrapper";
import { OrderMobileList } from "@/features/orders/order-mobile-list";
import { OrderTable } from "@/features/orders/order-table";
import { PackageGroupingDialog } from "@/features/orders/package-grouping-dialog";
import { AlertType } from "@/providers/AlertProvider";
import { useCourierEntryMutation } from "@/redux/api/couriar-api";
import { useBulkDeleteOrdersMutation, useGetOrdersQuery } from "@/redux/api/order-api";
import { PaginationState } from "@tanstack/react-table";
import { CustomSearch } from "@workspace/ui/components/custom/custom-search";
import { CustomTabs, CustomTabsList, CustomTabsTrigger } from "@workspace/ui/components/custom/custom-tabs";
import { toast } from "@workspace/ui/components/sonner";
import { useBreakpoint } from "@workspace/ui/hooks/use-breakpoint";
import { Bot, CheckSquare, DownloadCloud, Plus, Square, Trash2, Truck } from "lucide-react";

import { Order, OrderStatus } from "@/types/order-type";
import { useAlert } from "@/hooks/useAlert";
import { CustomButton } from "@/components/ui/custom-button";
import { Meta } from "@/components/table/data-table";

interface FilterParams {
    searchTerm?: string;
}

interface Props {
    user: User | null;
}

const OrdersPage = ({ user }: Props) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const isMobile = useBreakpoint();
    const tabItems = isMobile ? orderStatusOptionsMobile : orderStatusOptions;
    const status = searchParams.get("status") || "all";
    const limit = Number(searchParams.get("limit")) || 50;

    const [filterParams, setFilterParams] = useState<FilterParams>({});
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [selectedRows, setSelectedRows] = useState<Order[]>([]);
    const [activeTab, setActiveTab] = useState<string>(status);
    const [currentPage, setCurrentPage] = useState(1);
    const [isPackageDialogOpen, setIsPackageDialogOpen] = useState(false);

    const { data, isLoading, isError } = useGetOrdersQuery({
        shopId: user?.shop?.id,
        ...filterParams,
        orderStatus: status === "all" ? undefined : status,
        page: currentPage,
        limit,
    });

    const [courierEntry, { isLoading: isCourierEntryLoading }] = useCourierEntryMutation();
    const [bulkDeleteOrders, { isLoading: isBulkDeleteLoading }] = useBulkDeleteOrdersMutation();
    const { fire } = useAlert();

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

    const toggleSelectAll = () => {
        const orders = data?.data || [];
        if (selectedRows.length === orders.length) {
            setSelectedRows([]);
        } else {
            setSelectedRows([...orders]);
        }
    };

    const allSelected = (data?.data || []).length > 0 && selectedRows.length === (data?.data || []).length;

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

    const handleBulkDelete = () => {
        if (selectedRows.length === 0) return;

        const orderIds = selectedRows.map((o) => o.id);

        fire({
            title: "Delete Orders",
            description: `Are you sure you want to delete ${selectedRows.length} order(s)? This action cannot be undone.`,
            type: AlertType.ERROR,
            confirmButtonOptions: {
                variant: "destructive",
                text: "Delete",
            },
            onConfirm: async () => {
                await bulkDeleteOrders({ ids: orderIds })
                    .unwrap()
                    .then(() => {
                        toast.success("Orders deleted successfully");
                        setSelectedRows([]);
                    })
                    .catch((error) => {
                        toast.error(error.data?.message || "Failed to delete orders");
                        setSelectedRows([]);
                    });
            },
        });
    };

    const meta: Meta = {
        total: data?.meta?.total || 0,
        page: currentPage,
        limit: Number(limit),
    };

    return (
        <>
            <div className="grid gap-2 md:gap-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <h1 className="title">Orders ( {data?.meta?.total || 0} )</h1>

                    <div className="ms-auto flex items-center gap-2 md:gap-4">
                        <CustomButton variant="accent" className="hidden">
                            <DownloadCloud />
                            Export
                        </CustomButton>

                        <CustomButton href="/ai-order">
                            <Bot />
                            AI <span className="max-sm:hidden">Order</span>
                        </CustomButton>

                        <CustomButton href="/make-order">
                            <Plus />
                            Create <span className="max-sm:hidden">Order</span>
                        </CustomButton>
                    </div>
                </div>

                <CustomTabs value={activeTab} onValueChange={handleTabClick}>
                    <CustomTabsList>
                        {tabItems.map((tab) => {
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

                {activeTab === OrderStatus.CONFIRMED ? (
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2 sm:gap-4">
                            <p className="text-sm text-gray-600 dark:text-gray-400">Total: {data?.meta?.total || 0}</p>
                            {(data?.data || []).length > 0 && (
                                <button
                                    onClick={toggleSelectAll}
                                    className="text-primary hover:text-primary/80 flex items-center gap-2 text-sm font-medium transition-colors"
                                >
                                    {allSelected ? <CheckSquare className="h-4 w-4" /> : <Square className="h-4 w-4" />}
                                    <span>
                                        {allSelected ? (
                                            <>
                                                Deselect <span className="max-sm:hidden">All</span>
                                            </>
                                        ) : (
                                            "Select All"
                                        )}
                                    </span>
                                </button>
                            )}
                            {selectedRows.length > 0 && (
                                <p className="text-primary text-sm font-medium">
                                    {selectedRows.length} <span className="max-sm:hidden">selected</span>
                                </p>
                            )}
                        </div>

                        <div className="flex items-center gap-2">
                            <CustomButton variant="outline" onClick={() => setIsPackageDialogOpen(true)}>
                                Package
                            </CustomButton>
                            <CustomButton
                                onClick={handleCourierEntry}
                                disabled={selectedRows.length === 0 || isCourierEntryLoading}
                            >
                                <Truck />
                                Send
                                <span className="max-sm:hidden">to Courier</span>
                            </CustomButton>
                        </div>
                    </div>
                ) : activeTab === OrderStatus.PLACED ? (
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2 sm:gap-4">
                            <p className="text-sm text-gray-600 dark:text-gray-400">Total: {data?.meta?.total || 0}</p>
                            {(data?.data || []).length > 0 && (
                                <button
                                    onClick={toggleSelectAll}
                                    className="text-primary hover:text-primary/80 flex items-center gap-2 text-sm font-medium transition-colors"
                                >
                                    {allSelected ? <CheckSquare className="h-4 w-4" /> : <Square className="h-4 w-4" />}
                                    <span>
                                        {allSelected ? (
                                            <>
                                                Deselect <span className="max-sm:hidden">All</span>
                                            </>
                                        ) : (
                                            "Select All"
                                        )}
                                    </span>
                                </button>
                            )}
                            {selectedRows.length > 0 && (
                                <p className="text-primary text-sm font-medium">
                                    {selectedRows.length} <span className="max-sm:hidden">selected</span>
                                </p>
                            )}
                        </div>

                        <div className="flex items-center gap-2">
                            <CustomButton
                                onClick={handleBulkDelete}
                                disabled={selectedRows.length === 0 || isBulkDeleteLoading}
                                variant="destructive"
                            >
                                <Trash2 />
                                Delete
                                <span className="max-sm:hidden">Selected</span>
                            </CustomButton>
                        </div>
                    </div>
                ) : (
                    <CustomSearch onSearch={handleSearch} placeholder="Search orders" />
                )}

                {/* Desktop Table View */}
                <div className="max-lg:hidden">
                    <OrderTable
                        data={data?.data || []}
                        isLoading={isLoading}
                        isError={isError}
                        meta={meta}
                        onPaginationChange={handlePaginationChange}
                        onRowClick={handleRowClick}
                        onSelectionChange={setSelectedRows}
                        enableSelection={activeTab === OrderStatus.CONFIRMED || activeTab === OrderStatus.PLACED}
                    />
                </div>

                {/* Mobile Card View */}
                <div className="lg:hidden">
                    <OrderMobileList
                        data={data?.data || []}
                        isLoading={isLoading}
                        isError={isError}
                        meta={meta}
                        selectedRows={selectedRows}
                        enableSelection={activeTab === OrderStatus.CONFIRMED || activeTab === OrderStatus.PLACED}
                        onPaginationChange={handlePaginationChange}
                        onRowClick={handleRowClick}
                        onSelectionChange={setSelectedRows}
                    />
                </div>
            </div>

            {selectedOrder && (
                <OrderDetailsWrapper
                    open={!!selectedOrder}
                    onOpenChange={() => setSelectedOrder(null)}
                    order={selectedOrder}
                />
            )}

            <PackageGroupingDialog
                isOpen={isPackageDialogOpen}
                onClose={() => setIsPackageDialogOpen(false)}
                orders={data?.data || []}
            />
        </>
    );
};

export default OrdersPage;
