"use client";

import { useState } from "react";

import { useCreateCourseVideoMutation } from "@/redux/api/course-video-api";
import { zodResolver } from "@hookform/resolvers/zod";
import { CustomFormInput } from "@workspace/ui/components/custom/custom-form-input";
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

import { CreateCourseVideo } from "@/types/course-type";
import { CustomButton } from "@/components/ui/custom-button";

const CreateVideoFormSchema = z.object({
    title: z.string({
        required_error: "Title is required",
    }),
    videoUrl: z.string({
        required_error: "Video URL is required",
    }),
    duration: z.preprocess(
        (val) => (val === "" || val === null || val === undefined ? undefined : Number(val)),
        z.number().optional()
    ) as z.ZodType<number | undefined>,
    isFree: z.boolean().optional(),
});

type VideoFormValues = z.infer<typeof CreateVideoFormSchema>;

export const CreateVideoDialog = ({ courseId }: { courseId: string }) => {
    const [open, setOpen] = useState(false);
    const form = useForm<VideoFormValues>({
        resolver: zodResolver(CreateVideoFormSchema),
        defaultValues: {
            title: "",
            videoUrl: "",
            duration: undefined,
            isFree: false,
        },
    });

    const [createVideo, { isLoading }] = useCreateCourseVideoMutation();
    const onSubmit = async (data: VideoFormValues) => {
        const payload: CreateCourseVideo = {
            courseId,
            title: data.title,
            videoUrl: data.videoUrl,
            duration: data.duration || undefined,
            isFree: data.isFree || false,
        };
        await createVideo(payload)
            .unwrap()
            .then(() => {
                form.reset();
                toast.success("Video added successfully");
                setOpen(false);
            })
            .catch((error) => {
                toast.error(error.data?.message || "Failed to add video");
            });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <CustomButton>
                    <Plus className="mr-2 h-4 w-4" /> Add Video
                </CustomButton>
            </DialogTrigger>
            <DialogContent className="lg:max-w-2xl">
                <DialogHeader className="pb-3">
                    <DialogTitle className="text-xl font-bold">Add New Video</DialogTitle>
                    <DialogDescription>Add a new video to this course.</DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <CustomFormInput
                            label="Video Title"
                            name="title"
                            placeholder="Enter video title"
                            type="text"
                            required={true}
                            control={form.control}
                        />
                        <CustomFormInput
                            label="Video URL"
                            name="videoUrl"
                            placeholder="Enter video URL (YouTube, Vimeo, etc.)"
                            type="url"
                            required={true}
                            control={form.control}
                        />
                        <CustomFormInput
                            label="Duration (minutes)"
                            name="duration"
                            placeholder="Enter duration in minutes (optional)"
                            type="number"
                            control={form.control}
                        />
                        <div className="flex justify-end gap-4 pt-4">
                            <DialogClose asChild>
                                <CustomButton type="button" variant="outline">
                                    Cancel
                                </CustomButton>
                            </DialogClose>
                            <CustomButton type="submit" isLoading={isLoading}>
                                Add Video
                            </CustomButton>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};
