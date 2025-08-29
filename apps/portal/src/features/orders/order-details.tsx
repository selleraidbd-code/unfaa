import Image from "next/image";

import { useDeleteOrderMutation } from "@/redux/api/order-api";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

import { useAlert } from "@/hooks/useAlert";
import { Order } from "@/types/order-type";
import { CustomTextCopy } from "@workspace/ui/components/custom/custom-text-copy";
import { Button } from "@workspace/ui/components/button";
import { Separator } from "@workspace/ui/components/separator";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@workspace/ui/components/sheet";
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

    const [deleteOrder, { isLoading: isDeleting }] = useDeleteOrderMutation();

    const handleDelete = async () => {
        if (order) {
            fire({
                title: "Delete Order",
                text: "Are you sure you want to delete this order?",
                onConfirm: async () => {
                    await deleteOrder({ id: order.id })
                        .unwrap()
                        .then(() => {
                            toast.success("Order deleted successfully");
                        })
                        .catch((error) => {
                            toast.error(error.data.message);
                        });
                },
            });
        }
    };

    console.log("order :>> ", order);

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetHeader className="sr-only">
                <SheetTitle>Order Details</SheetTitle>
                <SheetDescription>Order Details</SheetDescription>
            </SheetHeader>
            <SheetContent className="sm:max-w-2xl px-6 py-8">
                <div className="flex justify-between">
                    <div className="space-y-0.5">
                        <CustomTextCopy
                            prefixText="Order"
                            text={order?.orderNumber.toString() || ""}
                            copy={true}
                            className="sub-title w-fit"
                            textClassName="lg:text-xl"
                        />
                        <p className="text-muted-foreground text-sm">
                            Date:{" "}
                            {order
                                ? formatDate(order.createdAt)
                                : "Select an order"}
                        </p>
                    </div>

                    <Button
                        disabled={!order || isDeleting}
                        size="sm"
                        variant="destructiveOutline"
                        className="ml-auto"
                        onClick={handleDelete}
                    >
                        <Trash2 className="h-3.5 w-3.5" />
                        Delete Order
                    </Button>
                </div>

                <div className="border-t">
                    {order ? (
                        <>
                            <div className="grid gap-3 py-6">
                                <div className="overflow-y-auto md:max-h-[50dvh]">
                                    {order?.orderItems.map((item) => (
                                        <div
                                            key={`${item.productId}-${item.productVariantId}`}
                                            className="flex items-center py-2.5"
                                        >
                                            <div className="flex w-[70%] items-center gap-2">
                                                <Image
                                                    unoptimized
                                                    src={
                                                        item.product
                                                            ?.photoURL ||
                                                        "/placeholder.jpg"
                                                    }
                                                    alt={
                                                        item.product?.name || ""
                                                    }
                                                    width={100}
                                                    height={100}
                                                    className="h-16 w-16 rounded-sm"
                                                />
                                                <div>
                                                    <p>{item.product?.name}</p>
                                                    {item.productVariant
                                                        ?.name && (
                                                        <p className="text-sm text-muted-foreground">
                                                            Variant:{" "}
                                                            {
                                                                item
                                                                    .productVariant
                                                                    ?.name
                                                            }
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="w-[30%]">
                                                <span>
                                                    {item.quantity} × ৳{" "}
                                                    {item.productVariant
                                                        ?.discountPrice ||
                                                        item.product
                                                            ?.discountPrice}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="space-y-4 border-y border-dashed border-foreground/20 py-3 max-lg:text-sm">
                                    <div className="flex items-center justify-between">
                                        <p className="w-[70%]">সাবটোটাল</p>
                                        <p className="w-[30%]">৳ {total}</p>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <p className="w-[70%]">শিপিং প্রসেস</p>
                                        <p className="w-[30%]">Free Shipping</p>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between pt-3 font-medium">
                                    <p className="w-[70%]">টোটাল</p>
                                    <p className="w-[30%]">৳ {total}</p>
                                </div>
                            </div>

                            <Separator className="my-4" />
                            <div className="grid gap-3">
                                <div className="font-semibold">
                                    Customer Information
                                </div>
                                <dl className="grid gap-3">
                                    <div className="flex items-center justify-between">
                                        <dt className="text-muted-foreground">
                                            Customer Name
                                        </dt>
                                        <dd>{order.customerName}</dd>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <dt className="text-muted-foreground">
                                            Phone
                                        </dt>
                                        <dd>
                                            <a
                                                href={`tel:${order.customerPhoneNumber}`}
                                            >
                                                {order.customerPhoneNumber}
                                            </a>
                                        </dd>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <dt className="text-muted-foreground">
                                            Address
                                        </dt>
                                        <dd>
                                            <a
                                                href={`mailto:${order.customerAddress}`}
                                            >
                                                {order.customerAddress}
                                            </a>
                                        </dd>
                                    </div>
                                </dl>
                            </div>
                            <Separator className="my-4" />
                            <div className="grid gap-3">
                                <div className="font-semibold">
                                    Payment Information
                                </div>
                                <p>
                                    <span className="text-muted-foreground">
                                        Payment Status:{" "}
                                    </span>
                                    <span>{order.paymentStatus}</span>
                                </p>
                                <p>
                                    <span className="text-muted-foreground">
                                        Order Status:{" "}
                                    </span>
                                    <span>{order.orderStatus}</span>
                                </p>
                            </div>
                        </>
                    ) : (
                        <div className="text-center text-muted-foreground">
                            Select an order to view details
                        </div>
                    )}
                </div>

                <div className="text-xs text-muted-foreground">
                    Updated{" "}
                    <time dateTime={order?.createdAt || ""}>
                        {formatDate(order?.updatedAt || "") || "N/A"}
                    </time>
                </div>
            </SheetContent>
        </Sheet>
    );
};
