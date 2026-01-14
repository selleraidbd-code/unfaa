"use client";

import { useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import {
    ChartConfig,
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from "@workspace/ui/components/chart";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@workspace/ui/components/select";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

import { OrderSourceData } from "@/types/shop-type";

interface OrderSourceChartProps {
    data: OrderSourceData;
}

const chartConfig = {
    customer: {
        label: "Customer",
        color: "hsl(142.1 76.2% 36.3%)", // green
    },
    admin: {
        label: "Admin",
        color: "hsl(217.2 91.2% 59.8%)", // blue
    },
    aiOrder: {
        label: "AI Order",
        color: "hsl(280 100% 70%)", // purple
    },
    manualOrder: {
        label: "Manual Order",
        color: "hsl(38 92% 50%)", // orange
    },
    websiteFacebook: {
        label: "Website Facebook",
        color: "hsl(221.2 83.2% 53.3%)", // facebook blue
    },
    websiteTiktok: {
        label: "Website TikTok",
        color: "hsl(0 0% 0%)", // black
    },
    landingPageFacebook: {
        label: "Landing Page Facebook",
        color: "hsl(221.2 83.2% 53.3%)",
    },
    landingPageTiktok: {
        label: "Landing Page TikTok",
        color: "hsl(0 0% 0%)",
    },
    website: {
        label: "Website",
        color: "hsl(210 40% 50%)", // gray-blue
    },
    unknown: {
        label: "Unknown",
        color: "hsl(0 0% 50%)", // gray
    },
} satisfies ChartConfig;

export const OrderSourceChart = ({ data }: OrderSourceChartProps) => {
    const [selectedSource, setSelectedSource] = useState<string>("all");

    // Get available sources that have data
    const availableSources = Object.keys(chartConfig).filter((key) => {
        return data.data.some((item) => (item as any)[key] > 0);
    });

    // Determine which sources to display
    const sourcesToDisplay =
        selectedSource === "all"
            ? availableSources.slice(0, 5) // Show top 5 by default
            : [selectedSource];

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
        });
    };

    return (
        <Card>
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between gap-4">
                    <CardTitle className="text-base font-semibold">
                        Order Source Analytics
                        <span className="text-muted-foreground ml-2 text-xs font-normal">({data.groupBy})</span>
                    </CardTitle>
                    <Select value={selectedSource} onValueChange={setSelectedSource}>
                        <SelectTrigger className="h-8 w-[160px]">
                            <SelectValue placeholder="Select source" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Sources</SelectItem>
                            {availableSources.map((source) => (
                                <SelectItem key={source} value={source}>
                                    {chartConfig[source as keyof typeof chartConfig].label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </CardHeader>
            <CardContent className="pt-0">
                <ChartContainer config={chartConfig} className="aspect-auto h-[260px] w-full">
                    <LineChart data={data.data} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
                        <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis
                            dataKey="date"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            tickFormatter={formatDate}
                            className="text-xs"
                        />
                        <ChartTooltip
                            cursor={false}
                            content={
                                <ChartTooltipContent
                                    labelFormatter={(value) => formatDate(value as string)}
                                    indicator="line"
                                />
                            }
                        />
                        {sourcesToDisplay.map((source) => (
                            <Line
                                key={source}
                                type="monotone"
                                dataKey={source}
                                stroke={`var(--color-${source})`}
                                strokeWidth={2}
                                dot={{ r: 3 }}
                                activeDot={{ r: 5 }}
                            />
                        ))}
                        <ChartLegend content={<ChartLegendContent />} />
                    </LineChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
};
