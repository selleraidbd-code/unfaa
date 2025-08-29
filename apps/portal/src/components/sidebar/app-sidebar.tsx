import * as React from "react";

import { getNavData } from "@/data/nav-data";
import useGetUser from "@/hooks/useGetUser";
import { UserRole } from "@/types";
import {
    Sidebar,
    SidebarContent,
    SidebarHeader,
    useSidebar,
} from "@workspace/ui/components/sidebar";
import { Store } from "lucide-react";
import Link from "next/link";
import { NavMain } from "./nav-main";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const user = useGetUser();
    const { open } = useSidebar();

    const data = getNavData(user?.role || UserRole.USER);

    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader className="flex justify-center pl-4 lg:pl-6 h-14">
                <Link href="/" className="flex items-center gap-2 text-primary">
                    <Store className="size-5" />
                    {open && (
                        <span className="text-base lg:text-lg font-semibold">
                            Unfaa
                        </span>
                    )}
                </Link>
            </SidebarHeader>

            <SidebarContent className="no-scrollbar">
                {data.navItems.map((item, index) => (
                    <NavMain
                        key={index}
                        items={item.items}
                        label={item.label}
                    />
                ))}
            </SidebarContent>
        </Sidebar>
    );
}
