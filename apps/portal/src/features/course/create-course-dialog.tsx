"use client";

import { useState } from "react";

import { useCreateCourseMutation } from "@/redux/api/course-api";
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
    DialogTrigger,
} from "@workspace/ui/components/dialog";
import { Form } from "@workspace/ui/components/form";
import { toast } from "@workspace/ui/components/sonner";
import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { CreateCourse } from "@/types/course-type";
import { CustomButton } from "@/components/ui/custom-button";
import { CustomFormImage } from "@/components/ui/custom-form-image";

const CreateCourseFormSchema = z.object({
    title: z.string({
        required_error: "Title is required",
    }),
    description: z.string().optional(),
    thumbnail: z.string().optional(),
    videoUrl: z.string().optional(),
    price: z.preprocess(
        (val) => (val === "" || val === null || val === undefined ? undefined : Number(val)),
        z.number().optional()
    ) as z.ZodType<number | undefined>,
    isFree: z.boolean().optional(),
});

type CourseFormValues = z.infer<typeof CreateCourseFormSchema>;

export const CreateCourseDialog = () => {
    const [open, setOpen] = useState(false);

    const form = useForm<CourseFormValues>({
        resolver: zodResolver(CreateCourseFormSchema),
        defaultValues: {
            title: "",
            description: "",
            thumbnail: "",
            videoUrl: "",
            price: undefined,
            isFree: false,
        },
    });

    const [createCourse, { isLoading }] = useCreateCourseMutation();
    const onSubmit = async (data: CourseFormValues) => {
        const payload: CreateCourse = {
            title: data.title,
            description: data.description || undefined,
            thumbnail: data.thumbnail || undefined,
            videoUrl: data.videoUrl || undefined,
            price: data.price || undefined,
            isFree: data.isFree || false,
        };
        await createCourse(payload)
            .unwrap()
            .then(() => {
                form.reset();
                toast.success("Course created successfully");
                setOpen(false);
            })
            .catch((error) => {
                toast.error(error.data?.message || "Failed to create course");
            });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <CustomButton>
                    <Plus className="mr-2 h-4 w-4" /> Create Course
                </CustomButton>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto lg:max-w-3xl">
                <DialogHeader className="pb-3">
                    <DialogTitle className="text-xl font-bold">Create New Course</DialogTitle>
                    <DialogDescription>Fill in the details to create a new course.</DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <CustomFormInput
                            label="Course Title"
                            name="title"
                            placeholder="Enter course title"
                            type="text"
                            required={true}
                            control={form.control}
                        />
                        <CustomFormTextarea
                            label="Description"
                            name="description"
                            placeholder="Enter course description"
                            control={form.control}
                        />
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <CustomFormInput
                                label="Price"
                                name="price"
                                placeholder="Enter price (optional)"
                                type="number"
                                control={form.control}
                            />
                            <CustomFormInput
                                label="Video URL"
                                name="videoUrl"
                                placeholder="Enter video URL (optional)"
                                type="url"
                                control={form.control}
                            />
                        </div>
                        <CustomFormImage label="Thumbnail" name="thumbnail" control={form.control} />
                        <div className="flex justify-end gap-4 pt-4">
                            <DialogClose asChild>
                                <CustomButton type="button" variant="outline">
                                    Cancel
                                </CustomButton>
                            </DialogClose>
                            <CustomButton type="submit" isLoading={isLoading}>
                                Create Course
                            </CustomButton>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};
