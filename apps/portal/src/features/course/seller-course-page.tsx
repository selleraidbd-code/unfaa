"use client";

import { CourseCardSkeleton } from "@/features/course/course-card-skeleton";
import { SellerCourseCard } from "@/features/course/seller-course-card";
import { useGetCoursesQuery } from "@/redux/api/course-api";

const SellerCoursePage = () => {
    const { data, isLoading } = useGetCoursesQuery({});
    const courses = data?.data || [];

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
                    <h3 className="text-xl font-semibold text-gray-900">No courses available</h3>
                    <p className="max-w-md text-gray-500">
                        There are no courses available at the moment. Please check back later.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {courses.map((course) => (
                <SellerCourseCard key={course.id} course={course} />
            ))}
        </div>
    );
};

export default SellerCoursePage;
