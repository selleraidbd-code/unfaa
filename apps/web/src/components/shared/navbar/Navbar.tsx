"use client";

import { SecondNavbar } from "@/components/shared/navbar/second-navbar";
import { TopNavbar } from "@/components/shared/navbar/top-navbar";
import { Shop } from "@/types/shop-type";

export const Navbar = ({ shop }: { shop: Shop }) => {
    return (
        <header className="w-full sticky top-0 z-50 bg-background shadow-sm border-b">
            <TopNavbar shop={shop} />

            <SecondNavbar shop={shop} />
        </header>
    );
};
