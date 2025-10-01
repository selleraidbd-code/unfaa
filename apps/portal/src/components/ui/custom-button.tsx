import { Button } from "@workspace/ui/components/button";
import { Loader } from "lucide-react";
import Link from "next/link";

type TCustomButton = {
    children: React.ReactNode;
    onClick?: () => void;
    href?: string;
    className?: string;
    isLoading?: boolean;
    disabled?: boolean;
    variant?:
        | "default"
        | "outline"
        | "ghost"
        | "link"
        | "destructive"
        | "destructiveOutline"
        | "accent";
    size?: "default" | "sm" | "lg" | "icon";
    icon?: React.ReactNode;
    type?: "button" | "submit" | "reset";
};

export const CustomButton = ({
    children,
    onClick,
    href,
    className,
    isLoading,
    disabled,
    variant = "default",
    size = "default",
    icon,
    type = "button",
}: TCustomButton) => {
    if (href) {
        return (
            <Link href={href}>
                <Button
                    className={className}
                    disabled={isLoading || disabled}
                    variant={variant}
                    size={size}
                >
                    {isLoading && <Loader className="h-4 w-4 animate-spin" />}
                    {icon}
                    {children}
                </Button>
            </Link>
        );
    }
    return (
        <Button
            onClick={onClick}
            className={className}
            disabled={isLoading || disabled}
            variant={variant}
            size={size}
            type={type}
        >
            {isLoading && <Loader className="h-4 w-4 animate-spin" />}
            {icon}
            {children}
        </Button>
    );
};
