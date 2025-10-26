import { Skeleton } from "@workspace/ui/components/skeleton";
import { CustomCollapsible } from "@workspace/ui/components/custom/custom-collapsible";

const PolicySectionSkeleton = ({ title }: { title: string }) => (
    <CustomCollapsible
        title={title}
        content={
            <div className="flex flex-col gap-6">
                <div className="space-y-3">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-4/5" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-4 w-5/6" />
                    <Skeleton className="h-4 w-4/5" />
                    <Skeleton className="h-4 w-3/4" />
                </div>
                <div className="flex justify-end">
                    <Skeleton className="h-10 w-32" />
                </div>
            </div>
        }
    />
);

export const ShopPolicySkeleton = () => {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between gap-2">
                <Skeleton className="h-8 w-32" />
            </div>

            <PolicySectionSkeleton title="About Us" />
            <PolicySectionSkeleton title="Terms and Conditions" />
            <PolicySectionSkeleton title="Privacy Policy" />
            <PolicySectionSkeleton title="Return Policy" />
            <PolicySectionSkeleton title="Refund Policy" />
        </div>
    );
};
