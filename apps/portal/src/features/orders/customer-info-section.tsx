import { useState } from "react";

import { useUpdateOrderMutation } from "@/redux/api/order-api";
import { Button } from "@workspace/ui/components/button";
import { CustomFormInput } from "@workspace/ui/components/custom/custom-form-input";
import { CustomFormTextarea } from "@workspace/ui/components/custom/custom-form-textarea";
import { Form } from "@workspace/ui/components/form";
import { toast } from "@workspace/ui/components/sonner";
import { Edit2, Phone, X } from "lucide-react";
import { useForm } from "react-hook-form";

import { Order } from "@/types/order-type";
import { CustomButton } from "@/components/ui/custom-button";

type CustomerInfoFormData = {
    customerName: string;
    customerPhoneNumber: string;
    customerAddress: string;
    totalAmount: number;
};

type CustomerInfoSectionProps = {
    order: Order;
    onUpdate?: (updatedOrder?: Order) => void;
};

export const CustomerInfoSection = ({ order, onUpdate }: CustomerInfoSectionProps) => {
    const [updateOrder, { isLoading: isUpdating }] = useUpdateOrderMutation();
    const [isEditing, setIsEditing] = useState(false);

    const form = useForm<CustomerInfoFormData>({
        values: {
            customerName: order?.customerName || "",
            customerPhoneNumber: order?.customerPhoneNumber || "",
            customerAddress: order?.customerAddress || "",
            totalAmount: order?.discountedPrice ?? order?.totalAmount ?? 0,
        },
    });

    const handleSubmit = async (data: CustomerInfoFormData) => {
        if (!order) return;

        const payload = {
            customerName: data.customerName,
            customerPhoneNumber: data.customerPhoneNumber,
            customerAddress: data.customerAddress,
            discountedPrice: data.totalAmount,
            orderStatus: order.orderStatus,
        };

        await updateOrder({
            id: order.id,
            payload,
        })
            .unwrap()
            .then(() => {
                toast.success("Customer information updated successfully");
                setIsEditing(false);
                form.reset();
                // Pass updated customer info to the callback
                onUpdate?.({
                    ...order,
                    customerName: data.customerName,
                    customerPhoneNumber: data.customerPhoneNumber,
                    customerAddress: data.customerAddress,
                    discountedPrice: data.totalAmount,
                    updatedAt: new Date().toISOString(),
                });
            })
            .catch((error) => {
                toast.error(error.data?.message || "Failed to update customer information");
            });
    };

    const handleCancel = () => {
        form.reset({
            customerName: order?.customerName || "",
            customerPhoneNumber: order?.customerPhoneNumber || "",
            customerAddress: order?.customerAddress || "",
            totalAmount: order?.discountedPrice ?? order?.totalAmount ?? 0,
        });
        setIsEditing(false);
    };

    const handleCallCustomer = () => {
        window.open(`tel:${order?.customerPhoneNumber}`, "_blank");
        toast.success("Calling customer...");
    };

    if (isEditing) {
        return (
            <div className="space-y-4 rounded-lg border p-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-base">Customer Information</h3>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            <CustomFormInput
                                label="Customer Name"
                                name="customerName"
                                control={form.control}
                                placeholder="Enter customer name"
                                required
                            />
                            <CustomFormInput
                                label="Phone Number"
                                name="customerPhoneNumber"
                                control={form.control}
                                placeholder="Enter phone number"
                                required
                            />
                            <CustomFormInput
                                label="COD / Payable Amount"
                                name="totalAmount"
                                control={form.control}
                                placeholder="Enter COD / Payable amount"
                                type="number"
                                required
                            />
                        </div>
                        <CustomFormTextarea
                            label="Address"
                            name="customerAddress"
                            control={form.control}
                            placeholder="Enter customer address"
                            required
                            rows={1}
                        />
                        <div className="flex justify-end gap-2">
                            <Button type="button" variant="outline" onClick={handleCancel} disabled={isUpdating}>
                                <X className="mr-2 h-4 w-4" />
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isUpdating || !form.formState.isDirty}>
                                {isUpdating ? "Saving..." : "Save Changes"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        );
    }

    return (
        <div className="space-y-4 rounded-lg border p-4">
            <div className="flex items-center justify-between">
                <h3 className="text-base">Customer Information</h3>
                <CustomButton
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                    isLoading={isUpdating}
                >
                    <Edit2 />
                    Edit
                </CustomButton>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-1">
                    <p className="text-muted-foreground text-sm">Customer Name</p>
                    <p className="font-medium max-sm:text-sm">{order?.customerName || "N/A"}</p>
                </div>
                <div className="flex items-end gap-4">
                    <div className="space-y-1">
                        <p className="text-muted-foreground text-sm">Phone Number</p>
                        <p className="font-medium max-sm:text-sm">{order?.customerPhoneNumber || "N/A"}</p>
                    </div>
                    <Button type="button" size="sm" onClick={handleCallCustomer}>
                        <Phone />
                        Call
                    </Button>
                </div>
                <div className="space-y-1 md:col-span-2">
                    <p className="text-muted-foreground text-sm">Address</p>
                    <p className="font-medium max-sm:text-sm">{order?.customerAddress || "N/A"}</p>
                </div>
                <div className="space-y-1">
                    <p className="text-muted-foreground text-sm">COD / Payable Amount</p>
                    <p className="font-medium">৳ {order?.discountedPrice ?? order?.totalAmount ?? 0}</p>
                </div>
            </div>
        </div>
    );
};
