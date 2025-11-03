import { DataStateHandler } from "@/components/shared/data-state-handler";
import {
    CustomPagination,
    PaginationMeta,
} from "@/components/ui/custom-pagination";
import useGetUser from "@/hooks/useGetUser";
import { useGetOrdersQuery } from "@/redux/api/order-api";
import { OrderStatus } from "@/types/order-type";
import { formatDateShortWithTime } from "@workspace/ui/lib/formateDate";
import { cn } from "@workspace/ui/lib/utils";
import { Calendar, MapPin, Phone, Truck, User } from "lucide-react";

export const ReadyToDispatch = () => {
    const user = useGetUser();

    const { data, isLoading } = useGetOrdersQuery({
        shopId: user?.shop.id,
        orderStatus: OrderStatus.SEND,
        page: 1,
        limit: 10,
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

    const paginationMeta: PaginationMeta = {
        page: 1,
        limit: 10,
        total: data?.meta?.total || 0,
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
            {(notSentData) => (
                <>
                    <div className="mb-4 text-sm text-gray-600">
                        Total Orders Not Sent: {notSentData?.meta?.total || 0}
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
                                            getStatusColor(order.orderStatus)
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
                                        <span>{order.customerPhoneNumber}</span>
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
                                    {order.orderItems?.length || 0} items
                                </div>
                            </div>
                        ))}
                    </div>

                    <CustomPagination
                        paginationMeta={paginationMeta}
                        showRowsPerPage={false}
                        showRowSelection={false}
                        showPageCount={false}
                        onPageChange={() => {}}
                        onLimitChange={() => {}}
                    />
                </>
            )}
        </DataStateHandler>
    );
};
