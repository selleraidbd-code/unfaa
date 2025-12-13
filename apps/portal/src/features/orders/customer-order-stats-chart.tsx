"use client";

import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@workspace/ui/components/chart";
import { cn } from "@workspace/ui/lib/utils";
import { Pie, PieChart } from "recharts";

const chartConfig = {
    orders: {
        label: "Orders",
    },
    confirmed: {
        label: "Confirmed",
        color: "hsl(142.1 76.2% 36.3%)", // green-600
    },
    cancelled: {
        label: "Cancelled",
        color: "hsl(0 84.2% 60.2%)", // red-500
    },
} satisfies ChartConfig;

interface CustomerOrderStatsChartProps {
    confirmedOrders: number;
    cancelledOrders: number;
    className?: string;
}

export const CustomerOrderStatsChart = ({
    confirmedOrders,
    cancelledOrders,
    className,
}: CustomerOrderStatsChartProps) => {
    const totalOrders = confirmedOrders + cancelledOrders;

    // Don't render if no orders
    if (totalOrders === 0) {
        return null;
    }

    const chartData = [
        {
            status: "confirmed",
            orders: confirmedOrders,
            fill: "var(--color-confirmed)",
        },
        {
            status: "cancelled",
            orders: cancelledOrders,
            fill: "var(--color-cancelled)",
        },
    ].filter((item) => item.orders > 0); // Only show segments with orders

    return (
        <ChartContainer config={chartConfig} className={cn("size-10 flex-shrink-0", className)}>
            <PieChart>
                <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                <Pie data={chartData} dataKey="orders" nameKey="status" stroke="0" />
            </PieChart>
        </ChartContainer>
    );
};
