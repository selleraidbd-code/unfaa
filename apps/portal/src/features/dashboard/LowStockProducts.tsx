"use client";

import Image from "next/image";

import { FilePenLine } from "lucide-react";

import { Button } from "@workspace/ui/components/button";
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

export const LowStockProducts = () => {
    const data = [
        {
            name: "Laser Lemonade Machine",
            status: "Low Stock",
            price: 499.99,
            qty: 10,
            image: "http://multi-media-server.naimurrhman.com/uploads/img/1745058757272-586511541.jpg",
        },
        {
            name: "AeroGlow Desk Lamp",
            status: "Low Stock",
            price: 39.99,
            qty: 50,
            image: "http://multi-media-server.naimurrhman.com/uploads/img/1745058757272-586511541.jpg",
        },
        {
            name: "TechTonic Energy Drink",
            status: "Low Stock",
            price: 2.99,
            qty: 0,
            image: "http://multi-media-server.naimurrhman.com/uploads/img/1745058757272-586511541.jpg",
        },
        {
            name: "Gamer Gear Pro Controller",
            status: "Low Stock",
            price: 59.99,
            qty: 75,
            image: "http://multi-media-server.naimurrhman.com/uploads/img/1745058757272-586511541.jpg",
        },
        {
            name: "Luminous VR Headset",
            status: "Low Stock",
            price: 199.99,
            qty: 30,
            image: "http://multi-media-server.naimurrhman.com/uploads/img/1745058757272-586511541.jpg",
        },
        {
            name: "Hypernova Headphones",
            status: "Low Stock",
            price: 129.99,
            qty: 100,
            image: "http://multi-media-server.naimurrhman.com/uploads/img/1745058757272-586511541.jpg",
        },
    ];

    return (
        <Card>
            <CardHeader>
                <CardTitle>Low Stock Product Alert</CardTitle>
                <CardDescription>
                    Products that are running low on stock.
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
                                Price
                            </TableHead>
                            <TableHead className="hidden md:table-cell">
                                QTY Left
                            </TableHead>
                            <TableHead className="text-center">
                                Actions
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
                                <TableCell className="hidden md:table-cell">
                                    $ {item.price}
                                </TableCell>
                                <TableCell className="text-center">
                                    {item.qty}
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button variant="outline" size="sm">
                                        <FilePenLine /> Update Stock
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
};
