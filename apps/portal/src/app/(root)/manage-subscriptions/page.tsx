"use client";

import { useRouter, useSearchParams } from "next/navigation";

import { useDeleteSubscriptionPlanMutation, useGetSubscriptionPlansQuery } from "@/redux/api/subscription-api";
import { ColumnDef, PaginationState } from "@tanstack/react-table";
import { Badge } from "@workspace/ui/components/badge";
import { Checkbox } from "@workspace/ui/components/checkbox";
import { toast } from "@workspace/ui/components/sonner";
import { formatDate } from "@workspace/ui/lib/formateDate";

import { SubscriptionPlan } from "@/types/subscription-plan-type";
import { useAlert } from "@/hooks/useAlert";
import { DataTable, Meta } from "@/components/table/data-table";
import { DataTableColumnHeader } from "@/components/table/data-table-column-header";
import { DataTableRowActions } from "@/components/table/data-table-row-actions";

const ManageSubscriptionsPage = () => {
    const router = useRouter();
    const { fire } = useAlert();
    const searchParams = useSearchParams();
    const page = searchParams.get("page") || 1;
    const limit = searchParams.get("limit") || 10;

    const { data, isLoading, isError } = useGetSubscriptionPlansQuery({
        page: Number(page),
        limit: Number(limit),
    });

    const [deletePlan] = useDeleteSubscriptionPlanMutation();

    const handleSearch = (_value: string) => {};

    const handlePaginationChange = (_state: PaginationState) => {};

    const handleEdit = (plan: SubscriptionPlan) => {
        router.push(`/manage-subscriptions/${plan.id}`);
    };

    const handleDelete = (plan: SubscriptionPlan) => {
        fire({
            title: "Delete subscription plan?",
            description: `This will permanently delete "${plan.name}".`,
            onConfirm: async () => {
                await deletePlan(plan.id)
                    .unwrap()
                    .then(() => {
                        toast.success("Plan deleted successfully");
                    })
                    .catch((err: { data?: { message?: string } }) => {
                        toast.error(err?.data?.message || "Failed to delete plan");
                    });
            },
        });
    };

    const columns: ColumnDef<SubscriptionPlan>[] = [
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
            cell: ({ row }) => <span className="font-medium">{row.getValue("name")}</span>,
        },
        {
            accessorKey: "price",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Price" />,
            cell: ({ row }) => (
                <span>
                    ৳{Number(row.original.price).toLocaleString()}
                    {row.original.isFree && (
                        <Badge variant="secondary" className="ml-2">
                            Free
                        </Badge>
                    )}
                </span>
            ),
        },
        {
            accessorKey: "duration",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Duration" />,
            cell: ({ row }) => <span>{row.original.durationName || `${row.original.duration} days`}</span>,
        },
        {
            accessorKey: "isTrial",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Trial" />,
            cell: ({ row }) =>
                row.original.isTrial ? (
                    <Badge variant="outline">Trial</Badge>
                ) : (
                    <span className="text-muted-foreground">—</span>
                ),
        },
        // {
        //     accessorKey: "popular",
        //     header: ({ column }) => <DataTableColumnHeader column={column} title="Popular" />,
        //     cell: ({ row }) =>
        //         row.original.popular ? (
        //             <Badge className="bg-blue-100 text-blue-700">Popular</Badge>
        //         ) : (
        //             <span className="text-muted-foreground">—</span>
        //         ),
        // },
        {
            accessorKey: "createdAt",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Created" />,
            cell: ({ row }) => (row.original.createdAt ? formatDate(row.original.createdAt) : "—"),
        },
        {
            id: "actions",
            cell: ({ row }) => (
                <DataTableRowActions
                    row={row}
                    actions={[
                        { label: "Edit", onClick: handleEdit },
                        {
                            label: "Delete",
                            onClick: handleDelete,
                            className: "text-destructive",
                        },
                    ]}
                />
            ),
        },
    ];

    const meta: Meta = {
        total: data?.meta?.total ?? 0,
        page: Number(page),
        limit: Number(limit),
    };

    return (
        <DataTable
            title="Subscription Plans"
            data={data?.data ?? []}
            columns={columns}
            showViewOptions
            onSearch={handleSearch}
            pagination
            paginationMeta={meta}
            onPaginationChange={handlePaginationChange}
            createButtonInfo={{
                label: "Create Plan",
                href: "/manage-subscriptions/create",
            }}
            isLoading={isLoading}
            isError={isError}
        />
    );
};

export default ManageSubscriptionsPage;
