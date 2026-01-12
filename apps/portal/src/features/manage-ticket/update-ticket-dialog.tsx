"use client";

import { useEffect } from "react";

import { useUpdateTicketByAdminMutation } from "@/redux/api/ticket-api";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@workspace/ui/components/button";
import { CustomFormSelect } from "@workspace/ui/components/custom/custom-form-select";
import { CustomFormTextarea } from "@workspace/ui/components/custom/custom-form-textarea";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@workspace/ui/components/dialog";
import { Form } from "@workspace/ui/components/form";
import { toast } from "@workspace/ui/components/sonner";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { ETicketPrivacyStatus, ETicketStatus, Ticket, TicketAdminUpdatePayload } from "@/types/ticket-type";
import { CustomButton } from "@/components/ui/custom-button";

const updateTicketSchema = z.object({
    adminAnswer: z.string().optional(),
    status: z.nativeEnum(ETicketStatus).optional(),
    ticketPrivacyStatus: z.nativeEnum(ETicketPrivacyStatus).optional(),
});

type UpdateTicketValues = z.infer<typeof updateTicketSchema>;

interface UpdateTicketDialogProps {
    ticket: Ticket | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const UpdateTicketDialog = ({ ticket, open, onOpenChange }: UpdateTicketDialogProps) => {
    const form = useForm<UpdateTicketValues>({
        resolver: zodResolver(updateTicketSchema),
        defaultValues: {
            adminAnswer: "",
            status: ETicketStatus.OPEN,
            ticketPrivacyStatus: ETicketPrivacyStatus.private,
        },
    });

    useEffect(() => {
        if (ticket) {
            form.reset({
                adminAnswer: ticket.adminAnswer || "",
                status: ticket.status,
                ticketPrivacyStatus: ticket.ticketPrivacyStatus,
            });
        }
    }, [ticket, form]);

    const [updateTicket, { isLoading }] = useUpdateTicketByAdminMutation();

    const onSubmit = async (data: UpdateTicketValues) => {
        if (!ticket) return;

        const payload: TicketAdminUpdatePayload = {
            ...data,
        };

        await updateTicket({ id: ticket.id, payload })
            .unwrap()
            .then(() => {
                toast.success("Ticket updated successfully");
                onOpenChange(false);
            })
            .catch((error) => {
                toast.error(error?.data?.message || "Failed to update ticket");
            });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:!w-[80vw] lg:!w-[60vw] xl:!w-[40vw]">
                <DialogHeader className="pb-3">
                    <DialogTitle className="text-xl font-bold">Update Ticket</DialogTitle>
                    <DialogDescription>Review and respond to the ticket.</DialogDescription>
                </DialogHeader>

                {ticket && (
                    <div className="bg-muted mb-4 rounded-md p-3 text-sm">
                        <p>
                            <strong>Title:</strong> {ticket.title}
                        </p>
                        <p>
                            <strong>Description:</strong> {ticket.description}
                        </p>
                        <p>
                            <strong>By:</strong> {ticket.user?.name || ticket.userId}
                        </p>
                    </div>
                )}

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <CustomFormTextarea
                            label="Admin Answer"
                            name="adminAnswer"
                            placeholder="Enter your response"
                            control={form.control}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <CustomFormSelect
                                label="Status"
                                name="status"
                                options={[
                                    { label: "Open", value: ETicketStatus.OPEN },
                                    { label: "Closed", value: ETicketStatus.CLOSED },
                                ]}
                                control={form.control}
                            />

                            <CustomFormSelect
                                label="Privacy"
                                name="ticketPrivacyStatus"
                                options={[
                                    { label: "Private", value: ETicketPrivacyStatus.private },
                                    { label: "Public", value: ETicketPrivacyStatus.public },
                                ]}
                                control={form.control}
                            />
                        </div>

                        <div className="flex justify-end gap-4">
                            <DialogClose asChild>
                                <Button type="button" variant="outline">
                                    Cancel
                                </Button>
                            </DialogClose>
                            <CustomButton type="submit" isLoading={isLoading}>
                                Update Ticket
                            </CustomButton>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};
