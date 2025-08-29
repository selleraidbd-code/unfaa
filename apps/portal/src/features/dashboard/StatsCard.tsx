import { cn } from "@workspace/ui/lib/utils";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@workspace/ui/components/card";

interface StatsCardProps {
    title: string;
    value: number;
    icon: React.ReactNode;
    iconClassName?: string;
    className?: string;
    isAmount?: boolean;
}

export const StatsCard = ({
    title,
    value,
    icon,
    className,
    iconClassName,
    isAmount = true,
}: StatsCardProps) => {
    return (
        <Card
            className={cn(
                "bg-secondary flex flex-col justify-between",
                className
            )}
        >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="sub-title">{title}</CardTitle>
                <span
                    className={cn(
                        "bg-white text-primary rounded-md p-1.5",
                        iconClassName
                    )}
                >
                    {icon}
                </span>
            </CardHeader>
            <CardContent className="mt-3 flex items-end justify-between">
                <div className="text-[26px] font-semibold whitespace-nowrap">
                    {isAmount ? "৳" : ""} {value.toLocaleString()}
                </div>
                <p className="text-right text-sm font-medium">
                    <span className="text-sm text-green-500">+ 10%</span> <br />{" "}
                    vs last month
                </p>
            </CardContent>
        </Card>
    );
};
