"use client";

import { useDeleteCourseVideoMutation } from "@/redux/api/course-video-api";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { toast } from "@workspace/ui/components/sonner";

import { CourseVideo } from "@/types/course-type";
import { useAlert } from "@/hooks/useAlert";

import { VideoCard } from "./video-card";

interface VideoListProps {
    videos: CourseVideo[];
    isLoading?: boolean;
    isPermission?: boolean;
    onPlay?: (video: CourseVideo) => void;
}

export const VideoList = ({ videos, isLoading, isPermission, onPlay }: VideoListProps) => {
    const { fire } = useAlert();
    const [deleteVideo] = useDeleteCourseVideoMutation();

    const handleDelete = (id: string) => {
        fire({
            title: "Delete Video",
            description: "Are you sure you want to delete this video?",
            onConfirm: async () => {
                await deleteVideo({ id })
                    .unwrap()
                    .then(() => {
                        toast.success("Video deleted successfully");
                    })
                    .catch((error) => {
                        toast.error(error.data?.message || "Failed to delete video");
                    });
            },
        });
    };

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, index) => (
                    <div key={index} className="overflow-hidden rounded-lg border border-gray-200 bg-white">
                        <Skeleton className="aspect-video w-full" />
                        <div className="space-y-2 p-4">
                            <Skeleton className="h-5 w-3/4" />
                            <Skeleton className="h-4 w-1/2" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (videos.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 px-4 py-12">
                <div className="space-y-4 text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                        <svg className="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                            />
                        </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">No videos yet</h3>
                    <p className="text-sm text-gray-500">Add your first video to get started with this course.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {videos.map((video) => (
                <VideoCard
                    key={video.id}
                    video={video}
                    handleDelete={handleDelete}
                    isPermission={isPermission}
                    onPlay={onPlay}
                />
            ))}
        </div>
    );
};
