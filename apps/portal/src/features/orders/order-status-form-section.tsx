import { useUpdateOrderMutation } from "@/redux/api/order-api";
import { Button } from "@workspace/ui/components/button";
import { CustomFormSelect } from "@workspace/ui/components/custom/custom-form-select";
import { CustomFormTextarea } from "@workspace/ui/components/custom/custom-form-textarea";
import { Form } from "@workspace/ui/components/form";
import { toast } from "@workspace/ui/components/sonner";
import { useBreakpoint } from "@workspace/ui/hooks/use-breakpoint";
import { useForm } from "react-hook-form";

import { Order, OrderStatus } from "@/types/order-type";

type OrderFormData = {
    orderStatus: OrderStatus;
    notes: string;
};

interface OrderStatusFormSectionProps {
    orderData: Order;
    setOrderData: (updatedOrder: Order) => void;
    isDeleting: boolean;
    displayOrderStatusOptions: Array<{ label: string; value: string }>;
    isOrderStatusInOptions: boolean;
}

export const OrderStatusFormSection = ({
    orderData,
    setOrderData,
    isDeleting,
    displayOrderStatusOptions,
    isOrderStatusInOptions,
}: OrderStatusFormSectionProps) => {
    const isMobile = useBreakpoint();

    const [updateOrder, { isLoading: isUpdating }] = useUpdateOrderMutation();

    const form = useForm<OrderFormData>({
        values: {
            orderStatus: orderData?.orderStatus || OrderStatus.PLACED,
            notes: orderData?.notes || "",
        },
    });

    const handleUpdateStatus = async (data: OrderFormData) => {
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
                setOrderData({
                    ...orderData,
                    orderStatus: data.orderStatus,
                    notes: data.notes,
                });
            })
            .catch((error) => {
                toast.error(error.data?.message || "Failed to update order");
            });
    };

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(handleUpdateStatus)}
                className="space-y-2 border-b pb-3 md:space-y-4 md:rounded-lg md:border md:p-4"
            >
                <div className="flex items-center justify-between">
                    <h3 className="text-base">
                        <span className="max-sm:hidden">Order</span>
                        Status & Note
                    </h3>
                    <Button
                        type="submit"
                        size={isMobile ? "sm" : "default"}
                        className="lg:px-10"
                        disabled={isUpdating || isDeleting || !form.formState.isDirty}
                    >
                        {isUpdating ? "Updating..." : "Update Order"}
                    </Button>
                </div>

                <div className="grid gap-2 sm:grid-cols-2 md:gap-4">
                    <CustomFormTextarea
                        label="Order Note"
                        name="notes"
                        control={form.control}
                        placeholder="Enter order note"
                        rows={isMobile ? 1 : 2}
                        textareaClassName="min-h-9 max-md:max-h-28"
                    />

                    <CustomFormSelect
                        label="Order Status"
                        name="orderStatus"
                        options={displayOrderStatusOptions}
                        control={form.control}
                        disabled={!isOrderStatusInOptions}
                    />
                </div>
            </form>
        </Form>
    );
};
