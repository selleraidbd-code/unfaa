import { Loader } from "lucide-react";

import { cn } from "@workspace/ui/lib/utils";
import { CustomErrorOrEmpty } from "@/components/ui/custom-error-or-empty";

type Props<T> = {
    children: (data: NonNullable<T>) => React.ReactNode;
    data: T;
    className?: string;

    isLoading?: boolean;
    loadingClassName?: string;
    loadingComponent?: React.ReactNode;

    isEmpty?: boolean;
    emptyTitle?: string;
    emptyDescription?: string;
    emptyClassName?: string;
    emptyButton?: React.ReactNode;

    isError?: boolean;
    errorTitle?: string;
    errorDescription?: string;
    errorClassName?: string;
};

export const DataStateHandler = <T,>({
    children,
    data,
    className,
    loadingClassName,
    isEmpty,
    emptyClassName,
    emptyTitle,
    emptyDescription,
    isError,
    isLoading,
    errorTitle = "Something went wrong",
    errorDescription,
    errorClassName,
    loadingComponent,
    emptyButton,
}: Props<T>) => {
    if (isLoading) {
        if (loadingComponent) {
            return loadingComponent;
        }
        return (
            <div
                className={cn(
                    "flex items-center justify-center py-20",
                    loadingClassName
                )}
            >
                <Loader className="size-7 animate-spin text-primary" />
            </div>
        );
    }

    if (isError) {
        return (
            <CustomErrorOrEmpty
                isError={isError}
                title={errorTitle}
                description={errorDescription}
                className={errorClassName}
            />
        );
    }

    if (isEmpty) {
        return (
            <CustomErrorOrEmpty
                title={emptyTitle}
                description={emptyDescription}
                button={emptyButton}
                className={emptyClassName}
            />
        );
    }
    return <div className={className}>{children(data as NonNullable<T>)}</div>;
};
