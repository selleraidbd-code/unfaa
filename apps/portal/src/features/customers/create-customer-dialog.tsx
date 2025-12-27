"use client";

import { useState } from "react";

import { useCreateCustomerMutation } from "@/redux/api/customer-api";
import { useAppSelector } from "@/redux/store/hook";
import { zodResolver } from "@hookform/resolvers/zod";
import { CustomFormInput } from "@workspace/ui/components/custom/custom-form-input";
import { CustomFormTextarea } from "@workspace/ui/components/custom/custom-form-textarea";
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
import { toast } from "@workspace/ui/components/sonner";
import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { isValidPhoneNumber } from "react-phone-number-input";
import { z } from "zod";

import { CreateCustomer } from "@/types/customer-type";
import { CustomButton } from "@/components/ui/custom-button";
import { CustomFormPhoneInput } from "@/components/ui/custom-form-phone-input";

const customerFormSchema = z.object({
    name: z.string().min(3, {
        message: "Customer name must be at least 2 characters.",
    }),
    email: z
        .string()
        .email({
            message: "Invalid email address.",
        })
        .or(z.literal("")),
    phoneNumber: z.string().refine(isValidPhoneNumber, { message: "Invalid phone number" }),
    address: z.string().min(3, {
        message: "Address is required.",
    }),
});

type BrandFormValues = z.infer<typeof customerFormSchema>;

export const CreateCustomerDialog = () => {
    const user = useAppSelector((state) => state.auth.user);
    const [open, setOpen] = useState(false);
    const form = useForm<BrandFormValues>({
        resolver: zodResolver(customerFormSchema),
        defaultValues: {
            name: "",
            email: "",
            phoneNumber: "",
            address: "",
        },
    });

    const [createCustomer, { isLoading }] = useCreateCustomerMutation();

    const onSubmit = async (data: BrandFormValues) => {
        if (!user) {
            toast.error("User not found");
            return;
        }

        const payload: CreateCustomer = {
            name: data.name,
            email: data.email || undefined,
            phoneNumber: data.phoneNumber,
            address: data.address || undefined,
            shopId: user.shop.id,
        };

        await createCustomer(payload)
            .unwrap()
            .then(() => {
                form.reset();
                toast.success("Customer created successfully");
                setOpen(false);
            })
            .catch((error) => {
                console.error(error);
                toast.error(error.data.message);
            });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <CustomButton>
                    <Plus className="h-4 w-4" /> Add Customer
                </CustomButton>
            </DialogTrigger>
            <DialogContent className="sm:!w-[80vw] lg:!w-[45vw] xl:!w-[40vw] 2xl:!w-[35vw]">
                <DialogHeader className="pb-3">
                    <DialogTitle className="text-xl font-bold">Add New Customer</DialogTitle>
                    <DialogDescription>Add a new customer for your shop.</DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <CustomFormInput
                            label="Name"
                            name="name"
                            placeholder="Enter customer name"
                            type="text"
                            control={form.control}
                            required
                        />

                        <CustomFormInput
                            label="Email"
                            name="email"
                            placeholder="Enter email address"
                            type="email"
                            control={form.control}
                        />

                        <CustomFormPhoneInput
                            label="Phone Number"
                            name="phoneNumber"
                            placeholder="Enter phone number"
                            control={form.control}
                            defaultCountry="BD"
                            required
                        />

                        <CustomFormTextarea
                            label="Address"
                            name="address"
                            placeholder="Enter address"
                            control={form.control}
                            required
                        />
                        <div className="flex justify-end gap-4">
                            <DialogClose asChild>
                                <CustomButton type="button" variant="outline">
                                    Cancel
                                </CustomButton>
                            </DialogClose>
                            <CustomButton type="submit" isLoading={isLoading}>
                                Save Customer
                            </CustomButton>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};
