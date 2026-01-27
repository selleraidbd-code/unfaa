"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { ProductCardList } from "@/features/products/product-card-list";
import { ProductTableView } from "@/features/products/product-table-view";
import { useGetCategoriesQuery } from "@/redux/api/category-api";
import { useDeleteProductMutation, useGetProductsQuery } from "@/redux/api/product-api";
import { useAppSelector } from "@/redux/store/hook";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@workspace/ui/components/select";
import { toast } from "@workspace/ui/components/sonner";
import { Plus, Search } from "lucide-react";

import { Product } from "@/types/product-type";
import { useAlert } from "@/hooks/useAlert";

interface FilterParams {
    searchTerm?: string;
    category?: string;
    availabilityStatus?: string;
}

export default function ProductsPage() {
    const searchParams = useSearchParams();
    const page = searchParams.get("page") || 1;
    const limit = searchParams.get("limit") || 50;
    const user = useAppSelector((state) => state.auth.user);
    const { fire } = useAlert();
    const [filterParams, setFilterParams] = useState<FilterParams>({});

    const { data, isLoading, isError } = useGetProductsQuery({
        shopId: user?.shop.id,
        ...filterParams,
        page: Number(page),
        limit: Number(limit),
    });

    const { data: categories } = useGetCategoriesQuery({
        shopId: user?.shop.id,
    });

    const [deleteProduct] = useDeleteProductMutation();

    const handleDelete = async (id: string) => {
        fire({
            title: "Delete Product",
            description: "Are you sure you want to delete this product? This action cannot be undone.",
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
            [filterId]: filterValue.length > 0 ? filterValue.join(",") : undefined,
        }));
    };

    const handleBulkDelete = async (selectedRows: Product[]) => {
        console.warn(selectedRows);
    };

    const categoryOptions = categories?.data.map((category) => ({
        label: category.name,
        value: category.id.toString(),
    }));

    const paginationMeta = {
        page: Number(page),
        limit: Number(limit),
        total: data?.meta?.total || 0,
    };

    return (
        <div className="space-y-6">
            {/* Mobile Header & Filters */}
            <div className="space-y-4 lg:hidden">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Products</h1>
                    <Button asChild>
                        <Link href="/products/create">
                            <Plus className="mr-2 h-4 w-4" />
                            Add
                        </Link>
                    </Button>
                </div>

                <div className="space-y-2">
                    <div className="relative">
                        <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                        <Input
                            placeholder="Search products..."
                            className="pl-9"
                            onChange={(e) => handleSearch(e.target.value || undefined)}
                        />
                    </div>

                    <div className="flex gap-2">
                        <Select
                            onValueChange={(value) => handleFilterChange("category", value === "all" ? [] : [value])}
                        >
                            <SelectTrigger className="flex-1">
                                <SelectValue placeholder="Category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Categories</SelectItem>
                                {categoryOptions?.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select
                            onValueChange={(value) =>
                                handleFilterChange("activeStatus", value === "all" ? [] : [value])
                            }
                        >
                            <SelectTrigger className="flex-1">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="inactive">Inactive</SelectItem>
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
                    paginationMeta={paginationMeta}
                    onDelete={handleDelete}
                    onBulkDelete={handleBulkDelete}
                    onSearch={handleSearch}
                    onFilterChange={handleFilterChange}
                    categoryOptions={categoryOptions || []}
                />
            </div>

            {/* Mobile Card View */}
            <div className="lg:hidden">
                <ProductCardList products={data?.data || []} isLoading={isLoading} onDelete={handleDelete} />
            </div>
        </div>
    );
}
