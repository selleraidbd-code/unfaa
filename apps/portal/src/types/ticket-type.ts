import { User } from "@/features/auth/auth-type";

export enum ETicketPrivacyStatus {
    private = "private",
    public = "public",
}

export enum ETicketStatus {
    OPEN = "open",
    CLOSED = "closed",
}

export interface Ticket {
    id: string;
    title: string;
    description: string;
    image?: string[];
    videoUrl?: string;
    ticketPrivacyStatus: ETicketPrivacyStatus;
    status: ETicketStatus;
    adminAnswer?: string;
    userId: string;
    user?: User;
    createdAt: string;
    updatedAt: string;
}

export interface TicketCreatePayload {
    title: string;
    description: string;
    image?: string[];
    videoUrl?: string;
    ticketPrivacyStatus?: ETicketPrivacyStatus;
}

export interface TicketAdminUpdatePayload {
    adminAnswer?: string;
    status?: ETicketStatus;
    ticketPrivacyStatus?: ETicketPrivacyStatus;
}
