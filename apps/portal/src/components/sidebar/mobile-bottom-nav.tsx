"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@workspace/ui/lib/utils";
import { BotIcon, LayoutDashboard, ShoppingCart, Truck } from "lucide-react";

const navItems = [
    {
        label: "Home",
        icon: LayoutDashboard,
        href: "/",
    },
    {
        label: "AI Order",
        icon: BotIcon,
        href: "/ai-order",
    },
    {
        label: "Orders",
        icon: ShoppingCart,
        href: "/orders",
    },
    {
        label: "In Delivery",
        icon: Truck,
        href: "/delivery-orders",
    },
];

export const MobileBottomNav = () => {
    const pathname = usePathname();

    return (
        <nav className="bg-background border-border fixed right-0 bottom-0 left-0 z-50 border-t shadow-lg md:hidden">
            <div className="flex h-16 items-center justify-around">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex h-full min-w-0 flex-1 flex-col items-center justify-center gap-1 transition-colors",
                                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            <Icon className="size-5 shrink-0" />
                            <span className="max-w-full truncate px-1 text-xs font-medium">{item.label}</span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
};
