"use client";

import { useGetCategoriesQuery } from "@/redux/api/category-api";
import { Category } from "@/types/category-type";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent } from "@workspace/ui/components/card";
import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
} from "@workspace/ui/components/dialog";
import { Loader2, X } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

interface ManageCategoriesProps {
  form: UseFormReturn<{
    bannerImg: string[];
    categories: string[];
  }>;
}

export const ManageCategories = ({ form }: ManageCategoriesProps) => {
  const { data: categoriesData, isLoading, error } = useGetCategoriesQuery({});

  const selectedCategories = form.watch("categories") || [];

  const handleSelectCategory = (categoryId: string) => {
    if (!selectedCategories.includes(categoryId)) {
      form.setValue("categories", [...selectedCategories, categoryId]);
    }
  };

  const handleDeselectCategory = (categoryId: string) => {
    const updatedCategories = selectedCategories.filter(
      (id) => id !== categoryId
    );
    form.setValue("categories", updatedCategories);
  };

  const getSelectedCategoryNames = () => {
    if (!categoriesData?.data) return [];
    return selectedCategories
      .map((id) => {
        const category = categoriesData.data.find((cat) => cat.id === id);
        return category?.name || "";
      })
      .filter(Boolean);
  };

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

  const categories = categoriesData?.data || [];
  const selectedCount = selectedCategories.length;
  const minRequired = 8;

  if (categories.length === 0) {
    return (
      <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
        <p className="text-gray-600">No categories available.</p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col border-2 border-dashed border-slate-300 rounded-lg p-6">
      <div className="flex justify-between w-full flex-wrap">
        <div>
          <h2 className="text-lg font-semibold">Add Categories</h2>
          <p className="text-sm font-normal text-gray-500 mt-1 max-w-[600px] text-wrap">
            Select at least {minRequired} categories (more is better) for better
            visual impact.
          </p>
        </div>
        <CategoryDialog />
      </div>

      <div className="grid mt-6 grid-cols-5 gap-4">
        {categories.map((category: Category) => {
          const isSelected = selectedCategories.includes(category.id);

          return (
            <Card
              key={category.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                isSelected ? "ring-2 ring-purple-500" : ""
              }`}
              onClick={() => handleSelectCategory(category.id)}
            >
              <CardContent className="p-4 relative">
                {isSelected && (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="absolute top-2 right-2 h-6 w-6 p-0 rounded-full bg-purple-600 text-white hover:bg-purple-700"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeselectCategory(category.id);
                    }}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}

                <div className="text-center space-y-2">
                  <div className="w-12 h-12 mx-auto bg-gray-100 rounded-lg flex items-center justify-center">
                    <span className="text-gray-500 text-xs">📷</span>
                  </div>
                  <div className="text-sm font-medium text-gray-900">
                    {category.name}
                  </div>
                  <div className="text-lg font-semibold text-gray-900">
                    {category.name}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
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
