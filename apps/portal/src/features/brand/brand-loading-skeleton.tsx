export const BrandLoadingSkeleton = () => {
    return (
        <div className="space-y-8">
            <h1 className="title">Brands</h1>

            <div className="flex flex-wrap gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="animate-pulse">
                        <div className="border rounded-md flex flex-col items-center justify-between gap-2 w-52 p-4">
                            <div className="size-40 bg-muted rounded-md"></div>
                            <div className="h-5 bg-muted rounded w-3/4"></div>
                            <div className="flex justify-end gap-2 items-center">
                                <div className="w-8 h-8 bg-muted rounded"></div>
                                <div className="w-8 h-8 bg-muted rounded"></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
