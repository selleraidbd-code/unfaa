import Image from "next/image";

import { Button } from "@workspace/ui/components/button";
import { cn } from "@workspace/ui/lib/utils";
import { CustomButton } from "@/components/ui/custom-button";
import noData from "@/assets/images/no-data.png";

interface CustomErrorOrEmptyProps {
    title?: string;
    description?: string;
    isError?: boolean;
    isTryAgain?: boolean;
    onRetry?: () => void;
    className?: string;
    href?: string;
    buttonText?: string;
    button?: React.ReactNode;
}

export const CustomErrorOrEmpty = ({
    title = "No Data Found",
    description = "There are no items to display at this time.",
    isError = false,
    isTryAgain = false,
    onRetry,
    className,
    href,
    buttonText = "Go to",
    button,
}: CustomErrorOrEmptyProps) => {
    return (
        <div className={cn("center h-[60vh] flex-col", className)}>
            <Image
                src={noData}
                alt="empty state"
                width={400}
                height={400}
                className="opacity-80 transition-transform duration-300 hover:scale-110"
            />
            <h1
                className={cn(
                    "text-gradient mt-8 text-2xl font-semibold",
                    isError && "from-rose-400 to-red-500"
                )}
            >
                {title}
            </h1>
            <p className="text-icon max-w-lg text-center text-lg leading-relaxed">
                {description}
            </p>
            <div className="flex flex-col gap-4 mt-4">
                {isTryAgain && (
                    <Button
                        className="mt-6 w-[160px]"
                        onClick={() => {
                            if (onRetry) onRetry();
                            else window.location.reload();
                        }}
                    >
                        Try Again
                    </Button>
                )}
                {href && (
                    <CustomButton className="mt-6 w-[160px]" href={href}>
                        {buttonText}
                    </CustomButton>
                )}
                {button}
            </div>
        </div>
    );
};
