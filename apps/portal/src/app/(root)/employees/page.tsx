"use client";

import { PaginationState } from "@tanstack/react-table";
import { useState } from "react";
import { toast } from "@workspace/ui/components/sonner";
import { useBreakpoint } from "@workspace/ui/hooks/use-breakpoint";
import {
    useDeleteEmployeeMutation,
    useGetEmployeesQuery,
} from "@/redux/api/employee-api";
import { UpdateEmployeeDialog } from "@/features/employee/update-employee-dialog";
import { EmployeeTableView } from "@/features/employee/employee-table-view";
import { EmployeeCardList } from "@/features/employee/employee-card-list";
import { Employee } from "@/types/employee-type";
import useGetUser from "@/hooks/useGetUser";
import { useAlert } from "@/hooks/useAlert";

const EmployeesPage = () => {
    const user = useGetUser();
    const { fire } = useAlert();
    const isMobile = useBreakpoint({ size: "lg" });
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
        fire({
            title: "Fire Employee",
            description: "Are you sure you want to remove this employee?",
            onConfirm: async () => {
                await deleteEmployee(id)
                    .unwrap()
                    .then(() => {
                        toast.success("🎉 Employee deleted successfully");
                    })
                    .catch((error) => {
                        toast.error(
                            error.data.message || "Something went wrong"
                        );
                    });
            },
        });
    };

    const handleEdit = (employee: Employee) => {
        setEmployee(employee);
    };

    return (
        <>
            {!isMobile ? (
                <EmployeeTableView
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
                <EmployeeCardList
                    data={data?.data || []}
                    isLoading={isLoading}
                    isError={isError}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onSearch={handleSearch}
                />
            )}

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
