import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { MobileBottomNav } from "@/components/sidebar/mobile-bottom-nav";
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
                    <div className="p-4 lg:p-6 2xl:p-8 pb-20 sm:pb-4">
                        {children}
                    </div>
                    <MobileBottomNav />
                </SidebarInset>
            </SidebarProvider>
        </VerificationProvider>
    );
}
