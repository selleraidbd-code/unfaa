"use client";

import { useState } from "react";

import { useGetOrdersQuery } from "@/redux/api/order-api";
import { Bot, DownloadCloud, Plus } from "lucide-react";

import { CustomButton } from "@/components/ui/custom-button";
import { OrderDetails } from "@/features/orders/order-details";
import useGetUser from "@/hooks/useGetUser";
import { Order, OrderStatus, PaymentStatus } from "@/types/order-type";
import { CustomSearch } from "@workspace/ui/components/custom/custom-search";
import { cn } from "@workspace/ui/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { orderStatusOptions } from "@/features/orders/data";
import { formatDateShortWithTime } from "@workspace/ui/lib/formateDate";
import {
    ChevronLeft,
    ChevronRight,
    Package,
    User,
    Phone,
    Calendar,
    CreditCard,
    MapPin,
} from "lucide-react";

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
        shopId: user?.shop.id,
        ...filterParams,
        orderStatus: status === "all" ? undefined : status,
        page: currentPage,
        limit: pageSize,
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

    const getStatusColor = (status: OrderStatus) => {
        switch (status) {
            case OrderStatus.PLACED:
                return "bg-blue-100 text-blue-800";
            case OrderStatus.CONFIRMED:
                return "bg-green-100 text-green-800";
            case OrderStatus.CANCELLED:
                return "bg-red-100 text-red-800";
            case OrderStatus.SEND:
                return "bg-purple-100 text-purple-800";
            case OrderStatus.HOLD:
                return "bg-yellow-100 text-yellow-800";
            case OrderStatus.WAITING:
                return "bg-orange-100 text-orange-800";
            case OrderStatus.RECEIVED:
                return "bg-emerald-100 text-emerald-800";
            case OrderStatus.PROCESSING:
                return "bg-indigo-100 text-indigo-800";
            case OrderStatus.NZC:
                return "bg-gray-100 text-gray-800";
            case OrderStatus.RETURN:
                return "bg-pink-100 text-pink-800";
            case OrderStatus.INCOMPLETE:
                return "bg-slate-100 text-slate-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const getPaymentStatusColor = (status: PaymentStatus) => {
        switch (status) {
            case PaymentStatus.PAID:
                return "bg-green-100 text-green-800";
            case PaymentStatus.PENDING:
                return "bg-yellow-100 text-yellow-800";
            case PaymentStatus.FAILED:
                return "bg-red-100 text-red-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const totalPages = Math.ceil((data?.meta?.total || 0) / pageSize);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
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

                {/* Orders Cards */}
                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {Array.from({ length: 6 }).map((_, index) => (
                            <div
                                key={index}
                                className="bg-white border rounded-lg p-4 animate-pulse"
                            >
                                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                                <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
                                <div className="space-y-2">
                                    <div className="h-3 bg-gray-200 rounded"></div>
                                    <div className="h-3 bg-gray-200 rounded"></div>
                                    <div className="h-3 bg-gray-200 rounded"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : isError ? (
                    <div className="text-center py-8">
                        <div className="text-red-500 mb-2">
                            Failed to load orders
                        </div>
                        <button
                            onClick={() => window.location.reload()}
                            className="text-blue-500 hover:underline"
                        >
                            Try again
                        </button>
                    </div>
                ) : data?.data?.length === 0 ? (
                    <div className="text-center py-8">
                        <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                        <div className="text-gray-500">No orders found</div>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {data?.data?.map((order) => (
                                <div
                                    key={order.id}
                                    onClick={() => handleRowClick(order)}
                                    className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                                >
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex items-center gap-2">
                                            <Package className="h-4 w-4 text-gray-500" />
                                            <span className="font-semibold text-lg">
                                                #{order.orderNumber}
                                            </span>
                                        </div>
                                        <span
                                            className={cn(
                                                "px-2 py-1 rounded-full text-xs font-medium",
                                                getStatusColor(
                                                    order.orderStatus
                                                )
                                            )}
                                        >
                                            {order.orderStatus}
                                        </span>
                                    </div>

                                    <div className="space-y-2 mb-4">
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <User className="h-4 w-4" />
                                            <span className="truncate">
                                                {order.customerName}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <Phone className="h-4 w-4" />
                                            <span>
                                                {order.customerPhoneNumber}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <MapPin className="h-4 w-4" />
                                            <span className="truncate">
                                                {order.customerAddress}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <Calendar className="h-4 w-4" />
                                            <span>
                                                {formatDateShortWithTime(
                                                    order.createdAt
                                                )}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-2">
                                            <CreditCard className="h-4 w-4 text-gray-500" />
                                            <span
                                                className={cn(
                                                    "px-2 py-1 rounded-full text-xs font-medium",
                                                    getPaymentStatusColor(
                                                        order.paymentStatus
                                                    )
                                                )}
                                            >
                                                {order.paymentStatus}
                                            </span>
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {order.orderItems?.length || 0}{" "}
                                            items
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex justify-center items-center gap-2 mt-6">
                                <button
                                    onClick={() =>
                                        handlePageChange(currentPage - 1)
                                    }
                                    disabled={currentPage === 1}
                                    className="flex items-center gap-1 px-3 py-2 text-sm border rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                    Previous
                                </button>

                                <div className="flex gap-1">
                                    {Array.from(
                                        { length: Math.min(5, totalPages) },
                                        (_, i) => {
                                            const page = i + 1;
                                            return (
                                                <button
                                                    key={page}
                                                    onClick={() =>
                                                        handlePageChange(page)
                                                    }
                                                    className={cn(
                                                        "px-3 py-2 text-sm border rounded-md",
                                                        currentPage === page
                                                            ? "bg-primary text-primary-foreground border-primary"
                                                            : "hover:bg-gray-50"
                                                    )}
                                                >
                                                    {page}
                                                </button>
                                            );
                                        }
                                    )}
                                </div>

                                <button
                                    onClick={() =>
                                        handlePageChange(currentPage + 1)
                                    }
                                    disabled={currentPage === totalPages}
                                    className="flex items-center gap-1 px-3 py-2 text-sm border rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Next
                                    <ChevronRight className="h-4 w-4" />
                                </button>
                            </div>
                        )}
                    </>
                )}
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
