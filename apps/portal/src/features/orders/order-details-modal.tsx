import Image from "next/image";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import {
    useDeleteOrderMutation,
    useUpdateOrderMutation,
} from "@/redux/api/order-api";
import { PhoneCall, Trash2 } from "lucide-react";
import { toast } from "@workspace/ui/components/sonner";

import { orderStatusOptions } from "@/features/orders/data";
import { useAlert } from "@/hooks/useAlert";
import { Order, OrderDetailsItem, OrderStatus } from "@/types/order-type";
import { Button } from "@workspace/ui/components/button";
import { CustomInput } from "@workspace/ui/components/custom/custom-input";
import { CustomSelect } from "@workspace/ui/components/custom/custom-select";
import { CustomTextCopy } from "@workspace/ui/components/custom/custom-text-copy";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@workspace/ui/components/dialog";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@workspace/ui/components/accordion";
import { formatDate } from "@workspace/ui/lib/formateDate";
import { Form } from "@workspace/ui/components/form";
import { CustomFormSelect } from "@workspace/ui/components/custom/custom-form-select";
import { CustomFormTextarea } from "@workspace/ui/components/custom/custom-form-textarea";
import { CustomFormInput } from "@workspace/ui/components/custom/custom-form-input";

type OrderFormData = {
    customerName: string;
    customerPhoneNumber: string;
    customerAddress: string;
    orderStatus: OrderStatus;
    notes: string;
    totalAmount: number;
};

export const OrderDetailsModal = ({
    order,
    open,
    onOpenChange,
}: {
    order: Order;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}) => {
    const { fire } = useAlert();
    const [updateOrder, { isLoading: isUpdating }] = useUpdateOrderMutation();
    const [deleteOrder, { isLoading: isDeleting }] = useDeleteOrderMutation();

    const form = useForm<OrderFormData>({
        values: {
            customerName: order?.customerName || "",
            customerPhoneNumber: order?.customerPhoneNumber || "",
            customerAddress: order?.customerAddress || "",
            orderStatus: order?.orderStatus || OrderStatus.PLACED,
            notes: order?.notes || "",
            totalAmount: order?.totalAmount || 0,
        },
    });

    const total = order?.orderItems.reduce(
        (acc, item) =>
            acc +
            (item?.product?.discountPrice ||
                item?.productVariant?.[0]?.discountPrice ||
                0) *
                item.quantity,
        0
    );

    const handleSubmit = async (data: OrderFormData) => {
        if (!order) return;

        const payload = {
            customerName: data.customerName,
            customerPhoneNumber: data.customerPhoneNumber,
            customerAddress: data.customerAddress,
            orderStatus: data.orderStatus,
        };

        await updateOrder({
            id: order.id,
            payload,
        })
            .unwrap()
            .then(() => {
                toast.success("Order updated successfully");
            })
            .catch((error) => {
                toast.error(error.data?.message || "Failed to update order");
            });
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
                            onOpenChange(false);
                        })
                        .catch((error) => {
                            toast.error(
                                error.data?.message || "Failed to delete order"
                            );
                        });
                },
            });
        }
    };

    const handleCallCustomer = () => {
        window.open(`tel:${order?.customerPhoneNumber}`, "_blank");
        toast.success("Calling customer...");
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="md:max-w-4xl overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex pr-5 justify-between">
                        <div className="space-y-1">
                            <p className="flex items-center gap-4">
                                Order Details{" "}
                                <CustomTextCopy
                                    text={order?.orderNumber.toString() || ""}
                                    copy={true}
                                />
                            </p>
                            <span className="text-xs text-muted-foreground">
                                Last updated:{" "}
                                <time dateTime={order?.updatedAt || ""}>
                                    {formatDate(order?.updatedAt || "") ||
                                        "N/A"}
                                </time>
                            </span>
                        </div>

                        <Button onClick={handleCallCustomer}>
                            <PhoneCall className="size-4" />
                            Call Customer
                        </Button>
                    </DialogTitle>
                    <DialogDescription className="sr-only">
                        Edit and manage order information
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(handleSubmit)}
                        className="space-y-4"
                    >
                        <div className="grid gap-4 pt-4 md:grid-cols-2">
                            <CustomInput
                                label="Customer Name"
                                placeholder="Enter customer name"
                                value={form.watch("customerName")}
                                onChange={(value) =>
                                    form.setValue(
                                        "customerName",
                                        value as string
                                    )
                                }
                                required
                            />
                            <CustomInput
                                label="Phone Number"
                                placeholder="Enter phone number"
                                type="text"
                                value={form.watch("customerPhoneNumber")}
                                onChange={(value) =>
                                    form.setValue(
                                        "customerPhoneNumber",
                                        value as string
                                    )
                                }
                                required
                            />

                            <CustomFormSelect
                                label="Order Status"
                                name="orderStatus"
                                options={orderStatusOptions}
                                control={form.control}
                            />

                            <CustomFormInput
                                label="COD / Payable Amount"
                                name="totalAmount"
                                control={form.control}
                                placeholder="Enter COD / Payable amount"
                                type="number"
                                defaultValue={order?.totalAmount || 0}
                            />
                        </div>

                        <CustomInput
                            label="Address"
                            placeholder="Enter customer address"
                            value={form.watch("customerAddress")}
                            onChange={(value) =>
                                form.setValue(
                                    "customerAddress",
                                    value as string
                                )
                            }
                            required
                        />

                        <CustomFormTextarea
                            label="Order Description"
                            name="notes"
                            control={form.control}
                            placeholder="Enter order description"
                            rows={4}
                            className="w-full"
                        />

                        <Accordion
                            type="single"
                            collapsible
                            className="w-full border rounded-lg px-4"
                        >
                            <AccordionItem value="order-items">
                                <AccordionTrigger className="text-base hover:no-underline">
                                    View Order Items ({order.orderItems.length})
                                </AccordionTrigger>

                                <AccordionContent>
                                    <div className="space-y-3 pt-2 max-h-60 overflow-y-auto">
                                        {order.orderItems.map((item) => (
                                            <OrderItems
                                                key={item.id}
                                                item={item}
                                            />
                                        ))}
                                    </div>

                                    {/* Order Summary */}
                                    <div className="space-y-3 border-t pt-4 mt-4">
                                        {/* <div className="flex justify-between">
                                            <span className="text-muted-foreground">
                                                Subtotal
                                            </span>
                                            <span>৳ {total || 0}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">
                                                Shipping
                                            </span>
                                            <span>Free</span>
                                        </div>
                                        <Separator /> */}
                                        <div className="flex justify-between font-semibold text-lg">
                                            <span>Total</span>
                                            <span>৳ {total || 0}</span>
                                        </div>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>

                        {/* Action Buttons */}
                        <DialogFooter className="sm:justify-between">
                            <Button
                                type="button"
                                disabled={isDeleting || isUpdating}
                                variant="destructiveOutline"
                                onClick={handleDelete}
                            >
                                <Trash2 className="h-3.5 w-3.5" />
                                Delete Order
                            </Button>

                            <div className="flex  gap-5 items-center">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => onOpenChange(false)}
                                    disabled={isUpdating || isDeleting}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={isUpdating || isDeleting}
                                >
                                    {isUpdating
                                        ? "Updating..."
                                        : "Update Order"}
                                </Button>
                            </div>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

const OrderItems = ({ item }: { item: OrderDetailsItem }) => {
    return (
        <div
            key={`${item.productId}-${item.productVariantId}`}
            className="flex items-center gap-3 p-3 border rounded-lg"
        >
            <Image
                unoptimized
                src={item.product?.photoURL || "/placeholder.jpg"}
                alt={item.product?.name || ""}
                width={60}
                height={60}
                className="size-16 rounded-sm object-cover"
            />
            <div className="flex-1 min-w-0">
                <p className="font-medium truncate">
                    {item.product?.banglaName || item.product?.name}
                </p>
                {item.productVariant?.length > 0 && (
                    <p className="text-sm text-muted-foreground">
                        Variant: {item.productVariant?.[0]?.name || ""}
                    </p>
                )}
                <p className="text-sm text-muted-foreground">
                    Qty: {item.quantity}
                </p>
            </div>
            <div className="text-right">
                <p className="font-medium">
                    ৳ {item.product?.discountPrice || item.product?.price}
                </p>
                <p className="text-sm text-muted-foreground">
                    × {item.quantity}
                </p>
            </div>
        </div>
    );
};
