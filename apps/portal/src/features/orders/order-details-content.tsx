import { useState } from "react";

import { CustomerInfoSection } from "@/features/orders/customer-info-section";
import { orderStatusOptions } from "@/features/orders/data";
import { OrderStatusFormSection } from "@/features/orders/order-status-form-section";
import { OrderItem, PreviousOrdersSection } from "@/features/orders/previous-orders-section";
import { useDeleteOrderMutation } from "@/redux/api/order-api";
import { Button } from "@workspace/ui/components/button";
import { toast } from "@workspace/ui/components/sonner";
import { cn } from "@workspace/ui/lib/utils";
import { Trash2 } from "lucide-react";

import { Order } from "@/types/order-type";
import { useAlert } from "@/hooks/useAlert";

interface OrderDetailsContentProps {
    order: Order;
    onClose: () => void;
    className?: string;
}

export const OrderDetailsContent = ({ order, onClose, className }: OrderDetailsContentProps) => {
    const { fire } = useAlert();
    const [deleteOrder, { isLoading: isDeleting }] = useDeleteOrderMutation();
    const [orderData, setOrderData] = useState<Order>(order);

    const handleCustomerInfoUpdate = (updatedOrder?: Order) => {
        if (updatedOrder) {
            setOrderData((prev) => ({
                ...prev,
                customerName: updatedOrder.customerName,
                customerPhoneNumber: updatedOrder.customerPhoneNumber,
                customerAddress: updatedOrder.customerAddress,
                discountedPrice: updatedOrder.discountedPrice,
                updatedAt: updatedOrder.updatedAt,
            }));
        } else {
            setOrderData(order);
        }
    };

    const handleDelete = async () => {
        if (order) {
            fire({
                title: "Delete Order",
                description: "Are you sure you want to delete this order?",
                onConfirm: async () => {
                    await deleteOrder({ id: order.id })
                        .unwrap()
                        .then(() => {
                            toast.success("Order deleted successfully");
                            onClose();
                        })
                        .catch((error) => {
                            toast.error(error.data?.message || "Failed to delete order");
                        });
                },
            });
        }
    };

    // Check if current order status is in the available options
    const isOrderStatusInOptions = orderStatusOptions.some((option) => option.value === orderData?.orderStatus);

    // If current status is not in options, add it so it can be displayed
    const displayOrderStatusOptions = isOrderStatusInOptions
        ? orderStatusOptions
        : [
              ...orderStatusOptions,
              {
                  label: orderData?.orderStatus || "Unknown Status",
                  value: orderData?.orderStatus,
              },
          ];

    const customerOrderHistory = [
        {
            label: "Total",
            value: order.customerTotalConfirmOrder + order.customerTotalCancelOrder,
            className: "bg-primary",
        },
        {
            label: "Successful",
            value: order.customerTotalConfirmOrder,
            className: "bg-green-500",
        },
        {
            label: "Cancelled",
            value: order.customerTotalCancelOrder,
            className: "bg-red-500",
        },
    ];

    return (
        <div className={cn("flex flex-col space-y-3 max-sm:px-4 max-sm:pb-8 md:space-y-5", className)}>
            <div className="flex gap-2 md:gap-4">
                <Button type="button" disabled={isDeleting} variant="destructiveOutline" onClick={handleDelete}>
                    <Trash2 className="h-3.5 w-3.5" />
                    <span className="max-sm:hidden">Delete</span>
                </Button>

                <div className="grid flex-1 grid-cols-3 gap-2 md:gap-4">
                    {customerOrderHistory.map((item) => (
                        <div
                            key={item.label}
                            className={cn(
                                "rounded-sm border px-3 py-1 text-center text-white transition-colors md:py-2",
                                item.className
                            )}
                        >
                            <span className="text-sm max-sm:hidden">{item.label} :</span> {item.value}
                        </div>
                    ))}
                </div>
            </div>

            {/* Customer Information Section */}
            <CustomerInfoSection order={orderData} onUpdate={handleCustomerInfoUpdate} />

            {/* Editable Order Status and Description Section */}
            <OrderStatusFormSection
                orderData={orderData}
                setOrderData={setOrderData}
                isDeleting={isDeleting}
                displayOrderStatusOptions={displayOrderStatusOptions}
                isOrderStatusInOptions={isOrderStatusInOptions}
            />

            {/* View Order Items */}
            <div className="md:card space-y-2 border-b pb-3 md:space-y-4 md:py-4">
                <div className="flex items-center justify-between pb-2 md:border-b">
                    <h2 className="text-base max-sm:text-sm">Order Items ({orderData.orderItems.length})</h2>
                </div>

                <div className="grid gap-2 sm:grid-cols-2">
                    {orderData.orderItems.map((item, itemIndex) => (
                        <OrderItem
                            key={itemIndex}
                            quantity={item.quantity}
                            productName={item.productName}
                            productImage={item.productImage}
                            productPrice={item.productPrice}
                            orderItemVariant={item.orderItemVariant}
                        />
                    ))}
                </div>
            </div>

            {/* Previous Orders */}
            <PreviousOrdersSection orders={orderData.customer.orders} orderId={order.id} />
        </div>
    );
};
