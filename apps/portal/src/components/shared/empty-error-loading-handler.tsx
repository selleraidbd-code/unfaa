import { CustomErrorOrEmpty } from "@/components/ui/custom-error-or-empty";
import { cn } from "@workspace/ui/lib/utils";
import { Loader } from "lucide-react";

type TEmptyErrorLoadingHandler = {
    children: React.ReactNode;
    className?: string;
    loadingClassName?: string;
    isEmpty?: boolean;
    emptyTitle?: string;
    emptyDescription?: string;
    isError?: boolean;
    errorTitle?: string;
    errorDescription?: string;
    isLoading?: boolean;
    loadingComponent?: React.ReactNode;
};

export const EmptyErrorLoadingHandler = ({
    children,
    className,
    loadingClassName,
    isEmpty,
    emptyTitle,
    emptyDescription,
    isError,
    isLoading,
    errorTitle = "Something went wrong",
    errorDescription,
    loadingComponent,
}: TEmptyErrorLoadingHandler) => {
    if (isError) {
        return (
            <CustomErrorOrEmpty
                isError={isError}
                title={errorTitle}
                description={errorDescription}
            />
        );
    }
    if (isLoading) {
        if (loadingComponent) {
            return loadingComponent;
        }
        return (
            <div
                className={cn(
                    "flex items-center justify-center",
                    loadingClassName
                )}
            >
                <Loader className="size-7 animate-spin text-primary" />
            </div>
        );
    }
    if (isEmpty) {
        return (
            <CustomErrorOrEmpty
                title={emptyTitle}
                description={emptyDescription}
            />
        );
    }
    return <div className={className}>{children}</div>;
};
