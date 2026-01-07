"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";

import { User } from "@/features/auth/auth-type";
import { useDeleteUserMutation, useGetUsersQuery } from "@/redux/api/auth-api";
import { UserRole } from "@/types";
import { ColumnDef, PaginationState } from "@tanstack/react-table";
import { Checkbox } from "@workspace/ui/components/checkbox";
import { toast } from "@workspace/ui/components/sonner";
import { formatDate } from "@workspace/ui/lib/formateDate";
import { Trash } from "lucide-react";

import { DataTable, Meta } from "@/components/table/data-table";
import { DataTableColumnHeader } from "@/components/table/data-table-column-header";
import { DataTableFieldCopy } from "@/components/table/data-table-field-copy";
import { DataTableRowActions } from "@/components/table/data-table-row-actions";

const UsersPage = () => {
    const searchParams = useSearchParams();
    const page = searchParams.get("page") || 1;
    const limit = searchParams.get("limit") || 10;
    const [searchTerm, setSearchTerm] = useState("");

    const { data, isLoading, isError } = useGetUsersQuery({
        page: Number(page),
        limit: Number(limit),
        searchTerm: searchTerm || undefined,
    });

    const [deleteUser] = useDeleteUserMutation();

    const handleSearch = (value: string) => {
        setSearchTerm(value);
    };

    const handleBulkDelete = () => {
        console.warn("Bulk delete");
    };

    const handleDelete = async (id: string) => {
        await deleteUser(id)
            .unwrap()
            .then(() => {
                toast.success("🎉 User deleted successfully");
            })
            .catch((error) => {
                toast.error(error.data.message || "Something went wrong");
            });
    };

    const usersColumns: ColumnDef<User>[] = [
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

    const roles = [
        {
            value: "",
            label: "All",
        },
        {
            value: UserRole.SUPER_ADMIN,
            label: "Super Admin",
        },
        {
            value: UserRole.ADMIN,
            label: "Admin",
        },
        {
            value: UserRole.SELLER,
            label: "Seller",
        },
        {
            value: UserRole.USER,
            label: "User",
        },
    ];

    const meta: Meta = {
        total: data?.meta?.total || 0,
        page: Number(page),
        limit: Number(limit),
    };

    return (
        <DataTable
            title="Users"
            data={data?.data || []}
            columns={usersColumns}
            showViewOptions={true}
            filterableColumns={[
                {
                    id: "role",
                    title: "Role",
                    options: roles,
                },
            ]}
            onSearch={handleSearch}
            pagination={true}
            paginationMeta={meta}
            createButtonInfo={{
                label: "Create User",
                href: "/users/create",
            }}
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
    );
};

export default UsersPage;
