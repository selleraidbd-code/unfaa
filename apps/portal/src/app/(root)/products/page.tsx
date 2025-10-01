"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { createProductColumns } from "@/features/products/product-columns";
import {
    useDeleteProductMutation,
    useGetProductsQuery,
} from "@/redux/api/product-api";
import { useGetCategoriesQuery } from "@/redux/api/category-api";
import { PaginationState } from "@tanstack/react-table";
import { Trash } from "lucide-react";
import { toast } from "@workspace/ui/components/sonner";

import { Product } from "@/types/product-type";
import useGetUser from "@/hooks/useGetUser";
import { DataTable } from "@/components/table/data-table";
import { DataTableRowActions } from "@/components/table/data-table-row-actions";

interface FilterParams {
    searchTerm?: string;
    category?: string;
    availabilityStatus?: string;
}

export default function ProductsPage() {
    const user = useGetUser();
    const router = useRouter();
    const [filterParams, setFilterParams] = useState<FilterParams>({});
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });

    const { data, isLoading, isError } = useGetProductsQuery({
        shopName: user?.shop.name,
        ...filterParams,
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
    });

    const { data: categories } = useGetCategoriesQuery({
        shopId: user?.shop.id,
    });

    const [deleteProduct] = useDeleteProductMutation();

    const handleDelete = async (id: string) => {
        await deleteProduct({ id })
            .unwrap()
            .then(() => {
                toast.success("Product deleted successfully");
            })
            .catch(() => {
                toast.error("Failed to delete product");
            });
    };

    const handleSearch = (searchTerm: string | undefined) => {
        setFilterParams((prev) => ({
            ...prev,
            searchTerm: searchTerm || undefined,
        }));
    };

    const handleFilterChange = (filterId: string, filterValue: string[]) => {
        setFilterParams((prev) => ({
            ...prev,
            [filterId]:
                filterValue.length > 0 ? filterValue.join(",") : undefined,
        }));
    };

    const handleBulkDelete = async (selectedRows: Product[]) => {
        try {
            const ids = selectedRows.map((row) => row.id);

            // Mock bulk delete with DummyJSON API
            const deletePromises = ids.map((id) =>
                fetch(`https://dummyjson.com/products/${id}`, {
                    method: "DELETE",
                })
            );

            await Promise.all(deletePromises);

            toast.success(`Successfully deleted ${ids.length} products`);
        } catch (error) {
            toast.error("Failed to delete products", {
                description:
                    error instanceof Error
                        ? error.message
                        : "An unknown error occurred",
            });
        }
    };

    const categoryOptions = categories?.data.map((category) => ({
        label: category.name,
        value: category.id.toString(),
    }));

    const columns = createProductColumns(categories?.data || []);

    columns.push({
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
                        onClick: () => handleDelete(row.original.id),
                    },
                ]}
            />
        ),
    });

    return (
        <DataTable
            title="Products"
            data={data?.data || []}
            columns={columns}
            showViewOptions={true}
            filterableColumns={[
                {
                    id: "category",
                    title: "Category",
                    options: categoryOptions || [],
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
            onSearch={handleSearch}
            onFilterChange={handleFilterChange}
            paginationMeta={data?.meta}
            onPaginationChange={setPagination}
            createButtonInfo={{
                label: "Add Product",
                href: "/products/create",
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
            skeletonRows={10}
        />
    );
}
