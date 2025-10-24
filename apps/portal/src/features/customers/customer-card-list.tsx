"use client";

import { Plus, Search } from "lucide-react";
import { Customer } from "@/types/customer-type";
import { CustomerCard } from "./customer-card";
import { CreateCustomerDialog } from "./create-customer-dialog";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { useState } from "react";

interface CustomerCardListProps {
    data: Customer[];
    isLoading: boolean;
    isError: boolean;
    onEdit: (customer: Customer) => void;
    onDelete: (id: string) => void;
    onSearch: (value: string) => void;
}

export const CustomerCardList = ({
    data,
    isLoading,
    isError,
    onEdit,
    onDelete,
    onSearch,
}: CustomerCardListProps) => {
    const [searchValue, setSearchValue] = useState("");

    const handleSearchChange = (value: string) => {
        setSearchValue(value);
        onSearch(value);
    };

    if (isLoading) {
        return (
            <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                    <h2 className="text-xl font-semibold">Customers</h2>
                </div>
                <div className="grid gap-3">
                    {[...Array(6)].map((_, i) => (
                        <div
                            key={i}
                            className="bg-muted/50 rounded-lg h-32 animate-pulse"
                        />
                    ))}
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                    <h2 className="text-xl font-semibold">Customers</h2>
                </div>
                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-8 text-center">
                    <p className="text-destructive font-medium">
                        Failed to load customers
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                        Please try again later
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4 pb-20">
            {/* Header */}
            <div className="flex items-center justify-between gap-2 sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-2 z-10">
                <h2 className="text-xl font-semibold">Customers</h2>
                <CreateCustomerDialog />
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search customers..."
                    value={searchValue}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="pl-9"
                />
            </div>

            {/* Cards Grid */}
            {data.length === 0 ? (
                <div className="bg-muted/30 rounded-lg p-12 text-center">
                    <p className="text-muted-foreground font-medium">
                        No customers found
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                        Get started by creating a new customer
                    </p>
                </div>
            ) : (
                <div className="grid gap-3">
                    {data.map((customer) => (
                        <CustomerCard
                            key={customer.id}
                            customer={customer}
                            onEdit={onEdit}
                            onDelete={onDelete}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};
