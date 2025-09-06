import { ColumnDef } from "@tanstack/react-table";

import { Product } from "@/types/product-type";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@workspace/ui/components/avatar";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { Checkbox } from "@workspace/ui/components/checkbox";
import { DataTableColumnHeader } from "@/components/table/data-table-column-header";
import Link from "next/link";

interface Category {
    id: string;
    name: string;
}

export const createProductColumns = (
    categories: Category[]
): ColumnDef<Product>[] => [
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
            return <Badge variant="default">{row.original.activeStatus}</Badge>;
        },
    },
    {
        accessorKey: "",
        header: "Make Page",
        cell: ({ row }) => {
            return (
                <Button size="sm" asChild>
                    <Link
                        href={`/landing-page/add?productId=${row.original.id}`}
                    >
                        Make Page
                    </Link>
                </Button>
            );
        },
    },
];
