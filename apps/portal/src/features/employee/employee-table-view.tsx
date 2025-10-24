"use client";

import { ColumnDef, PaginationState } from "@tanstack/react-table";
import { Trash } from "lucide-react";
import { DataTable } from "@/components/table/data-table";
import { DataTableColumnHeader } from "@/components/table/data-table-column-header";
import { DataTableRowActions } from "@/components/table/data-table-row-actions";
import { Checkbox } from "@workspace/ui/components/checkbox";
import { formatDate } from "@workspace/ui/lib/formateDate";
import { Employee } from "@/types/employee-type";
import { CreateEmployeeDialog } from "./create-employee-dialog";
import { getEmployeeRoleOptions } from "./employee-role-options";

interface EmployeeTableViewProps {
    data: Employee[];
    isLoading: boolean;
    isError: boolean;
    paginationMeta?: any;
    onEdit: (employee: Employee) => void;
    onDelete: (id: string) => void;
    onSearch: (value: string) => void;
    onPaginationChange: (state: PaginationState) => void;
    onBulkDelete: () => void;
}

export const EmployeeTableView = ({
    data,
    isLoading,
    isError,
    paginationMeta,
    onEdit,
    onDelete,
    onSearch,
    onPaginationChange,
    onBulkDelete,
}: EmployeeTableViewProps) => {
    const employeesColumns: ColumnDef<Employee>[] = [
        {
            id: "select",
            header: ({ table }) => (
                <Checkbox
                    checked={
                        table.getIsAllPageRowsSelected() ||
                        (table.getIsSomePageRowsSelected() && "indeterminate")
                    }
                    onCheckedChange={(value) =>
                        table.toggleAllPageRowsSelected(!!value)
                    }
                    aria-label="Select all"
                    className="translate-y-[2px]"
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                    className="translate-y-[2px]"
                />
            ),
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: "id",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="ID" />
            ),
            cell: ({ row }) => <p>{row.getValue("id")}</p>,
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: "user.name",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Name" />
            ),
            cell: ({ row }) => {
                return (
                    <span className="truncate font-medium">
                        {row.original.user.name}
                    </span>
                );
            },
        },
        {
            accessorKey: "user.email",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Email" />
            ),
            cell: ({ row }) => {
                return (
                    <span className="truncate font-medium">
                        {row.original.user.email}
                    </span>
                );
            },
        },
        {
            accessorKey: "createdAt",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Created At" />
            ),
            cell: ({ row }) => {
                return (
                    <span className="truncate font-medium">
                        {formatDate(row.getValue("createdAt"))}
                    </span>
                );
            },
        },
        {
            id: "actions",
            cell: ({ row }) => (
                <DataTableRowActions
                    row={row}
                    actions={[
                        {
                            label: "Edit",
                            onClick: () => onEdit(row.original),
                        },
                        {
                            label: "Delete",
                            onClick: () => onDelete(row.original.id),
                        },
                    ]}
                />
            ),
        },
    ];

    const employeeRoleOptions = getEmployeeRoleOptions();
    const roles = [
        {
            value: "",
            label: "All",
        },
        ...employeeRoleOptions,
    ];

    return (
        <DataTable
            title="Employees"
            data={data}
            columns={employeesColumns}
            showViewOptions={true}
            filterableColumns={[
                {
                    id: "role",
                    title: "Role",
                    options: roles,
                },
            ]}
            onSearch={onSearch}
            pagination={true}
            paginationMeta={paginationMeta}
            onPaginationChange={onPaginationChange}
            createButton={<CreateEmployeeDialog />}
            bulkActions={[
                {
                    label: "Delete Selected",
                    onClick: onBulkDelete,
                    variant: "destructive",
                    icon: Trash,
                },
            ]}
            isLoading={isLoading}
            isError={isError}
        />
    );
};
