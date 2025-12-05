import { DataStateHandler } from "@/components/shared/data-state-handler";
import { CustomButton } from "@/components/ui/custom-button";
import { CategoryCard } from "@/features/manage-shop/website-customization/manage-categories";
import { useGetCategoriesQuery } from "@/redux/api/category-api";
import { useUpdateShopThemeCategoryMutation } from "@/redux/api/shop-theme-api";
import { useAppSelector } from "@/redux/store/hook";
import { Category } from "@/types/category-type";
import {
    Dialog,
    DialogClose,
    DialogContainer,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@workspace/ui/components/dialog";
import { toast } from "@workspace/ui/components/sonner";
import { useState } from "react";

export const AddCategoryDialog = ({
    categoryIds,
    open,
    setOpen,
    themeId,
}: {
    categoryIds: string[];
    open: boolean;
    setOpen: (open: boolean) => void;
    themeId: string;
}) => {
    const [selectedCategories, setSelectedCategories] =
        useState<string[]>(categoryIds);
    const user = useAppSelector((state) => state.auth.user);
    const {
        data: categoriesData,
        isLoading,
        isError,
    } = useGetCategoriesQuery({
        shopId: user?.shop.id,
    });
    const [updateShopThemeCategory, { isLoading: isUpdating }] =
        useUpdateShopThemeCategoryMutation();

    const categories = categoriesData?.data || [];

    const handleSelectAndDeselect = (categoryId: string) => {
        if (selectedCategories.includes(categoryId)) {
            setSelectedCategories(
                selectedCategories.filter((id) => id !== categoryId)
            );
        } else {
            setSelectedCategories([...selectedCategories, categoryId]);
        }
    };

    const handleSaveAndClose = async () => {
        await updateShopThemeCategory({
            shopThemeId: themeId,
            categoryIds: selectedCategories,
        })
            .unwrap()
            .then(() => {
                toast.success("Categories updated successfully");
                setOpen(false);
            })
            .catch((error) => {
                toast.error(
                    error.data.message ||
                        "Something went wrong while updating categories"
                );
            });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="lg:max-w-3xl">
                <DialogHeader>
                    <DialogTitle>Select Categories</DialogTitle>
                    <DialogDescription>
                        Select at least categories (more is better) for better
                        visual impact.
                    </DialogDescription>
                </DialogHeader>
                <DataStateHandler
                    data={categories}
                    isLoading={isLoading}
                    isError={isError}
                    isEmpty={categories.length === 0}
                >
                    {(categoriesData) => (
                        <DialogContainer className="flex flex-wrap gap-4">
                            {categoriesData.map((category: Category) => {
                                const isSelected = selectedCategories.includes(
                                    category.id
                                );
                                return (
                                    <CategoryCard
                                        key={category.id}
                                        category={category}
                                        isSelected={isSelected}
                                        onSelect={() =>
                                            handleSelectAndDeselect(category.id)
                                        }
                                    />
                                );
                            })}
                        </DialogContainer>
                    )}
                </DataStateHandler>
                <DialogFooter className="grid grid-cols-2 gap-5">
                    <DialogClose asChild>
                        <CustomButton variant="outline">Cancel</CustomButton>
                    </DialogClose>
                    <CustomButton
                        onClick={handleSaveAndClose}
                        isLoading={isUpdating}
                    >
                        Save & Close
                    </CustomButton>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
