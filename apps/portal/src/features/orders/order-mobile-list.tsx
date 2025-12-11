"use client";

import { PaginationState } from "@tanstack/react-table";

import { Order } from "@/types/order-type";
import { CustomPagination } from "@/components/ui/custom-pagination";
import { DataStateHandler } from "@/components/shared/data-state-handler";
import { Meta } from "@/components/table/data-table";

import { OrderMobileCard } from "./order-mobile-card";

interface OrderMobileListProps {
    data: Order[];
    isLoading: boolean;
    isError: boolean;
    meta: Meta;
    selectedRows: Order[];
    enableSelection: boolean;
    onPaginationChange: (state: PaginationState) => void;
    onRowClick: (row: Order) => void;
    onSelectionChange: (selectedRows: Order[]) => void;
}

export const OrderMobileList = ({
    data,
    isLoading,
    isError,
    meta,
    selectedRows,
    enableSelection,
    onPaginationChange,
    onRowClick,
    onSelectionChange,
}: OrderMobileListProps) => {
    const handleToggleSelection = (orderId: string) => {
        const order = data.find((o) => o.id === orderId);
        if (!order) return;

        const isSelected = selectedRows.some((o) => o.id === orderId);
        if (isSelected) {
            onSelectionChange(selectedRows.filter((o) => o.id !== orderId));
        } else {
            onSelectionChange([...selectedRows, order]);
        }
    };

    const handlePageChange = (page: number) => {
        onPaginationChange({ pageIndex: page - 1, pageSize: meta.limit });
    };

    return (
        <div className="space-y-4">
            <DataStateHandler
                data={data}
                isLoading={isLoading}
                isError={isError}
                isEmpty={data.length === 0}
                emptyTitle="No orders found"
                emptyDescription="There are no orders matching your criteria."
                errorTitle="Error loading orders"
                errorDescription="Failed to load orders. Please try again."
            >
                {(data) => (
                    <div className="space-y-3">
                        {data.map((order) => {
                            const isSelected = selectedRows.some((o) => o.id === order.id);
                            return (
                                <OrderMobileCard
                                    key={order.id}
                                    order={order}
                                    isSelected={isSelected}
                                    enableSelection={enableSelection}
                                    onToggleSelection={handleToggleSelection}
                                    onClick={onRowClick}
                                />
                            );
                        })}
                    </div>
                )}
            </DataStateHandler>

            {data.length > 0 && (
                <div className="mt-6">
                    <CustomPagination
                        paginationMeta={{
                            page: meta.page,
                            total: meta.total,
                            limit: meta.limit,
                        }}
                        onPageChange={handlePageChange}
                        showRowsPerPage={false}
                    />
                </div>
            )}
        </div>
    );
};
