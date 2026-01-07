import { useState } from "react";

import { useCreateCategoryMutation } from "@/redux/api/category-api";
import { useAppSelector } from "@/redux/store/hook";
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
    DialogTrigger,
} from "@workspace/ui/components/dialog";
import { Form } from "@workspace/ui/components/form";
import { toast } from "@workspace/ui/components/sonner";
import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { CreateCategory } from "@/types/category-type";
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

export type CategoryFormValues = z.infer<typeof categoryFormSchema>;

export const CreateCategoryDialog = () => {
    const user = useAppSelector((state) => state.auth.user);
    const [open, setOpen] = useState(false);
    const form = useForm<CategoryFormValues>({
        resolver: zodResolver(categoryFormSchema),
        defaultValues: {
            name: "",
            keywords: "",
            description: "",
            thumbnailImg: "",
            coverImg: "",
        },
    });

    const [createCategory, { isLoading }] = useCreateCategoryMutation();

    const onSubmit = async (data: CategoryFormValues) => {
        if (!user) {
            toast.error("User not found");
            return;
        }

        const payload: CreateCategory = {
            name: data.name,
            keywords: data.keywords || "",
            shopId: user.shop.id,
            ...(data.description && { description: data.description }),
            ...(data.thumbnailImg && { thumbnailImg: data.thumbnailImg }),
            ...(data.coverImg && { coverImg: data.coverImg }),
        };

        await createCategory(payload)
            .unwrap()
            .then(() => {
                form.reset();
                setOpen(false);
                toast.success("Category created successfully");
            })
            .catch((error) => {
                toast.error(error.data.message);
            });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <CustomButton>
                    <Plus className="h-4 w-4" /> Create Category
                </CustomButton>
            </DialogTrigger>
            <DialogContent className="lg:max-w-3xl">
                <DialogHeader className="pb-3">
                    <DialogTitle className="text-xl font-bold">Create Category</DialogTitle>
                    <DialogDescription>Create a new category for your shop.</DialogDescription>
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
                                <CustomButton type="button" variant="outline">
                                    Cancel
                                </CustomButton>
                            </DialogClose>
                            <CustomButton type="submit" isLoading={isLoading}>
                                Save Category
                            </CustomButton>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};
