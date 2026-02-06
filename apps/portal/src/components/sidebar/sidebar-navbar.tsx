"use client";

import { config } from "@/config";
import { useAppSelector } from "@/redux/store/hook";
import { Separator } from "@workspace/ui/components/separator";
import { SidebarTrigger } from "@workspace/ui/components/sidebar";
import { useBreakpoint } from "@workspace/ui/hooks/use-breakpoint";
import { Globe } from "lucide-react";

import { CustomButton } from "@/components/ui/custom-button";
import { ThemeSwitcher } from "@/components/shared/theme-switcher";
import { NavUser } from "@/components/sidebar/nav-user";

export const SidebarNavbar = () => {
    const isMobile = useBreakpoint();
    const user = useAppSelector((state) => state.auth.user);

    const getShopUrl = () => {
        return `${config.rootDomain}/${user?.shop?.slug}`;
    };

    return (
        <header className="bg-sidebar sticky top-0 z-10 flex h-14 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-14">
            <div className="flex items-center gap-2 px-4">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="h-4 sm:mr-2" />

                <CustomButton target="_blank" size={isMobile ? "sm" : "default"} href={getShopUrl()}>
                    <Globe className="size-4" /> Go to Website
                </CustomButton>
            </div>

            <div className="ml-auto flex items-center gap-4 md:pr-8">
                <ThemeSwitcher />
                <NavUser user={user} />
            </div>
        </header>
    );
};
