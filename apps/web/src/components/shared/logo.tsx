/* eslint-disable @next/next/no-img-element */
import { cn } from "@workspace/ui/lib/utils";
import Link from "next/link";

export const Logo = ({
    image,
    className,
}: {
    image: string;
    className?: string;
}) => {
    return (
        <Link href="/">
            <img
                src={image}
                alt="logo"
                className={cn("max-h-12 max-w-40", className)}
            />
        </Link>
    );
};
