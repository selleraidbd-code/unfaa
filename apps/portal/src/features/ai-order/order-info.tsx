"use client";

import { useState } from "react";
import Image from "next/image";

import { useGetOrdersQuery } from "@/redux/api/order-api";
import { useAppSelector } from "@/redux/store/hook";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent } from "@workspace/ui/components/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@workspace/ui/components/dialog";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { formatDateShortWithTime } from "@workspace/ui/lib/formateDate";
import { cn } from "@workspace/ui/lib/utils";
import { Calendar, Clock, Eye } from "lucide-react";

import { CourierStatus, OrderStatus } from "@/types/order-type";
import { CustomErrorOrEmpty } from "@/components/ui/custom-error-or-empty";

type Props = {
    customerId: string;
};

export const OrderInfo = ({ customerId }: Props) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const user = useAppSelector((state) => state.auth.user);
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

    const getCourierStatusColor = (status: CourierStatus) => {
        switch (status) {
            case CourierStatus.PENDING:
                return "bg-green-100 text-green-800";
            case CourierStatus.IN_REVIEW:
                return "bg-blue-100 text-blue-800";
            case CourierStatus.DELIVERED:
                return "bg-yellow-100 text-yellow-800";
            case CourierStatus.PARTIAL_DELIVERED:
                return "bg-purple-100 text-purple-800";
            case CourierStatus.CANCELLED:
                return "bg-red-100 text-red-800";
            case CourierStatus.UNKNOWN:
                return "bg-gray-300 text-gray-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const mostRecentOrder = orders[0];

    if (isLoading) {
        return <OrderItemSkeleton />;
    }

    if (isError) {
        return <CustomErrorOrEmpty title="Failed to load orders" description="Failed to load orders" isError={true} />;
    }

    if (orders.length === 0) {
        return <CustomErrorOrEmpty title="No orders found" description="No orders found" />;
    }

    if (!customerId) {
        return null;
    }

    return (
        <>
            <Card>
                <CardContent>
                    {mostRecentOrder && (
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4" />
                                    <span className="text-base font-medium">
                                        Previous Orders ( {data?.meta?.total} )
                                    </span>
                                </div>
                                <div className="text-muted-foreground text-sm">
                                    You have a recent order from this customer. Click the button to view all order
                                    details.
                                </div>
                            </div>
                            <Button onClick={() => setIsModalOpen(true)} className="w-full sm:w-auto">
                                <Eye className="h-4 w-4" />
                                View Details
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Recent Orders Modal */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="max-h-[90vh] overflow-y-auto md:max-w-3xl">
                    <DialogHeader>
                        <DialogTitle>Recent Orders</DialogTitle>
                        <DialogDescription>View all recent orders for this customer</DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                        {orders.length > 0 ? (
                            orders.map((order) => (
                                <div
                                    key={order.id}
                                    className="border-b pb-4 transition-shadow last:border-b-0 hover:shadow-md sm:rounded-lg sm:border sm:p-4"
                                >
                                    <div className="mb-3 flex items-start justify-between">
                                        <p className="font-semibold">Order #{order.orderNumber}</p>
                                        <div className="flex gap-2">
                                            <span
                                                className={cn(
                                                    "rounded-full px-2 py-1 text-xs font-medium",
                                                    getStatusColor(order.orderStatus)
                                                )}
                                            >
                                                {order.orderStatus}
                                            </span>

                                            {order.courierStatus && (
                                                <span
                                                    className={cn(
                                                        "rounded-full px-2 py-1 text-xs font-medium",
                                                        getCourierStatusColor(order.courierStatus)
                                                    )}
                                                >
                                                    {order.courierStatus}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="mb-3 flex items-center gap-2 text-sm text-gray-600">
                                        <Calendar className="h-4 w-4" />
                                        <span>{formatDateShortWithTime(order.createdAt)}</span>
                                    </div>

                                    {/* Order Items */}
                                    {order.orderItems.length > 0 && (
                                        <div className="space-y-2 pt-3 sm:border-t">
                                            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
                                                Order Items
                                            </div>
                                            <div className="space-y-2">
                                                {order.orderItems.map((item) => (
                                                    <div key={item.id} className="flex items-start gap-3 text-sm">
                                                        <Image
                                                            src={item.product.photoURL}
                                                            alt={item.product.name}
                                                            width={40}
                                                            height={40}
                                                            className="size-8 rounded object-cover"
                                                        />
                                                        <div className="font-medium">{item.product.name}</div>
                                                        <span className="text-muted-foreground font-medium whitespace-nowrap">
                                                            Qty: {item.quantity}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="py-8 text-center text-gray-500">No orders found</div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
};

const OrderItemSkeleton = () => {
    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className="space-y-2">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-8 w-16" />
                    </div>
                ))}
            </div>
            <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="space-y-3 rounded-lg border p-4">
                        <div className="flex items-start justify-between">
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
                        <div className="space-y-2 border-t pt-3">
                            <Skeleton className="h-4 w-32" />
                            {Array.from({ length: 2 }).map((_, itemIndex) => (
                                <div key={itemIndex} className="flex items-center gap-2">
                                    <Skeleton className="h-4 w-4 rounded" />
                                    <Skeleton className="h-4 w-48" />
                                    <Skeleton className="ml-auto h-4 w-12" />
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
