import { NavCategories } from "@/components/shop/navbar/nav-categories";
import { getLink } from "@/lib/get-link";
import { Shop } from "@/types/shop-type";
import { Phone } from "lucide-react";
import Link from "next/link";

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
        <div className="hidden lg:block border-t border-primary">
            <div className="flex items-center justify-between py-1 container mx-auto w-full">
                <NavCategories
                    categories={shop.shopTheme.categories}
                    shopSlug={shop.slug}
                />

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
                    className="hidden lg:flex items-center gap-2 hover:text-primary"
                >
                    <Phone className="w-4 h-4" />
                    <span className="text-sm font-medium">
                        {shop?.whatsappNumber || "01700000000"}
                    </span>
                </Link>
            </div>
        </div>
    );
};
