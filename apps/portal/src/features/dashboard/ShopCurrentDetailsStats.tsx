"use client";

import Link from "next/link";

import { cn } from "@workspace/ui/lib/utils";
import { Briefcase, Package, ShoppingCart, Store, Tags, Users } from "lucide-react";

import { ShopCurrentDetails } from "@/types/shop-type";

interface ShopCurrentDetailsStatsProps {
    data: ShopCurrentDetails;
}

const stats = [
    {
        key: "totalOrder" as const,
        label: "Orders",
        icon: ShoppingCart,
        color: "text-pink-600",
        href: "/orders",
    },
    {
        key: "totalProduct" as const,
        label: "Products",
        icon: Package,
        color: "text-blue-600",
        href: "/products",
    },
    {
        key: "totalBrand" as const,
        label: "Brands",
        icon: Store,
        color: "text-purple-600",
        href: "/brands",
    },
    {
        key: "totalCategory" as const,
        label: "Categories",
        icon: Tags,
        color: "text-emerald-600",
        href: "/categories",
    },
    {
        key: "totalCustomer" as const,
        label: "Customers",
        icon: Users,
        color: "text-cyan-600",
        href: "/customers",
    },
    {
        key: "totalShopEmployee" as const,
        label: "Employees",
        icon: Briefcase,
        color: "text-orange-600",
        href: "/employees",
    },
];

export const ShopCurrentDetailsStats = ({ data }: ShopCurrentDetailsStatsProps) => {
    return (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {stats.map((stat) => {
                const Icon = stat.icon;
                const value = data[stat.key];

                return (
                    <Link
                        key={stat.key}
                        href={stat.href}
                        className="bg-card hover:bg-primary/5 hover:border-primary flex items-center justify-between gap-2 rounded-md border p-3 transition-shadow hover:shadow-md xl:px-4"
                    >
                        <div className="min-w-0 flex-1 space-y-0.5">
                            <p className="text-muted-foreground truncate text-sm font-medium">{stat.label}</p>
                            <p className="text-lg font-bold tracking-tight sm:text-xl">{value.toLocaleString()}</p>
                        </div>
                        <Icon className={cn("size-5 shrink-0 lg:size-6 xl:size-7", stat.color)} />
                    </Link>
                );
            })}
        </div>
    );
};
