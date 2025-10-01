"use client";

import {
    useDeleteEmployeeMutation,
    useGetEmployeesQuery,
} from "@/redux/api/employee-api";
import { ColumnDef, PaginationState } from "@tanstack/react-table";
import { Trash } from "lucide-react";

import { CreateEmployeeDialog } from "@/features/employee/create-employee-dialog";
import { getEmployeeRoleOptions } from "@/features/employee/employee-role-options";
import { UpdateEmployeeDialog } from "@/features/employee/update-employee-dialog";
import { Employee } from "@/types/employee-type";
import { DataTable } from "@/components/table/data-table";
import { DataTableColumnHeader } from "@/components/table/data-table-column-header";
import { DataTableRowActions } from "@/components/table/data-table-row-actions";
import { Checkbox } from "@workspace/ui/components/checkbox";
import { formatDate } from "@workspace/ui/lib/formateDate";
import { useState } from "react";
import { toast } from "@workspace/ui/components/sonner";
import useGetUser from "@/hooks/useGetUser";

const EmployeesPage = () => {
    const user = useGetUser();

    const [employee, setEmployee] = useState<Employee | null>(null);

    const { data, isLoading, isError } = useGetEmployeesQuery({
        page: 1,
        limit: 10,
        shopId: user?.shop?.id,
    });

    const [deleteEmployee] = useDeleteEmployeeMutation();

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
        await deleteEmployee(id)
            .unwrap()
            .then(() => {
                toast.success("🎉 Employee deleted successfully");
            })
            .catch((error) => {
                toast.error(error.data.message || "Something went wrong");
            });
    };

    const handleEdit = (employee: Employee) => {
        setEmployee(employee);
    };

    const employeesColumns: ColumnDef<Employee>[] = [
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
            accessorKey: "user.name",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Name" />
            ),
            cell: ({ row }) => {
                return (
                    <span className="truncate font-medium">
                        {row.original.user.name}
                    </span>
                );
            },
        },
        {
            accessorKey: "user.email",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Email" />
            ),
            cell: ({ row }) => {
                return (
                    <span className="truncate font-medium">
                        {row.original.user.email}
                    </span>
                );
            },
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
                title="Employees"
                data={data?.data || []}
                columns={employeesColumns}
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
                createButton={<CreateEmployeeDialog />}
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

            {employee && (
                <UpdateEmployeeDialog
                    open={!!employee}
                    setOpen={() => setEmployee(null)}
                    employee={employee}
                />
            )}
        </>
    );
};

export default EmployeesPage;
