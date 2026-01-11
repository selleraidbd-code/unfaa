"use client";

import { useEffect, useState } from "react";

import { useUpdateCourseVideoMutation } from "@/redux/api/course-video-api";
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
import { Edit } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { CourseVideo, UpdateCourseVideo } from "@/types/course-type";
import { CustomButton } from "@/components/ui/custom-button";

const VideoFormSchema = z.object({
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

type VideoFormValues = z.infer<typeof VideoFormSchema>;

export const UpdateVideoDialog = ({ video }: { video: CourseVideo }) => {
    const [open, setOpen] = useState(false);
    const form = useForm<VideoFormValues>({
        resolver: zodResolver(VideoFormSchema),
        defaultValues: {
            title: video.title || "",
            videoUrl: video.videoUrl || "",
            duration: video.duration || undefined,
            isFree: video.isFree || false,
        },
    });

    useEffect(() => {
        if (open) {
            form.reset({
                title: video.title || "",
                videoUrl: video.videoUrl || "",
                duration: video.duration || undefined,
                isFree: video.isFree || false,
            });
        }
    }, [open, video, form]);

    const [updateVideo, { isLoading }] = useUpdateCourseVideoMutation();
    const onSubmit = async (data: VideoFormValues) => {
        const payload: UpdateCourseVideo = {
            title: data.title,
            videoUrl: data.videoUrl,
            duration: data.duration || undefined,
            isFree: data.isFree || false,
        };

        const updateData = {
            id: video.id,
            payload,
        };
        await updateVideo(updateData)
            .unwrap()
            .then(() => {
                form.reset();
                toast.success("Video updated successfully");
                setOpen(false);
            })
            .catch((error) => {
                toast.error(error.data?.message || "Failed to update video");
            });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <CustomButton variant="outline" size="sm">
                    <Edit className="mr-2 h-4 w-4" /> Edit
                </CustomButton>
            </DialogTrigger>
            <DialogContent className="lg:max-w-2xl">
                <DialogHeader className="pb-3">
                    <DialogTitle className="text-xl font-bold">Update Video</DialogTitle>
                    <DialogDescription>Update the video details below.</DialogDescription>
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
                            placeholder="Enter video URL"
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
                                Update Video
                            </CustomButton>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};
