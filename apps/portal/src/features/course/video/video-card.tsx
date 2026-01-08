"use client";

import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { Clock, Play, Trash2 } from "lucide-react";

import { CourseVideo } from "@/types/course-type";

import { UpdateVideoDialog } from "./update-video-dialog";

export const VideoCard = ({
    video,
    handleDelete,
    isPermission,
    onPlay,
}: {
    video: CourseVideo;
    handleDelete: (id: string) => void;
    isPermission?: boolean;
    onPlay?: (video: CourseVideo) => void;
}) => {
    const formatDuration = (minutes?: number) => {
        if (!minutes) return "N/A";
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        if (hours > 0) {
            return `${hours}h ${mins}m`;
        }
        return `${mins}m`;
    };

    const getYouTubeVideoId = (url: string): string | null => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return match && match[2] && match[2].length === 11 ? match[2] : null;
    };

    const videoId = video.videoUrl ? getYouTubeVideoId(video.videoUrl) : null;
    const thumbnailUrl = videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : null;

    return (
        <div className="group overflow-hidden rounded-lg border border-gray-200 bg-white transition-all duration-300 hover:shadow-md">
            <div className="relative aspect-video bg-gradient-to-br from-gray-100 to-gray-200">
                {thumbnailUrl ? (
                    <img src={thumbnailUrl} alt={video.title} className="h-full w-full object-cover" />
                ) : (
                    <div className="flex h-full w-full items-center justify-center">
                        <Play className="h-12 w-12 text-gray-400" />
                    </div>
                )}

                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-all duration-300 group-hover:bg-black/30">
                    <button
                        onClick={() => onPlay?.(video)}
                        className="opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    >
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 shadow-lg backdrop-blur-sm transition-transform duration-300 hover:scale-110">
                            <Play className="ml-1 h-6 w-6 text-indigo-600" />
                        </div>
                    </button>
                </div>

                {/* Free Badge */}
                {video.isFree && (
                    <div className="absolute top-2 right-2">
                        <Badge variant="secondary" className="bg-green-500 text-white">
                            Free
                        </Badge>
                    </div>
                )}
            </div>

            <div className="space-y-2 p-4">
                <h4 className="line-clamp-2 text-base font-semibold text-gray-900">{video.title}</h4>
                <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>{formatDuration(video.duration)}</span>
                    </div>
                    {onPlay && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onPlay(video)}
                            className="text-indigo-600 hover:text-indigo-700"
                        >
                            Watch
                        </Button>
                    )}
                </div>
            </div>

            {/* Permission-based Actions */}
            {isPermission && (
                <div className="flex items-center justify-end gap-2 border-t px-4 pt-4 pb-4">
                    <UpdateVideoDialog video={video} />
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(video.id)}>
                        <Trash2 size={16} className="mr-2" /> Delete
                    </Button>
                </div>
            )}
        </div>
    );
};
