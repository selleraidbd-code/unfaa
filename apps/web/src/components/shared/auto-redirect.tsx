"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

interface AutoRedirectProps {
    href: string;
    delay?: number;
}

export function AutoRedirect({ href, delay = 5000 }: AutoRedirectProps) {
    const router = useRouter();

    useEffect(() => {
        const timer = setTimeout(() => {
            router.push(href);
        }, delay);

        return () => clearTimeout(timer);
    }, [href, delay, router]);

    return null;
}
