"use client";

import { useState } from "react";

import {
    CustomerCardSkeleton,
    CustomerSelectionCard,
    SelectedCustomerCard,
} from "@/features/create-order/customer-card";
import { useGetCustomersQuery } from "@/redux/api/customer-api";
import { useAppSelector } from "@/redux/store/hook";
import { CustomSearch } from "@workspace/ui/components/custom/custom-search";
import {
    Dialog,
    DialogContainer,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@workspace/ui/components/dialog";
import { User } from "lucide-react";

import { Customer } from "@/types/customer-type";
import { CustomPagination, PaginationMeta } from "@/components/ui/custom-pagination";
import { DataStateHandler } from "@/components/shared/data-state-handler";

interface CustomerSelectionModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSelectCustomer: (customer: Customer) => void;
    currentCustomerPhone?: string;
}

export const CustomerSelectionModal = ({
    open,
    onOpenChange,
    onSelectCustomer,
    currentCustomerPhone,
}: CustomerSelectionModalProps) => {
    const user = useAppSelector((state) => state.auth.user);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const { data, isLoading, isError } = useGetCustomersQuery({
        page: currentPage,
        limit: 20,
        shopId: user?.shop?.id,
        searchTerm: searchTerm || undefined,
    });

    const handleSearch = (value: string) => {
        setSearchTerm(value);
        setCurrentPage(1);
    };

    const handleSelectCustomer = (customer: Customer) => {
        onSelectCustomer(customer);
        onOpenChange(false);
    };

    const customers = data?.data || [];
    const paginationMeta: PaginationMeta = {
        page: currentPage,
        limit: 20,
        total: data?.meta?.total || 0,
    };

    const selectedCustomer = customers.find((customer) => customer.phoneNumber === currentCustomerPhone);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="flex flex-col md:max-w-4xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <User className="h-5 w-5" />
                        Select Customer
                    </DialogTitle>
                    <DialogDescription>
                        Choose a customer from your existing customers or search for a specific one.
                    </DialogDescription>
                </DialogHeader>

                <DialogContainer className="space-y-4">
                    {/* Search */}
                    <CustomSearch
                        onSearch={handleSearch}
                        placeholder="Search customers by name, phone, or email..."
                        className="md:w-full"
                    />

                    <DataStateHandler
                        data={customers}
                        isLoading={isLoading}
                        loadingComponent={
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                {Array.from({ length: 6 }).map((_, index) => (
                                    <CustomerCardSkeleton key={index} />
                                ))}
                            </div>
                        }
                        isError={isError}
                        isEmpty={customers.length === 0}
                        emptyDescription={searchTerm ? "No customers found matching your search" : "No customers found"}
                    >
                        {(customers) => (
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                {selectedCustomer && (
                                    <SelectedCustomerCard customer={selectedCustomer} className="col-span-2" />
                                )}

                                {customers.map((customer) => (
                                    <CustomerSelectionCard
                                        key={customer.id}
                                        customer={customer}
                                        onSelectCustomer={handleSelectCustomer}
                                        currentCustomerPhone={currentCustomerPhone}
                                    />
                                ))}
                            </div>
                        )}
                    </DataStateHandler>
                </DialogContainer>

                <DialogFooter>
                    {/* Pagination */}
                    {customers.length > 0 && (
                        <CustomPagination
                            paginationMeta={paginationMeta}
                            showRowSelection={false}
                            showRowsPerPage={false}
                            showPageCount={false}
                            onPageChange={setCurrentPage}
                            className="w-full justify-center"
                        />
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
