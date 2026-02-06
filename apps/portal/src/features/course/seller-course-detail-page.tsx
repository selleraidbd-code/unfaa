"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { useGetCourseQuery } from "@/redux/api/course-api";
import { Button } from "@workspace/ui/components/button";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@workspace/ui/components/drawer";
import { ScrollArea } from "@workspace/ui/components/scroll-area";
import { useBreakpoint } from "@workspace/ui/hooks/use-breakpoint";
import { ArrowLeft, Menu, Play } from "lucide-react";

import { CourseVideo } from "@/types/course-type";

const getYouTubeVideoId = (url: string): string | null => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2] && match[2].length === 11 ? match[2] : null;
};

interface VideoListItemProps {
    video: CourseVideo;
    isActive: boolean;
    onClick: () => void;
}

const VideoListItem = ({ video, isActive, onClick }: VideoListItemProps) => {
    const videoId = getYouTubeVideoId(video.videoUrl);
    const thumbnailUrl = videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : null;

    const formatDuration = (minutes?: number) => {
        if (!minutes) return "";
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        if (hours > 0) {
            return `${hours}:${mins.toString().padStart(2, "0")}`;
        }
        return `${mins}m`;
    };

    return (
        <button
            onClick={onClick}
            className={`group relative w-full text-left transition-all ${
                isActive
                    ? "border-l-4 border-indigo-600 bg-indigo-50"
                    : "border-l-4 border-transparent hover:bg-gray-50"
            }`}
        >
            <div className="flex gap-3 p-3">
                <div className="relative h-20 w-32 flex-shrink-0 overflow-hidden rounded bg-gray-200">
                    {thumbnailUrl ? (
                        <img src={thumbnailUrl} alt={video.title} className="h-full w-full object-cover" />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center">
                            <Play className="h-6 w-6 text-gray-400" />
                        </div>
                    )}
                    {video.duration && (
                        <div className="absolute right-1 bottom-1 rounded bg-black/70 px-1.5 py-0.5 text-xs text-white">
                            {formatDuration(video.duration)}
                        </div>
                    )}
                </div>
                <div className="min-w-0 flex-1">
                    <h4
                        className={`line-clamp-2 text-sm font-medium ${isActive ? "text-indigo-900" : "text-gray-900"}`}
                    >
                        {video.title}
                    </h4>
                </div>
            </div>
        </button>
    );
};

export const SellerCourseDetailPage = () => {
    const params = useParams();
    const router = useRouter();
    const courseId = params?.id as string;
    const isMobile = useBreakpoint();
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const { data: courseData, isLoading: courseLoading } = useGetCourseQuery({ id: courseId }, { skip: !courseId });
    const course = courseData?.data;
    const videos = course?.videos || [];

    const videoContainerClass = isMobile
        ? "relative w-full overflow-hidden rounded-lg bg-black shadow-lg aspect-[9/16]"
        : "relative aspect-[5/3] w-full overflow-hidden rounded-lg bg-black shadow-lg";

    const [selectedVideo, setSelectedVideo] = useState<CourseVideo | null>(null);

    // Update selected video when videos load
    useEffect(() => {
        if (videos.length > 0 && !selectedVideo) {
            const firstVideo = videos[0];
            if (firstVideo) {
                setSelectedVideo(firstVideo);
            }
        }
    }, [videos, selectedVideo]);

    const handleVideoSelect = (video: CourseVideo) => {
        setSelectedVideo(video);
        if (isMobile) {
            setIsDrawerOpen(false);
        }
    };

    if (courseLoading) {
        return (
            <div className="space-y-4">
                <div className="h-64 animate-pulse rounded-lg bg-gray-200" />
                <div className="space-y-3">
                    <div className="h-6 w-3/4 animate-pulse rounded bg-gray-200" />
                    <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
                </div>
            </div>
        );
    }

    if (!course) {
        return (
            <div className="flex flex-col items-center justify-center px-4 py-8">
                <h2 className="mb-2 text-xl font-semibold text-gray-900">Course not found</h2>
                <p className="mb-4 text-center text-sm text-gray-500">The course you're looking for doesn't exist.</p>
                <Button onClick={() => router.push("/courses")} className="text-sm">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Courses
                </Button>
            </div>
        );
    }

    const selectedVideoId = selectedVideo ? getYouTubeVideoId(selectedVideo.videoUrl) : null;

    return (
        <div className="-mt-4 space-y-1">
            {/* Header */}
            <div className="flex items-center justify-between">
                <Button variant="ghost" onClick={() => router.push("/courses")} className="text-sm">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Courses
                </Button>
                {isMobile && (
                    <Button variant="outline" onClick={() => setIsDrawerOpen(true)} className="text-sm">
                        <Menu className="mr-2 h-4 w-4" /> Videos
                    </Button>
                )}
            </div>

            {/* Main Content: Video Player and Video List */}
            <div className="flex flex-col gap-4 lg:flex-row">
                {/* Video Player - Left Side */}
                <div className="flex-1">
                    <div className="sticky top-4">
                        <div className={videoContainerClass}>
                            {selectedVideoId ? (
                                <iframe
                                    src={`https://www.youtube.com/embed/${selectedVideoId}?autoplay=1&rel=0&modestbranding=1`}
                                    title={selectedVideo?.title || "Video"}
                                    className="h-full w-full"
                                    frameBorder="0"
                                    allow="autoplay; encrypted-media"
                                    allowFullScreen
                                />
                            ) : selectedVideo ? (
                                <div className="flex h-full items-center justify-center text-white">
                                    <div className="text-center">
                                        <Play className="mx-auto mb-2 h-12 w-12 opacity-50" />
                                        <p className="text-sm">Invalid video link</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex h-full items-center justify-center text-white">
                                    <div className="text-center">
                                        <Play className="mx-auto mb-2 h-12 w-12 opacity-50" />
                                        <p className="text-sm">No video selected</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Video Info */}
                        {selectedVideo && (
                            <div className="mt-4 rounded-lg bg-white p-4 shadow-sm">
                                <h3 className="text-base font-semibold text-gray-900 lg:text-lg">
                                    {selectedVideo.title}
                                </h3>
                                {selectedVideo.duration && (
                                    <p className="mt-1 text-sm text-gray-600">
                                        Duration: {selectedVideo.duration % 60}m
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Video List - Right Side (Desktop) */}
                {!isMobile && (
                    <div className="w-full lg:w-80 xl:w-96">
                        <div className="sticky top-4 rounded-lg border border-gray-200 bg-white shadow-sm">
                            <div className="border-b border-gray-200 p-4">
                                <h2 className="text-lg font-semibold text-gray-900">Course Videos ({videos.length})</h2>
                            </div>
                            <ScrollArea className="h-[600px]">
                                <div className="divide-y divide-gray-100">
                                    {videos.map((video) => (
                                        <VideoListItem
                                            key={video.id}
                                            video={video}
                                            isActive={selectedVideo?.id === video.id}
                                            onClick={() => handleVideoSelect(video)}
                                        />
                                    ))}
                                </div>
                            </ScrollArea>
                        </div>
                    </div>
                )}
            </div>

            {/* Mobile Drawer for Video List */}
            {isMobile && (
                <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
                    <DrawerContent className="max-h-[80vh]">
                        <DrawerHeader>
                            <DrawerTitle>Course Videos ({videos.length})</DrawerTitle>
                        </DrawerHeader>
                        <ScrollArea className="flex-1 px-4">
                            <div className="space-y-1 pb-4">
                                {videos.map((video) => (
                                    <VideoListItem
                                        key={video.id}
                                        video={video}
                                        isActive={selectedVideo?.id === video.id}
                                        onClick={() => handleVideoSelect(video)}
                                    />
                                ))}
                            </div>
                        </ScrollArea>
                    </DrawerContent>
                </Drawer>
            )}
        </div>
    );
};
