"use client";

import { useState } from "react";

import { useSignUpMutation } from "@/redux/api/auth-api";
import { UserRole } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { CustomFormInput } from "@workspace/ui/components/custom/custom-form-input";
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
import { z } from "zod";

import { CustomButton } from "@/components/ui/custom-button";

const userFormSchema = z.object({
    name: z.string().min(2, {
        message: "Name must be at least 2 characters.",
    }),
    email: z.string().email({
        message: "Invalid email address.",
    }),
    password: z.string().min(6, {
        message: "Password must be at least 6 characters.",
    }),
});

type UserFormValues = z.infer<typeof userFormSchema>;

export const CreateUserDialog = () => {
    const [open, setOpen] = useState(false);
    const form = useForm<UserFormValues>({
        resolver: zodResolver(userFormSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
        },
    });

    const [signUp, { isLoading }] = useSignUpMutation();

    const onSubmit = async (data: UserFormValues) => {
        try {
            await signUp({
                name: data.name,
                email: data.email,
                password: data.password,
                role: UserRole.USER,
            }).unwrap();

            form.reset();
            toast.success("🎉 User created successfully");
            setOpen(false);
        } catch (error: any) {
            console.warn(error);
            toast.error(error.data?.message || "Something went wrong");
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <CustomButton>
                    <Plus className="h-4 w-4" /> Add User
                </CustomButton>
            </DialogTrigger>
            <DialogContent className="sm:!w-[80vw] lg:!w-[45vw] xl:!w-[40vw] 2xl:!w-[35vw]">
                <DialogHeader className="pb-3">
                    <DialogTitle className="text-xl font-bold">Add New User</DialogTitle>
                    <DialogDescription>Create a new user for the system.</DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <CustomFormInput
                            label="Name"
                            name="name"
                            placeholder="Enter user name"
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
                            required
                        />
                        <CustomFormInput
                            label="Password"
                            name="password"
                            placeholder="Enter password"
                            type="password"
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
                                Create User
                            </CustomButton>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};
