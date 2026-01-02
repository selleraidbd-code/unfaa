import { CustomCollapsible } from "@workspace/ui/components/custom/custom-collapsible";
import { Skeleton } from "@workspace/ui/components/skeleton";

const Loading = () => {
    return (
        <div className="grid gap-4">
            {/* Header Section */}
            <div className="flex items-center gap-4">
                <div className="flex w-fit items-center gap-2 sm:gap-4">
                    <Skeleton className="h-9 w-9 rounded-full sm:h-10 sm:w-10" />
                    <Skeleton className="h-6 w-32 sm:w-40" />
                </div>
                <div className="hidden gap-2 sm:ml-auto sm:flex">
                    <Skeleton className="h-10 w-24" />
                    <Skeleton className="h-10 w-24" />
                </div>
            </div>

            <div className="grid gap-4">
                {/* General Information Section */}
                <CustomCollapsible
                    title="General Information"
                    content={
                        <div className="grid gap-x-6 gap-y-4 pt-2 md:grid-cols-2">
                            {/* Product Name (English) */}
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-10 w-full" />
                            </div>
                            {/* Product Name (Display Name) */}
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-40" />
                                <Skeleton className="h-10 w-full" />
                            </div>
                            {/* Category */}
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-20" />
                                <Skeleton className="h-10 w-full" />
                            </div>
                            {/* Brand */}
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-16" />
                                <Skeleton className="h-10 w-full" />
                            </div>
                            {/* Active Status Switch */}
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-6 w-12" />
                            </div>
                        </div>
                    }
                />

                {/* Product Images Section */}
                <CustomCollapsible
                    title="Product Images"
                    content={
                        <div className="max-w-6xl sm:pt-2">
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                {/* Main Photo */}
                                <Skeleton className="aspect-square w-full rounded-lg" />
                                {/* Additional Images */}
                                {[...Array(5)].map((_, i) => (
                                    <Skeleton key={i} className="aspect-square w-full rounded-lg" />
                                ))}
                            </div>
                        </div>
                    }
                />

                {/* Price & Inventory Section */}
                <CustomCollapsible
                    title="Price & Inventory"
                    content={
                        <div className="grid gap-x-6 gap-y-4 pt-2 md:grid-cols-2">
                            {/* Sell / Current Price */}
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-10 w-full" />
                            </div>
                            {/* Regular / Old Price */}
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-10 w-full" />
                            </div>
                            {/* Quantity (Stock) */}
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-28" />
                                <Skeleton className="h-10 w-full" />
                            </div>
                            {/* SKU / Product Code */}
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-36" />
                                <Skeleton className="h-10 w-full" />
                            </div>
                            {/* Unit Name */}
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-10 w-full" />
                            </div>
                            {/* Warranty */}
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-20" />
                                <Skeleton className="h-10 w-full" />
                            </div>
                        </div>
                    }
                />

                {/* Product Variants Section */}
                <CustomCollapsible
                    title="Product Variants"
                    content={
                        <div className="grid gap-4 pt-1 md:gap-6">
                            <Skeleton className="h-4 w-full max-w-2xl" />
                            <Skeleton className="h-10 w-40" />
                        </div>
                    }
                />

                {/* Product Details Section */}
                <CustomCollapsible
                    title="Product Details"
                    content={
                        <div className="grid gap-x-6 gap-y-4 pt-2 md:grid-cols-2">
                            {/* Delivery Charge */}
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-28" />
                                <Skeleton className="h-10 w-full" />
                            </div>
                            {/* Video Link */}
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-10 w-full" />
                            </div>
                            {/* Short Description Editor */}
                            <div className="col-span-2 space-y-2.5">
                                <Skeleton className="h-4 w-48" />
                                <Skeleton className="h-48 w-full rounded-md" />
                            </div>
                            {/* Product Description Editor */}
                            <div className="col-span-2 space-y-2.5">
                                <Skeleton className="h-4 w-36" />
                                <Skeleton className="h-48 w-full rounded-md" />
                            </div>
                            {/* Keywords Textarea */}
                            <div className="col-span-2 space-y-2">
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-20 w-full rounded-md" />
                            </div>
                        </div>
                    }
                />
            </div>

            {/* Footer Action Buttons */}
            <div className="flex justify-end gap-2 border-t p-4">
                <Skeleton className="h-10 w-24" />
                <Skeleton className="h-10 w-24" />
            </div>
        </div>
    );
};

export default Loading;
