import Image from "next/image";

import {
    useDeleteOrderMutation,
    useUpdateOrderMutation,
} from "@/redux/api/order-api";
import { Trash2 } from "lucide-react";
import { toast } from "@workspace/ui/components/sonner";

import { orderStatusOptions } from "@/features/orders/data";
import { useAlert } from "@/hooks/useAlert";
import { Order, OrderStatus } from "@/types/order-type";
import { Button } from "@workspace/ui/components/button";
import { CustomSelect } from "@workspace/ui/components/custom/custom-select";
import { CustomTextCopy } from "@workspace/ui/components/custom/custom-text-copy";
import { Separator } from "@workspace/ui/components/separator";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@workspace/ui/components/dialog";
import { formatDate } from "@workspace/ui/lib/formateDate";

export const OrderDetails = ({
    order,
    open,
    onOpenChange,
}: {
    order?: Order;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}) => {
    const total = order?.orderItems.reduce(
        (acc, item) =>
            acc +
            (item?.product?.discountPrice ||
                item?.productVariant?.discountPrice ||
                0) *
                item.quantity,
        0
    );

    const { fire } = useAlert();

    const [updateOrder, { isLoading: isUpdating }] = useUpdateOrderMutation();
    const [deleteOrder, { isLoading: isDeleting }] = useDeleteOrderMutation();

    const handleUpdate = async (status: string) => {
        if (order) {
            await updateOrder({
                id: order.id,
                payload: { orderStatus: status as OrderStatus },
            })
                .unwrap()
                .then(() => {
                    toast.success("Order updated successfully");
                })
                .catch((error) => {
                    toast.error(error.data.message);
                });
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
                            onOpenChange(false);
                        })
                        .catch((error) => {
                            toast.error(error.data.message);
                        });
                },
            });
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Order Details</DialogTitle>
                    <DialogDescription>
                        View and manage order information
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-6">
                    {/* Order Header */}
                    <div className="flex justify-between items-start">
                        <div className="space-y-1">
                            <CustomTextCopy
                                prefixText="Order"
                                text={order?.orderNumber.toString() || ""}
                                copy={true}
                                className="sub-title w-fit"
                                textClassName="text-xl font-semibold"
                            />
                            <p className="text-muted-foreground text-sm">
                                Date:{" "}
                                {order
                                    ? formatDate(order.createdAt)
                                    : "Select an order"}
                            </p>
                        </div>

                        <Button
                            disabled={!order || isDeleting || isUpdating}
                            size="sm"
                            variant="destructiveOutline"
                            onClick={handleDelete}
                        >
                            <Trash2 className="h-3.5 w-3.5" />
                            Delete Order
                        </Button>
                    </div>

                    {/* Order Items */}
                    {order ? (
                        <>
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold">
                                    Order Items
                                </h3>
                                <div className="space-y-3 max-h-60 overflow-y-auto">
                                    {order?.orderItems.map((item) => (
                                        <div
                                            key={`${item.productId}-${item.productVariantId}`}
                                            className="flex items-center gap-3 p-3 border rounded-lg"
                                        >
                                            <Image
                                                unoptimized
                                                src={
                                                    item.product?.photoURL ||
                                                    "/placeholder.jpg"
                                                }
                                                alt={item.product?.name || ""}
                                                width={60}
                                                height={60}
                                                className="h-15 w-15 rounded-md object-cover"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium truncate">
                                                    {item.product?.name}
                                                </p>
                                                {item.productVariant?.name && (
                                                    <p className="text-sm text-muted-foreground">
                                                        Variant:{" "}
                                                        {
                                                            item.productVariant
                                                                ?.name
                                                        }
                                                    </p>
                                                )}
                                                <p className="text-sm text-muted-foreground">
                                                    Qty: {item.quantity}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-medium">
                                                    ৳{" "}
                                                    {item.productVariant
                                                        ?.discountPrice ||
                                                        item.product
                                                            ?.discountPrice}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    × {item.quantity}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Order Summary */}
                                <div className="space-y-3 border-t pt-4">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">
                                            Subtotal
                                        </span>
                                        <span>৳ {total}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">
                                            Shipping
                                        </span>
                                        <span>Free</span>
                                    </div>
                                    <Separator />
                                    <div className="flex justify-between font-semibold text-lg">
                                        <span>Total</span>
                                        <span>৳ {total}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Customer Information */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold">
                                    Customer Information
                                </h3>
                                <div className="grid gap-3 p-4 bg-muted/30 rounded-lg">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">
                                            Name
                                        </span>
                                        <span className="font-medium">
                                            {order.customerName}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">
                                            Phone
                                        </span>
                                        <a
                                            href={`tel:${order.customerPhoneNumber}`}
                                            className="font-medium text-blue-600 hover:underline"
                                        >
                                            {order.customerPhoneNumber}
                                        </a>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">
                                            Address
                                        </span>
                                        <span className="font-medium text-right max-w-xs truncate">
                                            {order.customerAddress}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Order Management */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold">
                                    Order Management
                                </h3>
                                <div className="flex items-center justify-between gap-4">
                                    <span className="text-muted-foreground">
                                        Status
                                    </span>
                                    <CustomSelect
                                        className="max-w-xs"
                                        options={orderStatusOptions}
                                        value={order.orderStatus}
                                        onChange={handleUpdate}
                                    />
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="text-center text-muted-foreground py-8">
                            Select an order to view details
                        </div>
                    )}

                    {/* Footer */}
                    {order && (
                        <div className="text-xs text-muted-foreground border-t pt-4">
                            Last updated:{" "}
                            <time dateTime={order?.updatedAt || ""}>
                                {formatDate(order?.updatedAt || "") || "N/A"}
                            </time>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};
