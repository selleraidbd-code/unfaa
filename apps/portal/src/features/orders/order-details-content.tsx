import { useState } from "react";

import { CustomerInfoSection } from "@/features/orders/customer-info-section";
import { orderStatusOptions } from "@/features/orders/data";
import { OrderActionsSection } from "@/features/orders/order-actions-section";
import { OrderItemsEdit } from "@/features/orders/order-items-edit";
import { OrderStatusFormSection } from "@/features/orders/order-status-form-section";
import { OrderItem, PreviousOrdersSection } from "@/features/orders/previous-orders-section";
import { Button } from "@workspace/ui/components/button";
import { cn } from "@workspace/ui/lib/utils";
import { Edit2 } from "lucide-react";

import { Order } from "@/types/order-type";

interface OrderDetailsContentProps {
    order: Order;
    onClose: () => void;
    className?: string;
}

export const OrderDetailsContent = ({ order, onClose, className }: OrderDetailsContentProps) => {
    const [orderData, setOrderData] = useState<Order>(order);
    const [isEditOrderItem, setIsEditOrderItem] = useState(false);

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

    return (
        <div className={cn("flex flex-col space-y-3 max-sm:px-4 max-sm:pb-8 md:space-y-5", className)}>
            <OrderActionsSection
                orderId={order.id}
                customerTotalConfirmOrder={order.customerTotalConfirmOrder}
                customerTotalCancelOrder={order.customerTotalCancelOrder}
                customerPhoneNumber={order.customerPhoneNumber}
                onDeleteSuccess={onClose}
            />

            {/* Customer Information Section */}
            <CustomerInfoSection order={orderData} onUpdate={handleCustomerInfoUpdate} />

            {isEditOrderItem ? (
                <OrderItemsEdit
                    orderId={orderData.id}
                    orderItems={orderData.orderItems}
                    discountedPrice={orderData.discountedPrice}
                    onCancel={() => setIsEditOrderItem(false)}
                    onSuccess={() => setIsEditOrderItem(false)}
                />
            ) : (
                <>
                    {/* Editable Order Status and Description Section - Hide when editing */}
                    <OrderStatusFormSection
                        orderData={orderData}
                        setOrderData={setOrderData}
                        displayOrderStatusOptions={displayOrderStatusOptions}
                        isOrderStatusInOptions={isOrderStatusInOptions}
                    />

                    {/* View/Edit Order Items */}
                    <div className="md:card space-y-2 rounded-sm border p-3 md:space-y-4 md:py-4">
                        <div className="flex items-center justify-between pb-2 md:border-b">
                            <h2 className="text-base max-sm:text-sm">Order Items ({orderData.orderItems.length})</h2>

                            <Button
                                variant="outline"
                                className="hidden"
                                size="sm"
                                onClick={() => setIsEditOrderItem(true)}
                            >
                                <Edit2 className="h-3.5 w-3.5" />
                                Edit
                            </Button>
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

                    {/* Previous Orders - Hide when editing */}
                    <PreviousOrdersSection orders={orderData.customer.orders} orderId={order.id} />
                </>
            )}
        </div>
    );
};
