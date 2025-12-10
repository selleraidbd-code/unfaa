"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { useDeleteShopMutation, useGetShopsQuery } from "@/redux/api/shop-api";
import { ColumnDef, PaginationState } from "@tanstack/react-table";
import { Badge } from "@workspace/ui/components/badge";
import { Checkbox } from "@workspace/ui/components/checkbox";
import { toast } from "@workspace/ui/components/sonner";
import { formatDate } from "@workspace/ui/lib/formateDate";
import { Trash } from "lucide-react";

import { Shop } from "@/types/shop-type";
import { statuses } from "@/components/table/data";
import { DataTable, Meta } from "@/components/table/data-table";
import { DataTableColumnHeader } from "@/components/table/data-table-column-header";
import { DataTableFieldCopy } from "@/components/table/data-table-field-copy";
import { DataTableRowActions } from "@/components/table/data-table-row-actions";

const ShopsPage = () => {
    const searchParams = useSearchParams();
    const page = searchParams.get("page") || 1;
    const limit = searchParams.get("limit") || 10;
    const [search, setSearch] = useState("");

    const { data, isLoading, isError } = useGetShopsQuery({
        searchTerm: search || undefined,
        page: Number(page),
        limit: Number(limit),
    });

    const [deleteShop] = useDeleteShopMutation();

    const handleSearch = (value: string) => {
        setSearch(value);
    };

    const handlePaginationChange = (state: PaginationState) => {
        console.log(state);
    };

    const handleBulkDelete = () => {
        console.log("Bulk delete");
    };

    const handleDelete = async (id: string) => {
        await deleteShop(id)
            .unwrap()
            .then(() => {
                toast.success("Shop deleted successfully");
            })
            .catch((error) => {
                toast.error(error.data.message);
            });
    };

    const shopsColumns: ColumnDef<Shop>[] = [
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
            header: ({ column }) => <DataTableColumnHeader column={column} title="Shop ID" />,
            cell: ({ row }) => <DataTableFieldCopy row={row} field="shopOwnerId" />,
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: "name",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
            cell: ({ row }) => <DataTableFieldCopy row={row} field="name" />,
        },
        {
            accessorKey: "status",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
            cell: ({ row }) => {
                return (
                    <span className="truncate font-medium">
                        {row.original.status === "active" ? (
                            <Badge variant="default">Active</Badge>
                        ) : (
                            <Badge variant="destructive">Inactive</Badge>
                        )}
                    </span>
                );
            },
        },
        {
            accessorKey: "shopOwnerId",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Shop Owner ID" />,
            cell: ({ row }) => <p>{row.getValue("id")}</p>,
        },
        {
            accessorKey: "slug",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Preview" />,
            cell: ({ row }) => (
                <Link className="text-blue-500" target="_blank" href={`http://${row.getValue("slug")}.localhost:3000`}>
                    {row.getValue("slug")}
                </Link>
            ),
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
        <DataTable
            title="Shops"
            data={data?.data || []}
            columns={shopsColumns}
            showViewOptions={true}
            filterableColumns={[
                {
                    id: "status",
                    title: "Status",
                    options: statuses,
                },
            ]}
            onSearch={handleSearch}
            pagination={true}
            paginationMeta={meta}
            onPaginationChange={handlePaginationChange}
            createButtonInfo={{
                label: "Create Shop",
                href: "/shops/create",
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

export default ShopsPage;
