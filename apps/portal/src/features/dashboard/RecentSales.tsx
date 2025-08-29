"use client";

import { ArrowUpRight } from "lucide-react";

import { CustomButton } from "@/components/ui/custom-button";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@workspace/ui/components/avatar";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@workspace/ui/components/card";
import { cn } from "@workspace/ui/lib/utils";

export const RecentSales = () => {
    const data = [
        {
            name: "Olivia Martin",
            email: "olivia.martin@email.com",
            amount: "1,999.00",
        },
        {
            name: "Jackson Lee",
            email: "jackson.lee@email.com",
            amount: "1,999.00",
        },
        {
            name: "Isabella Nguyen",
            email: "isabella.nguyen@email.com",
            amount: "1,999.00",
        },
        {
            name: "William Kim",
            email: "william.kim@email.com",
            amount: "1,999.00",
        },
        {
            name: "Sofia Davis",
            email: "sofia.davis@email.com",
            amount: "1,999.00",
        },
    ];

    return (
        <Card className="col-span-5">
            <CardHeader className="flex flex-row items-center justify-between">
                <div className="grid gap-2">
                    <CardTitle>Recent Sales</CardTitle>
                    <CardDescription>
                        Recent sales from your store.
                    </CardDescription>
                </div>
                <CustomButton href="/orders" size="sm">
                    View All
                    <ArrowUpRight />
                </CustomButton>
            </CardHeader>
            <CardContent className="px-0">
                {data.map((item, index) => (
                    <div
                        className={cn(
                            "flex items-center justify-between gap-4 px-6 py-2.5",
                            index % 2 === 0 && "bg-accent"
                        )}
                        key={index + item.name}
                    >
                        <div className="flex items-center gap-4">
                            <Avatar className="hidden h-9 w-9 sm:flex">
                                <AvatarImage
                                    src="/avatars/01.png"
                                    alt="Avatar"
                                />
                                <AvatarFallback>
                                    {item.name.slice(0, 2)}
                                </AvatarFallback>
                            </Avatar>
                            <div className="grid gap-1">
                                <p className="text-sm leading-none font-medium">
                                    {item.name}
                                </p>
                                <p className="text-muted-foreground text-sm">
                                    {item.email}
                                </p>
                            </div>
                        </div>
                        <div className="font-medium">+$ {item.amount}</div>

                        <CustomButton variant="outline" size="sm">
                            View Details
                        </CustomButton>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
};
