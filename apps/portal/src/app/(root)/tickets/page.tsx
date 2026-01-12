"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";

import { CreateTicketDialog } from "@/features/manage-ticket/create-ticket-dialog";
import { TicketCard } from "@/features/manage-ticket/ticket-card";
import { TicketViewDialog } from "@/features/manage-ticket/ticket-view-dialog";
import { useDeleteTicketMutation, useGetTicketsQuery } from "@/redux/api/ticket-api";
import { useAppSelector } from "@/redux/store/hook";
import { Card, CardFooter, CardHeader } from "@workspace/ui/components/card";
import { AlertType } from "@workspace/ui/components/custom/custom-alert-dialogue";
import { toast } from "@workspace/ui/components/sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/components/tabs";

import { ETicketPrivacyStatus, Ticket } from "@/types/ticket-type";
import { useAlert } from "@/hooks/useAlert";
import { CustomPagination } from "@/components/ui/custom-pagination";

const Page = () => {
    const { fire } = useAlert();
    const searchParams = useSearchParams();
    const page = searchParams.get("page") || 1;
    const limit = searchParams.get("limit") || 50;
    const user = useAppSelector((state) => state.auth.user);

    const [activeTab, setActiveTab] = useState("all-tickets"); // "all-tickets" (public) and "my-tickets"
    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
    const [viewDialogOpen, setViewDialogOpen] = useState(false);

    const {
        data: ticketData,
        isLoading,
        isError,
    } = useGetTicketsQuery({
        page: Number(page),
        limit: Number(limit),
        ...(activeTab === "my-tickets" ? { userId: user?.id } : { ticketPrivacyStatus: ETicketPrivacyStatus.public }),
    });

    const [deleteTicket] = useDeleteTicketMutation();

    const handleDelete = async (id: string) => {
        fire({
            title: "Are you sure you want to delete this ticket?",
            description: "This action cannot be undone.",
            type: AlertType.ERROR,
            onConfirm: async () => {
                await deleteTicket({ id })
                    .unwrap()
                    .then(() => toast.success("Ticket deleted successfully"))
                    .catch((err) => toast.error(err?.data?.message || "Failed to delete ticket"));
            },
        });
    };

    const handleView = (ticket: Ticket) => {
        setSelectedTicket(ticket);
        setViewDialogOpen(true);
    };

    const renderTicketCards = () => {
        if (isLoading) {
            return (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {[...Array(6)].map((_, i) => (
                        <Card key={i} className="animate-pulse">
                            <CardHeader>
                                <div className="bg-muted h-6 w-3/4 rounded" />
                                <div className="bg-muted mt-2 h-4 w-full rounded" />
                                <div className="bg-muted mt-2 h-4 w-2/3 rounded" />
                            </CardHeader>
                            <CardFooter>
                                <div className="bg-muted h-9 w-full rounded" />
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            );
        }

        if (isError) {
            return (
                <div className="py-12 text-center">
                    <p className="text-muted-foreground">Failed to load tickets. Please try again.</p>
                </div>
            );
        }

        const tickets = ticketData?.data || [];

        if (tickets.length === 0) {
            return (
                <div className="py-12 text-center">
                    <p className="text-muted-foreground">No tickets found.</p>
                </div>
            );
        }

        return (
            <div className="space-y-6">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {tickets.map((ticket) => (
                        <TicketCard key={ticket.id} ticket={ticket} onView={handleView} onDelete={handleDelete} />
                    ))}
                </div>
                {ticketData?.meta && ticketData?.meta?.total >= 50 && (
                    <div className="flex justify-center">
                        <CustomPagination
                            paginationMeta={{
                                page: Number(page),
                                limit: Number(limit),
                                total: ticketData?.meta?.total || 0,
                            }}
                        />
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-semibold tracking-tight">Tickets</h2>
                    <p className="text-muted-foreground">View public tickets or manage your own tickets.</p>
                </div>
                <CreateTicketDialog />
            </div>

            <Tabs defaultValue="all-tickets" onValueChange={setActiveTab} className="w-full">
                <TabsList>
                    <TabsTrigger value="all-tickets">Public Tickets</TabsTrigger>
                    <TabsTrigger value="my-tickets">My Tickets</TabsTrigger>
                </TabsList>
                <TabsContent value="all-tickets" className="mt-4">
                    {renderTicketCards()}
                </TabsContent>
                <TabsContent value="my-tickets" className="mt-4">
                    {renderTicketCards()}
                </TabsContent>
            </Tabs>

            {selectedTicket && (
                <TicketViewDialog ticket={selectedTicket} open={viewDialogOpen} onOpenChange={setViewDialogOpen} />
            )}
        </div>
    );
};

export default Page;
