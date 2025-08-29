"use client";

import { useDeleteUserMutation, useGetUsersQuery } from "@/redux/api/auth-api";
import { ColumnDef, PaginationState } from "@tanstack/react-table";
import { Trash } from "lucide-react";

import { UserRole } from "@/types";
import { User } from "@/types/auth-type";
import { DataTable } from "@repo/ui/components/table/data-table";
import { DataTableColumnHeader } from "@repo/ui/components/table/data-table-column-header";
import { DataTableFieldCopy } from "@repo/ui/components/table/data-table-field-copy";
import { DataTableRowActions } from "@repo/ui/components/table/data-table-row-actions";
import { Checkbox } from "@repo/ui/components/ui/checkbox";
import { formatDate } from "@repo/ui/lib/formateDate";
import { toast } from "sonner";

const UsersPage = () => {
    const { data, isLoading, isError } = useGetUsersQuery({
        page: 1,
        limit: 10,
    });

    const [deleteUser] = useDeleteUserMutation();

    const handleSearch = (value: string) => {
        console.log(value);
    };

    const handlePaginationChange = (state: PaginationState) => {
        console.log(state);
    };

    const handleBulkDelete = () => {
        console.log("Bulk delete");
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
            accessorKey: "role",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Role" />
            ),
            cell: ({ row }) => (
                <span className="truncate font-medium">
                    {row.getValue("role")}
                </span>
            ),
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
            paginationMeta={data?.meta}
            onPaginationChange={handlePaginationChange}
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
