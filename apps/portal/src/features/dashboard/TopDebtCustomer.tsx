"use client";

import Image from "next/image";

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

export const TopDebtCustomer = () => {
    const data = [
        {
            name: "John Doe",
            email: "john.doe@example.com",
            totalPaid: 2575,
            totalTransactions: 25,
            createdAt: "2023-07-12",
            image: "http://multi-media-server.naimurrhman.com/uploads/img/1745062787925-672674933.jpg",
        },
        {
            name: "Daniyal",
            email: "daniyal@example.com",
            totalPaid: 1500,
            totalTransactions: 10,
            createdAt: "2023-07-12",
            image: "http://multi-media-server.naimurrhman.com/uploads/img/1745062787925-672674933.jpg",
        },
        {
            name: "Ali",
            email: "ali@example.com",
            totalPaid: 1000,
            totalTransactions: 5,
            createdAt: "2023-07-12",
            image: "http://multi-media-server.naimurrhman.com/uploads/img/1745062787925-672674933.jpg",
        },
        {
            name: "Ahmad",
            email: "ahmad@example.com",
            totalPaid: 1000,
            totalTransactions: 5,
            createdAt: "2023-07-12",
            image: "http://multi-media-server.naimurrhman.com/uploads/img/1745062787925-672674933.jpg",
        },
    ];

    return (
        <Card>
            <CardHeader>
                <CardTitle>Top Debt Customer</CardTitle>
                <CardDescription>
                    Manage your customers and view their debt.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader className="bg-accent">
                        <TableRow>
                            <TableHead className="hidden w-[100px] sm:table-cell">
                                <span className="sr-only">Image</span>
                            </TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead className="hidden md:table-cell">
                                Total Debt
                            </TableHead>
                            <TableHead className="hidden md:table-cell">
                                Transactions
                            </TableHead>
                            <TableHead className="hidden md:table-cell">
                                Last Payment
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.map((item, index) => (
                            <TableRow key={index + item.name}>
                                <TableCell className="hidden sm:table-cell">
                                    <Image
                                        alt="Product image"
                                        className="aspect-square rounded-full object-cover"
                                        height="48"
                                        src={item.image}
                                        width="48"
                                    />
                                </TableCell>
                                <TableCell className="grid gap-0.5 font-medium">
                                    <p>{item.name}</p>
                                    <p className="text-muted-foreground text-sm">
                                        {item.email}
                                    </p>
                                </TableCell>
                                <TableCell className="hidden md:table-cell">
                                    $ {item.totalPaid}
                                </TableCell>
                                <TableCell className="hidden text-center md:table-cell">
                                    {item.totalTransactions}
                                </TableCell>
                                <TableCell className="hidden md:table-cell">
                                    {item.createdAt}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
};
