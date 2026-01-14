"use client";

import Image from "next/image";
import Link from "next/link";

import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { BookOpen, DollarSign, Play, Trash2 } from "lucide-react";

import { Course } from "@/types/course-type";

import { UpdateCourseDialog } from "./update-course-dialog";

export const ManageCourseCard = ({
    course,
    handleDelete,
    isPermission,
}: {
    course: Course;
    handleDelete: (id: string) => void;
    isPermission?: boolean;
}) => {
    const formatPrice = (price?: number) => {
        if (!price) return "Free";
        return `$${price.toFixed(2)}`;
    };

    return (
        <div className="group bg-card overflow-hidden rounded-lg border shadow-sm transition-all duration-300 hover:shadow-lg">
            <Link href={isPermission ? `/manage-courses/${course.id}` : `/courses/${course.id}`}>
                <div className="relative h-48 overflow-hidden bg-gradient-to-br from-indigo-50 to-purple-50">
                    {course.thumbnail ? (
                        <Image
                            src={course.thumbnail}
                            alt={course.title || "Course"}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center">
                            <BookOpen className="h-16 w-16 text-gray-300" />
                        </div>
                    )}

                    {/* Price Badge */}
                    <div className="absolute top-3 right-3">
                        <Badge
                            variant={course.isFree ? "secondary" : "default"}
                            className="bg-white/90 font-semibold text-gray-900 shadow-md backdrop-blur-sm"
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

                    {/* Play Button Overlay */}
                    {course.videoUrl && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-all duration-300 group-hover:bg-black/20">
                            <div className="opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 shadow-lg transition-transform duration-300 hover:scale-110">
                                    <Play className="ml-1 h-6 w-6 text-white" />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </Link>

            {/* Content */}
            <div className="space-y-2 p-4">
                <Link href={isPermission ? `/manage-courses/${course.id}` : `/courses/${course.id}`}>
                    <h3 className="line-clamp-2 text-lg font-semibold text-gray-900 transition-colors hover:text-indigo-600">
                        {course.title}
                    </h3>
                </Link>
                {course.description && <p className="line-clamp-2 text-sm text-gray-600">{course.description}</p>}
                <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                        <BookOpen className="h-4 w-4" />
                        <span>Course</span>
                    </div>
                    <Link href={isPermission ? `/manage-courses/${course.id}` : `/courses/${course.id}`}>
                        <Button variant="ghost" size="sm" className="text-indigo-600 hover:text-indigo-700">
                            View Details
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Permission-based Actions */}
            {isPermission && (
                <div className="flex items-center justify-end gap-2 border-t px-4 pt-4 pb-4">
                    <UpdateCourseDialog course={course} />
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(course.id)}>
                        <Trash2 size={16} className="mr-2" /> Delete
                    </Button>
                </div>
            )}
        </div>
    );
};
