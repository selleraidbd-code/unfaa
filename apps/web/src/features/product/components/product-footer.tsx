import { memo } from "react";
import Link from "next/link";

import { getLink } from "@/lib/get-link";

type Props = {
    banglaName: string;
    shopSlug: string;
};

export const ProductFooter = memo(function ProductFooter({ banglaName, shopSlug }: Props) {
    return (
        <footer className="border-t border-gray-200 py-6 text-center text-gray-600">
            <div className="landing-width">
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
                    © {new Date().getFullYear()} {banglaName}
                </p>
            </div>
        </footer>
    );
});
