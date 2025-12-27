import { CustomCollapsible } from "@workspace/ui/components/custom/custom-collapsible";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { cn } from "@workspace/ui/lib/utils";

export const ShopBasicInfoSkeleton = ({ className }: { className?: string }) => {
    return (
        <div className={cn("space-y-6", className)}>
            <CustomCollapsible
                collapsible={false}
                title="Shop Basic Info"
                content={
                    <div className="space-y-6 pt-2">
                        <div className="grid grid-cols-2 gap-4">
                            {/* Shop Name */}
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-10 w-full" />
                            </div>

                            {/* Shop Type */}
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-10 w-full" />
                            </div>

                            {/* Shop Email */}
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-10 w-full" />
                            </div>

                            {/* Shop Phone Number */}
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-10 w-full" />
                            </div>

                            {/* Shop Description - Full Width */}
                            <div className="col-span-2 space-y-2">
                                <Skeleton className="h-4 w-48" />
                                <Skeleton className="h-24 w-full" />
                            </div>

                            {/* Shop Logo */}
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-32 w-full 2xl:h-40" />
                            </div>

                            {/* Shop Theme Color */}
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-32 w-full 2xl:h-40" />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-end pt-4">
                            <Skeleton className="h-10 w-40" />
                        </div>
                    </div>
                }
            />
        </div>
    );
};
