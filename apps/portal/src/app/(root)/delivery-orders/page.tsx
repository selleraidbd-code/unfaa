"use client";

import { useState } from "react";

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
    const [activeTab, setActiveTab] = useState("pending-parcel");

    return (
        <div className="grid gap-4 md:gap-6">
            <h1 className="title">In Delivery Orders</h1>

            <CustomTabs value={activeTab} onValueChange={setActiveTab}>
                <CustomTabsList>
                    <CustomTabsTrigger value="ready-for-dispatch" icon={<Truck className="size-4 lg:size-5" />}>
                        Ready for Dispatch
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
