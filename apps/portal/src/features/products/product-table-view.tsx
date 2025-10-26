"use client";

import { Product } from "@/types/product-type";
import { DataTable, Meta } from "@/components/table/data-table";
import { DataTableRowActions } from "@/components/table/data-table-row-actions";
import { ColumnDef } from "@tanstack/react-table";
import { Trash } from "lucide-react";
import { Checkbox } from "@workspace/ui/components/checkbox";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@workspace/ui/components/avatar";
import { DataTableColumnHeader } from "@/components/table/data-table-column-header";
import { Badge } from "@workspace/ui/components/badge";
import { CustomButton } from "@/components/ui/custom-button";
import { useRouter } from "next/navigation";

interface ProductTableViewProps {
    products: Product[];
    isLoading?: boolean;
    isError?: boolean;
    paginationMeta: Meta;
    onDelete: (id: string) => void;
    onBulkDelete: (products: Product[]) => void;
    onSearch: (searchTerm: string | undefined) => void;
    onFilterChange: (filterId: string, filterValue: string[]) => void;
    categoryOptions: { label: string; value: string }[];
}

export function ProductTableView({
    products,
    isLoading,
    isError,
    paginationMeta,
    onDelete,
    onBulkDelete,
    onSearch,
    onFilterChange,
    categoryOptions,
}: ProductTableViewProps) {
    const router = useRouter();

    const productColumns: ColumnDef<Product>[] = [
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
            accessorKey: "photoURL",
            header: "Photo",
            cell: ({ row }) => {
                return (
                    <Avatar className="h-8 w-8">
                        <AvatarImage
                            src={row.original.photoURL}
                            alt={row.original.name}
                        />
                        <AvatarFallback>
                            {row.original.name.slice(0, 2)}
                        </AvatarFallback>
                    </Avatar>
                );
            },
        },
        {
            accessorKey: "name",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Name" />
            ),
        },
        {
            accessorKey: "banglaName",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Bangla Name" />
            ),
        },
        {
            accessorKey: "category",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Categories" />
            ),
            cell: ({ row }) => {
                return (
                    <div className="flex flex-wrap gap-1">
                        {row.original.categories.map((cat) => (
                            <Badge key={cat.category.id} variant="outline">
                                {cat.category.name || "Unknown"}
                            </Badge>
                        ))}
                    </div>
                );
            },
            filterFn: (row, id, filterValue) => {
                return row.original.categories.some(
                    (cat) => String(cat.category.id) === String(filterValue)
                );
            },
        },
        {
            accessorKey: "price",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Price" />
            ),
            cell: ({ row }) => {
                return row.original.price;
            },
        },
        {
            accessorKey: "stock",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Stock" />
            ),
            cell: ({ row }) => {
                const stock = row.original.stock;
                return (
                    <Badge variant={stock < 10 ? "destructive" : "default"}>
                        {stock}
                    </Badge>
                );
            },
        },
        {
            accessorKey: "activeStatus",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Status" />
            ),
            cell: ({ row }) => {
                return (
                    <Badge variant="default">{row.original.activeStatus}</Badge>
                );
            },
        },
        {
            accessorKey: "",
            header: "Make Page",
            cell: ({ row }) => {
                return (
                    <CustomButton
                        size="sm"
                        href={`/landing-page/add?productId=${row.original.id}`}
                    >
                        Make Page
                    </CustomButton>
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
                            label: "Edit",
                            onClick: () =>
                                router.push(`/products/${row.original.id}`),
                        },
                        {
                            label: "Delete",
                            onClick: () => onDelete(row.original.id),
                        },
                    ]}
                />
            ),
        },
    ];

    return (
        <DataTable
            title="Products"
            data={products}
            columns={productColumns}
            showViewOptions={true}
            filterableColumns={[
                {
                    id: "category",
                    title: "Category",
                    options: categoryOptions,
                    isMulti: true,
                },
                {
                    id: "activeStatus",
                    title: "Status",
                    options: [
                        { label: "Active", value: "active" },
                        { label: "Inactive", value: "inactive" },
                    ],
                },
            ]}
            onSearch={onSearch}
            onFilterChange={onFilterChange}
            paginationMeta={paginationMeta}
            createButtonInfo={{
                label: "Add Product",
                href: "/products/create",
            }}
            bulkActions={[
                {
                    label: "Delete Selected",
                    onClick: onBulkDelete,
                    variant: "destructive",
                    icon: Trash,
                },
            ]}
            isLoading={isLoading}
            isError={isError}
            skeletonRows={10}
        />
    );
}
