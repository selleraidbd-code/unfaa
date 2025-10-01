"use client";

import { ColumnDef, PaginationState } from "@tanstack/react-table";
import { Trash } from "lucide-react";

import { UpdateCustomerDialog } from "@/features/customers/update-customer-dialog";
import { CreateCustomerDialog } from "@/features/customers/create-customer-dialog";
import { getEmployeeRoleOptions } from "@/features/employee/employee-role-options";
import {
    useDeleteCustomerMutation,
    useGetCustomersQuery,
} from "@/redux/api/customer-api";
import { Customer } from "@/types/customer-type";
import { DataTable } from "@/components/table/data-table";
import { DataTableColumnHeader } from "@/components/table/data-table-column-header";
import { DataTableFieldCopy } from "@/components/table/data-table-field-copy";
import { DataTableRowActions } from "@/components/table/data-table-row-actions";
import { Checkbox } from "@workspace/ui/components/checkbox";
import { formatDate } from "@workspace/ui/lib/formateDate";
import { useState } from "react";
import { toast } from "@workspace/ui/components/sonner";
import useGetUser from "@/hooks/useGetUser";

const CustomersPage = () => {
    const user = useGetUser();
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
        await deleteCustomer({ id })
            .unwrap()
            .then(() => {
                toast.success("🎉 Customer deleted successfully");
            })
            .catch((error) => {
                toast.error(error.data.message || "Something went wrong");
            });
    };

    const handleEdit = (customer: Customer) => {
        setCustomer(customer);
    };

    const customersColumns: ColumnDef<Customer>[] = [
        {
            id: "select",
            header: ({ table }) => (
                <Checkbox
                    checked={
                        table.getIsAllPageRowsSelected() ||
                        (table.getIsSomePageRowsSelected() && "indeterminate")
                    }
                    onCheckedChange={(value) =>
                        table.toggleAllPageRowsSelected(!!value)
                    }
                    aria-label="Select all"
                    className="translate-y-[2px]"
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                    className="translate-y-[2px]"
                />
            ),
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: "id",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="ID" />
            ),
            cell: ({ row }) => <p>{row.getValue("id")}</p>,
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: "name",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Name" />
            ),
            cell: ({ row }) => <DataTableFieldCopy row={row} field="name" />,
        },
        {
            accessorKey: "email",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Email" />
            ),
            cell: ({ row }) => {
                return (
                    <span className="truncate font-medium">
                        {row.getValue("email")}
                    </span>
                );
            },
        },

        {
            accessorKey: "role",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Role" />
            ),
            cell: ({ row }) => (
                <span className="truncate font-medium">
                    {row.getValue("role")}
                </span>
            ),
        },
        {
            accessorKey: "createdAt",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Created At" />
            ),
            cell: ({ row }) => {
                return (
                    <span className="truncate font-medium">
                        {formatDate(row.getValue("createdAt"))}
                    </span>
                );
            },
        },
        {
            id: "actions",
            cell: ({ row }) => (
                <DataTableRowActions
                    row={row}
                    actions={[
                        {
                            label: "Edit",
                            onClick: () => handleEdit(row.original),
                        },
                        {
                            label: "Delete",
                            onClick: () => handleDelete(row.original.id),
                        },
                    ]}
                />
            ),
        },
    ];

    // Get employee role options for filter dropdown
    const employeeRoleOptions = getEmployeeRoleOptions();
    const roles = [
        {
            value: "",
            label: "All",
        },
        ...employeeRoleOptions,
    ];

    return (
        <>
            <DataTable
                title="Customers"
                data={data?.data || []}
                columns={customersColumns}
                showViewOptions={true}
                filterableColumns={[
                    {
                        id: "role",
                        title: "Role",
                        options: roles,
                    },
                ]}
                onSearch={handleSearch}
                pagination={true}
                paginationMeta={data?.meta}
                onPaginationChange={handlePaginationChange}
                createButton={<CreateCustomerDialog />}
                bulkActions={[
                    {
                        label: "Delete Selected",
                        onClick: handleBulkDelete,
                        variant: "destructive",
                        icon: Trash,
                    },
                ]}
                isLoading={isLoading}
                isError={isError}
            />

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
