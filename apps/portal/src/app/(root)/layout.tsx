import { SidebarInset, SidebarProvider } from "@workspace/ui/components/sidebar";

import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { MobileBottomNav } from "@/components/sidebar/mobile-bottom-nav";
import { SidebarNavbar } from "@/components/sidebar/sidebar-navbar";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <SidebarNavbar />
                <div className="p-4 pb-20 md:pb-4 lg:p-6">{children}</div>
                <MobileBottomNav />
            </SidebarInset>
        </SidebarProvider>
    );
}
