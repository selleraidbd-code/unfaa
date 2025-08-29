"use client";

import { useState } from "react";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

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
    ChartTooltip,
    ChartTooltipContent,
} from "@workspace/ui/components/chart";
import { CustomSearchSelect } from "@workspace/ui/components/custom/custom-search-select";

const yearlyData = [
    { month: "January", sales: 185 },
    { month: "February", sales: 312 },
    { month: "March", sales: 243 },
    { month: "April", sales: 198 },
    { month: "May", sales: 356 },
    { month: "June", sales: 279 },
    { month: "July", sales: 167 },
    { month: "August", sales: 221 },
    { month: "September", sales: 309 },
    { month: "October", sales: 194 },
    { month: "November", sales: 376 },
    { month: "December", sales: 289 },
];

const monthlyData = [
    { date: "1", sales: 185 },
    { date: "2", sales: 312 },
    { date: "3", sales: 243 },
    { date: "4", sales: 198 },
    { date: "5", sales: 356 },
    { date: "6", sales: 279 },
    { date: "7", sales: 167 },
    { date: "8", sales: 221 },
    { date: "9", sales: 309 },
    { date: "10", sales: 194 },
    { date: "11", sales: 376 },
    { date: "12", sales: 289 },
    { date: "13", sales: 185 },
    { date: "14", sales: 312 },
    { date: "15", sales: 243 },
    { date: "16", sales: 198 },
    { date: "17", sales: 356 },
    { date: "18", sales: 279 },
    { date: "19", sales: 167 },
    { date: "20", sales: 221 },
    { date: "21", sales: 309 },
    { date: "22", sales: 194 },
    { date: "23", sales: 376 },
    { date: "24", sales: 289 },
    { date: "25", sales: 185 },
    { date: "26", sales: 312 },
    { date: "27", sales: 243 },
    { date: "28", sales: 198 },
    { date: "29", sales: 356 },
    { date: "30", sales: 279 },
];

const weeklyData = [
    { day: "Sun", sales: 185 },
    { day: "Mon", sales: 312 },
    { day: "Tue", sales: 243 },
    { day: "Wed", sales: 198 },
    { day: "Thu", sales: 356 },
    { day: "Fri", sales: 279 },
    { day: "Sat", sales: 167 },
];

const chartConfig = {
    sales: {
        label: "Sales",
        color: "var(--chart-1)",
    },
} satisfies ChartConfig;

const selectOptions = [
    { value: "week", label: "Last Week" },
    { value: "month", label: "Last Month" },
    { value: "year", label: "Last Year" },
];

export const SaleAndPaidStats = () => {
    const [selected, setSelected] = useState("year");

    const getData = () => {
        switch (selected) {
            case "week":
                return { data: weeklyData, key: "day" };
            case "month":
                return { data: monthlyData, key: "date" };
            case "year":
                return { data: yearlyData, key: "month" };
            default:
                return { data: [], key: "" };
        }
    };

    const { data, key } = getData();

    return (
        <Card className="bg-secondary col-span-2 row-span-2">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="sub-title">
                            Review Analysis
                        </CardTitle>
                        <CardDescription className="hidden">
                            January - June 2024
                        </CardDescription>
                    </div>

                    <div className="w-[200px]">
                        <CustomSearchSelect
                            value={selected}
                            onChange={setSelected}
                            options={selectOptions}
                            showSearch={false}
                        />
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <ChartContainer
                    config={chartConfig}
                    className="max-h-[240px] w-full"
                >
                    <BarChart accessibilityLayer data={data}>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey={key}
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tickFormatter={(value) => value.slice(0, 3)}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent />}
                        />
                        <Bar dataKey="sales" fill="var(--chart-1)" radius={6} />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
};
