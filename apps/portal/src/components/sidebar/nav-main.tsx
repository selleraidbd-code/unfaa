"use client";

import {
    NavItemProps,
    SidebarNavItem,
} from "@/components/sidebar/sidebar-nav-item";
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
} from "@workspace/ui/components/sidebar";

export function NavMain({
    label,
    items,
    className,
}: {
    label?: string;
    className?: string;
    items: NavItemProps[];
}) {
    return (
        <SidebarGroup className={className}>
            {label && (
                <SidebarGroupLabel className="pb-2">{label}</SidebarGroupLabel>
            )}

            <SidebarMenu>
                {items.map((item) => (
                    <SidebarNavItem key={item.title} item={item} />
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
}
