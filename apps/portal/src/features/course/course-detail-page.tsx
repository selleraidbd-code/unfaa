"use client";

import { useState } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";

import { useGetCourseQuery } from "@/redux/api/course-api";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { ArrowLeft, BookOpen, DollarSign, Play, X } from "lucide-react";

import { CourseVideo } from "@/types/course-type";

import { UpdateCourseDialog } from "./update-course-dialog";
import { CreateVideoDialog } from "./video/create-video-dialog";
import { VideoList } from "./video/video-list";

interface CourseDetailPageProps {
    isPermission?: boolean;
}

const getYouTubeVideoId = (url: string): string | null => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2] && match[2].length === 11 ? match[2] : null;
};

export const CourseDetailPage = ({ isPermission }: CourseDetailPageProps) => {
    const params = useParams();
    const router = useRouter();
    const courseId = params?.id as string;

    const [selectedVideo, setSelectedVideo] = useState<CourseVideo | null>(null);
    const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

    const { data: courseData, isLoading: courseLoading } = useGetCourseQuery({ id: courseId }, { skip: !courseId });
    const course = courseData?.data;
    const videos = course?.videos || [];

    const openVideoModal = (video: CourseVideo) => {
        setSelectedVideo(video);
        setIsVideoModalOpen(true);
    };

    const closeVideoModal = () => {
        setIsVideoModalOpen(false);
        setSelectedVideo(null);
    };

    const formatPrice = (price?: number) => {
        if (!price) return "Free";
        return `$${price.toFixed(2)}`;
    };

    if (courseLoading) {
        return (
            <div className="space-y-4 sm:space-y-6">
                <div className="h-48 animate-pulse rounded-lg bg-gray-200 sm:h-64" />
                <div className="space-y-3 sm:space-y-4">
                    <div className="h-6 w-3/4 animate-pulse rounded bg-gray-200 sm:h-8" />
                    <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
                    <div className="h-4 w-2/3 animate-pulse rounded bg-gray-200" />
                </div>
            </div>
        );
    }

    if (!course) {
        return (
            <div className="flex flex-col items-center justify-center px-4 py-8 sm:py-12">
                <h2 className="mb-2 text-xl font-semibold text-gray-900 sm:text-2xl">Course not found</h2>
                <p className="mb-4 text-center text-sm text-gray-500 sm:text-base">
                    The course you're looking for doesn't exist.
                </p>
                <Button onClick={() => router.push("/manage-courses")} className="text-sm sm:text-base">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Courses
                </Button>
            </div>
        );
    }

    return (
        <>
            <div className="space-y-4 sm:space-y-6">
                {/* Back Button */}
                <Button
                    variant="ghost"
                    onClick={() => router.push("/manage-courses")}
                    className="mb-2 text-sm sm:mb-4 sm:text-base"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Courses
                </Button>

                {/* Course Header */}
                <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
                    <div className="relative h-48 bg-gradient-to-br from-indigo-50 to-purple-50 sm:h-64 md:h-80">
                        {course.thumbnail ? (
                            <Image src={course.thumbnail} alt={course.title} fill className="object-cover" />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center">
                                <BookOpen className="h-16 w-16 text-gray-300 sm:h-24 sm:w-24" />
                            </div>
                        )}
                    </div>

                    <div className="space-y-3 p-4 sm:space-y-4 sm:p-6">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                            <div className="flex-1">
                                <div className="mb-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
                                    <h1 className="text-xl font-bold text-gray-900 sm:text-2xl md:text-3xl">
                                        {course.title}
                                    </h1>
                                    <Badge
                                        variant={course.isFree ? "secondary" : "default"}
                                        className="w-fit bg-indigo-100 text-indigo-800"
                                    >
                                        {course.isFree ? (
                                            "Free"
                                        ) : (
                                            <span className="flex items-center gap-1">
                                                <DollarSign className="h-3 w-3" />
                                                {formatPrice(course.price)}
                                            </span>
                                        )}
                                    </Badge>
                                </div>
                                {course.description && (
                                    <p className="text-base text-gray-600 sm:text-lg">{course.description}</p>
                                )}
                            </div>
                            {isPermission && (
                                <div className="flex-shrink-0 sm:ml-4">
                                    <UpdateCourseDialog course={course} />
                                </div>
                            )}
                        </div>

                        {/* Course Stats */}
                        <div className="flex flex-wrap items-center gap-4 border-t pt-3 sm:gap-6 sm:pt-4">
                            <div className="flex items-center gap-2 text-sm text-gray-600 sm:text-base">
                                <BookOpen className="h-4 w-4 sm:h-5 sm:w-5" />
                                <span className="font-medium">
                                    {videos.length} Video{videos.length !== 1 ? "s" : ""}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Videos Section */}
                <div className="space-y-3 sm:space-y-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">Course Videos</h2>
                        {isPermission && <CreateVideoDialog courseId={courseId} />}
                    </div>
                    <VideoList
                        videos={videos}
                        isLoading={courseLoading}
                        isPermission={isPermission}
                        onPlay={openVideoModal}
                    />
                </div>
            </div>

            {/* Video Modal */}
            {isVideoModalOpen && selectedVideo && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-2 sm:p-4">
                    <div className="relative w-full max-w-6xl">
                        {/* Close Button */}
                        <button
                            onClick={closeVideoModal}
                            className="absolute -top-1 -right-1 z-10 cursor-pointer rounded-full bg-white p-1.5 shadow-lg transition-colors hover:bg-gray-200 sm:-top-2 sm:-right-2 sm:p-2"
                        >
                            <X className="h-5 w-5 sm:h-6 sm:w-6" />
                        </button>

                        {/* Video Player */}
                        <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-black shadow-2xl">
                            {selectedVideo.videoUrl && getYouTubeVideoId(selectedVideo.videoUrl) ? (
                                <iframe
                                    src={`https://www.youtube.com/embed/${getYouTubeVideoId(
                                        selectedVideo.videoUrl
                                    )}?autoplay=1&rel=0&modestbranding=1`}
                                    title={selectedVideo.title || "Video"}
                                    className="h-full w-full"
                                    frameBorder="0"
                                    allow="autoplay; encrypted-media"
                                    allowFullScreen
                                />
                            ) : (
                                <div className="flex h-full items-center justify-center text-white">
                                    <div className="text-center">
                                        <Play className="mx-auto mb-2 h-12 w-12 opacity-50 sm:mb-4 sm:h-16 sm:w-16" />
                                        <p className="text-sm sm:text-base">Invalid video link</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Video Info */}
                        <div className="mt-2 rounded-lg bg-white p-3 sm:mt-4 sm:p-4">
                            <h3 className="mb-1 text-lg font-semibold text-gray-900 sm:mb-2 sm:text-xl">
                                {selectedVideo.title}
                            </h3>
                            {selectedVideo.duration && (
                                <p className="text-sm text-gray-600 sm:text-base">
                                    Duration: {Math.floor(selectedVideo.duration / 60)}h {selectedVideo.duration % 60}m
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
