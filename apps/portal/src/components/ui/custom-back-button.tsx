"use client";

import { ArrowLeft } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { cn } from "@workspace/ui/lib/utils";
import Link from "next/link";

interface ArrowBackButtonProps {
    onClick?: () => void;
    href?: string;
    className?: string;
    size?: "sm" | "md" | "lg";
    variant?: "default" | "ghost" | "outline";
    disabled?: boolean;
}

export const ArrowBackButton = ({
    onClick,
    href,
    className,
    size = "md",
    variant = "ghost",
    disabled = false,
}: ArrowBackButtonProps) => {
    const sizeClasses = {
        sm: "h-8 w-8",
        md: "h-10 w-10",
        lg: "h-12 w-12",
    };

    const iconSizes = {
        sm: "h-4 w-4",
        md: "h-5 w-5",
        lg: "h-6 w-6",
    };

    const buttonContent = (
        <ArrowLeft
            className={cn(
                iconSizes[size],
                "transition-transform duration-200 group-hover:-translate-x-0.5"
            )}
        />
    );

    const baseClasses = cn(
        "group rounded-full border shadow-sm transition-all duration-200",
        "bg-white/80 backdrop-blur-sm hover:bg-white",
        "border-gray-200/60 hover:border-gray-300",
        "hover:shadow-md hover:scale-105",
        "active:scale-95 active:shadow-sm",
        "focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
        "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100",
        sizeClasses[size]
    );

    if (href) {
        return (
            <Link href={href}>
                <Button
                    variant={variant}
                    size="icon"
                    className={cn(baseClasses, className)}
                    disabled={disabled}
                    aria-label="Go back"
                >
                    {buttonContent}
                </Button>
            </Link>
        );
    }

    return (
        <Button
            variant={variant}
            size="icon"
            onClick={onClick}
            className={cn(baseClasses, className)}
            disabled={disabled}
            aria-label="Go back"
        >
            {buttonContent}
        </Button>
    );
};

export const HeaderBackButton = ({
    title,
    href,
}: {
    title: string;
    href: string;
}) => {
    return (
        <div className="flex items-center w-fit gap-4 group">
            <ArrowBackButton href={href} />
            <Link
                href={href}
                className="flex-1 shrink-0 text-xl font-medium tracking-tight whitespace-nowrap sm:grow-0"
            >
                {title}
            </Link>
        </div>
    );
};
