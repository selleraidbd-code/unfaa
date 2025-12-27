import { getEmployeeRoleLabel, getEmployeeRoleOptions } from "@/features/employee/employee-role-options";
import { useUpdateEmployeeMutation } from "@/redux/api/employee-api";
import { zodResolver } from "@hookform/resolvers/zod";
import { CustomFormMultiSelect } from "@workspace/ui/components/custom/custom-form-multi-select";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@workspace/ui/components/dialog";
import { Form } from "@workspace/ui/components/form";
import { toast } from "@workspace/ui/components/sonner";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Employee, UpdateEmployee } from "@/types/employee-type";
import { CustomButton } from "@/components/ui/custom-button";

const employeeFormSchema = z.object({
    roles: z.array(z.object({ value: z.string(), label: z.string() })),
});

type BrandFormValues = z.infer<typeof employeeFormSchema>;

export const UpdateEmployeeDialog = ({
    open,
    setOpen,
    employee,
}: {
    open: boolean;
    setOpen: (open: boolean) => void;
    employee: Employee;
}) => {
    const form = useForm<BrandFormValues>({
        resolver: zodResolver(employeeFormSchema),
        defaultValues: {
            roles: employee.roles.map((role) => ({
                value: role,
                label: getEmployeeRoleLabel(role),
            })),
        },
    });

    const [updateEmployee, { isLoading }] = useUpdateEmployeeMutation();

    const onSubmit = async (data: BrandFormValues) => {
        const payload: UpdateEmployee = {
            id: employee.id,
            payload: {
                roles: data.roles.map((role) => role.value),
            },
        };

        await updateEmployee(payload)
            .unwrap()
            .then(() => {
                form.reset();
                toast.success("Employee updated successfully");
                setOpen(false);
            })
            .catch((error) => {
                console.warn(error);
                toast.error(error.data.message);
            });
    };

    const employeeRoleOptions = getEmployeeRoleOptions();

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:!w-[80vw] lg:!w-[45vw] xl:!w-[40vw] 2xl:!w-[35vw]">
                <DialogHeader className="pb-3">
                    <DialogTitle className="text-xl font-bold">Update Employee</DialogTitle>
                    <DialogDescription>Update the employee details.</DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <CustomFormMultiSelect
                            label="Roles"
                            name="roles"
                            options={employeeRoleOptions}
                            required={true}
                            control={form.control}
                        />

                        <div className="flex justify-end gap-4">
                            <DialogClose asChild>
                                <CustomButton type="button" variant="outline">
                                    Cancel
                                </CustomButton>
                            </DialogClose>
                            <CustomButton type="submit" isLoading={isLoading}>
                                Update Employee
                            </CustomButton>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};
