"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";

import { useDeleteComponentMutation, useGetComponentsQuery } from "@/redux/api/component-api";
import { ColumnDef, PaginationState } from "@tanstack/react-table";
import { Checkbox } from "@workspace/ui/components/checkbox";
import { toast } from "@workspace/ui/components/sonner";
import { Component } from "@workspace/ui/landing/types";
import { formatDate } from "@workspace/ui/lib/formateDate";
import { Trash } from "lucide-react";

import { useAlert } from "@/hooks/useAlert";
import { DataTable, Meta } from "@/components/table/data-table";
import { DataTableColumnHeader } from "@/components/table/data-table-column-header";
import { DataTableRowActions } from "@/components/table/data-table-row-actions";

const ComponentsPage = () => {
    const router = useRouter();
    const { fire } = useAlert();
    const searchParams = useSearchParams();
    const page = searchParams.get("page") || 1;
    const limit = searchParams.get("limit") || 10;

    const { data, isLoading, isFetching, isError } = useGetComponentsQuery({
        type: undefined,
        page: Number(page),
        limit: Number(limit),
    });

    const [deleteComponentById] = useDeleteComponentMutation();

    const handleSearch = (value: string) => {
        console.warn(value);
    };

    const handlePaginationChange = (state: PaginationState) => {
        console.warn(state);
    };

    const handleEdit = (data: Component) => {
        router.push(`/components/${data.id}`);
    };

    const handleBulkDelete = () => {
        console.warn("Bulk delete");
    };

    const handleDelete = (data: Component) => {
        fire({
            title: "Are you sure?",
            description: "You are about to delete this component",
            onConfirm: async () => {
                await deleteComponentById(data.id)
                    .unwrap()
                    .then(() => {
                        toast.success("Component deleted successfully");
                    })
                    .catch(() => {
                        toast.error("Component deletion failed");
                    });
            },
        });
    };

    const componentsColumns: ColumnDef<Component>[] = [
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
            accessorKey: "imgURL",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Image" />,
            cell: ({ row }) => {
                return (
                    <Image
                        src={row.original.imgURL}
                        alt={row.original.name}
                        className="h-10 w-20 rounded-sm object-cover"
                        width={100}
                        height={100}
                    />
                );
            },
        },
        {
            accessorKey: "name",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
            cell: ({ row }) => {
                return <span className="truncate font-medium">{row.getValue("name")}</span>;
            },
        },
        {
            accessorKey: "type",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Type" />,
            cell: ({ row }) => {
                return <span className="truncate font-medium">{row.original.type}</span>;
            },
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
                        { label: "Edit", onClick: handleEdit },
                        { label: "Delete", onClick: handleDelete },
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
            title="Components"
            data={data?.data || []}
            columns={componentsColumns}
            showViewOptions={true}
            onSearch={handleSearch}
            pagination={true}
            paginationMeta={meta}
            onPaginationChange={handlePaginationChange}
            createButtonInfo={{
                label: "Create Component",
                href: "/components/create",
            }}
            bulkActions={[
                {
                    label: "Delete Selected",
                    onClick: handleBulkDelete,
                    variant: "destructive",
                    icon: Trash,
                },
            ]}
            isLoading={isLoading || isFetching}
            isError={isError}
        />
    );
};

export default ComponentsPage;
