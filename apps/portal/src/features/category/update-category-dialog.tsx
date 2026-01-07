import { useUpdateCategoryMutation } from "@/redux/api/category-api";
import { zodResolver } from "@hookform/resolvers/zod";
import { CustomFormInput } from "@workspace/ui/components/custom/custom-form-input";
import { CustomFormTextarea } from "@workspace/ui/components/custom/custom-form-textarea";
import {
    Dialog,
    DialogClose,
    DialogContainer,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@workspace/ui/components/dialog";
import { Form } from "@workspace/ui/components/form";
import { toast } from "@workspace/ui/components/sonner";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Category } from "@/types/category-type";
import { CustomButton } from "@/components/ui/custom-button";
import { CustomFormImage } from "@/components/ui/custom-form-image";

const categoryFormSchema = z.object({
    name: z.string().min(3, {
        message: "Category name must be at least 3 characters.",
    }),
    description: z.string().optional(),
    keywords: z.string().optional(),
    thumbnailImg: z.string().optional(),
    coverImg: z.string().optional(),
});

type CategoryFormValues = z.infer<typeof categoryFormSchema>;

interface UpdateCategoryDialogProps {
    category: Category;
    onClose: () => void;
}

export const UpdateCategoryDialog = ({ category, onClose }: UpdateCategoryDialogProps) => {
    const form = useForm<CategoryFormValues>({
        resolver: zodResolver(categoryFormSchema),
        defaultValues: {
            name: category.name,
            keywords: category.keywords || "",
            description: category.description || "",
            thumbnailImg: category.thumbnailImg || "",
            coverImg: category.coverImg || "",
        },
    });

    const [updateCategory, { isLoading }] = useUpdateCategoryMutation();

    const onSubmit = async (data: CategoryFormValues) => {
        await updateCategory({ id: category.id, payload: data })
            .unwrap()
            .then(() => {
                toast.success("Category updated successfully");
                onClose();
            })
            .catch((error) => {
                toast.error(error.data?.message || "Failed to update category");
            });
    };

    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent className="lg:max-w-3xl">
                <DialogHeader className="pb-3">
                    <DialogTitle className="text-xl font-bold">Update Category</DialogTitle>
                    <DialogDescription>Update the category information.</DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <DialogContainer className="space-y-4">
                            <CustomFormInput
                                label="Name"
                                name="name"
                                placeholder="Enter category name"
                                type="text"
                                required={true}
                                control={form.control}
                            />

                            <CustomFormTextarea
                                label="Description"
                                name="description"
                                placeholder="Enter category description"
                                control={form.control}
                            />

                            <CustomFormImage label="Thumbnail Image" name="thumbnailImg" control={form.control} />

                            <CustomFormImage label="Cover Image" name="coverImg" control={form.control} />

                            <CustomFormTextarea
                                label="Keywords"
                                name="keywords"
                                placeholder="Enter category keywords"
                                control={form.control}
                            />
                        </DialogContainer>

                        <div className="flex justify-end gap-4">
                            <DialogClose asChild>
                                <CustomButton type="button" variant="outline" onClick={onClose}>
                                    Cancel
                                </CustomButton>
                            </DialogClose>
                            <CustomButton type="submit" isLoading={isLoading}>
                                Update Category
                            </CustomButton>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};
