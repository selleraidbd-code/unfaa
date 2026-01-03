import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { RiderNoteModal } from "@/features/orders/rider-note-modal";
import { useGetOrdersQuery } from "@/redux/api/order-api";
import { useAppSelector } from "@/redux/store/hook";
import { Button } from "@workspace/ui/components/button";
import { formatDateShortWithTime } from "@workspace/ui/lib/formateDate";
import { cn } from "@workspace/ui/lib/utils";
import { Calendar, FileText, MapPin, Package, Phone, User } from "lucide-react";

import { CourierStatus, OrderStatus } from "@/types/order-type";
import { useUpdateCourierStatus } from "@/hooks/useUpdateCourierStatus";
import { CustomButton } from "@/components/ui/custom-button";
import { CustomPagination, PaginationMeta } from "@/components/ui/custom-pagination";
import { DataStateHandler } from "@/components/shared/data-state-handler";

export const PendingParcel = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const page = searchParams.get("page") || 1;
    const limit = searchParams.get("limit") || 30;
    const user = useAppSelector((state) => state.auth.user);
    const shop = user?.shop;
    const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { data: pendingData, isLoading: isPendingLoading } = useGetOrdersQuery({
        shopId: shop?.id,
        orderStatus: OrderStatus.SEND,
        courierStatus: CourierStatus.PENDING,
        page: Number(page),
        limit: Number(limit),
    });

    const { isButtonEnabled, isUpdating, timeRemaining, updateAllStatuses } = useUpdateCourierStatus({
        shopId: shop?.id,
    });

    const paginationMeta: PaginationMeta = {
        page: Number(page),
        limit: Number(limit),
        total: pendingData?.meta?.total || 0,
    };

    const formatTimeRemaining = (seconds: number | null): string => {
        if (seconds === null) return "";
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        if (hours > 0) {
            return `${hours}h ${minutes}m ${secs}s`;
        }
        if (minutes > 0) {
            return `${minutes}m ${secs}s`;
        }
        return `${secs}s`;
    };

    const getStatusColor = (status: OrderStatus) => {
        switch (status) {
            case OrderStatus.PROCESSING:
                return "bg-indigo-100 text-indigo-800";
            case OrderStatus.CONFIRMED:
                return "bg-green-100 text-green-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

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
            data={pendingData}
            isLoading={isPendingLoading}
            isEmpty={pendingData?.data?.length === 0}
            emptyTitle="No pending parcels found"
            emptyDescription="No pending parcels found"
            emptyClassName="text-center py-12"
        >
            {(pendingData) => (
                <>
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-sm text-gray-600">
                            Total Pending Parcels: {pendingData?.meta?.total || 0}
                        </h2>

                        <div className="flex items-center gap-2">
                            {!isButtonEnabled && timeRemaining !== null && (
                                <span className="text-xs text-gray-500">
                                    Available in: {formatTimeRemaining(timeRemaining)}
                                </span>
                            )}
                            <CustomButton
                                onClick={updateAllStatuses}
                                disabled={!isButtonEnabled || isUpdating}
                                isLoading={isUpdating}
                            >
                                Update Status
                            </CustomButton>
                        </div>
                    </div>
                    <div className="mb-2 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {pendingData?.data?.map((order) => (
                            <div
                                key={order.id}
                                className="rounded-lg border bg-white p-4 transition-shadow hover:shadow-md"
                            >
                                <div className="mb-3 flex items-start justify-between">
                                    <div className="flex items-center gap-2">
                                        <Package className="h-4 w-4 text-gray-500" />
                                        <span className="text-lg font-semibold">#{order.orderNumber}</span>
                                    </div>
                                    <span
                                        className={cn(
                                            "rounded-full px-2 py-1 text-xs font-medium",
                                            getStatusColor(order.orderStatus)
                                        )}
                                    >
                                        {order.orderStatus}
                                    </span>
                                </div>
                                <div className="mb-4 space-y-2">
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <User className="h-4 w-4" />
                                        <span className="truncate">{order.customerName}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Phone className="h-4 w-4" />
                                        <span>{order.customerPhoneNumber}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <MapPin className="h-4 w-4" />
                                        <span className="truncate">{order.customerAddress}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Calendar className="h-4 w-4" />
                                        <span>{formatDateShortWithTime(order.createdAt)}</span>
                                    </div>
                                </div>
                                <div className="text-sm text-gray-500">{order.orderItems?.length || 0} items</div>
                                <div className="mt-4">
                                    {order.courierNote && (
                                        <div className="text-sm text-gray-500">
                                            <p> {order.courierNote}</p>
                                        </div>
                                    )}
                                </div>
                                <div className="mt-4">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="w-full"
                                        onClick={() => {
                                            setSelectedOrderId(order.id);
                                            setIsModalOpen(true);
                                        }}
                                    >
                                        <FileText className="mr-2 h-4 w-4" />
                                        View Rider Notes
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <CustomPagination
                        className="justify-center"
                        paginationMeta={paginationMeta}
                        showRowsPerPage={false}
                        showRowSelection={false}
                        showPageCount={false}
                        onPageChange={handlePageChange}
                        onLimitChange={handleLimitChange}
                    />
                    <RiderNoteModal orderId={selectedOrderId} open={isModalOpen} onOpenChange={setIsModalOpen} />
                </>
            )}
        </DataStateHandler>
    );
};
