import Image from "next/image";

import { Button } from "@workspace/ui/components/button";
import { cn } from "@workspace/ui/lib/utils";

interface CustomErrorOrEmptyProps {
    title?: string;
    description?: string;
    isError?: boolean;
    isTryAgain?: boolean;
    onRetry?: () => void;
    className?: string;
}

export const CustomErrorOrEmpty = ({
    title = "No Data Found",
    description = "There are no items to display at this time.",
    isError = false,
    isTryAgain = false,
    onRetry,
    className,
}: CustomErrorOrEmptyProps) => {
    return (
        <div className={cn("center h-[60vh] flex-col", className)}>
            <Image
                src={
                    "http://multi-media-server.naimurrhman.com/uploads/img/1745681986517-50678915.jpg"
                }
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
        </div>
    );
};
