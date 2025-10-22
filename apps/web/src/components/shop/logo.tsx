/* eslint-disable @next/next/no-img-element */
import { getLink } from "@/lib/get-link";
import { cn } from "@workspace/ui/lib/utils";
import Link from "next/link";

export const Logo = ({
    image,
    className,
    shopSlug,
}: {
    image: string;
    className?: string;
    shopSlug: string;
}) => {
    return (
        <Link href={getLink({ shopSlug: shopSlug, path: "/" })}>
            <img
                src={image}
                alt="logo"
                className={cn("max-h-12 max-w-40", className)}
            />
        </Link>
    );
};
