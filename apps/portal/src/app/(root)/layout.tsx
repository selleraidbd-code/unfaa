"use client";

import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SidebarNavbar } from "@/components/sidebar/sidebar-navbar";
import { VerificationProvider } from "@/providers/verification-provider";
import {
    SidebarInset,
    SidebarProvider,
} from "@workspace/ui/components/sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <VerificationProvider>
            <SidebarProvider>
                <AppSidebar />
                <SidebarInset>
                    <SidebarNavbar />
                    <div className="p-4 xl:!p-6 2xl:!p-8">{children}</div>
                </SidebarInset>
            </SidebarProvider>
        </VerificationProvider>
    );
}
