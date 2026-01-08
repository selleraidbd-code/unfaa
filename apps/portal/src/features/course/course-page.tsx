"use client";

import { CourseCardSkeleton } from "@/features/course/course-card-skeleton";
import { ManageCourseCard } from "@/features/course/manage-course-card";
import { useDeleteCourseMutation, useGetCoursesQuery } from "@/redux/api/course-api";
import { toast } from "@workspace/ui/components/sonner";

import { useAlert } from "@/hooks/useAlert";

interface CoursePageProps {
    isPermission?: boolean;
}

const CoursePage = ({ isPermission }: CoursePageProps) => {
    const { fire } = useAlert();

    const { data, isLoading } = useGetCoursesQuery({});
    const courses = data?.data || [];

    const [deleteCourse] = useDeleteCourseMutation();

    const handleDelete = (id: string) => {
        fire({
            title: "Delete Course",
            description:
                "Are you sure you want to delete this course? This will also delete all videos in this course.",
            onConfirm: async () => {
                await deleteCourse({ id })
                    .unwrap()
                    .then(() => {
                        toast.success("Course deleted successfully");
                    })
                    .catch((error) => {
                        toast.error(error.data?.message || "Failed to delete course");
                    });
            },
        });
    };

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {Array.from({ length: 8 }).map((_, index) => (
                    <CourseCardSkeleton key={index} />
                ))}
            </div>
        );
    }

    if (courses.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center px-4 py-12">
                <div className="space-y-4 text-center">
                    <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gray-100">
                        <svg className="h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                            />
                        </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">No courses yet</h3>
                    <p className="max-w-md text-gray-500">
                        Get started by creating your first course. Add content, videos, and engage with your audience.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {courses.map((course) => (
                <ManageCourseCard
                    key={course.id}
                    course={course}
                    handleDelete={handleDelete}
                    isPermission={isPermission}
                />
            ))}
        </div>
    );
};

export default CoursePage;
