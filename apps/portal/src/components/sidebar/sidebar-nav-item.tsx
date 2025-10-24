"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { ChevronDown, LucideIcon } from "lucide-react";

import {
    Accordion,
    AccordionContent,
    AccordionTrigger,
} from "@workspace/ui/components/accordion";
import {
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    useSidebar,
} from "@workspace/ui/components/sidebar";

export interface NavItemProps {
    title: string;
    url: string;
    icon?: LucideIcon;
    isActive?: boolean;
    items?: {
        title: string;
        url: string;
    }[];
    subItems?: {
        title: string;
        url: string;
    }[];
}

export const SidebarNavItem = ({ item }: { item: NavItemProps }) => {
    const pathname = usePathname();
    const { setOpen, setOpenMobile, isMobile } = useSidebar();

    const isActive = pathname.split("/")[1] === item.url.split("/")[1];

    const handleNavClick = () => {
        if (isMobile) {
            setOpenMobile(false);
        }
    };

    if (!item.items || item.items.length === 0) {
        return (
            <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                    tooltip={item.title}
                    asChild
                    isActive={isActive}
                >
                    <Link href={item.url} onClick={handleNavClick}>
                        {item.icon && <item.icon className="size-5 " />}
                        <span>{item.title}</span>
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
        );
    }

    return (
        <Accordion
            type="single"
            collapsible
            key={item.title}
            asChild
            className="group/collapsible"
            defaultValue={isActive ? item.title : ""}
        >
            <SidebarMenuItem>
                <AccordionTrigger asChild>
                    <SidebarMenuButton
                        tooltip={item.title}
                        onClick={() => setOpen(true)}
                    >
                        {item.icon && <item.icon className="size-5" />}
                        <span className="xl:text-base">{item.title}</span>
                        <ChevronDown className="ml-auto size-5 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180" />
                    </SidebarMenuButton>
                </AccordionTrigger>
                <AccordionContent>
                    <SidebarMenuSub>
                        {item.items?.map((subItem) => {
                            const isSubItemActive = pathname.startsWith(
                                subItem.url
                            );

                            return (
                                <SidebarMenuSubItem key={subItem.title}>
                                    <SidebarMenuSubButton
                                        asChild
                                        isActive={isSubItemActive}
                                    >
                                        <Link
                                            href={subItem.url}
                                            onClick={handleNavClick}
                                        >
                                            <span className="xl:text-base">
                                                {subItem.title}
                                            </span>
                                        </Link>
                                    </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                            );
                        })}
                    </SidebarMenuSub>
                </AccordionContent>
            </SidebarMenuItem>
        </Accordion>
    );
};
