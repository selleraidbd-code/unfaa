"use client";

import { useState } from "react";
import Image from "next/image";

import { AddCategoryDialog } from "@/features/manage-shop/website-customization/add-category-dialog";
import { WebCustomizationEmptyMessage } from "@/features/manage-shop/website-customization/web-customization-empty-message";
import { WebCustomizationHeader } from "@/features/manage-shop/website-customization/web-customization-header";
import { useUpdateShopThemeCategoryMutation } from "@/redux/api/shop-theme-api";
import { Button } from "@workspace/ui/components/button";
import { toast } from "@workspace/ui/components/sonner";
import { cn } from "@workspace/ui/lib/utils";
import { X } from "lucide-react";

import { Category } from "@/types/category-type";
import { ShopTheme, ShopThemeCategory } from "@/types/shop-type";
import { useAlert } from "@/hooks/useAlert";

interface ManageCategoriesProps {
    theme: ShopTheme;
}

export const ManageCategories = ({ theme }: ManageCategoriesProps) => {
    const [open, setOpen] = useState(false);
    const categories = theme.categories || [];
    const categoryIds = categories.map((category) => category.category.id);
    const { fire } = useAlert();

    const [updateShopThemeCategory] = useUpdateShopThemeCategoryMutation();

    const handleRemoveCategory = (categoryId: string) => {
        fire({
            title: "Remove Category",
            description: "Are you sure you want to remove this category?",
            onConfirm: async () => {
                await updateShopThemeCategory({
                    shopThemeId: theme.id,
                    categoryIds: categoryIds.filter((catId) => catId !== categoryId),
                })
                    .unwrap()
                    .then(() => {
                        toast.success("Category removed successfully");
                    })
                    .catch((error) => {
                        toast.error(error.data.message || "Something went wrong while removing category");
                    });
            },
        });
    };

    return (
        <div className="flex w-full flex-col gap-2 rounded-sm border-2 border-dashed border-slate-300 p-4 md:gap-3 md:rounded-lg md:p-6 dark:border-slate-700">
            <WebCustomizationHeader
                title="Add Categories"
                description="Select at least 8 categories (more is better) for better visual impact."
                button={<Button onClick={() => setOpen(true)}>Add Categories</Button>}
            />

            {categories.length === 0 ? (
                <WebCustomizationEmptyMessage
                    title="No categories added yet"
                    description="Add categories to create an engaging homepage experience for your customers."
                />
            ) : (
                <div className="flex flex-wrap gap-2 sm:gap-4 lg:gap-5">
                    {categories.map((category: ShopThemeCategory) => (
                        <CategoryCard key={category.id} category={category.category} onRemove={handleRemoveCategory} />
                    ))}
                </div>
            )}

            {open && <AddCategoryDialog themeId={theme.id} categoryIds={categoryIds} open={open} setOpen={setOpen} />}
        </div>
    );
};

export const CategoryCard = ({
    category,
    onRemove,
    isSelected,
    onSelect,
}: {
    category: Category;
    onRemove?: (categoryId: string) => void;
    isSelected?: boolean;
    onSelect?: (categoryId: string) => void;
}) => {
    return (
        <div
            className={cn(
                "relative w-[156px] space-y-2 rounded-md border p-4 text-center sm:w-40",
                isSelected && "border-primary border-2"
            )}
            onClick={() => onSelect?.(category.id)}
        >
            {onRemove && (
                <button
                    className="bg-primary text-primary-foreground absolute -top-2.5 -right-2.5 rounded-full p-1"
                    onClick={() => onRemove?.(category.id)}
                >
                    <X className="size-5" />
                </button>
            )}

            <Image
                src={category.thumbnailImg || "/placeholder.jpg"}
                alt={category.name}
                width={160}
                height={160}
                className="size-32 rounded-md object-cover"
            />
            <p className="font-medium">{category.name}</p>
        </div>
    );
};
