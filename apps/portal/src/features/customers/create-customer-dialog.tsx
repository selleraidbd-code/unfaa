"use client";

import useGetUser from "@/hooks/useGetUser";
import { useCreateCustomerMutation } from "@/redux/api/customer-api";
import { CreateCustomer } from "@/types/customer-type";
import { zodResolver } from "@hookform/resolvers/zod";
import { CustomButton } from "@/components/ui/custom-button";
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
import { Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const employeeFormSchema = z.object({
    name: z.string().min(2, {
        message: "Employee name must be at least 2 characters.",
    }),
    email: z.string().email({
        message: "Invalid email address.",
    }),
    phoneNumber: z.string().min(10, {
        message: "Phone number must be at least 10 characters.",
    }),
    address: z.string().min(1, {
        message: "Address is required.",
    }),
});

type BrandFormValues = z.infer<typeof employeeFormSchema>;

export const CreateCustomerDialog = () => {
    const user = useGetUser();
    const [open, setOpen] = useState(false);
    const form = useForm<BrandFormValues>({
        resolver: zodResolver(employeeFormSchema),
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
            email: data.email,
            phoneNumber: data.phoneNumber,
            address: data.address,
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
                console.log(error);
                toast.error(error.data.message);
            });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <CustomButton>
                    <Plus className="w-4 h-4" /> Add Customer
                </CustomButton>
            </DialogTrigger>
            <DialogContent className="sm:!w-[80vw] lg:!w-[45vw] xl:!w-[40vw] 2xl:!w-[35vw]">
                <DialogHeader className="pb-3">
                    <DialogTitle className="text-xl font-bold">
                        Add New Customer
                    </DialogTitle>
                    <DialogDescription>
                        Add a new customer for your shop.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4"
                    >
                        <CustomFormInput
                            label="Name"
                            name="name"
                            placeholder="Enter brand name"
                            type="text"
                            required={true}
                            control={form.control}
                        />
                        <CustomFormInput
                            label="Email"
                            name="email"
                            placeholder="Enter email address"
                            type="email"
                            control={form.control}
                        />
                        <CustomFormInput
                            label="Phone Number"
                            name="phoneNumber"
                            placeholder="Enter phone number"
                            type="text"
                            required={true}
                            control={form.control}
                        />
                        <CustomFormTextarea
                            label="Address"
                            name="address"
                            placeholder="Enter address"
                            control={form.control}
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
