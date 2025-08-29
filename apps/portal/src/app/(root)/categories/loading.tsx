const Loading = () => {
    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="animate-pulse">
                        <div className="bg-muted rounded-lg p-6 space-y-3">
                            <div className="h-6 bg-muted-foreground/20 rounded w-3/4"></div>
                            <div className="h-4 bg-muted-foreground/20 rounded w-full"></div>
                            <div className="h-4 bg-muted-foreground/20 rounded w-2/3"></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Loading;
