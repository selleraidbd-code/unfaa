"use client";

import { DataTable, Meta } from "@/components/table/data-table";
import { DataTableColumnHeader } from "@/components/table/data-table-column-header";
import { DataTableFieldCopy } from "@/components/table/data-table-field-copy";
import { DataTableRowActions } from "@/components/table/data-table-row-actions";
import { Employee } from "@/types/employee-type";
import { ColumnDef } from "@tanstack/react-table";
import { formatDate } from "@workspace/ui/lib/formateDate";
import { CreateEmployeeDialog } from "./create-employee-dialog";
import { getEmployeeRoleLabel } from "./employee-role-options";

interface EmployeeTableViewProps {
    data: Employee[];
    isLoading: boolean;
    isError: boolean;
    paginationMeta: Meta;
    onEdit: (employee: Employee) => void;
    onDelete: (id: string) => void;
    onSearch: (value: string) => void;
}

export const EmployeeTableView = ({
    data,
    isLoading,
    isError,
    paginationMeta,
    onEdit,
    onDelete,
    onSearch,
}: EmployeeTableViewProps) => {
    const employeesColumns: ColumnDef<Employee>[] = [
        {
            accessorKey: "id",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="ID" />
            ),
            cell: ({ row }) => (
                <DataTableFieldCopy row={row} field="id" slice={8} />
            ),
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
            accessorKey: "role",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Role" />
            ),
            cell: ({ row }) => {
                return (
                    <div className="flex flex-wrap gap-1">
                        {row.original.roles.map((role) => (
                            <span
                                key={role}
                                className="inline-flex items-center px-2 py-0.5 rounded-md bg-primary/10 text-primary text-xs font-medium"
                            >
                                {getEmployeeRoleLabel(role)}
                            </span>
                        ))}
                    </div>
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

    return (
        <DataTable
            title="Employees"
            data={data}
            columns={employeesColumns}
            showViewOptions={true}
            onSearch={onSearch}
            pagination={true}
            paginationMeta={paginationMeta}
            createButton={<CreateEmployeeDialog />}
            isLoading={isLoading}
            isError={isError}
        />
    );
};
