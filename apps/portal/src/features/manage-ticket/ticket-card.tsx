"use client";

import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Eye, Settings, Trash2 } from "lucide-react";

import { ETicketStatus, Ticket } from "@/types/ticket-type";

interface TicketCardProps {
    ticket: Ticket;
    onView?: (ticket: Ticket) => void;
    onDelete?: (id: string) => void;
    onManage?: (ticket: Ticket) => void;
    showView?: boolean;
    showDelete?: boolean;
    showManage?: boolean;
}

export const TicketCard = ({
    ticket,
    onView,
    onDelete,
    onManage,
    showView = true,
    showDelete = true,
    showManage = false,
}: TicketCardProps) => {
    return (
        <Card className="flex flex-col">
            <CardHeader>
                <div className="flex items-start justify-between gap-2">
                    <CardTitle className="line-clamp-2">{ticket.title}</CardTitle>
                    <div className="flex gap-2">
                        <Badge
                            variant={ticket.status === ETicketStatus.CLOSED ? "default" : "secondary"}
                            className="text-xs"
                        >
                            {ticket.status}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                            {ticket.ticketPrivacyStatus}
                        </Badge>
                    </div>
                </div>
                <CardDescription className="line-clamp-2">{ticket.description}</CardDescription>
            </CardHeader>
            <CardFooter className="mt-auto justify-end gap-4">
                {showDelete && onDelete && (
                    <Button variant="outline" size="sm" onClick={() => onDelete(ticket.id)}>
                        <Trash2 className="h-4 w-4" />
                        <span className="max-md:hidden"> Delete</span>
                    </Button>
                )}

                {showView && onView && (
                    <Button variant="default" size="sm" onClick={() => onView(ticket)}>
                        <Eye className="h-4 w-4" />
                        View Details
                    </Button>
                )}
                {showManage && onManage && (
                    <Button variant="secondary" size="sm" onClick={() => onManage(ticket)}>
                        <Settings className="h-4 w-4" />
                        <span className="max-md:hidden">Manage/Answer</span>
                    </Button>
                )}
            </CardFooter>
        </Card>
    );
};
