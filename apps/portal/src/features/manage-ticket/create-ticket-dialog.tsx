"use client";

import { useState } from "react";

import { useCreateTicketMutation } from "@/redux/api/ticket-api";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@workspace/ui/components/button";
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
import { z } from "zod";

import { ETicketPrivacyStatus, TicketCreatePayload } from "@/types/ticket-type";
import { CustomButton } from "@/components/ui/custom-button";
import { CustomFormImages } from "@/components/ui/custom-form-images";

const ticketFormSchema = z.object({
    title: z.string().min(2, {
        message: "Title must be at least 2 characters.",
    }),
    description: z.string().min(5, {
        message: "Description must be at least 5 characters.",
    }),
    ticketPrivacyStatus: z.nativeEnum(ETicketPrivacyStatus).optional(),
    image: z.array(z.string()).optional(),
    videoUrl: z.string().optional(),
});

type TicketFormValues = z.infer<typeof ticketFormSchema>;

export const CreateTicketDialog = () => {
    const [open, setOpen] = useState(false);
    const form = useForm<TicketFormValues>({
        resolver: zodResolver(ticketFormSchema),
        defaultValues: {
            title: "",
            description: "",
            ticketPrivacyStatus: ETicketPrivacyStatus.private,
            image: [],
            videoUrl: "",
        },
    });

    const [createTicket, { isLoading }] = useCreateTicketMutation();

    const onSubmit = async (data: TicketFormValues) => {
        const payload: TicketCreatePayload = {
            ...data,
        };
        await createTicket(payload)
            .unwrap()
            .then(() => {
                form.reset();
                toast.success("Ticket created successfully");
                setOpen(false);
            })
            .catch((error) => {
                toast.error(error?.data?.message || "Failed to create ticket");
            });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="h-4 w-4" /> Create Ticket
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:!w-[80vw] lg:!w-[60vw] xl:!w-[40vw]">
                <DialogHeader className="pb-3">
                    <DialogTitle className="text-xl font-bold">Create Ticket</DialogTitle>
                    <DialogDescription>Submit a new ticket for assistance.</DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <CustomFormInput
                            label="Title"
                            name="title"
                            placeholder="Enter ticket title"
                            required={true}
                            control={form.control}
                        />

                        <CustomFormTextarea
                            label="Description"
                            name="description"
                            placeholder="Describe your issue"
                            required={true}
                            control={form.control}
                        />

                        <CustomFormImages label="Images" name="image" limit={5} control={form.control} />

                        <div className="flex justify-end gap-4">
                            <DialogClose asChild>
                                <Button type="button" variant="outline">
                                    Cancel
                                </Button>
                            </DialogClose>
                            <CustomButton type="submit" isLoading={isLoading}>
                                Submit Ticket
                            </CustomButton>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};
