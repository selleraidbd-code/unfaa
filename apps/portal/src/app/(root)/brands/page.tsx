"use client";

import { BrandCard } from "@/features/brand/brand-card";
import { CreateBrandDialog } from "@/features/brand/create-brand-dialog";
import { UpdateBrandDialog } from "@/features/brand/update-brand-dialog";
import { useAlert } from "@/hooks/useAlert";
import useGetUser from "@/hooks/useGetUser";
import {
    useDeleteBrandMutation,
    useGetBrandsQuery,
} from "@/redux/api/brand-api";
import { Brand } from "@/types/brand-type";
import { CustomErrorOrEmpty } from "@/components/ui/custom-error-or-empty";
import { FolderOpen } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const Page = () => {
    const user = useGetUser();
    const { fire } = useAlert();

    const [brand, setBrand] = useState<Brand | null>(null);

    const { data, isLoading, error } = useGetBrandsQuery({
        shopId: user?.shop.id,
        page: 1,
        limit: 50,
    });

    const [deleteBrand] = useDeleteBrandMutation();

    const onUpdate = async (brand: Brand) => {
        setBrand(brand);
    };

    const onDelete = async (id: string) => {
        fire({
            title: "Delete Brand",
            text: "Are you sure you want to delete this brand?",
            onConfirm: async () => {
                await deleteBrand({ id })
                    .unwrap()
                    .then(() => {
                        toast.success("Brand deleted successfully");
                    })
                    .catch((error) => {
                        toast.error(
                            error.data.message || "Brand deletion failed"
                        );
                    });
            },
        });
    };

    const HeaderSection = () => (
        <div className="flex items-center justify-between mb-4">
            <h1 className="title">Brands</h1>
            <CreateBrandDialog />
        </div>
    );

    if (isLoading) {
        return (
            <div className="space-y-8">
                <HeaderSection />

                <div className="flex flex-wrap gap-6">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="animate-pulse">
                            <div className="border rounded-md flex flex-col items-center justify-between gap-2 w-52 p-4">
                                {/* Image skeleton */}
                                <div className="size-40 bg-muted rounded-md"></div>
                                {/* Text skeleton */}
                                <div className="h-5 bg-muted rounded w-3/4"></div>
                                {/* Action buttons skeleton */}
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
    }

    if (error) {
        return <CustomErrorOrEmpty isError={true} />;
    }

    return (
        <>
            <div className="space-y-8">
                <HeaderSection />

                <div className="flex flex-wrap gap-6">
                    {data?.data?.length ? (
                        data.data.map((brand: Brand) => (
                            <BrandCard
                                key={brand.id}
                                brand={brand}
                                onEdit={onUpdate}
                                onDelete={onDelete}
                            />
                        ))
                    ) : (
                        <div className="col-span-full text-center py-16">
                            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                                <FolderOpen className="w-8 h-8 text-muted-foreground" />
                            </div>
                            <h3 className="text-lg font-semibold mb-2">
                                No brands found
                            </h3>
                            <p className="text-muted-foreground mb-4">
                                Create your first brand to start organizing your
                                products.
                            </p>
                            <CreateBrandDialog />
                        </div>
                    )}
                </div>
            </div>

            {brand && (
                <UpdateBrandDialog
                    brand={brand}
                    onClose={() => setBrand(null)}
                />
            )}
        </>
    );
};

export default Page;
