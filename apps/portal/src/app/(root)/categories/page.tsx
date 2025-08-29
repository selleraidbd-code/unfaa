"use client";

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
import { CustomErrorOrEmpty } from "@/components/ui/custom-error-or-empty";
import { FolderOpen } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const Page = () => {
    const user = useGetUser();
    const { fire } = useAlert();
    const [category, setCategory] = useState<Category | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(
        null
    );

    const { data, isLoading, error } = useGetCategoriesQuery({
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
            text: "Are you sure you want to delete this category?",
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

    if (isLoading) {
        return (
            <div className="space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="animate-pulse">
                            <div className="bg-muted rounded-lg p-6 space-y-3">
                                <div className="h-6 bg-muted-foreground/20 rounded w-3/4"></div>
                                <div className="h-4 bg-muted-foreground/20 rounded w-full"></div>
                                <div className="h-4 bg-muted-foreground/20 rounded w-2/3"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (error)
        return (
            <CustomErrorOrEmpty title="Failed to load categories. Please try again later." />
        );

    return (
        <>
            <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="title">Categories</h1>
                    <CreateCategoryDialog />
                </div>

                {/* Categories Grid */}
                <div className="flex flex-wrap gap-6">
                    {data?.data?.length ? (
                        data.data.map((category: Category) => (
                            <CategoryCard
                                key={category.id}
                                category={category}
                                onEdit={() => onUpdate(category)}
                                onView={() => onView(category)}
                                onDelete={() => onDelete(category.id)}
                            />
                        ))
                    ) : (
                        <div className="col-span-full text-center py-16">
                            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                                <FolderOpen className="w-8 h-8 text-muted-foreground" />
                            </div>
                            <p className="text-muted-foreground">
                                No categories found.
                            </p>
                        </div>
                    )}
                </div>
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
