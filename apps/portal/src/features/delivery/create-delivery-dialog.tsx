"use client";

import { useState } from "react";
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
    DialogTrigger,
} from "@workspace/ui/components/dialog";
import { Form } from "@workspace/ui/components/form";
import { CustomFormInput } from "@workspace/ui/components/custom/custom-form-input";
import { CustomFormSelect } from "@workspace/ui/components/custom/custom-form-select";
import { CustomFormSwitch } from "@workspace/ui/components/custom/custom-form-switch";
import { toast } from "@workspace/ui/components/sonner";
import { useCreateDeliveryMutation } from "@/redux/api/delivery-api";
import { CreateDelivery, DeliveryScope } from "@/types/delivery-type";
import { deliveryFormSchema, DeliveryFormValues } from "./delivery-schema";
import useGetUser from "@/hooks/useGetUser";
import { CustomCollapsible } from "@workspace/ui/components/custom/custom-collapsible";

export const CreateDeliveryDialog = () => {
    const user = useGetUser();
    const [open, setOpen] = useState(false);
    const form = useForm<DeliveryFormValues>({
        resolver: zodResolver(deliveryFormSchema),
        defaultValues: {
            name: "",
            scope: DeliveryScope.GLOBAL,
            isFree: false,
            deliveryZones: [{ name: "", fee: 0, isFree: false }],
        },
    });

    const [createDelivery, { isLoading }] = useCreateDeliveryMutation();

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "deliveryZones",
    });

    const isFreeDelivery = form.watch("isFree");

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

    const onSubmit = async (data: DeliveryFormValues) => {
        if (!user) {
            toast.error("User not found");
            return;
        }

        const payload: CreateDelivery = {
            name: data.name,
            scope: data.scope as DeliveryScope,
            isFree: data.isFree,
            shopId: user.shop.id,
            deliveryZones: data.deliveryZones,
        };

        await createDelivery(payload)
            .unwrap()
            .then(() => {
                form.reset();
                toast.success("Delivery created successfully");
                setOpen(false);
            })
            .catch((error) => {
                toast.error(
                    error?.data?.message || "Failed to create delivery"
                );
            });
    };

    const scopeOptions = [
        {
            label: "Global",
            value: DeliveryScope.GLOBAL,
        },
        {
            label: "Product Specific",
            value: DeliveryScope.PRODUCT_SPECIFIC,
        },
    ];

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="w-4 h-4" /> Create Delivery
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader className="pb-3">
                    <DialogTitle className="text-xl font-bold">
                        Create Delivery Charge
                    </DialogTitle>
                    <DialogDescription>
                        Create a new delivery charge configuration for your
                        shop.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4"
                    >
                        <div className="grid md:grid-cols-2 gap-4">
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
                                options={scopeOptions}
                                placeholder="Select delivery scope"
                            />
                        </div>

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
                                        Add delivery zones with different
                                        charges based on location.
                                    </p>

                                    {fields.map((field, index) => {
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
                                Create Delivery
                            </CustomButton>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};
