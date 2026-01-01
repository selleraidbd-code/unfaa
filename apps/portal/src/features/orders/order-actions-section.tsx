import { useState } from "react";

import { useGetFraudCheckerDataMutation } from "@/redux/api/customer-api";
import { useDeleteOrderMutation, useUpdateOrderMutation } from "@/redux/api/order-api";
import { Button } from "@workspace/ui/components/button";
import { toast } from "@workspace/ui/components/sonner";
import { cn } from "@workspace/ui/lib/utils";
import { Loader2, RefreshCw, Trash2 } from "lucide-react";

import { FraudCheckerData } from "@/types/customer-type";
import { useAlert } from "@/hooks/useAlert";

interface OrderActionsSectionProps {
    orderId: string;
    customerTotalConfirmOrder: number | null;
    customerTotalCancelOrder: number | null;
    customerPhoneNumber: string;
    onDeleteSuccess: () => void;
}

export const OrderActionsSection = ({
    orderId,
    customerTotalConfirmOrder,
    customerTotalCancelOrder,
    customerPhoneNumber,
    onDeleteSuccess,
}: OrderActionsSectionProps) => {
    const { fire } = useAlert();
    const [deleteOrder, { isLoading: isDeleting }] = useDeleteOrderMutation();
    const [getFraudCheckerData, { isLoading }] = useGetFraudCheckerDataMutation();
    const [updateOrder, { isLoading: isUpdating }] = useUpdateOrderMutation();
    const [fraudState, setFraudState] = useState<{
        successfulOrders: number;
        cancelledOrders: number;
        totalOrders: number;
    } | null>(null);

    const checkFraud = async (phoneNumber: string) => {
        await getFraudCheckerData({ phoneNumber })
            .unwrap()
            .then(async (res) => {
                setFraudState({
                    successfulOrders: res.data.total_delivered ?? 0,
                    cancelledOrders: res.data.total_cancel ?? 0,
                    totalOrders: res.data.total_parcels ?? 0,
                });
                await updateOrder({
                    id: orderId,
                    payload: {
                        customerTotalConfirmOrder: res.data.total_delivered ?? 0,
                        customerTotalCancelOrder: res.data.total_cancel ?? 0,
                    },
                })
                    .unwrap()
                    .then(() => {})
                    .catch((error) => {
                        toast.error(error.data?.message || "Failed to update fraud checker data");
                    });
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const handleLoadFraudData = () => {
        if (customerPhoneNumber) {
            checkFraud(customerPhoneNumber);
        } else {
            toast.error("Customer phone number is not available");
        }
    };

    const shouldShowLoadButton = customerTotalConfirmOrder === null && customerTotalCancelOrder === null && !fraudState;

    const handleDelete = async () => {
        fire({
            title: "Delete Order",
            description: "Are you sure you want to delete this order?",
            onConfirm: async () => {
                await deleteOrder({ id: orderId })
                    .unwrap()
                    .then(() => {
                        toast.success("Order deleted successfully");
                        onDeleteSuccess();
                    })
                    .catch((error) => {
                        toast.error(error.data?.message || "Failed to delete order");
                    });
            },
        });
    };

    const customerOrderHistory = [
        {
            label: "Total",
            value: fraudState?.totalOrders ?? (customerTotalConfirmOrder ?? 0) + (customerTotalCancelOrder ?? 0),
            className: "bg-primary",
        },
        {
            label: "Successful",
            value: fraudState?.successfulOrders ?? customerTotalConfirmOrder,
            className: "bg-green-500",
        },
        {
            label: "Cancelled",
            value: fraudState?.cancelledOrders ?? customerTotalCancelOrder,
            className: "bg-red-500",
        },
    ];

    return (
        <div className="flex gap-2 md:gap-4">
            <Button type="button" disabled={isDeleting} variant="destructiveOutline" onClick={handleDelete}>
                <Trash2 className="h-3.5 w-3.5" />
                <span className="max-sm:hidden">Delete</span>
            </Button>

            {shouldShowLoadButton && (
                <Button
                    type="button"
                    variant="outline"
                    onClick={handleLoadFraudData}
                    disabled={isLoading}
                    className="flex-1"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            <span className="max-sm:hidden">Loading...</span>
                        </>
                    ) : (
                        <>
                            <RefreshCw className="h-3.5 w-3.5" />
                            Load Fraud Checker Data
                        </>
                    )}
                </Button>
            )}

            {(!shouldShowLoadButton || fraudState) && (
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
            )}
        </div>
    );
};
