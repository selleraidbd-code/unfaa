"use client";

import { useRouter, useSearchParams } from "next/navigation";

import { PendingParcel } from "@/features/orders/pending-percel";
import { ReadyToDispatch } from "@/features/orders/ready-to-dispatch";
import { RiderNote } from "@/features/orders/rider-note";
import {
    CustomTabs,
    CustomTabsContent,
    CustomTabsList,
    CustomTabsTrigger,
} from "@workspace/ui/components/custom/custom-tabs";
import { FileText, Package, Truck } from "lucide-react";

const Page = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const activeTab = searchParams.get("tab") || "ready-for-dispatch";

    const handleTabChange = (value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("tab", value);
        router.push(`?${params.toString()}`);
    };

    return (
        <div className="grid gap-4 md:gap-6">
            <h1 className="title">In Delivery Orders</h1>

            <CustomTabs value={activeTab} onValueChange={handleTabChange}>
                <CustomTabsList>
                    <CustomTabsTrigger value="ready-for-dispatch" icon={<Truck className="size-4 lg:size-5" />}>
                        <span className="max-sm:hidden">Ready for</span> Dispatch
                    </CustomTabsTrigger>
                    <CustomTabsTrigger value="pending-parcel" icon={<Package className="size-4 lg:size-5" />}>
                        Pending Parcel
                    </CustomTabsTrigger>
                    <CustomTabsTrigger value="rider-note" icon={<FileText className="size-4 lg:size-5" />}>
                        Rider Note
                    </CustomTabsTrigger>
                </CustomTabsList>

                <CustomTabsContent value="ready-for-dispatch">
                    <ReadyToDispatch />
                </CustomTabsContent>

                <CustomTabsContent value="pending-parcel" className="mt-6">
                    <PendingParcel />
                </CustomTabsContent>

                <CustomTabsContent value="rider-note" className="mt-6">
                    <RiderNote />
                </CustomTabsContent>
            </CustomTabs>
        </div>
    );
};

export default Page;
