"use client";

import { Logo } from "@/components/shared/logo";
import ShoppingCart from "@/features/cart/ShoppingCart";
import { Shop } from "@/types/shop-type";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export const TopNavbar = ({ shop }: { shop: Shop }) => {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmedQuery = searchQuery.trim();

        if (trimmedQuery) {
            const encodedQuery = encodeURIComponent(trimmedQuery);
            router.push(`/search/${encodedQuery}`);
            setSearchQuery("");
        }
    };

    return (
        <div className="flex items-center justify-between py-2 container">
            <Logo image={shop?.photoURL} className="flex-shrink-0" />

            <form
                onSubmit={handleSearch}
                className="hidden lg:flex items-center"
            >
                <Input
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="lg:text-lg w-[30vw] h-11 px-4  rounded-r-none border-primary focus-visible:ring-0 focus-visible:ring-offset-0"
                    placeholder="Search your product name..."
                    minLength={3}
                />
                <Button
                    type="submit"
                    className="rounded-l-none border-primary border-l-0 h-11"
                    variant="outline"
                >
                    <Search className="w-5 h-5 text-primary" />
                </Button>
            </form>

            <ShoppingCart />
        </div>
    );
};
