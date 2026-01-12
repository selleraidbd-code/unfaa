"use client";

import Image from "next/image";

import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import {
    Dialog,
    DialogClose,
    DialogContainer,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@workspace/ui/components/dialog";
import { Separator } from "@workspace/ui/components/separator";
import { formatDate } from "@workspace/ui/lib/formateDate";
import { Calendar, Image as ImageIcon, MessageSquare, Shield, User, Video } from "lucide-react";

import { ETicketStatus, Ticket } from "@/types/ticket-type";

interface TicketViewDialogProps {
    ticket: Ticket;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const TicketViewDialog = ({ ticket, open, onOpenChange }: TicketViewDialogProps) => {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl">
                <DialogHeader>
                    <DialogTitle>Ticket Details</DialogTitle>
                </DialogHeader>

                <DialogContainer>
                    <div className="space-y-6 p-2 pb-0">
                        {/* Title and Status */}
                        <div className="space-y-3">
                            <div className="flex items-start justify-between gap-4">
                                <h3 className="text-2xl font-bold">{ticket.title}</h3>
                                <div className="flex gap-2">
                                    <Badge variant={ticket.status === ETicketStatus.CLOSED ? "default" : "secondary"}>
                                        {ticket.status}
                                    </Badge>
                                    <Badge variant="outline">{ticket.ticketPrivacyStatus}</Badge>
                                </div>
                            </div>
                        </div>

                        <Separator />

                        {/* Quick Info Grid */}
                        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                            <div className="space-y-1">
                                <div className="text-muted-foreground flex items-center gap-2 text-sm">
                                    <Calendar className="size-4" />
                                    <span>Created</span>
                                </div>
                                <p className="text-sm font-medium">{formatDate(ticket.createdAt)}</p>
                            </div>

                            <div className="space-y-1">
                                <div className="text-muted-foreground flex items-center gap-2 text-sm">
                                    <Calendar className="size-4" />
                                    <span>Updated</span>
                                </div>
                                <p className="text-sm font-medium">{formatDate(ticket.updatedAt)}</p>
                            </div>

                            {ticket.user && (
                                <div className="space-y-1">
                                    <div className="text-muted-foreground flex items-center gap-2 text-sm">
                                        <User className="size-4" />
                                        <span>User</span>
                                    </div>
                                    <p className="text-sm font-medium">
                                        {ticket.user.name || ticket.user.email || "N/A"}
                                    </p>
                                </div>
                            )}

                            <div className="space-y-1">
                                <div className="text-muted-foreground flex items-center gap-2 text-sm">
                                    <Shield className="size-4" />
                                    <span>Privacy</span>
                                </div>
                                <p className="text-sm font-medium">{ticket.ticketPrivacyStatus}</p>
                            </div>
                        </div>

                        <Separator />

                        {/* Description */}
                        <div className="space-y-2">
                            <div className="text-muted-foreground flex items-center gap-2 text-sm">
                                <MessageSquare className="size-4" />
                                <h4 className="text-foreground text-lg font-semibold">Description</h4>
                            </div>
                            <p className="text-muted-foreground leading-relaxed">{ticket.description}</p>
                        </div>

                        {/* Images */}
                        {ticket.image && ticket.image.length > 0 && (
                            <div className="space-y-2">
                                <div className="text-muted-foreground flex items-center gap-2 text-sm">
                                    <ImageIcon className="size-4" />
                                    <h4 className="text-foreground text-lg font-semibold">Images</h4>
                                </div>
                                <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                                    {ticket.image.map((img, idx) => (
                                        <div
                                            key={idx}
                                            className="relative aspect-square w-full overflow-hidden rounded-lg border bg-gray-100"
                                        >
                                            <Image
                                                src={img}
                                                alt={`Ticket image ${idx + 1}`}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Video */}
                        {ticket.videoUrl && (
                            <div className="space-y-2">
                                <div className="text-muted-foreground flex items-center gap-2 text-sm">
                                    <Video className="size-4" />
                                    <h4 className="text-foreground text-lg font-semibold">Video</h4>
                                </div>
                                <div className="relative aspect-video w-full overflow-hidden rounded-lg border bg-gray-100">
                                    <iframe
                                        src={ticket.videoUrl}
                                        className="absolute inset-0 h-full w-full"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    />
                                </div>
                            </div>
                        )}

                        {/* Admin Answer */}
                        {ticket.adminAnswer && (
                            <>
                                <Separator />
                                <div className="space-y-2">
                                    <h4 className="text-lg font-semibold">Admin Response</h4>
                                    <div className="bg-muted/30 rounded-lg border p-4">
                                        <p className="text-muted-foreground leading-relaxed">{ticket.adminAnswer}</p>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </DialogContainer>

                <DialogFooter>
                    <DialogClose>
                        <Button>Close</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
