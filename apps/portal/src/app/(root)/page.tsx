"use client";

import { AdminDashboard } from "@/features/dashboard/AdminDashboard";
import { SellerEmployeeDashboard } from "@/features/dashboard/SellerEmployeeDashboard";
import { useAppSelector } from "@/redux/store/hook";
import { UserRole } from "@/types";

const Page = () => {
    const user = useAppSelector((state) => state.auth.user);
    const shopId = user?.shop?.id || "";

    // Render different dashboards based on user role
    if (user?.role === UserRole.ADMIN || user?.role === UserRole.SUPER_ADMIN) {
        return <AdminDashboard shopId={shopId} />;
    }

    // For SELLER and EMPLOYEE roles
    if (user?.role === UserRole.SELLER || user?.role === UserRole.EMPLOYEE) {
        return <SellerEmployeeDashboard shopId={shopId} />;
    }

    // Fallback for other roles
    return (
        <div className="flex items-center justify-center p-8">
            <p className="text-muted-foreground">Unable to load dashboard for your role</p>
        </div>
    );
};

export default Page;
