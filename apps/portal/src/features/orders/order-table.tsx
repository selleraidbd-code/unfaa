"use client";

import Link from "next/link";

import { ColumnDef, PaginationState } from "@tanstack/react-table";
import { Checkbox } from "@workspace/ui/components/checkbox";
import { CustomTextCopy } from "@workspace/ui/components/custom/custom-text-copy";
import { formatDateShortWithTime } from "@workspace/ui/lib/formateDate";
import { cn } from "@workspace/ui/lib/utils";
import { MapPin, Phone, PhoneCall, User } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa6";

import { CourierStatus, Order, OrderStatus, PaymentStatus } from "@/types/order-type";
import { DataTable, Meta } from "@/components/table/data-table";
import { DataTableColumnHeader } from "@/components/table/data-table-column-header";

const getStatusColor = (status: OrderStatus) => {
    switch (status) {
        case OrderStatus.PLACED:
            return "bg-blue-100 text-blue-800";
        case OrderStatus.CONFIRMED:
            return "bg-green-100 text-green-800";
        case OrderStatus.CANCELLED:
            return "bg-red-100 text-red-800";
        case OrderStatus.SEND:
            return "bg-purple-100 text-purple-800";
        case OrderStatus.HOLD:
            return "bg-yellow-100 text-yellow-800";
        case OrderStatus.WAITING:
            return "bg-orange-100 text-orange-800";
        case OrderStatus.RECEIVED:
            return "bg-emerald-100 text-emerald-800";
        case OrderStatus.PROCESSING:
            return "bg-indigo-100 text-indigo-800";
        case OrderStatus.NZC:
            return "bg-gray-100 text-gray-800";
        case OrderStatus.RETURN:
            return "bg-pink-100 text-pink-800";
        case OrderStatus.INCOMPLETE:
            return "bg-slate-100 text-slate-800";
        default:
            return "bg-gray-100 text-gray-800";
    }
};

const getCourierStatusColor = (status: CourierStatus) => {
    switch (status) {
        case CourierStatus.PENDING:
            return "bg-yellow-100 text-yellow-800";
        case CourierStatus.DELIVERED:
            return "bg-green-100 text-green-800";
        case CourierStatus.PARTIAL_DELIVERED:
            return "bg-orange-100 text-orange-800";
        case CourierStatus.CANCELLED:
            return "bg-red-100 text-red-800";
        case CourierStatus.UNKNOWN:
            return "bg-red-100 text-red-800";
        default:
            return "bg-muted text-muted-foreground";
    }
};

const CustomerCell = ({ order }: { order: Order }) => {
    const phoneNumber = order.customerPhoneNumber;

    const formatPhoneForWhatsApp = (phone: string) => {
        // Remove any non-digit characters and add country code if needed
        const cleaned = phone.replace(/\D/g, "");
        // If it starts with 0, replace with 880 (Bangladesh country code)
        if (cleaned.startsWith("0")) {
            return "880" + cleaned.substring(1);
        }
        return cleaned;
    };

    return (
        <div className="max-w-[250px] space-y-2.5">
            {/* Phone Number Row */}
            <div className="flex w-fit items-center gap-2">
                <Phone className="text-muted-foreground h-4 w-4 flex-shrink-0" />

                <span className="text-sm font-medium">{phoneNumber}</span>

                <Link
                    href={`tel:${phoneNumber}`}
                    target="_blank"
                    className="p-1"
                    title="Call"
                    onClick={(e) => e.stopPropagation()}
                >
                    <PhoneCall className="text-primary size-5" />
                </Link>

                <Link
                    href={`https://wa.me/${formatPhoneForWhatsApp(phoneNumber)}`}
                    target="_blank"
                    className="p-1"
                    title="WhatsApp"
                    onClick={(e) => e.stopPropagation()}
                >
                    <FaWhatsapp className="size-5 text-green-600" />
                </Link>
            </div>

            {/* Customer Name Row */}
            <div className="flex w-fit items-center gap-2">
                <User className="text-muted-foreground size-4 flex-shrink-0" />

                <CustomTextCopy text={order.customerName} textClassName="text-foreground font-normal text-sm" />
            </div>

            {/* Address Row */}
            <div className="flex items-start gap-2">
                <MapPin className="text-muted-foreground mt-0.5 h-4 w-4 flex-shrink-0" />
                <span className="text-muted-foreground line-clamp-2 truncate text-sm">{order.customerAddress}</span>
            </div>
        </div>
    );
};

const createOrdersColumns = (enableSelection: boolean): ColumnDef<Order>[] => {
    const selectColumn: ColumnDef<Order> = {
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
            <div onClick={(e) => e.stopPropagation()}>
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                    className="size-5 translate-y-[2px]"
                />
            </div>
        ),
        enableSorting: false,
        enableHiding: false,
    };

    return [
        ...(enableSelection ? [selectColumn] : []),
        {
            accessorKey: "orderNumber",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Order Number" />,
            cell: ({ row }) => {
                return <span className="font-semibold">#{row.getValue("orderNumber")}</span>;
            },
            enableSorting: false,
            enableHiding: false,
        },
        {
            id: "customer",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Customer" />,
            cell: ({ row }) => {
                return <CustomerCell order={row.original} />;
            },
            enableSorting: false,
        },
        {
            accessorKey: "orderStatus",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Order Status" />,
            cell: ({ row }) => {
                const status = row.original.orderStatus;
                return (
                    <span className={cn("rounded-full px-2 py-1 text-xs font-medium", getStatusColor(status))}>
                        {status}
                    </span>
                );
            },
        },
        {
            accessorKey: "courierStatus",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Courier Status" />,
            cell: ({ row }) => {
                const status = row.original.courierStatus as CourierStatus;
                return (
                    <span className={cn("rounded-full px-2 py-1 text-xs font-medium", getCourierStatusColor(status))}>
                        {status}
                    </span>
                );
            },
        },
        {
            accessorKey: "orderItems",
            header: "Items",
            cell: ({ row }) => {
                const items = row.original.orderItems || [];
                return <span className="text-sm text-gray-600">{items.length} items</span>;
            },
            enableSorting: false,
        },
        {
            accessorKey: "totalAmount",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Total" />,
            cell: ({ row }) => {
                return (
                    <span className="font-medium">
                        ৳{(row.original.discountedPrice ?? row.original.totalAmount).toLocaleString()}
                    </span>
                );
            },
        },
        {
            accessorKey: "createdAt",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Created At" />,
            cell: ({ row }) => {
                return <span className="text-sm">{formatDateShortWithTime(row.getValue("createdAt"))}</span>;
            },
        },
    ];
};

interface OrderTableProps {
    data: Order[];
    isLoading: boolean;
    isError: boolean;
    meta: Meta;
    onPaginationChange: (state: PaginationState) => void;
    onRowClick: (row: Order) => void;
    onSelectionChange?: (selectedRows: Order[]) => void;
    enableSelection?: boolean;
}

export const OrderTable = ({
    data,
    isLoading,
    isError,
    meta,
    onPaginationChange,
    onRowClick,
    onSelectionChange,
    enableSelection = false,
}: OrderTableProps) => {
    const columns = createOrdersColumns(enableSelection);

    return (
        <DataTable
            data={data}
            columns={columns}
            pagination={true}
            paginationMeta={meta}
            onPaginationChange={onPaginationChange}
            isLoading={isLoading}
            isError={isError}
            showViewOptions={false}
            onRowClick={onRowClick}
            onSelectionChange={onSelectionChange}
            createButton={<div className="flex items-center gap-4"></div>}
        />
    );
};
