import { CustomButton } from "@/components/ui/custom-button";
import { CustomFormImage } from "@/components/ui/custom-form-image";
import { useUpdateCategoryMutation } from "@/redux/api/category-api";
import { Category, CategoryFormSchema } from "@/types/category-type";
import { zodResolver } from "@hookform/resolvers/zod";
import { CustomFormInput } from "@workspace/ui/components/custom/custom-form-input";
import { CustomFormTextarea } from "@workspace/ui/components/custom/custom-form-textarea";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@workspace/ui/components/dialog";
import { Form } from "@workspace/ui/components/form";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const categoryFormSchema = z.object({
    name: z.string().min(3, {
        message: "Category name must be at least 3 characters.",
    }),
    description: z.string().optional(),
    keywords: z.string().min(5, {
        message: "Category keywords must be at least 5 characters.",
    }),
    thumbnailImg: z.string().optional(),
    coverImg: z.string().optional(),
});

type CategoryFormValues = z.infer<typeof categoryFormSchema>;

interface UpdateCategoryDialogProps {
    category: Category;
    onClose: () => void;
}

export const UpdateCategoryDialog = ({
    category,
    onClose,
}: UpdateCategoryDialogProps) => {
    const form = useForm<CategoryFormValues>({
        resolver: zodResolver(categoryFormSchema),
        defaultValues: {
            name: category.name,
            keywords: category.keywords,
            description: category.description || "",
            thumbnailImg: category.thumbnailImg || "",
            coverImg: category.coverImg || "",
        },
    });

    const [updateCategory, { isLoading }] = useUpdateCategoryMutation();

    const onSubmit = async (data: CategoryFormValues) => {
        const payload: CategoryFormSchema = {
            ...data,
        };

        await updateCategory({ id: category.id, payload })
            .unwrap()
            .then(() => {
                toast.success("Category updated successfully");
                onClose();
            })
            .catch((error) => {
                console.log(error);
                toast.error(error.data?.message || "Failed to update category");
            });
    };

    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent className="sm:!w-[80vw] lg:!w-[60vw] xl:!w-[45vw]">
                <DialogHeader className="pb-3">
                    <DialogTitle className="text-xl font-bold">
                        Update Category
                    </DialogTitle>
                    <DialogDescription>
                        Update the category information.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4"
                    >
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

                        <CustomFormTextarea
                            label="Keywords"
                            name="keywords"
                            placeholder="Enter category keywords"
                            required={true}
                            control={form.control}
                        />

                        <CustomFormImage
                            label="Thumbnail Image"
                            name="thumbnailImg"
                            control={form.control}
                        />

                        <CustomFormImage
                            label="Cover Image"
                            name="coverImg"
                            control={form.control}
                        />

                        <div className="flex justify-end gap-4">
                            <DialogClose asChild>
                                <CustomButton
                                    type="button"
                                    variant="outline"
                                    onClick={onClose}
                                >
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
