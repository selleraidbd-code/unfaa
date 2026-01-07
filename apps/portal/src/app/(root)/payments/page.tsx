"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";

import { useDeletePaymentMutation, useGetPaymentsQuery } from "@/redux/api/payments-api";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@workspace/ui/components/checkbox";
import { toast } from "@workspace/ui/components/sonner";
import { formatDate } from "@workspace/ui/lib/formateDate";
import { Trash } from "lucide-react";

import { Payment } from "@/types/payments-type";
import { DataTable, Meta } from "@/components/table/data-table";
import { DataTableColumnHeader } from "@/components/table/data-table-column-header";
import { DataTableRowActions } from "@/components/table/data-table-row-actions";

const Payments = () => {
    const searchParams = useSearchParams();
    const page = searchParams.get("page") || "1";
    const limit = searchParams.get("limit") || 10;
    const [searchTerm, setSearchTerm] = useState("");

    const { data, isLoading, isError } = useGetPaymentsQuery({
        page: Number(page),
        limit: Number(limit),
        search: searchTerm || undefined,
    });

    const [deletePayment] = useDeletePaymentMutation();

    const handleSearch = (value: string) => {
        setSearchTerm(value);
    };

    const handleBulkDelete = () => {
        console.warn("Bulk delete");
    };

    const handleDelete = (data: Payment) => {
        deletePayment({ id: data.id })
            .unwrap()
            .then(() => {
                toast.success("Payment deleted successfully");
            })
            .catch(() => {
                toast.error("Payment deletion failed");
            });
    };

    const paymentsColumns: ColumnDef<Payment>[] = [
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
            accessorKey: "name",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
            cell: ({ row }) => {
                return <span className="truncate font-medium">{row.getValue("name")}</span>;
            },
        },
        {
            accessorKey: "paymentMethod",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Payment Method" />,
            cell: ({ row }) => {
                return <span className="truncate font-medium">{row.original.paymentMethod}</span>;
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
            cell: ({ row }) => <DataTableRowActions row={row} actions={[{ label: "Delete", onClick: handleDelete }]} />,
        },
    ];

    const meta: Meta = {
        total: data?.meta?.total || 0,
        page: Number(page),
        limit: Number(limit),
    };

    return (
        <DataTable
            title="Payments"
            data={data?.data || []}
            columns={paymentsColumns}
            showViewOptions={true}
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
    );
};

export default Payments;
