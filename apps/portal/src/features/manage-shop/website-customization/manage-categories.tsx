"use client";

import { AddCategoryDialog } from "@/features/manage-shop/website-customization/add-category-dialog";
import { WebCustomizationHeader } from "@/features/manage-shop/website-customization/web-customization-header";
import { useAlert } from "@/hooks/useAlert";
import { useUpdateShopThemeCategoryMutation } from "@/redux/api/shop-theme-api";
import { Category } from "@/types/category-type";
import { ShopTheme, ShopThemeCategory } from "@/types/shop-type";
import { Button } from "@workspace/ui/components/button";
import { cn } from "@workspace/ui/lib/utils";
import { X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";

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
            text: "Are you sure you want to remove this category?",
            onConfirm: async () => {
                await updateShopThemeCategory({
                    shopThemeId: theme.id,
                    categoryIds: categoryIds.filter(
                        (catId) => catId !== categoryId
                    ),
                })
                    .unwrap()
                    .then(() => {
                        toast.success("Category removed successfully");
                    })
                    .catch((error) => {
                        toast.error(
                            error.data.message ||
                                "Something went wrong while removing category"
                        );
                    });
            },
        });
    };

    return (
        <div className="w-full flex flex-col border-2 border-dashed border-slate-300 rounded-lg p-6">
            <WebCustomizationHeader
                title="Add Categories"
                description="Select at least 8 categories (more is better) for better visual impact."
                button={
                    <Button onClick={() => setOpen(true)}>
                        Add Categories
                    </Button>
                }
            />

            <div className="flex flex-wrap mt-6 gap-5">
                {categories.map((category: ShopThemeCategory) => (
                    <CategoryCard
                        key={category.id}
                        category={category.category}
                        onRemove={handleRemoveCategory}
                    />
                ))}
            </div>

            {open && (
                <AddCategoryDialog
                    themeId={theme.id}
                    categoryIds={categoryIds}
                    open={open}
                    setOpen={setOpen}
                />
            )}
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
                "border relative w-40 space-y-2 text-center rounded-md p-4",
                isSelected && "border-2 border-primary"
            )}
            onClick={() => onSelect?.(category.id)}
        >
            {onRemove && (
                <button
                    className="absolute -top-2.5 -right-2.5 bg-primary text-primary-foreground rounded-full p-1"
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
                className="object-cover rounded-md size-32"
            />
            <p className="font-medium">{category.name}</p>
        </div>
    );
};
