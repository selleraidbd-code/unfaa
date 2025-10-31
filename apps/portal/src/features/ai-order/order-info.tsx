"use client";

import { useGetOrdersQuery } from "@/redux/api/order-api";
import useGetUser from "@/hooks/useGetUser";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@workspace/ui/components/card";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { OrderStatus, PaymentStatus } from "@/types/order-type";
import { formatDateShortWithTime } from "@workspace/ui/lib/formateDate";
import {
    Package,
    Calendar,
    TrendingUp,
    Clock,
    CheckCircle2,
    XCircle,
    ShoppingCart,
} from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";
import Image from "next/image";
import { DataStateHandler } from "@/components/shared/data-state-handler";

type Props = {
    customerId: string;
};

export const OrderInfo = ({ customerId }: Props) => {
    const user = useGetUser();
    const { data, isLoading, isError } = useGetOrdersQuery(
        {
            customerId,
            shopId: user?.shop?.id,
            limit: 10,
            page: 1,
        },
        {
            skip: !customerId || !user?.shop?.id,
        }
    );

    const orders = data?.data || [];
    const totalOrders = data?.meta?.total || 0;

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

    // Calculate statistics
    const paidOrders = orders.filter(
        (o) => o.paymentStatus === PaymentStatus.PAID
    ).length;
    const pendingOrders = orders.filter(
        (o) => o.paymentStatus === PaymentStatus.PENDING
    ).length;
    const cancelledOrders = orders.filter(
        (o) => o.orderStatus === OrderStatus.CANCELLED
    ).length;
    const mostRecentOrder = orders[0];

    if (!customerId) {
        return null;
    }

    return (
        <Card>
            <CardHeader className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Previous Orders
                </CardTitle>
            </CardHeader>
            <CardContent>
                <DataStateHandler
                    data={orders}
                    isLoading={isLoading}
                    loadingComponent={<OrderItemSkeleton />}
                    isError={isError}
                    errorTitle="Failed to load orders"
                    isEmpty={orders.length === 0}
                    emptyTitle="No previous orders found for this customer"
                    emptyDescription="No previous orders found for this customer"
                >
                    {(recentOrders) => (
                        <div className="space-y-6">
                            {/* Statistics */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="border rounded-lg p-4">
                                    <div className="flex items-center gap-2 text-gray-600 mb-1">
                                        <TrendingUp className="h-4 w-4" />
                                        <span className="text-sm">
                                            Total Orders
                                        </span>
                                    </div>
                                    <div className="text-2xl font-bold">
                                        {totalOrders}
                                    </div>
                                </div>
                                <div className="border rounded-lg p-4">
                                    <div className="flex items-center gap-2 text-gray-600 mb-1">
                                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                                        <span className="text-sm">Paid</span>
                                    </div>
                                    <div className="text-2xl font-bold text-green-600">
                                        {paidOrders}
                                    </div>
                                </div>
                                <div className="border rounded-lg p-4">
                                    <div className="flex items-center gap-2 text-gray-600 mb-1">
                                        <Clock className="h-4 w-4 text-yellow-600" />
                                        <span className="text-sm">Pending</span>
                                    </div>
                                    <div className="text-2xl font-bold text-yellow-600">
                                        {pendingOrders}
                                    </div>
                                </div>
                                <div className="border rounded-lg p-4">
                                    <div className="flex items-center gap-2 text-gray-600 mb-1">
                                        <XCircle className="h-4 w-4 text-red-600" />
                                        <span className="text-sm">
                                            Cancelled
                                        </span>
                                    </div>
                                    <div className="text-2xl font-bold text-red-600">
                                        {cancelledOrders}
                                    </div>
                                </div>
                            </div>

                            {/* Recent Orders */}
                            {recentOrders.length > 0 && (
                                <div className="space-y-3">
                                    <h3 className="font-semibold text-lg">
                                        Recent Orders
                                    </h3>
                                    <div className="space-y-3">
                                        {recentOrders.map((order) => (
                                            <div
                                                key={order.id}
                                                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                                            >
                                                <div className="flex justify-between items-start mb-3">
                                                    <div className="flex items-center gap-2">
                                                        <Package className="h-4 w-4 text-gray-500" />
                                                        <span className="font-semibold">
                                                            Order #
                                                            {order.orderNumber}
                                                        </span>
                                                    </div>
                                                    <div className="flex gap-2">
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
                                                        <span
                                                            className={cn(
                                                                "px-2 py-1 rounded-full text-xs font-medium",
                                                                getPaymentStatusColor(
                                                                    order.paymentStatus
                                                                )
                                                            )}
                                                        >
                                                            {
                                                                order.paymentStatus
                                                            }
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                                                    <Calendar className="h-4 w-4" />
                                                    <span>
                                                        {formatDateShortWithTime(
                                                            order.createdAt
                                                        )}
                                                    </span>
                                                </div>

                                                {/* Order Items */}
                                                {order.orderItems.length >
                                                    0 && (
                                                    <div className="border-t pt-3 space-y-2">
                                                        <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                                            <ShoppingCart className="h-4 w-4" />
                                                            <span>
                                                                Items (
                                                                {
                                                                    order
                                                                        .orderItems
                                                                        .length
                                                                }
                                                                )
                                                            </span>
                                                        </div>
                                                        <div className="space-y-2">
                                                            {order.orderItems.map(
                                                                (item) => (
                                                                    <div
                                                                        key={
                                                                            item.id
                                                                        }
                                                                        className="flex items-start gap-3 text-sm"
                                                                    >
                                                                        <Image
                                                                            src={
                                                                                item
                                                                                    .product
                                                                                    .photoURL
                                                                            }
                                                                            alt={
                                                                                item
                                                                                    .product
                                                                                    .name
                                                                            }
                                                                            width={
                                                                                40
                                                                            }
                                                                            height={
                                                                                40
                                                                            }
                                                                            className="rounded size-8 object-cover"
                                                                        />
                                                                        <div className="font-medium ">
                                                                            {
                                                                                item
                                                                                    .product
                                                                                    .name
                                                                            }
                                                                        </div>
                                                                        <span className="text-muted-foreground font-medium whitespace-nowrap">
                                                                            Qty:{" "}
                                                                            {
                                                                                item.quantity
                                                                            }
                                                                        </span>
                                                                    </div>
                                                                )
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Most Recent Order Info */}
                            {mostRecentOrder && (
                                <div className="border-t pt-4">
                                    <div className="flex items-center gap-2 text-gray-600 mb-2">
                                        <Clock className="h-4 w-4" />
                                        <span className="text-sm font-medium">
                                            Most Recent Order
                                        </span>
                                    </div>
                                    <div className="text-sm text-gray-700">
                                        Order #{mostRecentOrder.orderNumber} -{" "}
                                        {formatDateShortWithTime(
                                            mostRecentOrder.createdAt
                                        )}{" "}
                                        ({mostRecentOrder.orderStatus})
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </DataStateHandler>
            </CardContent>
        </Card>
    );
};

const OrderItemSkeleton = () => {
    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className="space-y-2">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-8 w-16" />
                    </div>
                ))}
            </div>
            <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, index) => (
                    <div
                        key={index}
                        className="border rounded-lg p-4 space-y-3"
                    >
                        <div className="flex justify-between items-start">
                            <Skeleton className="h-5 w-24" />
                            <div className="flex gap-2">
                                <Skeleton className="h-6 w-20 rounded-full" />
                                <Skeleton className="h-6 w-20 rounded-full" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-3/4" />
                        </div>
                        <div className="border-t pt-3 space-y-2">
                            <Skeleton className="h-4 w-32" />
                            {Array.from({ length: 2 }).map((_, itemIndex) => (
                                <div
                                    key={itemIndex}
                                    className="flex items-center gap-2"
                                >
                                    <Skeleton className="h-4 w-4 rounded" />
                                    <Skeleton className="h-4 w-48" />
                                    <Skeleton className="h-4 w-12 ml-auto" />
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
