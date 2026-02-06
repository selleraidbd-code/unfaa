"use client";

import { useParams } from "next/navigation";

import { SellerEmployeeDashboard } from "@/features/dashboard/SellerEmployeeDashboard";

import { HeaderBackButton } from "@/components/ui/custom-back-button";

const SellerDetailsPage = () => {
    const params = useParams();
    const shopId = (params?.id as string) || "";

    if (!shopId) {
        return (
            <div className="flex items-center justify-center p-8">
                <p className="text-muted-foreground">Invalid seller. Shop ID is required.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <HeaderBackButton title="Sellers" href="/sellers" />
            <SellerEmployeeDashboard shopId={shopId} />
        </div>
    );
};

export default SellerDetailsPage;
