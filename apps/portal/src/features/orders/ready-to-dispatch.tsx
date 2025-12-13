"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { DispatchOrderCard } from "@/features/orders/dispatch-order-card";
import { useGetCourierSetupQuery } from "@/redux/api/couriar-api";
import { useGetOrdersQuery } from "@/redux/api/order-api";
import { useAppSelector } from "@/redux/store/hook";
import { pdf } from "@react-pdf/renderer";
import { CheckSquare, Square } from "lucide-react";

import { CourierStatus, Order, OrderStatus } from "@/types/order-type";
import { CustomButton } from "@/components/ui/custom-button";
import { CustomPagination, PaginationMeta } from "@/components/ui/custom-pagination";
import { OrderPDFDocument } from "@/components/pdf/order-pdf-document";
import { DataStateHandler } from "@/components/shared/data-state-handler";

export const ReadyToDispatch = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const page = searchParams.get("page") || 1;
    const limit = searchParams.get("limit") || 100;
    const user = useAppSelector((state) => state.auth.user);
    const shop = user?.shop;

    const [selectedOrders, setSelectedOrders] = useState<Set<string>>(new Set());
    const [isExporting, setIsExporting] = useState(false);

    // Cache generated blobs so repeated exports don't rebuild identical PDFs.
    // Cache promises so duplicate exports reuse the same work and resolve once.
    const pdfCacheRef = useRef<Map<string, Promise<Blob>>>(new Map());

    const { data: courierSetup } = useGetCourierSetupQuery({ shopId: shop?.id || "" }, { skip: !shop?.id });

    const { data, isLoading } = useGetOrdersQuery({
        shopId: shop?.id,
        orderStatus: OrderStatus.SEND,
        courierStatus: CourierStatus.IN_REVIEW,
        page: Number(page),
        limit: Number(limit),
    });

    console.log(data?.data);

    const paginationMeta: PaginationMeta = {
        page: Number(page),
        limit: Number(limit),
        total: data?.meta?.total || 0,
    };

    // Clear cached blobs whenever the data set changes to prevent stale exports.
    useEffect(() => {
        pdfCacheRef.current.clear();
    }, [data?.meta?.total, shop?.id]);

    const buildCacheKey = useCallback((orders: Order[]) => {
        const sorted = [...orders].map((order) => `${order.id}-${order.updatedAt || ""}`).sort();
        return sorted.join("|");
    }, []);

    const downloadBlob = useCallback((blob: Blob, filename: string) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }, []);

    const createPdfBlob = useCallback(
        async (orders: Order[], merchantId?: string) => {
            const cacheKey = buildCacheKey(orders);
            const cachedPromise = pdfCacheRef.current.get(cacheKey);
            if (cachedPromise) return cachedPromise;

            const promise = (async () => {
                const doc = (
                    <OrderPDFDocument
                        orders={orders}
                        shopLogo={shop?.photoURL}
                        shopName={shop?.name}
                        merchantId={merchantId}
                    />
                );
                return pdf(doc).toBlob();
            })();

            pdfCacheRef.current.set(cacheKey, promise);
            try {
                return await promise;
            } catch (error) {
                pdfCacheRef.current.delete(cacheKey);
                throw error;
            }
        },
        [buildCacheKey, shop?.photoURL]
    );

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
                const blob = await createPdfBlob([order], courierSetup?.data?.merchantId || shop?.merchantId);
                downloadBlob(blob, `order-${order.consignmentId || order.orderNumber}.pdf`);
            } catch (error) {
                console.error("Error generating PDF:", error);
            } finally {
                setIsExporting(false);
            }
        },
        [courierSetup?.data?.merchantId, createPdfBlob, downloadBlob, isExporting, shop?.merchantId]
    );

    const handleBulkPDFExport = useCallback(
        async (orders: Order[]) => {
            if (orders.length === 0 || isExporting) return;

            setIsExporting(true);
            try {
                const blob = await createPdfBlob(orders, shop?.merchantId || courierSetup?.data?.merchantId);
                downloadBlob(blob, `bulk-orders-${new Date().getTime()}.pdf`);
                setSelectedOrders(new Set());
            } catch (error) {
                console.error("Error generating PDF:", error);
            } finally {
                setIsExporting(false);
            }
        },
        [courierSetup?.data?.merchantId, createPdfBlob, downloadBlob, isExporting, shop?.merchantId]
    );

    const updateSearchParams = (key: string, value: string | number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set(key, value.toString());

        // Always reset page to 1 unless we're updating the page itself
        if (key !== "page") {
            params.set("page", "1");
        }

        router.push(`/delivery-orders?${params.toString()}`);
    };

    const handlePageChange = (page: number) => {
        updateSearchParams("page", page);
    };

    const handleLimitChange = (limit: number) => {
        updateSearchParams("limit", limit);
    };

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
                const selectedOrdersList = useMemo(
                    () => orders.filter((order) => selectedOrders.has(order.id)),
                    // eslint-disable-next-line react-hooks/exhaustive-deps
                    [orders, selectedOrders]
                );
                const allSelected = useMemo(
                    () => orders.length > 0 && selectedOrders.size === orders.length,
                    // eslint-disable-next-line react-hooks/exhaustive-deps
                    [orders.length, selectedOrders]
                );

                return (
                    <>
                        <div className="mt-4 mb-4 flex items-center justify-between gap-4 md:mt-6">
                            <div className="flex items-center gap-2 sm:gap-4">
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Total <span className="max-sm:hidden">Orders</span>: {notSentData?.meta?.total || 0}
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
                                        <span>
                                            {allSelected ? (
                                                <>
                                                    Deselect <span className="max-sm:hidden"> All</span>
                                                </>
                                            ) : (
                                                "Select All"
                                            )}
                                        </span>
                                    </button>
                                )}
                                {selectedOrders.size > 0 && (
                                    <p className="text-primary text-sm font-medium">
                                        {selectedOrders.size} <span className="max-sm:hidden">selected</span>
                                    </p>
                                )}
                            </div>

                            <CustomButton
                                onClick={() => handleBulkPDFExport(selectedOrdersList)}
                                disabled={selectedOrders.size === 0 || isExporting}
                                isLoading={isExporting}
                            >
                                {isExporting
                                    ? "Exporting..."
                                    : selectedOrders.size > 0
                                      ? `Export PDF${selectedOrders.size > 1 ? "s" : ""}`
                                      : "Export PDF"}
                            </CustomButton>
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
                            {orders.map((order) => (
                                <DispatchOrderCard
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
                                onPageChange={handlePageChange}
                                onLimitChange={handleLimitChange}
                            />
                        </div>
                    </>
                );
            }}
        </DataStateHandler>
    );
};
