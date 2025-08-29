const DashboardSkeleton = () => {
    return (
        <div className="flex h-screen items-center justify-center">
            <div className="w-full p-12">
                {/* Header section */}
                <div className="mb-8 space-y-4">
                    <div className="h-8 w-1/4 animate-pulse rounded-lg bg-background/80" />
                    <div className="h-4 w-1/3 animate-pulse rounded-lg bg-background/80" />
                </div>

                {/* Table header */}
                <div className="mb-4 grid grid-cols-6 gap-4">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="h-8 animate-pulse rounded-lg bg-background/80" />
                    ))}
                </div>

                {/* Table rows */}
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="mb-4 grid grid-cols-6 gap-4">
                        {[...Array(6)].map((_, j) => (
                            <div key={j} className="h-12 animate-pulse rounded-lg bg-background/80" />
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DashboardSkeleton;
