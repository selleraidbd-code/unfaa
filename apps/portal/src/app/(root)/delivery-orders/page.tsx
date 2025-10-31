"use client";

import { useState } from "react";
import { useGetSteadfastRiderNoteQuery } from "@/redux/api/couriar-api";
import { useGetOrdersQuery } from "@/redux/api/order-api";
import useGetUser from "@/hooks/useGetUser";
import { OrderStatus } from "@/types/order-type";
import { formatDateShortWithTime } from "@workspace/ui/lib/formateDate";
import {
    Tabs,
    TabsList,
    TabsTrigger,
    TabsContent,
} from "@workspace/ui/components/tabs";
import {
    Package,
    Truck,
    FileText,
    Clock,
    User,
    Phone,
    MapPin,
    Calendar,
} from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";

import {
    CustomTabs,
    CustomTabsList,
    CustomTabsTrigger,
    CustomTabsContent,
} from "@workspace/ui/components/custom/custom-tabs";

const Page = () => {
    const user = useGetUser();
    const [activeTab, setActiveTab] = useState("pending-parcel");
    const [riderNotePage, setRiderNotePage] = useState(1);
    const [pendingPage, setPendingPage] = useState(1);
    const [notSentPage, setNotSentPage] = useState(1);
    const pageSize = 10;

    // Rider Note Query
    const { data: riderNoteData, isLoading: isRiderNoteLoading } =
        useGetSteadfastRiderNoteQuery({
            page: riderNotePage,
            limit: pageSize,
        });

    // Pending Parcel (Orders with PROCESSING status)
    const { data: pendingData, isLoading: isPendingLoading } =
        useGetOrdersQuery({
            shopId: user?.shop.id,
            orderStatus: OrderStatus.PROCESSING,
            page: pendingPage,
            limit: pageSize,
        });

    // Orders Not Sent to Courier (CONFIRMED but not SEND)
    const { data: notSentData, isLoading: isNotSentLoading } =
        useGetOrdersQuery({
            shopId: user?.shop.id,
            orderStatus: OrderStatus.SEND,
            page: notSentPage,
            limit: pageSize,
        });

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

    const renderPagination = (
        currentPage: number,
        totalPages: number,
        onPageChange: (page: number) => void
    ) => {
        if (totalPages <= 1) return null;

        return (
            <div className="flex justify-center items-center gap-2 mt-6">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-2 text-sm border rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Previous
                </button>
                <div className="flex gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        const page = i + 1;
                        return (
                            <button
                                key={page}
                                onClick={() => onPageChange(page)}
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
                    })}
                </div>
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 text-sm border rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Next
                </button>
            </div>
        );
    };

    const renderEmptyState = (icon: React.ReactNode, message: string) => (
        <div className="text-center py-12">
            <div className="flex justify-center mb-4 text-gray-400">{icon}</div>
            <div className="text-gray-500">{message}</div>
        </div>
    );

    const renderLoadingSkeleton = () => (
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
    );

    return (
        <div className="grid gap-4 md:gap-6">
            <h1 className="title">In Delivery Orders</h1>

            <CustomTabs value={activeTab} onValueChange={setActiveTab}>
                <CustomTabsList>
                    <CustomTabsTrigger
                        value="ready-for-dispatch"
                        icon={<Truck className="size-4 lg:size-5" />}
                    >
                        Ready for Dispatch
                    </CustomTabsTrigger>
                    <CustomTabsTrigger
                        value="pending-parcel"
                        icon={<Package className="size-4 lg:size-5" />}
                    >
                        Pending Parcel
                    </CustomTabsTrigger>
                    <CustomTabsTrigger
                        value="rider-note"
                        icon={<FileText className="size-4 lg:size-5" />}
                    >
                        Rider Note
                    </CustomTabsTrigger>
                </CustomTabsList>
            </CustomTabs>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger
                        value="ready-for-dispatch"
                        className="flex items-center gap-2"
                    >
                        <Truck className="w-4 h-4" />
                        Ready for Dispatch
                    </TabsTrigger>
                    <TabsTrigger
                        value="pending-parcel"
                        className="flex items-center gap-2"
                    >
                        <Package className="w-4 h-4" />
                        Pending Parcel
                    </TabsTrigger>

                    <TabsTrigger
                        value="rider-note"
                        className="flex items-center gap-2"
                    >
                        <FileText className="w-4 h-4" />
                        Rider Note
                    </TabsTrigger>
                </TabsList>

                {/* Pending Parcel Tab */}
                <TabsContent value="pending-parcel" className="mt-6">
                    {isPendingLoading ? (
                        renderLoadingSkeleton()
                    ) : pendingData?.data?.length === 0 ? (
                        renderEmptyState(
                            <Package className="h-12 w-12" />,
                            "No pending parcels found"
                        )
                    ) : (
                        <>
                            <div className="mb-4 text-sm text-gray-600">
                                Total Pending Parcels:{" "}
                                {pendingData?.meta?.total || 0}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {pendingData?.data?.map((order) => (
                                    <div
                                        key={order.id}
                                        className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow"
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
                                        <div className="text-sm text-gray-500">
                                            {order.orderItems?.length || 0}{" "}
                                            items
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {renderPagination(
                                pendingPage,
                                Math.ceil(
                                    (pendingData?.meta?.total || 0) / pageSize
                                ),
                                setPendingPage
                            )}
                        </>
                    )}
                </TabsContent>

                {/* Not Sent to Courier Tab */}
                <TabsContent value="ready-for-dispatch" className="mt-6">
                    {isNotSentLoading ? (
                        renderLoadingSkeleton()
                    ) : notSentData?.data?.length === 0 ? (
                        renderEmptyState(
                            <Truck className="h-12 w-12" />,
                            "No orders found that haven't been sent to courier"
                        )
                    ) : (
                        <>
                            <div className="mb-4 text-sm text-gray-600">
                                Total Orders Not Sent:{" "}
                                {notSentData?.meta?.total || 0}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {notSentData?.data?.map((order) => (
                                    <div
                                        key={order.id}
                                        className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow"
                                    >
                                        <div className="flex justify-between items-start mb-3">
                                            <div className="flex items-center gap-2">
                                                <Truck className="h-4 w-4 text-gray-500" />
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
                                        <div className="text-sm text-gray-500">
                                            {order.orderItems?.length || 0}{" "}
                                            items
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {renderPagination(
                                notSentPage,
                                Math.ceil(
                                    (notSentData?.meta?.total || 0) / pageSize
                                ),
                                setNotSentPage
                            )}
                        </>
                    )}
                </TabsContent>

                {/* Rider Note Tab */}
                <TabsContent value="rider-note" className="mt-6">
                    {isRiderNoteLoading ? (
                        <div className="space-y-4">
                            {Array.from({ length: 5 }).map((_, index) => (
                                <div
                                    key={index}
                                    className="bg-white border rounded-lg p-4 animate-pulse"
                                >
                                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                                    <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                                </div>
                            ))}
                        </div>
                    ) : riderNoteData?.data?.length === 0 ? (
                        renderEmptyState(
                            <FileText className="h-12 w-12" />,
                            "No rider notes found"
                        )
                    ) : (
                        <>
                            <div className="mb-4 text-sm text-gray-600">
                                Total Rider Notes:{" "}
                                {riderNoteData?.meta?.total || 0}
                            </div>
                            <div className="space-y-4">
                                {riderNoteData?.data?.map((note) => (
                                    <div
                                        key={note.id}
                                        className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow"
                                    >
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                                <FileText className="h-4 w-4" />
                                                <span>
                                                    Note ID:{" "}
                                                    {note.id.slice(0, 8)}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-gray-400">
                                                <Clock className="h-3 w-3" />
                                                <span>
                                                    {formatDateShortWithTime(
                                                        note.createdAt
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="bg-gray-50 rounded-md p-3">
                                            <p className="text-sm text-gray-700 whitespace-pre-wrap">
                                                {note.riderNote}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {renderPagination(
                                riderNotePage,
                                Math.ceil(
                                    (riderNoteData?.meta?.total || 0) / pageSize
                                ),
                                setRiderNotePage
                            )}
                        </>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default Page;
