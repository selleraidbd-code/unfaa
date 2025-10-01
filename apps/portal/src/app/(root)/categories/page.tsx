"use client";

import { EmptyErrorLoadingHandler } from "@/components/shared/empty-error-loading-handler";
import { CategorySkeleton } from "@/features/categories/category-skeleton";
import { CategoryCard } from "@/features/category/category-card";
import { CategoryDetailsDialog } from "@/features/category/category-details-dialog";
import { CreateCategoryDialog } from "@/features/category/create-category-dialog";
import { UpdateCategoryDialog } from "@/features/category/update-category-dialog";
import { useAlert } from "@/hooks/useAlert";
import useGetUser from "@/hooks/useGetUser";
import {
    useDeleteCategoryMutation,
    useGetCategoriesQuery,
} from "@/redux/api/category-api";
import { Category } from "@/types/category-type";
import { useState } from "react";
import { toast } from "@workspace/ui/components/sonner";

const Page = () => {
    const user = useGetUser();
    const { fire } = useAlert();
    const [category, setCategory] = useState<Category | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(
        null
    );

    const { data, isLoading, isError } = useGetCategoriesQuery({
        shopId: user?.shop.id,
        page: 1,
        limit: 50,
    });

    const [deleteCategory] = useDeleteCategoryMutation();

    const onUpdate = async (category: Category) => {
        setCategory(category);
    };

    const onView = async (category: Category) => {
        setSelectedCategory(category);
    };

    const onDelete = async (id: string) => {
        fire({
            title: "Delete Category",
            description: "Are you sure you want to delete this category?",
            onConfirm: async () => {
                await deleteCategory({ id })
                    .unwrap()
                    .then(() => {
                        toast.success("Category deleted successfully");
                    })
                    .catch((error) => {
                        toast.error(
                            error.data?.message || "Category deletion failed"
                        );
                    });
            },
        });
    };

    const handleEdit = (category: Category) => {
        setSelectedCategory(null);
        setCategory(category);
    };

    return (
        <>
            <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                    <h1 className="title">Categories</h1>
                    <CreateCategoryDialog />
                </div>

                <EmptyErrorLoadingHandler
                    className="flex flex-wrap gap-6"
                    isError={isError}
                    errorTitle="Failed to load categories. Please try again later."
                    isEmpty={data?.data?.length === 0}
                    isLoading={isLoading}
                    loadingComponent={<CategorySkeleton />}
                >
                    {data?.data?.map((category: Category) => (
                        <CategoryCard
                            key={category.id}
                            category={category}
                            onEdit={() => onUpdate(category)}
                            onView={() => onView(category)}
                            onDelete={() => onDelete(category.id)}
                        />
                    ))}
                </EmptyErrorLoadingHandler>
            </div>

            {/* Update Category Dialog */}
            {category && (
                <UpdateCategoryDialog
                    category={category}
                    onClose={() => setCategory(null)}
                />
            )}

            {/* View Category Details Dialog */}
            {selectedCategory && (
                <CategoryDetailsDialog
                    selectedCategory={selectedCategory}
                    setSelectedCategory={setSelectedCategory}
                    handleEdit={handleEdit}
                />
            )}
        </>
    );
};

export default Page;
