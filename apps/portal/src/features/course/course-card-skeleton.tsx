import { Skeleton } from "@workspace/ui/components/skeleton";

export const CourseCardSkeleton = () => {
    return (
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
            {/* Image skeleton */}
            <div className="relative h-48 overflow-hidden">
                <Skeleton className="h-full w-full" />
            </div>

            {/* Content skeleton */}
            <div className="space-y-3 p-4">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
                <div className="flex items-center justify-between pt-2">
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-8 w-16 rounded-full" />
                </div>
            </div>

            {/* Actions skeleton */}
            <div className="flex items-center justify-end gap-2 border-t px-4 pt-4 pb-4">
                <Skeleton className="h-9 w-20" />
                <Skeleton className="h-9 w-20" />
            </div>
        </div>
    );
};
