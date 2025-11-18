"use client";

import { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { CustomButton } from "@/components/ui/custom-button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@workspace/ui/components/dialog";
import { Form } from "@workspace/ui/components/form";
import { CustomFormInput } from "@workspace/ui/components/custom/custom-form-input";
import { CustomFormSelect } from "@workspace/ui/components/custom/custom-form-select";
import { CustomFormSwitch } from "@workspace/ui/components/custom/custom-form-switch";
import { toast } from "@workspace/ui/components/sonner";
import { useUpdateDeliveryMutation } from "@/redux/api/delivery-api";
import { Delivery, DeliveryScope, UpdateDelivery } from "@/types/delivery-type";
import {
    updateDeliveryFormSchema,
    UpdateDeliveryFormValues,
} from "./delivery-schema";
import { CustomCollapsible } from "@workspace/ui/components/custom/custom-collapsible";

interface UpdateDeliveryDialogProps {
    delivery: Delivery | null;
    onClose: () => void;
}

export const UpdateDeliveryDialog = ({
    delivery,
    onClose,
}: UpdateDeliveryDialogProps) => {
    const form = useForm<UpdateDeliveryFormValues>({
        resolver: zodResolver(updateDeliveryFormSchema),
        defaultValues: {
            name: "",
            scope: DeliveryScope.GLOBAL,
            isFree: false,
            deliveryZones: [{ name: "", fee: 0, isFree: false }],
        },
    });

    const [updateDelivery, { isLoading }] = useUpdateDeliveryMutation();

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "deliveryZones",
    });

    const isFreeDelivery = form.watch("isFree");

    useEffect(() => {
        if (delivery) {
            form.reset({
                name: delivery.name,
                scope: delivery.scope,
                isFree: delivery.isFree,
                deliveryZones: delivery.deliveryZones.map((zone) => ({
                    id: zone.id,
                    name: zone.name,
                    fee: zone.fee,
                    isFree: zone.isFree,
                })),
            });
        }
    }, [delivery, form]);

    const handleAddZone = () => {
        append({ name: "", fee: 0, isFree: false });
    };

    const handleRemoveZone = (index: number) => {
        if (fields.length > 1) {
            remove(index);
        } else {
            toast.error("At least one delivery zone is required");
        }
    };

    const onSubmit = async (data: UpdateDeliveryFormValues) => {
        if (!delivery) return;

        const payload: UpdateDelivery = {
            id: delivery.id,
            payload: {
                name: data.name,
                scope: data.scope as DeliveryScope,
                isFree: data.isFree,
                deliveryZones: data.deliveryZones,
            },
        };

        await updateDelivery(payload)
            .unwrap()
            .then(() => {
                toast.success("Delivery updated successfully");
                onClose();
            })
            .catch((error) => {
                toast.error(
                    error?.data?.message || "Failed to update delivery"
                );
            });
    };

    return (
        <Dialog open={!!delivery} onOpenChange={onClose}>
            <DialogContent className="sm:!w-[90vw] lg:!w-[65vw] xl:!w-[55vw] max-h-[90vh] overflow-y-auto">
                <DialogHeader className="pb-3">
                    <DialogTitle className="text-xl font-bold">
                        Update Delivery Charge
                    </DialogTitle>
                    <DialogDescription>
                        Update the delivery charge configuration.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4"
                    >
                        <CustomFormInput
                            label="Delivery Name"
                            name="name"
                            placeholder="e.g., Standard Delivery, Express Delivery"
                            type="text"
                            required={true}
                            control={form.control}
                        />

                        <CustomFormSelect
                            label="Scope"
                            name="scope"
                            required={true}
                            control={form.control}
                            options={[
                                {
                                    label: "Global (All Products)",
                                    value: DeliveryScope.GLOBAL,
                                },
                                {
                                    label: "Product Specific",
                                    value: DeliveryScope.PRODUCT_SPECIFIC,
                                },
                            ]}
                            placeholder="Select delivery scope"
                        />

                        <CustomFormSwitch
                            label="Free Delivery"
                            name="isFree"
                            control={form.control}
                            description="Toggle this on if delivery is completely free"
                        />

                        <CustomCollapsible
                            title="Delivery Zones"
                            content={
                                <div className="space-y-4 pt-2">
                                    <p className="text-sm text-muted-foreground">
                                        Manage delivery zones with different
                                        charges based on location.
                                    </p>

                                    {fields.map((field, index) => {
                                        const zoneFee = form.watch(
                                            `deliveryZones.${index}.fee`
                                        );
                                        const zoneIsFree = form.watch(
                                            `deliveryZones.${index}.isFree`
                                        );

                                        return (
                                            <div
                                                key={field.id}
                                                className="border rounded-lg p-4 space-y-4"
                                            >
                                                <div className="flex justify-between items-center">
                                                    <h4 className="font-semibold">
                                                        Zone {index + 1}
                                                    </h4>
                                                    {fields.length > 1 && (
                                                        <Button
                                                            type="button"
                                                            variant="destructiveOutline"
                                                            size="icon"
                                                            onClick={() =>
                                                                handleRemoveZone(
                                                                    index
                                                                )
                                                            }
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    )}
                                                </div>

                                                <div className="grid md:grid-cols-2 gap-4">
                                                    <CustomFormInput
                                                        label="Zone Name"
                                                        name={`deliveryZones.${index}.name`}
                                                        placeholder="e.g., Dhaka City, Outside Dhaka"
                                                        type="text"
                                                        required={true}
                                                        control={form.control}
                                                    />

                                                    <CustomFormInput
                                                        label="Delivery Fee"
                                                        name={`deliveryZones.${index}.fee`}
                                                        placeholder="Enter fee amount"
                                                        type="number"
                                                        min={0}
                                                        required={true}
                                                        control={form.control}
                                                        disabled={
                                                            isFreeDelivery ||
                                                            zoneIsFree
                                                        }
                                                    />

                                                    <CustomFormSwitch
                                                        label="Free for this zone"
                                                        name={`deliveryZones.${index}.isFree`}
                                                        control={form.control}
                                                        disabled={
                                                            isFreeDelivery
                                                        }
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}

                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={handleAddZone}
                                        className="w-full"
                                    >
                                        <Plus className="w-4 h-4" /> Add Another
                                        Zone
                                    </Button>
                                </div>
                            }
                        />

                        <div className="flex justify-end gap-4 pt-4">
                            <DialogClose asChild>
                                <Button type="button" variant="outline">
                                    Cancel
                                </Button>
                            </DialogClose>
                            <CustomButton type="submit" isLoading={isLoading}>
                                Update Delivery
                            </CustomButton>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};
