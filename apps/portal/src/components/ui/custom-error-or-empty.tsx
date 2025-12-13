import Image from "next/image";

import noData from "@/assets/images/no-data.png";
import { Button } from "@workspace/ui/components/button";
import { cn } from "@workspace/ui/lib/utils";

import { CustomButton } from "@/components/ui/custom-button";

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
        <div className={cn("center h-[50vh] flex-col md:h-[80vh]", className)}>
            <Image
                src={noData}
                alt="empty state"
                width={400}
                height={400}
                className="opacity-80 transition-transform duration-300 hover:scale-110 max-md:w-40"
            />
            <h1
                className={cn(
                    "text-gradient mt-4 text-base font-semibold md:mt-8 md:text-lg lg:text-2xl",
                    isError && "from-rose-400 to-red-500"
                )}
            >
                {title}
            </h1>
            <p className="text-icon max-w-lg pt-2 text-center text-sm leading-relaxed md:text-lg">{description}</p>
            <div className="mt-4 flex flex-col gap-4">
                {isTryAgain && (
                    <Button
                        className="mt-4 w-[160px] md:mt-6"
                        onClick={() => {
                            if (onRetry) onRetry();
                            else window.location.reload();
                        }}
                    >
                        Try Again
                    </Button>
                )}
                {href && (
                    <CustomButton className="mt-4 w-[160px] md:mt-6" href={href}>
                        {buttonText}
                    </CustomButton>
                )}
                {button}
            </div>
        </div>
    );
};
