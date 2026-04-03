"use client";

import {
    useDeleteShopSubscriptionMutation,
    useGetShopSubscriptionsQuery,
    useUpdateShopSubscriptionStatusMutation,
} from "@/redux/api/shop-subscription-api";
import { useAlert } from "@/hooks/useAlert";
import { useAppSelector } from "@/redux/store/hook";
import { UserRole } from "@/types";
import { ColumnDef, PaginationState } from "@tanstack/react-table";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { Card } from "@workspace/ui/components/card";
import { toast } from "@workspace/ui/components/sonner";
import { formatDateWithTime } from "@workspace/ui/lib/formateDate";

import { ShopSubscriptionStatus, type ShopSubscription } from "@/types/shop-subscription-type";
import { DataTable, Meta } from "@/components/table/data-table";
import { DataTableColumnHeader } from "@/components/table/data-table-column-header";

const Page = () => {
    const user = useAppSelector((state) => state.auth.user);
    const isAdmin = user?.role === UserRole.ADMIN || user?.role === UserRole.SUPER_ADMIN;
    const { fire } = useAlert();

    const { data, isLoading, isError } = useGetShopSubscriptionsQuery({});

    const [updateStatus, { isLoading: isUpdating }] = useUpdateShopSubscriptionStatusMutation();
    const [deleteShopSubscription, { isLoading: isDeleting }] = useDeleteShopSubscriptionMutation();

    const subscriptions = data?.data ?? [];

    const handleApprove = async (item: ShopSubscription) => {
        try {
            await updateStatus({
                id: item.id,
                shopId: item.shopId,
                subscriptionId: item.subscriptionId,
                status: ShopSubscriptionStatus.ACTIVE,
            }).unwrap();
            toast.success("Subscription request approved.");
        } catch {
            toast.error("Failed to approve subscription request.");
        }
    };

    const handleExpire = async (item: ShopSubscription) => {
        try {
            await updateStatus({
                id: item.id,
                shopId: item.shopId,
                subscriptionId: item.subscriptionId,
                status: ShopSubscriptionStatus.EXPIRED,
            }).unwrap();
            toast.success("Subscription marked as expired.");
        } catch {
            toast.error("Failed to expire subscription.");
        }
    };

    const handleDelete = (item: ShopSubscription) => {
        fire({
            title: "Delete shop subscription?",
            description:
                "This will permanently remove this shop subscription record. This action cannot be undone.",
            onConfirm: async () => {
                await deleteShopSubscription(item.id)
                    .unwrap()
                    .then(() => {
                        toast.success("Shop subscription deleted.");
                    })
                    .catch((err: { data?: { message?: string } }) => {
                        toast.error(err?.data?.message || "Failed to delete shop subscription.");
                    });
            },
            confirmButtonOptions: { variant: "destructive", text: "Delete" },
        });
    };

    const columns: ColumnDef<ShopSubscription>[] = [
        // {
        //     accessorKey: "id",
        //     header: ({ column }) => <DataTableColumnHeader column={column} title="ID" />,
        //     cell: ({ row }) => <span className="font-mono text-xs">{row.original.id}</span>,
        // },
        // {
        //     accessorKey: "shopId",
        //     header: ({ column }) => <DataTableColumnHeader column={column} title="Shop ID" />,
        //     cell: ({ row }) => <span className="font-mono text-xs">{row.original.shopId}</span>,
        // },
        {
            accessorKey: "subscriptionId",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Subscription ID" />,
            cell: ({ row }) => <span className="font-mono text-xs">{row.original.subscriptionId}</span>,
        },
        {
            accessorKey: "refaranceId",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Reference ID" />,
            cell: ({ row }) => <span className="font-mono text-xs">{row.original.refaranceId}</span>,
        },
        {
            accessorKey: "status",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
            cell: ({ row }) => (
                <Badge
                    variant={
                        row.original.status === ShopSubscriptionStatus.UNDER_REVIEW
                            ? "secondary"
                            : row.original.status === ShopSubscriptionStatus.ACTIVE
                              ? "default"
                              : "outline"
                    }
                >
                    {row.original.status}
                </Badge>
            ),
        },
        {
            accessorKey: "createdAt",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Created At" />,
            cell: ({ row }) => <span>{formatDateWithTime(row.original.createdAt)}</span>,
        },
        {
            accessorKey: "updatedAt",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Updated At" />,
            cell: ({ row }) => <span>{formatDateWithTime(row.original.updatedAt)}</span>,
        },
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => {
                const item = row.original;
                const busy = isUpdating || isDeleting;

                return (
                    <div className="flex flex-wrap items-center gap-2">
                        {item.status === ShopSubscriptionStatus.UNDER_REVIEW && (
                            <Button size="sm" onClick={() => handleApprove(item)} disabled={busy}>
                                Accept
                            </Button>
                        )}
                        {item.status === ShopSubscriptionStatus.ACTIVE && (
                            <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleExpire(item)}
                                disabled={busy}
                            >
                                Mark as Expired
                            </Button>
                        )}
                        <Button
                            size="sm"
                            variant="outline"
                            className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                            onClick={() => handleDelete(item)}
                            disabled={busy}
                        >
                            Delete
                        </Button>
                    </div>
                );
            },
        },
    ];

    const meta: Meta = {
        total: data?.meta?.total ?? 0,
        page: 1,
        limit: data?.meta?.limit ?? subscriptions.length ?? 10,
    };

    const handlePaginationChange = (_state: PaginationState) => {};

    if (!isAdmin) {
        return (
            <div className="mx-auto max-w-5xl px-4 py-8">
                <Card className="text-muted-foreground p-6 text-center text-sm">
                    You are not authorized to view this page.
                </Card>
            </div>
        );
    }

    return (
        <div className="">
            <DataTable
                title="Shop Subscription Requests"
                data={subscriptions}
                columns={columns}
                showViewOptions={false}
                onSearch={undefined}
                pagination
                paginationMeta={meta}
                onPaginationChange={handlePaginationChange}
                isLoading={isLoading}
                isError={isError}
                isSubtitleShown={true}
                subtitle="Review and approve pending subscription requests for shops."
            />
        </div>
    );
};

export default Page;
