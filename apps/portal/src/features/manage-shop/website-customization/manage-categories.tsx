"use client";

import { useGetCategoriesQuery } from "@/redux/api/category-api";
import { ShopTheme, ShopThemeCategory } from "@/types/shop-type";
import { Category } from "@/types/category-type";
import { Button } from "@workspace/ui/components/button";
import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
} from "@workspace/ui/components/dialog";
import { Loader2, X } from "lucide-react";
import Image from "next/image";
import { useUpdateShopThemeCategoryMutation } from "@/redux/api/shop-theme-api";
import { toast } from "sonner";
import { useAlert } from "@/hooks/useAlert";

interface ManageCategoriesProps {
  theme: ShopTheme;
}

export const ManageCategories = ({ theme }: ManageCategoriesProps) => {
  const categories = theme.categories || [];
  const categoryIds = categories.map((category) => category.category.id);
  const { fire } = useAlert();

  const [updateShopThemeCategory, { isLoading: isUpdating }] =
    useUpdateShopThemeCategoryMutation();

  console.log("categories :>> ", categories);
  const { data: categoriesData, isLoading, error } = useGetCategoriesQuery({});

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin mr-2" />
        <span>Loading categories...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 border border-red-200 rounded-lg bg-red-50">
        <p className="text-red-600">
          Error loading categories. Please try again.
        </p>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
        <p className="text-gray-600">No categories available.</p>
      </div>
    );
  }

  const handleRemoveCategory = (categoryId: string) => {
    fire({
      title: "Remove Category",
      text: "Are you sure you want to remove this category?",
      onConfirm: async () => {
        await updateShopThemeCategory({
          shopThemeId: theme.id,
          categoryIds: categoryIds.filter(
            (categoryId) => categoryId !== categoryId
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
      <div className="flex justify-between w-full flex-wrap">
        <div>
          <h2 className="text-lg font-semibold">Add Categories</h2>
          <p className="text-sm font-normal text-gray-500 mt-1 max-w-[600px] text-wrap">
            Select at least 8 categories (more is better) for better visual
            impact.
          </p>
        </div>
        <CategoryDialog />
      </div>

      <div className="flex flex-wrap mt-6 gap-5">
        {categories.map((category: ShopThemeCategory) => (
          <CategoryCard
            key={category.id}
            category={category.category}
            onRemove={handleRemoveCategory}
          />
        ))}
      </div>
    </div>
  );
};

const CategoryDialog = () => {
  const { data: categoriesData, isLoading } = useGetCategoriesQuery({});

  const categories = categoriesData?.data || [];

  return (
    <Dialog>
      <DialogTrigger>
        <Button>Select Categories</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select Categories</DialogTitle>
          <DialogDescription>
            Select at least categories (more is better) for better visual
            impact.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-5 gap-4">
          {categories.map((category: Category) => {
            return <div key={category.id}>{category.name}</div>;
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
};

const CategoryCard = ({
  category,
  onRemove,
}: {
  category: Category;
  onRemove?: (categoryId: string) => void;
}) => {
  return (
    <div className="border relative w-40 space-y-2 text-center rounded-md p-4">
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
