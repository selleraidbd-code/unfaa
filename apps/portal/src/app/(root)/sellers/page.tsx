"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";

import { User } from "@/features/auth/auth-type";
import { useDeleteUserMutation, useGetUsersQuery } from "@/redux/api/auth-api";
import { UserRole } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@workspace/ui/components/checkbox";
import { AlertType } from "@workspace/ui/components/custom/custom-alert-dialogue";
import { toast } from "@workspace/ui/components/sonner";
import { formatDate } from "@workspace/ui/lib/formateDate";
import { Trash } from "lucide-react";

import { useAlert } from "@/hooks/useAlert";
import { DataTable, Meta } from "@/components/table/data-table";
import { DataTableColumnHeader } from "@/components/table/data-table-column-header";
import { DataTableFieldCopy } from "@/components/table/data-table-field-copy";
import { DataTableRowActions } from "@/components/table/data-table-row-actions";

const SellersPage = () => {
    const { fire } = useAlert();
    const searchParams = useSearchParams();
    const page = searchParams.get("page") || 1;
    const limit = searchParams.get("limit") || 30;

    const [searchTerm, setSearchTerm] = useState("");

    const { data, isLoading, isError } = useGetUsersQuery({
        page: Number(page),
        limit: Number(limit),
        searchTerm: searchTerm || undefined,
        role: UserRole.SELLER,
    });

    const [deleteUser] = useDeleteUserMutation();

    const handleSearch = (value: string) => {
        setSearchTerm(value);
    };

    const handleBulkDelete = () => {
        console.warn("Bulk delete");
    };

    const handleDelete = async (id: string) => {
        fire({
            title: "Delete Seller",
            description: "Are you sure you want to delete this seller? This action cannot be undone.",
            type: AlertType.ERROR,
            onConfirm: async () => {
                await deleteUser(id)
                    .unwrap()
                    .then(() => {
                        toast.success("🎉 Seller deleted successfully");
                    })
                    .catch((error) => {
                        toast.error(error.data.message || "Something went wrong");
                    });
            },
        });
    };

    const sellersColumns: ColumnDef<User>[] = [
        {
            id: "select",
            header: ({ table }) => (
                <Checkbox
                    checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
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
            header: ({ column }) => <DataTableColumnHeader column={column} title="ID" />,
            cell: ({ row }) => <p>{row.getValue("id")}</p>,
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: "name",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
            cell: ({ row }) => <DataTableFieldCopy row={row} field="name" />,
        },
        {
            accessorKey: "email",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Email" />,
            cell: ({ row }) => {
                return <span className="truncate font-medium">{row.getValue("email")}</span>;
            },
        },

        {
            accessorKey: "role",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Role" />,
            cell: ({ row }) => <span className="truncate font-medium">{row.getValue("role")}</span>,
        },
        {
            accessorKey: "createdAt",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Created At" />,
            cell: ({ row }) => {
                return <span className="truncate font-medium">{formatDate(row.getValue("createdAt"))}</span>;
            },
        },
        {
            id: "actions",
            cell: ({ row }) => (
                <DataTableRowActions
                    row={row}
                    actions={[
                        {
                            label: "Delete",
                            onClick: () => handleDelete(row.original.id),
                        },
                    ]}
                />
            ),
        },
    ];

    const meta: Meta = {
        total: data?.meta?.total || 0,
        page: Number(page),
        limit: Number(limit),
    };

    return (
        <div className="space-y-4">
            <div>
                <h2 className="text-2xl font-semibold tracking-tight">Sellers Management</h2>
                <p className="text-muted-foreground">Manage sellers in your system.</p>
            </div>

            <DataTable
                data={data?.data || []}
                columns={sellersColumns}
                onSearch={handleSearch}
                pagination={true}
                paginationMeta={meta}
                bulkActions={[
                    {
                        label: "Delete Selected",
                        onClick: handleBulkDelete,
                        variant: "destructive",
                        icon: Trash,
                    },
                ]}
                isLoading={isLoading}
                isError={isError}
            />
        </div>
    );
};

export default SellersPage;
