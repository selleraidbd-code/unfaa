"use client";

import { PaginationState } from "@tanstack/react-table";
import { useState } from "react";
import { toast } from "@workspace/ui/components/sonner";
import { useBreakpoint } from "@workspace/ui/hooks/use-breakpoint";
import { UpdateCustomerDialog } from "@/features/customers/update-customer-dialog";
import { CustomerTableView } from "@/features/customers/customer-table-view";
import { CustomerCardList } from "@/features/customers/customer-card-list";
import {
    useDeleteCustomerMutation,
    useGetCustomersQuery,
} from "@/redux/api/customer-api";
import { Customer } from "@/types/customer-type";
import useGetUser from "@/hooks/useGetUser";
import { useAlert } from "@/hooks/useAlert";
import { useSearchParams } from "next/navigation";

const CustomersPage = () => {
    const searchParams = useSearchParams();
    const page = searchParams.get("page") || 1;
    const limit = searchParams.get("limit") || 10;
    const user = useGetUser();
    const { fire } = useAlert();
    const isMobile = useBreakpoint({ size: "lg" });

    const [searchTerm, setSearchTerm] = useState<string>("");
    const [customer, setCustomer] = useState<Customer | null>(null);

    const { data, isLoading, isError } = useGetCustomersQuery({
        page: Number(page),
        limit: Number(limit),
        shopId: user?.shop?.id,
        searchTerm: searchTerm || undefined,
    });

    const [deleteCustomer] = useDeleteCustomerMutation();

    const handleSearch = (value: string) => {
        setSearchTerm(value);
    };

    const handlePaginationChange = (state: PaginationState) => {
        console.log(state);
    };

    const handleDelete = async (id: string) => {
        fire({
            title: "Delete Customer",
            description:
                "Are you sure you want to delete this customer? This action cannot be undone.",
            onConfirm: async () => {
                await deleteCustomer({ id })
                    .unwrap()
                    .then(() => {
                        toast.success("🎉 Customer deleted successfully");
                    })
                    .catch((error) => {
                        toast.error(
                            error.data.message || "Something went wrong"
                        );
                    });
            },
        });
    };

    const handleEdit = (customer: Customer) => {
        setCustomer(customer);
    };

    const paginationMeta = {
        page: Number(page),
        limit: Number(limit),
        total: data?.meta?.total || 0,
    };

    return (
        <>
            {!isMobile ? (
                <CustomerTableView
                    data={data?.data || []}
                    isLoading={isLoading}
                    isError={isError}
                    paginationMeta={paginationMeta}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onSearch={handleSearch}
                    onPaginationChange={handlePaginationChange}
                />
            ) : (
                <CustomerCardList
                    data={data?.data || []}
                    isLoading={isLoading}
                    isError={isError}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onSearch={handleSearch}
                />
            )}

            {customer && (
                <UpdateCustomerDialog
                    open={!!customer}
                    setOpen={() => setCustomer(null)}
                    customer={customer}
                />
            )}
        </>
    );
};

export default CustomersPage;
