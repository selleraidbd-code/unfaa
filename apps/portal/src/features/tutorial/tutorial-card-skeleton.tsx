import { Skeleton } from "@workspace/ui/components/skeleton";

export const TutorialCardSkeleton = () => {
    return (
        <div className="bg-white shadow-sm rounded-lg">
            {/* Image skeleton */}
            <div className="relative h-64 overflow-hidden rounded-t-lg">
                <Skeleton className="w-full h-full" />
            </div>

            {/* Title & Description skeleton */}
            <div className="p-4 flex items-center gap-3">
                <Skeleton className="w-8 h-8 rounded-full" />
                <div className="flex-1">
                    <Skeleton className="h-4 w-3/4 mb-2" />
                    <Skeleton className="h-3 w-1/2" />
                </div>
            </div>

            {/* Buttons skeleton */}
            <div className="flex justify-between items-center px-4 pb-4">
                <Skeleton className="h-9 w-20" />
                <Skeleton className="h-9 w-9 rounded" />
            </div>
        </div>
    );
};
