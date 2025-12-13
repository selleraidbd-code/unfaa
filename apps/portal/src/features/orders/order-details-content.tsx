import { useState } from "react";
import Image from "next/image";

import { CustomerInfoSection } from "@/features/orders/customer-info-section";
import { orderStatusOptions } from "@/features/orders/data";
import { useDeleteOrderMutation, useUpdateOrderMutation } from "@/redux/api/order-api";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@workspace/ui/components/accordion";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { CustomFormSelect } from "@workspace/ui/components/custom/custom-form-select";
import { CustomFormTextarea } from "@workspace/ui/components/custom/custom-form-textarea";
import { Form } from "@workspace/ui/components/form";
import { toast } from "@workspace/ui/components/sonner";
import { cn } from "@workspace/ui/lib/utils";
import { Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";

import { Order, OrderDetailsItem, OrderStatus } from "@/types/order-type";
import { useAlert } from "@/hooks/useAlert";

type OrderFormData = {
    orderStatus: OrderStatus;
    notes: string;
};

interface OrderDetailsContentProps {
    order: Order;
    onClose: () => void;
}

export const OrderDetailsContent = ({ order, onClose }: OrderDetailsContentProps) => {
    const { fire } = useAlert();
    const [updateOrder, { isLoading: isUpdating }] = useUpdateOrderMutation();
    const [deleteOrder, { isLoading: isDeleting }] = useDeleteOrderMutation();
    const [orderData, setOrderData] = useState<Order>(order);

    // Form for order status and notes
    const orderForm = useForm<OrderFormData>({
        values: {
            orderStatus: orderData?.orderStatus || OrderStatus.PLACED,
            notes: orderData?.notes || "",
        },
    });

    const handleOrderSubmit = async (data: OrderFormData) => {
        if (!orderData) return;

        const payload = {
            orderStatus: data.orderStatus,
            notes: data.notes,
        };

        await updateOrder({
            id: orderData.id,
            payload,
        })
            .unwrap()
            .then(() => {
                toast.success("Order status and description updated successfully");
                setOrderData((prev) => ({
                    ...prev,
                    orderStatus: data.orderStatus,
                    notes: data.notes,
                }));
            })
            .catch((error) => {
                toast.error(error.data?.message || "Failed to update order");
            });
    };

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
        <div className="flex max-h-[85dvh] flex-col space-y-3 overflow-y-auto max-sm:px-4 max-sm:pb-8 md:space-y-5">
            <div className="flex gap-2 md:gap-4">
                <Button
                    type="button"
                    disabled={isDeleting || isUpdating}
                    variant="destructiveOutline"
                    onClick={handleDelete}
                >
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
            <Form {...orderForm}>
                <form onSubmit={orderForm.handleSubmit(handleOrderSubmit)} className="space-y-4 rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-base">
                            <span className="max-sm:hidden">Order Status & Note</span>
                            <span className="sm:hidden">Status & Note</span>
                        </h3>
                        <Button
                            type="submit"
                            className="lg:px-10"
                            disabled={isUpdating || isDeleting || !orderForm.formState.isDirty}
                        >
                            {isUpdating ? "Updating..." : "Update Order"}
                        </Button>
                    </div>

                    <div className="space-y-4">
                        <CustomFormSelect
                            label="Order Status"
                            name="orderStatus"
                            options={displayOrderStatusOptions}
                            control={orderForm.control}
                            disabled={!isOrderStatusInOptions}
                        />

                        <CustomFormTextarea
                            label="Order Note"
                            name="notes"
                            control={orderForm.control}
                            placeholder="Enter order note"
                            rows={2}
                            className="w-full"
                        />
                    </div>
                </form>
            </Form>

            {/* View Order Items */}
            <Accordion type="single" collapsible className="w-full rounded-lg border px-4">
                <AccordionItem value="order-items">
                    <AccordionTrigger className="text-base hover:no-underline">
                        View Order Items ({orderData.orderItems.length})
                    </AccordionTrigger>

                    <AccordionContent>
                        <div className="max-h-60 space-y-3 overflow-y-auto pt-2">
                            {orderData.orderItems.map((item) => (
                                <OrderItems key={item.id} item={item} />
                            ))}
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    );
};

const OrderItems = ({ item }: { item: OrderDetailsItem }) => {
    return (
        <div className="flex items-center gap-3 rounded-md border-b pb-2 last:border-b-0 max-sm:flex-col md:border md:p-3">
            <div className="items-center gap-2 max-sm:flex">
                <Image
                    src={item.product?.photoURL || "/placeholder.jpg"}
                    alt={item.product?.name || ""}
                    width={60}
                    height={60}
                    className="size-12 rounded-sm object-cover sm:size-16"
                />

                <p className="font-medium sm:hidden">৳ {item.product?.discountPrice || item.product?.price}</p>
            </div>

            <div className="min-w-0 flex-1 space-y-1.5">
                <p className="truncate font-medium">
                    {item.product?.banglaName || item.product?.name}{" "}
                    <span className="text-muted-foreground pl-2 text-sm">(Qty: {item.quantity})</span>
                </p>

                {item.orderItemVariant?.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {item.orderItemVariant.map((ov, i) => (
                            <Badge
                                key={`${ov.productVariant?.name}-${ov.productVariantOption?.name}-${i}`}
                                variant="secondary"
                            >
                                <span className="text-primary">{ov.productVariant?.name}:</span>{" "}
                                {ov.productVariantOption?.name}
                                {typeof ov.productVariantOption?.extraPrice === "number" &&
                                ov.productVariantOption?.extraPrice > 0
                                    ? ` (+${ov.productVariantOption?.extraPrice})`
                                    : ""}
                            </Badge>
                        ))}
                    </div>
                )}
            </div>

            <div className="text-right max-sm:hidden">
                <p className="font-medium">৳ {item.product?.discountPrice || item.product?.price}</p>
                <p className="text-muted-foreground text-sm">× {item.quantity}</p>
            </div>
        </div>
    );
};
