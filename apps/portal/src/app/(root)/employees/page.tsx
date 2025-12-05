"use client";

import { EmployeeCardList } from "@/features/employee/employee-card-list";
import { EmployeeTableView } from "@/features/employee/employee-table-view";
import { UpdateEmployeeDialog } from "@/features/employee/update-employee-dialog";
import { useAlert } from "@/hooks/useAlert";
import {
    useDeleteEmployeeMutation,
    useGetEmployeesQuery,
} from "@/redux/api/employee-api";
import { useAppSelector } from "@/redux/store/hook";
import { Employee } from "@/types/employee-type";
import { AlertType } from "@workspace/ui/components/custom/custom-alert-dialogue";
import { toast } from "@workspace/ui/components/sonner";
import { useBreakpoint } from "@workspace/ui/hooks/use-breakpoint";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

const EmployeesPage = () => {
    const searchParams = useSearchParams();
    const user = useAppSelector((state) => state.auth.user);
    const { fire } = useAlert();
    const isMobile = useBreakpoint({ size: "lg" });
    const [employee, setEmployee] = useState<Employee | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const page = searchParams.get("page") || 1;
    const limit = searchParams.get("limit") || 10;

    const { data, isLoading, isError } = useGetEmployeesQuery({
        page: Number(page),
        limit,
        shopId: user?.shop?.id,
        searchTerm: searchTerm || undefined,
    });

    const [deleteEmployee] = useDeleteEmployeeMutation();

    const handleSearch = (value: string) => {
        setSearchTerm(value);
    };

    const handleDelete = async (id: string) => {
        fire({
            title: "Remove Employee",
            type: AlertType.WARNING,
            description:
                "Are you sure you want to remove this employee from the shop? This action cannot be undone.",
            onConfirm: async () => {
                await deleteEmployee(id)
                    .unwrap()
                    .then(() => {
                        toast.success("🎉 Employee removed successfully");
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

    const paginationMeta = {
        page: Number(page),
        limit: Number(limit),
        total: data?.meta?.total || 0,
    };

    return (
        <>
            {!isMobile ? (
                <EmployeeTableView
                    data={data?.data || []}
                    isLoading={isLoading}
                    isError={isError}
                    paginationMeta={paginationMeta}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onSearch={handleSearch}
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
