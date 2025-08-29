"use client";

import * as React from "react";

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@workspace/ui/components/card";
import {
    ChartConfig,
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from "@workspace/ui/components/chart";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@workspace/ui/components/select";

const chartData = [
    { date: "2024-04-01", order: 222, paid: 150 },
    { date: "2024-04-02", order: 97, paid: 180 },
    { date: "2024-04-03", order: 167, paid: 120 },
    { date: "2024-04-04", order: 242, paid: 260 },
    { date: "2024-04-05", order: 373, paid: 290 },
    { date: "2024-04-06", order: 301, paid: 340 },
    { date: "2024-04-07", order: 245, paid: 180 },
    { date: "2024-04-08", order: 409, paid: 320 },
    { date: "2024-04-09", order: 59, paid: 110 },
    { date: "2024-04-10", order: 261, paid: 190 },
    { date: "2024-04-11", order: 327, paid: 350 },
    { date: "2024-04-12", order: 292, paid: 210 },
    { date: "2024-04-13", order: 342, paid: 380 },
    { date: "2024-04-14", order: 137, paid: 220 },
    { date: "2024-04-15", order: 120, paid: 170 },
    { date: "2024-04-16", order: 138, paid: 190 },
    { date: "2024-04-17", order: 446, paid: 360 },
    { date: "2024-04-18", order: 364, paid: 410 },
    { date: "2024-04-19", order: 243, paid: 180 },
    { date: "2024-04-20", order: 89, paid: 150 },
    { date: "2024-04-21", order: 137, paid: 200 },
    { date: "2024-04-22", order: 224, paid: 170 },
    { date: "2024-04-23", order: 138, paid: 230 },
    { date: "2024-04-24", order: 387, paid: 290 },
    { date: "2024-04-25", order: 215, paid: 250 },
    { date: "2024-04-26", order: 75, paid: 130 },
    { date: "2024-04-27", order: 383, paid: 420 },
    { date: "2024-04-28", order: 122, paid: 180 },
    { date: "2024-04-29", order: 315, paid: 240 },
    { date: "2024-04-30", order: 454, paid: 380 },
    { date: "2024-05-01", order: 165, paid: 220 },
    { date: "2024-05-02", order: 293, paid: 310 },
    { date: "2024-05-03", order: 247, paid: 190 },
    { date: "2024-05-04", order: 385, paid: 420 },
    { date: "2024-05-05", order: 481, paid: 390 },
    { date: "2024-05-06", order: 498, paid: 520 },
    { date: "2024-05-07", order: 388, paid: 300 },
    { date: "2024-05-08", order: 149, paid: 210 },
    { date: "2024-05-09", order: 227, paid: 180 },
    { date: "2024-05-10", order: 293, paid: 330 },
    { date: "2024-05-11", order: 335, paid: 270 },
    { date: "2024-05-12", order: 197, paid: 240 },
    { date: "2024-05-13", order: 197, paid: 160 },
    { date: "2024-05-14", order: 448, paid: 490 },
    { date: "2024-05-15", order: 473, paid: 380 },
    { date: "2024-05-16", order: 338, paid: 400 },
    { date: "2024-05-17", order: 499, paid: 420 },
    { date: "2024-05-18", order: 315, paid: 350 },
    { date: "2024-05-19", order: 235, paid: 180 },
    { date: "2024-05-20", order: 177, paid: 230 },
    { date: "2024-05-21", order: 82, paid: 140 },
    { date: "2024-05-22", order: 81, paid: 120 },
    { date: "2024-05-23", order: 252, paid: 290 },
    { date: "2024-05-24", order: 294, paid: 220 },
    { date: "2024-05-25", order: 201, paid: 250 },
    { date: "2024-05-26", order: 213, paid: 170 },
    { date: "2024-05-27", order: 420, paid: 460 },
    { date: "2024-05-28", order: 233, paid: 190 },
    { date: "2024-05-29", order: 78, paid: 130 },
    { date: "2024-05-30", order: 340, paid: 280 },
    { date: "2024-05-31", order: 178, paid: 230 },
    { date: "2024-06-01", order: 178, paid: 200 },
    { date: "2024-06-02", order: 470, paid: 410 },
    { date: "2024-06-03", order: 103, paid: 160 },
    { date: "2024-06-04", order: 439, paid: 380 },
    { date: "2024-06-05", order: 88, paid: 140 },
    { date: "2024-06-06", order: 294, paid: 250 },
    { date: "2024-06-07", order: 323, paid: 370 },
    { date: "2024-06-08", order: 385, paid: 320 },
    { date: "2024-06-09", order: 438, paid: 480 },
    { date: "2024-06-10", order: 155, paid: 200 },
    { date: "2024-06-11", order: 92, paid: 150 },
    { date: "2024-06-12", order: 492, paid: 420 },
    { date: "2024-06-13", order: 81, paid: 130 },
    { date: "2024-06-14", order: 426, paid: 380 },
    { date: "2024-06-15", order: 307, paid: 350 },
    { date: "2024-06-16", order: 371, paid: 310 },
    { date: "2024-06-17", order: 475, paid: 520 },
    { date: "2024-06-18", order: 107, paid: 170 },
    { date: "2024-06-19", order: 341, paid: 290 },
    { date: "2024-06-20", order: 408, paid: 450 },
    { date: "2024-06-21", order: 169, paid: 210 },
    { date: "2024-06-22", order: 317, paid: 270 },
    { date: "2024-06-23", order: 480, paid: 530 },
    { date: "2024-06-24", order: 132, paid: 180 },
    { date: "2024-06-25", order: 141, paid: 190 },
    { date: "2024-06-26", order: 434, paid: 380 },
    { date: "2024-06-27", order: 448, paid: 490 },
    { date: "2024-06-28", order: 149, paid: 200 },
    { date: "2024-06-29", order: 103, paid: 160 },
    { date: "2024-06-30", order: 446, paid: 400 },
];

const chartConfig = {
    visitors: {
        label: "Visitors",
    },
    order: {
        label: "অর্ডার",
        color: "var(--chart-1)",
    },
    paid: {
        label: "টাকা পরিশোধ",
        color: "var(--chart-2)",
    },
} satisfies ChartConfig;

export function OrderPaidStats() {
    const [timeRange, setTimeRange] = React.useState("90d");

    const filteredData = chartData.filter((item) => {
        const date = new Date(item.date);
        const referenceDate = new Date("2024-06-30");
        let daysToSubtract = 90;
        if (timeRange === "30d") {
            daysToSubtract = 30;
        } else if (timeRange === "7d") {
            daysToSubtract = 7;
        }
        const startDate = new Date(referenceDate);
        startDate.setDate(startDate.getDate() - daysToSubtract);
        return date >= startDate;
    });

    const getTimeRange = () => {
        if (timeRange === "90d") {
            return "শেষ ৩ মাসের";
        } else if (timeRange === "30d") {
            return "শেষ ৩০ দিনের";
        } else if (timeRange === "7d") {
            return "শেষ ৭ দিনের";
        }
    };

    return (
        <Card>
            <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
                <div className="grid flex-1 gap-1 text-center sm:text-left">
                    <CardTitle className="sub-title">
                        মোট অর্ডার ও টাকা পরিশোধ
                    </CardTitle>
                    <CardDescription>
                        {getTimeRange()} জন্য মোট অর্ডার ও টাকা পরিশোধ দেখাচ্ছে
                    </CardDescription>
                </div>
                <Select value={timeRange} onValueChange={setTimeRange}>
                    <SelectTrigger
                        className="w-[160px] rounded-lg sm:ml-auto"
                        aria-label="Select a value"
                    >
                        <SelectValue placeholder="Last 3 months" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                        <SelectItem value="90d" className="rounded-lg">
                            Last 3 months
                        </SelectItem>
                        <SelectItem value="30d" className="rounded-lg">
                            Last 30 days
                        </SelectItem>
                        <SelectItem value="7d" className="rounded-lg">
                            Last 7 days
                        </SelectItem>
                    </SelectContent>
                </Select>
            </CardHeader>
            <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
                <ChartContainer
                    config={chartConfig}
                    className="aspect-auto h-[250px] w-full"
                >
                    <AreaChart data={filteredData}>
                        <defs>
                            <linearGradient
                                id="fillOrder"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                            >
                                <stop
                                    offset="5%"
                                    stopColor="var(--color-order)"
                                    stopOpacity={0.8}
                                />
                                <stop
                                    offset="95%"
                                    stopColor="var(--color-order)"
                                    stopOpacity={0.1}
                                />
                            </linearGradient>
                            <linearGradient
                                id="fillPaid"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                            >
                                <stop
                                    offset="5%"
                                    stopColor="var(--color-paid)"
                                    stopOpacity={0.8}
                                />
                                <stop
                                    offset="95%"
                                    stopColor="var(--color-paid)"
                                    stopOpacity={0.1}
                                />
                            </linearGradient>
                        </defs>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="date"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            minTickGap={32}
                            tickFormatter={(value) => {
                                const date = new Date(value);
                                return date.toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                });
                            }}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={
                                <ChartTooltipContent
                                    labelFormatter={(value) => {
                                        return new Date(
                                            value
                                        ).toLocaleDateString("en-US", {
                                            month: "short",
                                            day: "numeric",
                                        });
                                    }}
                                    indicator="dot"
                                />
                            }
                        />
                        <Area
                            dataKey="paid"
                            type="natural"
                            fill="url(#fillPaid)"
                            stroke="var(--color-paid)"
                            stackId="a"
                        />
                        <Area
                            dataKey="order"
                            type="natural"
                            fill="url(#fillOrder)"
                            stroke="var(--color-order)"
                            stackId="a"
                        />
                        <ChartLegend content={<ChartLegendContent />} />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
