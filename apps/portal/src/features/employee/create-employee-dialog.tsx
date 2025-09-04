"use client";

import { CustomButton } from "@/components/ui/custom-button";
import { getEmployeeRoleOptions } from "@/features/employee/employee-role-options";
import useGetUser from "@/hooks/useGetUser";
import { useCreateEmployeeMutation } from "@/redux/api/employee-api";
import { CreateEmployee } from "@/types/employee-type";
import { zodResolver } from "@hookform/resolvers/zod";
import { CustomFormInput } from "@workspace/ui/components/custom/custom-form-input";
import { CustomFormSearchMultiSelect } from "@workspace/ui/components/custom/custom-form-search-multi-select";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog";
import { Form } from "@workspace/ui/components/form";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const employeeFormSchema = z.object({
  name: z.string().min(2, {
    message: "Employee name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Invalid email address.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
  role: z.array(z.object({ value: z.string(), label: z.string() })),
});

type BrandFormValues = z.infer<typeof employeeFormSchema>;

export const CreateEmployeeDialog = () => {
  const user = useGetUser();
  const [open, setOpen] = useState(false);
  const form = useForm<BrandFormValues>({
    resolver: zodResolver(employeeFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: [],
    },
  });

  const [createEmployee, { isLoading }] = useCreateEmployeeMutation();

  const onSubmit = async (data: BrandFormValues) => {
    if (!user) {
      toast.error("User not found");
      return;
    }

    const payload: CreateEmployee = {
      employeeInfo: {
        name: data.name,
        email: data.email,
        password: data.password,
      },
      employeeRoles: data.role.map((role) => role.value) || [],
    };

    await createEmployee(payload)
      .unwrap()
      .then(() => {
        form.reset();
        toast.success("Brand created successfully");
        setOpen(false);
      })
      .catch((error) => {
        console.log(error);
        toast.error(error.data.message);
      });
  };

  const employeeRoleOptions = getEmployeeRoleOptions();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <CustomButton>
          <Plus className="w-4 h-4" /> Add Employee
        </CustomButton>
      </DialogTrigger>
      <DialogContent className="sm:!w-[80vw] lg:!w-[45vw] xl:!w-[40vw] 2xl:!w-[35vw]">
        <DialogHeader className="pb-3">
          <DialogTitle className="text-xl font-bold">
            Add New Employee
          </DialogTitle>
          <DialogDescription>
            Add a new employee for your shop.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <CustomFormSearchMultiSelect
              label="Roles"
              name="role"
              options={employeeRoleOptions}
              required={true}
              control={form.control}
            />
            <CustomFormInput
              label="Name"
              name="name"
              placeholder="Enter brand name"
              type="text"
              required={true}
              control={form.control}
            />
            <CustomFormInput
              label="Email"
              name="email"
              placeholder="Enter email address"
              type="email"
              required={true}
              control={form.control}
            />
            <CustomFormInput
              label="Password"
              name="password"
              placeholder="Enter password"
              type="password"
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
                Save Employee
              </CustomButton>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
