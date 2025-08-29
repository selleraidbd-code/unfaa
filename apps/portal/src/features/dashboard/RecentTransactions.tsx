"use client";

import { ArrowUpRight } from "lucide-react";

import { CustomButton } from "@/components/ui/custom-button";
import { Badge } from "@workspace/ui/components/badge";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@workspace/ui/components/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@workspace/ui/components/table";

export const RecentTransactions = () => {
    const data = [
        {
            name: "Liam Johnson",
            email: "liam@example.com",
            amount: "250.00",
            debt: "50.00",
        },
        {
            name: "Emma Brown",
            email: "emma@example.com",
            amount: "250.00",
            debt: "50.00",
        },
        {
            name: "Noah Williams",
            email: "noah@example.com",
            amount: "250.00",
            debt: "50.00",
        },
        {
            name: "Olivia Smith",
            email: "olivia@example.com",
            amount: "250.00",
            debt: "50.00",
        },
        {
            name: "Liam Johnson",
            email: "liam@example.com",
            amount: "250.00",
            debt: "50.00",
        },
    ];

    return (
        <Card className="col-span-7">
            <CardHeader className="flex flex-row items-center justify-between">
                <div className="grid gap-2">
                    <CardTitle>Transactions</CardTitle>
                    <CardDescription>
                        Recent transactions from your store.
                    </CardDescription>
                </div>
                <CustomButton href="/transactions" size="sm">
                    View All
                    <ArrowUpRight />
                </CustomButton>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader className="bg-accent">
                        <TableRow>
                            <TableHead>Customer</TableHead>
                            <TableHead className="hidden xl:table-column">
                                Type
                            </TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead className="text-right">
                                Debt Amount
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.map((item, index) => (
                            <TableRow key={index + item.name}>
                                <TableCell>
                                    <div className="font-medium">
                                        {item.name}
                                    </div>
                                    <div className="text-muted-foreground hidden text-sm md:inline">
                                        {item.email}
                                    </div>
                                </TableCell>
                                <TableCell className="hidden xl:table-column">
                                    Order
                                </TableCell>
                                <TableCell className="hidden xl:table-column">
                                    <Badge
                                        className="text-xs"
                                        variant="outline"
                                    >
                                        Approved
                                    </Badge>
                                </TableCell>
                                <TableCell>2023-06-23</TableCell>
                                <TableCell>$ {item.amount}</TableCell>
                                <TableCell className="text-right">
                                    $ {item.debt}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
};
