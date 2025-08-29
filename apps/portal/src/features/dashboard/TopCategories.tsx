"use client";

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

const data = [
    { name: "Electronics", value: 1200000, color: "var(--chart-1)" },
    { name: "Fashion", value: 950000, color: "var(--chart-2)" },
    { name: "Home & Kitchen", value: 750000, color: "var(--chart-3)" },
    { name: "Beauty & Personal Care", value: 500000, color: "var(--chart-4)" },
];

// Calculate total sales
const totalSales = data.reduce((sum, item) => sum + item.value, 0);

const chartConfig = {
    desktop: {
        label: "Desktop",
        color: "var(--chart-1)",
    },
    mobile: {
        label: "Mobile",
        color: "var(--chart-2)",
    },
} satisfies ChartConfig;

export const TopCategories = () => {
    return (
        <Card className="bg-secondary row-span-3">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle>Top Categories</CardTitle>
                <Button variant="ghost">See All</Button>
            </CardHeader>
            <CardContent>
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto h-[220px] w-[220px]"
                >
                    <PieChart>
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={70}
                            outerRadius={90}
                            paddingAngle={2}
                            dataKey="value"
                            startAngle={90}
                            endAngle={-270}
                            strokeWidth={0}
                        >
                            {data.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={entry.color}
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
                                                    y={viewBox.cy}
                                                    className="fill-foreground text-2xl font-semibold"
                                                >
                                                    $
                                                    {totalSales.toLocaleString()}
                                                </tspan>
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={(viewBox.cy || 0) + 24}
                                                    className="fill-muted-foreground"
                                                >
                                                    Total Sales
                                                </tspan>
                                            </text>
                                        );
                                    }
                                }}
                            />
                        </Pie>
                    </PieChart>
                </ChartContainer>

                <div className="mt-6 space-y-3">
                    {data.map((category, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-between"
                        >
                            <div className="flex items-center">
                                <div
                                    className="mr-2 h-3 w-3 rounded-sm"
                                    style={{ backgroundColor: category.color }}
                                ></div>
                                <span className="text-gray-500">
                                    {category.name}
                                </span>
                            </div>
                            <span className="font-medium">
                                ${category.value.toLocaleString()}
                            </span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};
