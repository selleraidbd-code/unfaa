import Link from "next/link";

import { Phone } from "lucide-react";

import { Shop } from "@/types/shop-type";
import { getLink } from "@/lib/get-link";
import { NavCategories } from "@/components/shop/navbar/nav-categories";

export const SecondNavbar = ({ shop }: { shop: Shop }) => {
    const navItems = [
        {
            label: "Home",
            href: "/",
        },
        {
            label: "Products",
            href: "/products",
        },
        {
            label: "About Us",
            href: "/about-us",
        },
    ];

    return (
        <div className="border-primary hidden border-t lg:block">
            <div className="container mx-auto flex w-full items-center justify-between py-1">
                <NavCategories categories={shop.shopTheme?.categories || []} shopSlug={shop.slug} />

                <nav className="flex items-center gap-8">
                    {navItems.map((item) => (
                        <Link
                            key={item.label}
                            href={getLink({
                                shopSlug: shop.slug,
                                path: item.href,
                            })}
                            className="text-foreground hover:text-primary font-medium"
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>

                {/* Phone visible on lg */}
                <Link
                    target="_blank"
                    href={`https://wa.me/${shop?.whatsappNumber || "01700000000"}`}
                    className="hover:text-primary hidden items-center gap-2 lg:flex"
                >
                    <Phone className="h-4 w-4" />
                    <span className="text-sm font-medium">{shop?.whatsappNumber || "01700000000"}</span>
                </Link>
            </div>
        </div>
    );
};
