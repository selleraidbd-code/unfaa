"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import {
    useDeleteProductMutation,
    useGetProductsQuery,
} from "@/redux/api/product-api";
import { useGetCategoriesQuery } from "@/redux/api/category-api";
import { PaginationState } from "@tanstack/react-table";
import { toast } from "@workspace/ui/components/sonner";

import { Product } from "@/types/product-type";
import useGetUser from "@/hooks/useGetUser";
import { useAlert } from "@/hooks/useAlert";
import { ProductTableView } from "@/features/products/product-table-view";
import { ProductCardList } from "@/features/products/product-card-list";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@workspace/ui/components/select";
import { Plus, Search } from "lucide-react";
import Link from "next/link";

interface FilterParams {
    searchTerm?: string;
    category?: string;
    availabilityStatus?: string;
}

export default function ProductsPage() {
    const user = useGetUser();
    const { fire } = useAlert();
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
        fire({
            title: "Delete Product",
            description:
                "Are you sure you want to delete this product? This action cannot be undone.",
            onConfirm: async () => {
                await deleteProduct({ id })
                    .unwrap()
                    .then(() => {
                        toast.success("Product deleted successfully");
                    })
                    .catch(() => {
                        toast.error("Failed to delete product");
                    });
            },
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

    return (
        <div className="space-y-6">
            {/* Mobile Header & Filters */}
            <div className="lg:hidden space-y-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Products</h1>
                    <Button asChild>
                        <Link href="/products/create">
                            <Plus className="h-4 w-4 mr-2" />
                            Add
                        </Link>
                    </Button>
                </div>

                <div className="space-y-2">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search products..."
                            className="pl-9"
                            onChange={(e) =>
                                handleSearch(e.target.value || undefined)
                            }
                        />
                    </div>

                    <div className="flex gap-2">
                        <Select
                            onValueChange={(value) =>
                                handleFilterChange(
                                    "category",
                                    value === "all" ? [] : [value]
                                )
                            }
                        >
                            <SelectTrigger className="flex-1">
                                <SelectValue placeholder="Category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">
                                    All Categories
                                </SelectItem>
                                {categoryOptions?.map((option) => (
                                    <SelectItem
                                        key={option.value}
                                        value={option.value}
                                    >
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select
                            onValueChange={(value) =>
                                handleFilterChange(
                                    "activeStatus",
                                    value === "all" ? [] : [value]
                                )
                            }
                        >
                            <SelectTrigger className="flex-1">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="inactive">
                                    Inactive
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            {/* Desktop Table View */}
            <div className="hidden lg:block">
                <ProductTableView
                    products={data?.data || []}
                    isLoading={isLoading}
                    isError={isError}
                    onPaginationChange={setPagination}
                    paginationMeta={data?.meta}
                    onDelete={handleDelete}
                    onBulkDelete={handleBulkDelete}
                    onSearch={handleSearch}
                    onFilterChange={handleFilterChange}
                    categoryOptions={categoryOptions || []}
                />
            </div>

            {/* Mobile Card View */}
            <div className="lg:hidden">
                <ProductCardList
                    products={data?.data || []}
                    isLoading={isLoading}
                    onDelete={handleDelete}
                />
            </div>
        </div>
    );
}
