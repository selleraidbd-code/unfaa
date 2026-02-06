"use client";

import { Construction } from "lucide-react";

export const AdminDashboard = ({ shopId }: { shopId: string }) => {
    return (
        <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 p-8">
            <div className="bg-muted/50 flex h-24 w-24 items-center justify-center rounded-full">
                <Construction className="text-muted-foreground h-12 w-12" />
            </div>
            <div className="text-center">
                <h2 className="text-2xl font-bold tracking-tight">Coming Soon</h2>
                <p className="text-muted-foreground mt-2 text-sm">Admin dashboard is currently under development</p>
            </div>
        </div>
    );
};
