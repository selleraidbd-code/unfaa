"use client";

import { EmptyErrorLoadingHandler } from "@/components/shared/empty-error-loading-handler";
import { BrandCard } from "@/features/brand/brand-card";
import { BrandLoadingSkeleton } from "@/features/brand/brand-loading-skeleton";
import { CreateBrandDialog } from "@/features/brand/create-brand-dialog";
import { UpdateBrandDialog } from "@/features/brand/update-brand-dialog";
import { useAlert } from "@/hooks/useAlert";
import useGetUser from "@/hooks/useGetUser";
import {
    useDeleteBrandMutation,
    useGetBrandsQuery,
} from "@/redux/api/brand-api";
import { Brand } from "@/types/brand-type";
import { useState } from "react";
import { toast } from "sonner";

const Page = () => {
    const user = useGetUser();
    const { fire } = useAlert();

    const [brand, setBrand] = useState<Brand | null>(null);

    const { data, isLoading, isError } = useGetBrandsQuery({
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
            description: "Are you sure you want to delete this brand?",
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

    return (
        <>
            <div className="space-y-8">
                <HeaderSection />

                <EmptyErrorLoadingHandler
                    className="flex flex-wrap gap-6"
                    isError={isError}
                    isLoading={isLoading}
                    loadingComponent={<BrandLoadingSkeleton />}
                    isEmpty={data?.data?.length === 0}
                    emptyTitle="No brands found"
                    emptyDescription="Create your first brand to start organizing your products."
                >
                    {data?.data?.map((brand: Brand) => (
                        <BrandCard
                            key={brand.id}
                            brand={brand}
                            onEdit={onUpdate}
                            onDelete={onDelete}
                        />
                    ))}
                </EmptyErrorLoadingHandler>
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
