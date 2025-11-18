"use client";

import { useState } from "react";
import {
    useGetDeliveriesQuery,
    useDeleteDeliveryMutation,
} from "@/redux/api/delivery-api";
import { Delivery } from "@/types/delivery-type";
import { DeliveryCard } from "@/features/delivery/delivery-card";
import { CreateDeliveryDialog } from "@/features/delivery/create-delivery-dialog";
import { UpdateDeliveryDialog } from "@/features/delivery/update-delivery-dialog";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { Truck } from "lucide-react";
import { toast } from "@workspace/ui/components/sonner";
import useGetUser from "@/hooks/useGetUser";
import { useAlert } from "@/hooks/useAlert";

const DeliveryCharge = () => {
    const { fire } = useAlert();
    const user = useGetUser();
    const shopId = user?.shop.id || "";
    const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(
        null
    );

    const { data, isLoading, isError } = useGetDeliveriesQuery({
        shopId,
    });

    const [deleteDelivery] = useDeleteDeliveryMutation();

    const handleEdit = (delivery: Delivery) => {
        setSelectedDelivery(delivery);
    };

    const handleDelete = async (id: string) => {
        fire({
            title: "Delete Delivery Charge",
            description:
                "Are you sure you want to delete this delivery charge?",
            onConfirm: async () => {
                await deleteDelivery({ id })
                    .unwrap()
                    .then(() => {
                        toast.success("Delivery deleted successfully");
                    })
                    .catch((error) => {
                        toast.error(
                            error?.data?.message || "Failed to delete delivery"
                        );
                    });
            },
        });
    };

    const handleCloseDialog = () => {
        setSelectedDelivery(null);
    };

    if (isLoading) {
        return (
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold">Delivery Charges</h2>
                    <CreateDeliveryDialog />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[...Array(3)].map((_, i) => (
                        <Skeleton key={i} className="h-64 rounded-lg" />
                    ))}
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold">Delivery Charges</h2>
                    <CreateDeliveryDialog />
                </div>
                <div className="text-center py-12 text-muted-foreground">
                    Error loading delivery charges
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold">Delivery Charges</h2>
                    <CreateDeliveryDialog />
                </div>

                {data?.data.length === 0 ? (
                    <div className="border rounded-lg p-12 text-center">
                        <Truck className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold mb-2">
                            No Delivery Charges Yet
                        </h3>
                        <p className="text-muted-foreground mb-4">
                            Create your first delivery charge to get started
                        </p>
                        <CreateDeliveryDialog />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {data?.data.map((delivery) => (
                            <DeliveryCard
                                key={delivery.id}
                                delivery={delivery}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                            />
                        ))}
                    </div>
                )}
            </div>

            <UpdateDeliveryDialog
                delivery={selectedDelivery}
                onClose={handleCloseDialog}
            />
        </>
    );
};

export default DeliveryCharge;
