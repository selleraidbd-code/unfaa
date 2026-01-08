"use client";

import { useEffect, useState } from "react";

import { useUpdateCourseMutation } from "@/redux/api/course-api";
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
import { Edit } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Course, UpdateCourse } from "@/types/course-type";
import { CustomButton } from "@/components/ui/custom-button";
import { CustomFormImage } from "@/components/ui/custom-form-image";

const CourseFormSchema = z.object({
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

type CourseFormValues = z.infer<typeof CourseFormSchema>;

export const UpdateCourseDialog = ({ course }: { course: Course }) => {
    const [open, setOpen] = useState(false);
    const form = useForm<CourseFormValues>({
        resolver: zodResolver(CourseFormSchema),
        defaultValues: {
            title: course.title || "",
            description: course.description || "",
            thumbnail: course.thumbnail || "",
            videoUrl: course.videoUrl || "",
            price: course.price || undefined,
            isFree: course.isFree || false,
        },
    });

    useEffect(() => {
        if (open) {
            form.reset({
                title: course.title || "",
                description: course.description || "",
                thumbnail: course.thumbnail || "",
                videoUrl: course.videoUrl || "",
                price: course.price || undefined,
                isFree: course.isFree || false,
            });
        }
    }, [open, course, form]);

    const [updateCourse, { isLoading }] = useUpdateCourseMutation();
    const onSubmit = async (data: CourseFormValues) => {
        const payload: UpdateCourse = {
            title: data.title,
            description: data.description || undefined,
            thumbnail: data.thumbnail || undefined,
            videoUrl: data.videoUrl || undefined,
            price: data.price || undefined,
            isFree: data.isFree || false,
        };

        const updateData = {
            id: course.id,
            payload,
        };
        await updateCourse(updateData)
            .unwrap()
            .then(() => {
                form.reset();
                toast.success("Course updated successfully");
                setOpen(false);
            })
            .catch((error) => {
                toast.error(error.data?.message || "Failed to update course");
            });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <CustomButton variant="outline" size="sm">
                    <Edit className="mr-2 h-4 w-4" /> Edit
                </CustomButton>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto lg:max-w-3xl">
                <DialogHeader className="pb-3">
                    <DialogTitle className="text-xl font-bold">Update Course</DialogTitle>
                    <DialogDescription>Update the course details below.</DialogDescription>
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
                                Update Course
                            </CustomButton>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};
