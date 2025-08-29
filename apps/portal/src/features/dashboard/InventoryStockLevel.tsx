"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@workspace/ui/components/card";
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@workspace/ui/components/chart";

const chartData = [
    { productName: "Shirt", stock: 186, reorderPoint: 80 },
    { productName: "T-Shirt", stock: 100, reorderPoint: 120 },
    { productName: "Pant", stock: 237, reorderPoint: 120 },
    { productName: "Jeans", stock: 73, reorderPoint: 190 },
    { productName: "Shoe", stock: 209, reorderPoint: 130 },
    { productName: "Cap", stock: 214, reorderPoint: 140 },
    { productName: "T-Shirt", stock: 186, reorderPoint: 80 },
    { productName: "Pant", stock: 305, reorderPoint: 200 },
    { productName: "Jeans", stock: 237, reorderPoint: 120 },
    { productName: "Shoe", stock: 73, reorderPoint: 190 },
    { productName: "Cap", stock: 209, reorderPoint: 130 },
    { productName: "Shirt", stock: 214, reorderPoint: 140 },
    { productName: "T-Shirt", stock: 186, reorderPoint: 80 },
    { productName: "Pant", stock: 305, reorderPoint: 200 },
    { productName: "Jeans", stock: 237, reorderPoint: 120 },
    { productName: "Shoe", stock: 73, reorderPoint: 190 },
    { productName: "Cap", stock: 209, reorderPoint: 130 },
    { productName: "Shirt", stock: 214, reorderPoint: 140 },
    { productName: "T-Shirt", stock: 186, reorderPoint: 80 },
    { productName: "Pant", stock: 305, reorderPoint: 200 },
    { productName: "Jeans", stock: 237, reorderPoint: 120 },
    { productName: "Shoe", stock: 73, reorderPoint: 190 },
    { productName: "Soket", stock: 209, reorderPoint: 130 },
    { productName: "Cap", stock: 214, reorderPoint: 140 },
    { productName: "T-Shirt", stock: 186, reorderPoint: 80 },
    { productName: "Pant", stock: 305, reorderPoint: 200 },
    { productName: "Jeans", stock: 237, reorderPoint: 120 },
    { productName: "Shoe", stock: 73, reorderPoint: 190 },
    { productName: "Fans", stock: 209, reorderPoint: 130 },
    { productName: "Cap", stock: 214, reorderPoint: 140 },
    { productName: "T-Shirt", stock: 186, reorderPoint: 80 },
    { productName: "Pant", stock: 305, reorderPoint: 200 },
    { productName: "Jeans", stock: 237, reorderPoint: 120 },
    { productName: "Shoe", stock: 73, reorderPoint: 190 },
    { productName: "Fans", stock: 209, reorderPoint: 130 },
    { productName: "Cap", stock: 214, reorderPoint: 140 },
];

const chartConfig = {
    stock: {
        label: "Stock",
        color: "var(--chart-1)",
    },
    reorderPoint: {
        label: "Reorder Point",
        color: "var(--chart-2)",
    },
} satisfies ChartConfig;

export const InventoryStockLevel = () => {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="sub-title">
                    প্রতিটি পণ্যের স্টক ও পুনরায় পূরণ পরিমাণ
                </CardTitle>
                <CardDescription>জুন 2025</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer
                    config={chartConfig}
                    className="aspect-auto h-[250px] w-full"
                >
                    <BarChart accessibilityLayer data={chartData}>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="productName"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tickFormatter={(value) => value.slice(0, 3)}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent indicator="line" />}
                        />
                        <Bar
                            dataKey="stock"
                            fill="var(--color-stock)"
                            radius={4}
                        />
                        <Bar
                            dataKey="reorderPoint"
                            fill="var(--color-reorderPoint)"
                            radius={4}
                        />
                    </BarChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
                <div className="flex gap-2 leading-none font-medium">
                    Trending up by 5.2% this month{" "}
                    <TrendingUp className="h-4 w-4" />
                </div>
                <div className="text-muted-foreground leading-none">
                    Showing total visitors for the last 6 months
                </div>
            </CardFooter>
        </Card>
    );
};
