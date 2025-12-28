"use client";

import { memo } from "react";
import Link from "next/link";

import { Product } from "@/types/product-type";
import { getLink } from "@/lib/get-link";

type Props = {
    product: Product;
    shopSlug: string;
};

export const ProductFooter = memo(function ProductFooter({ product, shopSlug }: Props) {
    return (
        <footer className="mt-8 border-t border-gray-200 pt-6 text-center text-gray-600">
            <p className="mb-2">
                <Link href={getLink({ shopSlug, path: "/privacy-policy" })} className="hover:text-green-600">
                    Privacy Policy
                </Link>{" "}
                |
                <Link href={getLink({ shopSlug, path: "/terms-conditions" })} className="ml-2 hover:text-green-600">
                    Terms & Conditions
                </Link>
            </p>
            <p>
                © {new Date().getFullYear()} {product.banglaName}
            </p>
        </footer>
    );
});
