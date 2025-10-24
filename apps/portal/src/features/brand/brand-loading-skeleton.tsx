export const BrandLoadingSkeleton = () => {
    return (
        <div className="flex flex-wrap gap-4 max-md:justify-center md:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
                <div
                    key={i}
                    className="border rounded-md flex flex-col items-center justify-between gap-2 w-[155px] md:w-44 lg:w-48 p-2 md:p-4 animate-pulse"
                >
                    <div className="size-24 sm:size-32 lg:size-40 bg-muted rounded-md"></div>
                    <div className="h-5 bg-muted rounded w-3/4"></div>
                    <div className="flex justify-end gap-2 items-center w-full">
                        <div className="w-9 h-9 bg-muted rounded-md"></div>
                        <div className="w-9 h-9 bg-muted rounded-md"></div>
                    </div>
                </div>
            ))}
        </div>
    );
};
