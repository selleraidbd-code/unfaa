"use client";

import { DataTable, Meta } from "@/components/table/data-table";
import { DataTableColumnHeader } from "@/components/table/data-table-column-header";
import { DataTableFieldCopy } from "@/components/table/data-table-field-copy";
import { DataTableRowActions } from "@/components/table/data-table-row-actions";
import { Customer } from "@/types/customer-type";
import { ColumnDef, PaginationState } from "@tanstack/react-table";
import { formatDate } from "@workspace/ui/lib/formateDate";
import { CreateCustomerDialog } from "./create-customer-dialog";

interface CustomerTableViewProps {
    data: Customer[];
    isLoading: boolean;
    isError: boolean;
    paginationMeta: Meta;
    onEdit: (customer: Customer) => void;
    onDelete: (id: string) => void;
    onSearch: (value: string) => void;
    onPaginationChange: (state: PaginationState) => void;
}

export const CustomerTableView = ({
    data,
    isLoading,
    isError,
    paginationMeta,
    onEdit,
    onDelete,
    onSearch,
    onPaginationChange,
}: CustomerTableViewProps) => {
    const customersColumns: ColumnDef<Customer>[] = [
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
            accessorKey: "name",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Name" />
            ),
            cell: ({ row }) => <DataTableFieldCopy row={row} field="name" />,
        },
        {
            accessorKey: "email",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Email" />
            ),
            cell: ({ row }) => {
                return (
                    <span className="truncate font-medium">
                        {row.getValue("email")}
                    </span>
                );
            },
        },
        {
            accessorKey: "phoneNumber",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Phone Number" />
            ),
            cell: ({ row }) => (
                <DataTableFieldCopy row={row} field="phoneNumber" />
            ),
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: "createdAt",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Joined At" />
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
            title="Customers"
            data={data}
            columns={customersColumns}
            showViewOptions={true}
            onSearch={onSearch}
            paginationMeta={paginationMeta}
            onPaginationChange={onPaginationChange}
            createButton={<CreateCustomerDialog />}
            isLoading={isLoading}
            isError={isError}
        />
    );
};
