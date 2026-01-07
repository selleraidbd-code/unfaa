"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { ShoppingCart } from "@/features/shop/cart/ShoppingCart";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Search } from "lucide-react";

import { Shop } from "@/types/shop-type";
import { getLink } from "@/lib/get-link";
import { Logo } from "@/components/shop/logo";

export const TopNavbar = ({ shop }: { shop: Shop }) => {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmedQuery = searchQuery.trim();

        if (trimmedQuery) {
            const encodedQuery = encodeURIComponent(trimmedQuery);
            router.push(
                getLink({
                    shopSlug: shop.slug,
                    path: `/search/${encodedQuery}`,
                })
            );
            setSearchQuery("");
        }
    };

    return (
        <div className="container flex items-center justify-between py-2">
            <Logo shopSlug={shop.slug} image={shop?.photoURL} className="flex-shrink-0" />

            <form onSubmit={handleSearch} className="hidden items-center lg:flex">
                <Input
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="border-primary h-11 w-[30vw] rounded-r-none px-4 focus-visible:ring-0 focus-visible:ring-offset-0 lg:text-lg"
                    placeholder="Search your product name..."
                    minLength={3}
                />
                <Button type="submit" className="border-primary rounded-l-none border-l-0 md:h-11" variant="outline">
                    <Search className="text-primary h-5 w-5" />
                </Button>
            </form>

            <ShoppingCart />
        </div>
    );
};
