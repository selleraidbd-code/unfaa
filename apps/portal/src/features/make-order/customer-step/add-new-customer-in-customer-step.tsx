import { useCreateCustomerMutation } from "@/redux/api/customer-api";
import { zodResolver } from "@hookform/resolvers/zod";
import { CustomFormInput } from "@workspace/ui/components/custom/custom-form-input";
import { CheckCircle2, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "@workspace/ui/components/sonner";
import { z } from "zod";

import { CreateCustomer, Customer } from "@/types/customer-type";
import { Form } from "@workspace/ui/components/form";
import useGetUser from "@/hooks/useGetUser";
import { OrderStepIndicator } from "@/types/order-type";
import { CustomButton } from "@/components/ui/custom-button";

interface AddNewCustomerInCustomerStepProps {
    setShowNewCustomerForm: (show: boolean) => void;
    setSelectedCustomer: (customer: Customer) => void;
    setActiveStep: (step: OrderStepIndicator) => void;
}

const customerSchema = z.object({
    name: z.string().min(1, { message: "Name is required" }),
    email: z.string().email().optional(),
    phoneNumber: z.string().min(1, { message: "Phone number is required" }),
    address: z.string().optional(),
});

export type createCustomerFormValues = z.infer<typeof customerSchema>;

export const AddNewCustomerInCustomerStep = ({
    setShowNewCustomerForm,
    setSelectedCustomer,
    setActiveStep,
}: AddNewCustomerInCustomerStepProps) => {
    const user = useGetUser();
    const form = useForm<createCustomerFormValues>({
        resolver: zodResolver(customerSchema),
        defaultValues: {
            name: "",
            phoneNumber: "",
            email: "",
            address: "",
        },
    });

    const [createCustomer, { isLoading }] = useCreateCustomerMutation();

    const onSubmit = async (data: createCustomerFormValues) => {
        if (!user) {
            toast.error("User not found");
            return;
        }

        const payload: CreateCustomer = {
            name: data.name,
            email: data.email,
            phoneNumber: data.phoneNumber,
            address: data.address,
            shopId: user.shop.id,
        };

        await createCustomer(payload)
            .unwrap()
            .then((res) => {
                toast.success("Customer created successfully");
                setSelectedCustomer(res.data);
                setShowNewCustomerForm(false);
                setActiveStep(OrderStepIndicator.PRODUCTS);
            })
            .catch((res) => {
                toast.error(res.data.message || "Failed to create customer");
            });
    };

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4 border rounded-md p-4 pt-3"
            >
                <div className="space-y-4">
                    <div className="flex items-center justify-between border-b pb-2">
                        <h3 className="font-medium">Add New Customer</h3>
                        <CustomButton
                            variant="outline"
                            size="sm"
                            onClick={() => setShowNewCustomerForm(false)}
                        >
                            <X className="h-4 w-4" />
                            Cancel
                        </CustomButton>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <CustomFormInput
                            name="name"
                            label="Name"
                            placeholder="Customer name"
                            control={form.control}
                            // required
                        />

                        <CustomFormInput
                            name="phoneNumber"
                            label="Phone"
                            placeholder="Phone number"
                            control={form.control}
                            required
                        />

                        <CustomFormInput
                            name="email"
                            label="Email"
                            placeholder="Email"
                            control={form.control}
                            type="email"
                        />

                        <CustomFormInput
                            name="address"
                            label="Address"
                            placeholder="Address"
                            control={form.control}
                        />
                    </div>

                    <CustomButton type="submit" isLoading={isLoading}>
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Save & Continue
                    </CustomButton>
                </div>
            </form>
        </Form>
    );
};
