"use client";

import Image from "next/image";

import { MoreHorizontal } from "lucide-react";

import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@workspace/ui/components/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@workspace/ui/components/table";

export const TopSellingProducts = () => {
    const data = [
        {
            name: "Laser Lemonade Machine",
            status: "Active",
            price: 499.99,
            totalSales: 25,
            createdAt: "2023-07-12",
            image: "http://multi-media-server.naimurrhman.com/uploads/img/1745058757272-586511541.jpg",
        },
        {
            name: "Hypernova Headphones",
            status: "Active",
            price: 129.99,
            totalSales: 100,
            createdAt: "2023-10-18",
            image: "http://multi-media-server.naimurrhman.com/uploads/img/1745058757272-586511541.jpg",
        },
        {
            name: "AeroGlow Desk Lamp",
            status: "Active",
            price: 39.99,
            totalSales: 50,
            createdAt: "2023-11-29",
            image: "http://multi-media-server.naimurrhman.com/uploads/img/1745058757272-586511541.jpg",
        },
        {
            name: "TechTonic Energy Drink",
            status: "Draft",
            price: 2.99,
            totalSales: 0,
            createdAt: "2023-12-25",
            image: "http://multi-media-server.naimurrhman.com/uploads/img/1745058757272-586511541.jpg",
        },
        {
            name: "Gamer Gear Pro Controller",
            status: "Active",
            price: 59.99,
            totalSales: 75,
            createdAt: "2024-01-01",
            image: "http://multi-media-server.naimurrhman.com/uploads/img/1745058757272-586511541.jpg",
        },
        {
            name: "Luminous VR Headset",
            status: "Active",
            price: 199.99,
            totalSales: 30,
            createdAt: "2024-02-14",
            image: "http://multi-media-server.naimurrhman.com/uploads/img/1745058757272-586511541.jpg",
        },
    ];

    return (
        <Card>
            <CardHeader>
                <CardTitle>Top Selling Products</CardTitle>
                <CardDescription>
                    Manage your products and view their sales performance.
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
                            <TableHead>Status</TableHead>
                            <TableHead className="hidden md:table-cell">
                                Price
                            </TableHead>
                            <TableHead className="hidden md:table-cell">
                                Total Sales
                            </TableHead>
                            <TableHead className="hidden md:table-cell">
                                Created at
                            </TableHead>
                            <TableHead>
                                <span className="sr-only">Actions</span>
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.map((item, index) => (
                            <TableRow key={index + item.name}>
                                <TableCell className="hidden sm:table-cell">
                                    <Image
                                        alt="Product image"
                                        className="aspect-square rounded-md object-cover"
                                        height="64"
                                        src={item.image}
                                        width="64"
                                    />
                                </TableCell>
                                <TableCell className="font-medium">
                                    {item.name}
                                </TableCell>
                                <TableCell>
                                    <Badge variant="outline">
                                        {item.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="hidden md:table-cell">
                                    ${item.price}
                                </TableCell>
                                <TableCell className="hidden md:table-cell">
                                    {item.totalSales}
                                </TableCell>
                                <TableCell className="hidden md:table-cell">
                                    {item.createdAt}
                                </TableCell>
                                <TableCell>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                aria-haspopup="true"
                                                size="icon"
                                                variant="ghost"
                                            >
                                                <MoreHorizontal className="h-4 w-4" />
                                                <span className="sr-only">
                                                    Toggle menu
                                                </span>
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuLabel>
                                                Actions
                                            </DropdownMenuLabel>
                                            <DropdownMenuItem>
                                                Edit
                                            </DropdownMenuItem>
                                            <DropdownMenuItem>
                                                Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
};
