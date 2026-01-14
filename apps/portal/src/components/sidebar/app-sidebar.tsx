"use client";

import * as React from "react";
import Link from "next/link";

import { getNavData } from "@/data/nav-data";
import { useAppSelector } from "@/redux/store/hook";
import { UserRole } from "@/types";
import { Sidebar, SidebarContent, SidebarHeader, useSidebar } from "@workspace/ui/components/sidebar";
import { Store } from "lucide-react";

import { NavMain } from "./nav-main";

export const AppSidebar = ({ ...props }: React.ComponentProps<typeof Sidebar>) => {
    const user = useAppSelector((state) => state.auth.user);
    const isAdmin = user?.role === UserRole.ADMIN || user?.role === UserRole.SUPER_ADMIN;
    const { open } = useSidebar();

    const data = getNavData(user?.role);

    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader className="flex h-14 justify-center pl-4 lg:pl-6">
                <Link href={isAdmin ? "/overview" : "/"} className="text-primary flex items-center gap-2">
                    <Store className="size-5" />
                    {open && <span className="text-base font-semibold lg:text-lg">Unfaa</span>}
                </Link>
            </SidebarHeader>

            <SidebarContent>
                {data.navItems.map((item, index) => (
                    <NavMain key={index} items={item.items} label={item.label} />
                ))}
            </SidebarContent>
        </Sidebar>
    );
};
