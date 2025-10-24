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

const CustomersPage = () => {
    const user = useGetUser();
    const { fire } = useAlert();
    const isMobile = useBreakpoint({ size: "lg" });
    const [customer, setCustomer] = useState<Customer | null>(null);

    const { data, isLoading, isError } = useGetCustomersQuery({
        page: 1,
        limit: 10,
        shopId: user?.shop?.id,
    });

    const [deleteCustomer] = useDeleteCustomerMutation();

    const handleSearch = (value: string) => {
        console.log(value);
    };

    const handlePaginationChange = (state: PaginationState) => {
        console.log(state);
    };

    const handleBulkDelete = () => {
        console.log("Bulk delete");
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

    return (
        <>
            {!isMobile ? (
                <CustomerTableView
                    data={data?.data || []}
                    isLoading={isLoading}
                    isError={isError}
                    paginationMeta={data?.meta}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onSearch={handleSearch}
                    onPaginationChange={handlePaginationChange}
                    onBulkDelete={handleBulkDelete}
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
