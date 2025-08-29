"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Order } from "@/types/order-type";
import { formatDateShortWithTime } from "@workspace/ui/lib/formateDate";
import { Checkbox } from "@workspace/ui/components/checkbox";
import { DataTableColumnHeader } from "@/components/table/data-table-column-header";

export const ordersColumns: ColumnDef<Order>[] = [
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
        accessorKey: "orderNumber",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Number" />
        ),
        cell: ({ row }) => <p>{row.getValue("orderNumber")}</p>,
        enableSorting: false,
        enableHiding: false,
    },

    {
        accessorKey: "customerName",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Customer Name" />
        ),
        cell: ({ row }) => {
            return (
                <span className="truncate font-medium">
                    {row.getValue("customerName")}
                </span>
            );
        },
    },
    {
        accessorKey: "customerPhoneNumber",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Customer Phone" />
        ),
        cell: ({ row }) => {
            return (
                <span className="truncate font-medium">
                    {row.getValue("customerPhoneNumber")}
                </span>
            );
        },
    },
    {
        accessorKey: "orderStatus",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Order Status" />
        ),
        cell: ({ row }) => {
            return (
                <span className="truncate font-medium">
                    {row.getValue("orderStatus")}
                </span>
            );
        },
    },
    {
        accessorKey: "paymentStatus",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Payment Status" />
        ),
        cell: ({ row }) => {
            return (
                <span className="truncate font-medium">
                    {row.getValue("paymentStatus")}
                </span>
            );
        },
    },
    {
        accessorKey: "createdAt",
        header: "Created At",
        cell: ({ row }) => {
            return (
                <span className="truncate font-medium">
                    {formatDateShortWithTime(row.getValue("createdAt"))}
                </span>
            );
        },
    },
];
