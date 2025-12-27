import { Skeleton } from "@workspace/ui/components/skeleton";

export const ShopSettingsRightSideSkeleton = () => {
    return (
        <div className="w-1/3 space-y-6">
            {/* Shop QR Section */}
            <div className="card space-y-4">
                <Skeleton className="h-7 w-32" />

                <div className="center space-y-2">
                    {/* QR Code placeholder */}
                    <Skeleton className="h-64 w-64" />
                    <Skeleton className="h-4 w-56" />
                </div>

                {/* Shop URL */}
                <Skeleton className="h-12 w-full rounded-lg" />

                {/* Download Button */}
                <Skeleton className="h-10 w-full" />
            </div>
        </div>
    );
};
