"use client";

import { useState } from "react";

import { Check, MoreHorizontal } from "lucide-react";
import { Cell, Label, Pie, PieChart } from "recharts";

import { Button } from "@workspace/ui/components/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@workspace/ui/components/card";
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@workspace/ui/components/chart";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";

// Sample data for different months
const monthlyData = {
    January: { target: 500000, revenue: 425000, increase: 7.5 },
    February: { target: 520000, revenue: 468000, increase: 8.5 },
    March: { target: 550000, revenue: 495000, increase: 7.8 },
    April: { target: 580000, revenue: 504600, increase: 6.9 },
    May: { target: 590000, revenue: 507400, increase: 7.2 },
    June: { target: 600000, revenue: 510000, increase: 8.02 },
    July: { target: 620000, revenue: 0, increase: 0 },
    August: { target: 640000, revenue: 0, increase: 0 },
    September: { target: 660000, revenue: 0, increase: 0 },
    October: { target: 680000, revenue: 0, increase: 0 },
    November: { target: 700000, revenue: 0, increase: 0 },
    December: { target: 720000, revenue: 0, increase: 0 },
};

export const MonthlyTargetGauge = () => {
    const [selectedMonth, setSelectedMonth] = useState("June");
    const {
        target: targetAmount,
        revenue: currentAmount,
        increase: percentageIncrease,
    } = monthlyData[selectedMonth as keyof typeof monthlyData];

    // Calculate percentage
    const percentage = Math.round((currentAmount / targetAmount) * 100) || 0;
    const increasedAmount = Math.round(
        currentAmount - currentAmount / (1 + percentageIncrease / 100)
    );

    // Data for the semi-circle gauge
    const data = [
        { name: "Completed", value: percentage },
        { name: "Remaining", value: 100 - percentage },
    ];

    // Custom colors
    const COLORS = [
        "var(--primary)",
        "color-mix(in srgb, var(--primary) 15%, transparent)",
    ];

    const chartConfig = {
        completed: {
            label: "Completed",
            color: "var(--primary)",
        },
        remaining: {
            label: "Remaining",
            color: "var(--secondary)",
        },
    } satisfies ChartConfig;

    return (
        <Card className="bg-secondary row-span-2 mx-auto w-full max-w-md">
            <CardHeader className="flex flex-row items-center justify-between pb-0">
                <CardTitle className="sub-title">Monthly Target</CardTitle>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuLabel>Select Month</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {Object.keys(monthlyData).map((month) => (
                            <DropdownMenuItem
                                key={month}
                                onClick={() => setSelectedMonth(month)}
                                className="flex items-center justify-between"
                            >
                                {month}
                                {selectedMonth === month && (
                                    <Check className="ml-2 h-4 w-4" />
                                )}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col items-center">
                    <ChartContainer
                        config={chartConfig}
                        className="max-h-[115px] w-full"
                    >
                        <PieChart>
                            <ChartTooltip
                                cursor={false}
                                content={<ChartTooltipContent hideLabel />}
                            />
                            <Pie
                                data={data}
                                cx="50%"
                                cy="100%"
                                startAngle={180}
                                endAngle={0}
                                innerRadius={80}
                                outerRadius={110}
                                paddingAngle={0}
                                dataKey="value"
                                strokeWidth={0}
                            >
                                {data.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={COLORS[index % COLORS.length]}
                                    />
                                ))}
                                <Label
                                    content={({ viewBox }) => {
                                        if (
                                            viewBox &&
                                            "cx" in viewBox &&
                                            "cy" in viewBox
                                        ) {
                                            return (
                                                <text
                                                    x={viewBox.cx}
                                                    y={viewBox.cy}
                                                    textAnchor="middle"
                                                    dominantBaseline="middle"
                                                >
                                                    <tspan
                                                        x={viewBox.cx}
                                                        y={
                                                            (viewBox.cy || 0) -
                                                            40
                                                        }
                                                        className="fill-foreground text-3xl font-bold"
                                                    >
                                                        {percentage}%
                                                    </tspan>
                                                    <tspan
                                                        x={viewBox.cx}
                                                        y={
                                                            (viewBox.cy || 0) -
                                                            12
                                                        }
                                                        className="fill-accent-foreground"
                                                    >
                                                        <tspan className="fill-green-500">
                                                            +
                                                            {percentageIncrease}
                                                            %
                                                        </tspan>{" "}
                                                        from last month
                                                    </tspan>
                                                </text>
                                            );
                                        }
                                    }}
                                />
                            </Pie>
                        </PieChart>
                    </ChartContainer>

                    <div className="mt-2.5 text-center">
                        {percentage > 0 ? (
                            <>
                                <div className="flex items-center justify-center gap-1 font-semibold">
                                    Great Progress!{" "}
                                    <span className="text-xl">🎉</span>
                                </div>
                                <p className="text-accent-foreground mt-0.5 text-xs">
                                    Our achievement increased by{" "}
                                    <span className="text-primary font-semibold">
                                        ${increasedAmount.toLocaleString()}
                                    </span>
                                    ;
                                    <br />
                                    let&apos;s reach 100% next month.
                                </p>
                            </>
                        ) : (
                            <p className="text-accent-foreground mt-1 text-sm">
                                No data available for {selectedMonth} yet.
                            </p>
                        )}
                    </div>

                    <div className="bg-primary/15 mt-2.5 grid w-full grid-cols-2 gap-2 divide-x divide-white rounded-lg px-4 py-2.5">
                        <div className="text-center">
                            <div className="text-accent-foreground text-sm">
                                Target
                            </div>
                            <div className="text-lg font-semibold">
                                ${targetAmount.toLocaleString()}
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="text-accent-foreground text-sm">
                                Revenue
                            </div>
                            <div className="text-lg font-semibold">
                                ${currentAmount.toLocaleString()}
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
