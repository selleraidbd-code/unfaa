"use client";

import { useCallback, useState } from "react";

import { useGetOrdersQuery } from "@/redux/api/order-api";
import { useAppSelector } from "@/redux/store/hook";
import { pdf } from "@react-pdf/renderer";
import { CheckSquare, Square } from "lucide-react";

import { CourierStatus, Order, OrderStatus } from "@/types/order-type";
import { CustomButton } from "@/components/ui/custom-button";
import { CustomPagination, PaginationMeta } from "@/components/ui/custom-pagination";
import { OrderPDFDocument } from "@/components/pdf/order-pdf-document";
import { DataStateHandler } from "@/components/shared/data-state-handler";

import { OrderCard } from "./order-card";

export const ReadyToDispatch = () => {
    const user = useAppSelector((state) => state.auth.user);
    const shop = user?.shop;
    const [selectedOrders, setSelectedOrders] = useState<Set<string>>(new Set());
    const [isExporting, setIsExporting] = useState(false);

    const { data, isLoading } = useGetOrdersQuery({
        shopId: shop?.id,
        orderStatus: OrderStatus.SEND,
        courierStatus: CourierStatus.IN_REVIEW,
        page: 1,
        limit: 10,
    });

    const paginationMeta: PaginationMeta = {
        page: 1,
        limit: 10,
        total: data?.meta?.total || 0,
    };

    const toggleOrderSelection = useCallback((orderId: string) => {
        setSelectedOrders((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(orderId)) {
                newSet.delete(orderId);
            } else {
                newSet.add(orderId);
            }
            return newSet;
        });
    }, []);

    const toggleSelectAll = useCallback((orders: Order[]) => {
        setSelectedOrders((prev) => {
            if (prev.size === orders.length) {
                return new Set();
            }
            return new Set(orders.map((order) => order.id));
        });
    }, []);

    const handleSinglePDFExport = useCallback(
        async (order: Order) => {
            if (isExporting) return;
            setIsExporting(true);
            try {
                const doc = (
                    <OrderPDFDocument orders={[order]} shopLogo={shop?.photoURL} merchantId={shop?.merchantId} />
                );
                const blob = await pdf(doc).toBlob();
                const url = URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = url;
                link.download = `order-${order.consignmentId || order.orderNumber}.pdf`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
            } catch (error) {
                console.error("Error generating PDF:", error);
            } finally {
                setIsExporting(false);
            }
        },
        [shop, isExporting]
    );

    const handleBulkPDFExport = useCallback(
        async (orders: Order[]) => {
            if (orders.length === 0 || isExporting) return;

            setIsExporting(true);
            try {
                const doc = (
                    <OrderPDFDocument orders={orders} shopLogo={shop?.photoURL} merchantId={shop?.merchantId} />
                );
                const blob = await pdf(doc).toBlob();
                const url = URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = url;
                link.download = `bulk-orders-${new Date().getTime()}.pdf`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
                setSelectedOrders(new Set());
            } catch (error) {
                console.error("Error generating PDF:", error);
            } finally {
                setIsExporting(false);
            }
        },
        [shop, isExporting]
    );

    return (
        <DataStateHandler
            data={data}
            isLoading={isLoading}
            isEmpty={data?.data?.length === 0}
            emptyTitle="No orders found that haven't been sent to courier"
            emptyDescription="No orders found that haven't been sent to courier"
            emptyClassName="text-center py-12"
        >
            {(notSentData) => {
                const orders = notSentData?.data || [];
                const selectedOrdersList = orders.filter((order) => selectedOrders.has(order.id));
                const allSelected = orders.length > 0 && selectedOrders.size === orders.length;

                return (
                    <>
                        <div className="mt-6 mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Total Orders: {notSentData?.meta?.total || 0}
                                </p>
                                {orders.length > 0 && (
                                    <button
                                        onClick={() => toggleSelectAll(orders)}
                                        className="text-primary hover:text-primary/80 flex items-center gap-2 text-sm font-medium transition-colors"
                                    >
                                        {allSelected ? (
                                            <CheckSquare className="h-4 w-4" />
                                        ) : (
                                            <Square className="h-4 w-4" />
                                        )}
                                        <span>{allSelected ? "Deselect All" : "Select All"}</span>
                                    </button>
                                )}
                                {selectedOrders.size > 0 && (
                                    <p className="text-primary text-sm font-medium">{selectedOrders.size} selected</p>
                                )}
                            </div>

                            <CustomButton
                                onClick={() => handleBulkPDFExport(selectedOrdersList)}
                                disabled={selectedOrders.size === 0 || isExporting}
                                isLoading={isExporting}
                                className="w-full sm:w-auto"
                            >
                                {isExporting
                                    ? "Exporting..."
                                    : selectedOrders.size > 0
                                      ? `Export PDF${selectedOrders.size > 1 ? "s" : ""}`
                                      : "Export PDF"}
                            </CustomButton>
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {orders.map((order) => (
                                <OrderCard
                                    key={order.id}
                                    order={order}
                                    isSelected={selectedOrders.has(order.id)}
                                    isExporting={isExporting}
                                    onToggleSelection={toggleOrderSelection}
                                    onExportPDF={handleSinglePDFExport}
                                />
                            ))}
                        </div>

                        <div className="center mt-4">
                            <CustomPagination
                                paginationMeta={paginationMeta}
                                showRowsPerPage={false}
                                showRowSelection={false}
                                showPageCount={false}
                                onPageChange={() => {}}
                                onLimitChange={() => {}}
                            />
                        </div>
                    </>
                );
            }}
        </DataStateHandler>
    );
};
