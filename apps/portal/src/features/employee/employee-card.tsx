"use client";

import { Mail, MoreVertical, Calendar, Shield } from "lucide-react";
import { Employee } from "@/types/employee-type";
import { formatDate } from "@workspace/ui/lib/formateDate";
import { getEmployeeRoleLabel } from "./employee-role-options";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { Button } from "@workspace/ui/components/button";

interface EmployeeCardProps {
    employee: Employee;
    onEdit: (employee: Employee) => void;
    onDelete: (id: string) => void;
}

export const EmployeeCard = ({
    employee,
    onEdit,
    onDelete,
}: EmployeeCardProps) => {
    return (
        <div className="bg-background border rounded-lg p-4 space-y-3 hover:border-primary/50 transition-colors">
            {/* Header */}
            <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-base truncate">
                        {employee.user.name}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                        ID: {employee.id}
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
                        <DropdownMenuItem onClick={() => onEdit(employee)}>
                            Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => onDelete(employee.id)}
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
                    <span className="truncate">{employee.user.email}</span>
                </div>

                {employee.roles && employee.roles.length > 0 && (
                    <div className="flex items-start gap-2 text-sm">
                        <Shield className="h-3.5 w-3.5 text-muted-foreground shrink-0 mt-0.5" />
                        <div className="flex flex-wrap gap-1 flex-1 min-w-0">
                            {employee.roles.map((role, index) => (
                                <span
                                    key={index}
                                    className="inline-flex items-center px-2 py-0.5 rounded-md bg-primary/10 text-primary text-xs font-medium"
                                >
                                    {getEmployeeRoleLabel(role)}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">
                        {formatDate(employee.createdAt)}
                    </span>
                </div>
            </div>
        </div>
    );
};
