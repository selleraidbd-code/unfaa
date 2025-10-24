"use client";

import {
    LayoutDashboard,
    ShoppingCart,
    ShoppingBag,
    Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@workspace/ui/lib/utils";

const navItems = [
    {
        label: "Home",
        icon: LayoutDashboard,
        href: "/",
    },
    {
        label: "Orders",
        icon: ShoppingCart,
        href: "/orders",
    },
    {
        label: "Products",
        icon: ShoppingBag,
        href: "/products",
    },
    {
        label: "Customers",
        icon: Users,
        href: "/customers",
    },
];

export const MobileBottomNav = () => {
    const pathname = usePathname();

    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border shadow-lg">
            <div className="flex items-center justify-around h-16">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive =
                        pathname === item.href ||
                        (item.href !== "/" && pathname.startsWith(item.href));

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex flex-col items-center justify-center gap-1 min-w-0 flex-1 h-full transition-colors",
                                isActive
                                    ? "text-primary"
                                    : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            <Icon className="size-5 shrink-0" />
                            <span className="text-xs font-medium truncate max-w-full px-1">
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
};
