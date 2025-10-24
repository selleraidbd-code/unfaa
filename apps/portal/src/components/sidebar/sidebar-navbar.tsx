"use client";

import { ThemeSwitcher } from "@/components/shared/theme-switcher";
import { NavUser } from "@/components/sidebar/nav-user";
import { CustomButton } from "@/components/ui/custom-button";
import { config } from "@/config";
import useGetUser from "@/hooks/useGetUser";
import { Separator } from "@workspace/ui/components/separator";
import { SidebarTrigger } from "@workspace/ui/components/sidebar";
import { Globe } from "lucide-react";

export const SidebarNavbar = () => {
    const user = useGetUser();

    const getShopUrl = () => {
        return `${config.rootDomain}/shop/${user?.shop?.slug}`;
    };

    return (
        <header className="flex h-14 sticky top-0 z-10 bg-sidebar shrink-0 border-b items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-14">
            <div className="flex items-center gap-2 px-4">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="mr-2 h-4" />

                <CustomButton
                    className="max-md:hidden"
                    target="_blank"
                    href={getShopUrl()}
                >
                    <Globe className="size-4" /> Go to Website
                </CustomButton>
            </div>

            <div className="ml-auto md:pr-8 flex items-center gap-4">
                <ThemeSwitcher />
                <NavUser user={user} />
            </div>
        </header>
    );
};
