import { CustomButton } from "@/components/ui/custom-button";
import { useUpdateCustomerMutation } from "@/redux/api/customer-api";
import { Customer, UpdateCustomer } from "@/types/customer-type";
import { zodResolver } from "@hookform/resolvers/zod";
import { CustomFormInput } from "@workspace/ui/components/custom/custom-form-input";
import { CustomFormTextarea } from "@workspace/ui/components/custom/custom-form-textarea";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@workspace/ui/components/dialog";
import { Form } from "@workspace/ui/components/form";
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
    address: z.string().min(1, {
        message: "Address is required.",
    }),
});

type BrandFormValues = z.infer<typeof employeeFormSchema>;

export const UpdateCustomerDialog = ({
    open,
    setOpen,
    customer,
}: {
    open: boolean;
    setOpen: (open: boolean) => void;
    customer: Customer;
}) => {
    const form = useForm<BrandFormValues>({
        resolver: zodResolver(employeeFormSchema),
        defaultValues: {
            name: customer.name || "",
            email: customer.email || "",
            address: customer.address || "",
        },
    });

    const [updateCustomer, { isLoading }] = useUpdateCustomerMutation();

    const onSubmit = async (data: BrandFormValues) => {
        const payload: UpdateCustomer = {
            id: customer.id,
            payload: {
                name: data.name,
                email: data.email,
                address: data.address,
            },
        };

        await updateCustomer(payload)
            .unwrap()
            .then(() => {
                form.reset();
                toast.success("Customer updated successfully");
                setOpen(false);
            })
            .catch((error) => {
                console.log(error);
                toast.error(error.data.message);
            });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:!w-[80vw] lg:!w-[45vw] xl:!w-[40vw] 2xl:!w-[35vw]">
                <DialogHeader className="pb-3">
                    <DialogTitle className="text-xl font-bold">
                        Update Customer
                    </DialogTitle>
                    <DialogDescription>
                        Update the customer details.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4"
                    >
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
                            placeholder="Enter email"
                            type="email"
                            control={form.control}
                        />

                        <CustomFormTextarea
                            label="Address"
                            name="address"
                            placeholder="Enter address"
                            control={form.control}
                        />

                        <div className="flex justify-end gap-4">
                            <DialogClose asChild>
                                <CustomButton type="button" variant="outline">
                                    Cancel
                                </CustomButton>
                            </DialogClose>
                            <CustomButton type="submit" isLoading={isLoading}>
                                Update Customer
                            </CustomButton>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};
