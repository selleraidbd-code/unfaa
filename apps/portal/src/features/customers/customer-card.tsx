"use client";

import { Mail, MoreVertical, Calendar, User, Phone } from "lucide-react";
import { Customer } from "@/types/customer-type";
import { formatDate } from "@workspace/ui/lib/formateDate";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { Button } from "@workspace/ui/components/button";

interface CustomerCardProps {
    customer: Customer;
    onEdit: (customer: Customer) => void;
    onDelete: (id: string) => void;
}

export const CustomerCard = ({
    customer,
    onEdit,
    onDelete,
}: CustomerCardProps) => {
    return (
        <div className="bg-background border rounded-lg p-4 space-y-3 hover:border-primary/50 transition-colors">
            {/* Header */}
            <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-base truncate">
                        {customer.name}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                        ID: {customer.id}
                    </p>
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 -mt-1"
                        >
                            <MoreVertical className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEdit(customer)}>
                            Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => onDelete(customer.id)}
                            className="text-destructive"
                        >
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Details */}
            <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                    <span className="truncate">{customer.email}</span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                    <span className="truncate">{customer.phoneNumber}</span>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">
                        {formatDate(customer.createdAt)}
                    </span>
                </div>
            </div>
        </div>
    );
};
