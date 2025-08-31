import { useState } from "react";

import { AddNewCustomerInCustomerStep } from "@/features/make-order/customer-step/add-new-customer-in-customer-step";
import { useGetCustomersQuery } from "@/redux/api/customer-api";
import { ChevronRight, Plus } from "lucide-react";

import { Customer } from "@/types/customer-type";
import { OrderStepIndicator } from "@/types/order-type";
import { CustomErrorOrEmpty } from "@/components/ui/custom-error-or-empty";
import { CustomLoading } from "@workspace/ui/components/custom/custom-loading";
import { CustomSearch } from "@workspace/ui/components/custom/custom-search";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@workspace/ui/components/card";
import { cn } from "@workspace/ui/lib/utils";
import { CustomButton } from "@/components/ui/custom-button";

interface CustomerStepProps {
    selectedCustomer: Customer | null;
    setSelectedCustomer: (customer: Customer | null) => void;
    setActiveStep: (step: OrderStepIndicator) => void;
    shopId: string;
}

export const CustomerStep = ({
    selectedCustomer,
    setSelectedCustomer,
    setActiveStep,
    shopId,
}: CustomerStepProps) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [showNewCustomerForm, setShowNewCustomerForm] = useState(false);

    const { data, isLoading } = useGetCustomersQuery({
        searchTerm: searchTerm ? searchTerm : undefined,
        limit: 100,
        shopId,
    });

    const handleSelectCustomer = (customer: Customer) => {
        setSelectedCustomer(customer);
        setActiveStep(OrderStepIndicator.PRODUCTS);
    };

    if (isLoading) return <CustomLoading />;

    if (!data)
        return (
            <CustomErrorOrEmpty
                isError={true}
                description="No customers found"
            />
        );

    return (
        <Card className="mx-auto mt-4 max-w-5xl gap-3 border shadow-none">
            <CardHeader>
                <CardTitle>Customer Information</CardTitle>
            </CardHeader>
            <CardContent>
                {!showNewCustomerForm ? (
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <CustomSearch
                                onSearch={setSearchTerm}
                                placeholder="Search customers by name, email, or phone..."
                                className="md:w-full"
                            />

                            <CustomButton
                                onClick={() => setShowNewCustomerForm(true)}
                            >
                                <Plus className="mr-2 h-4 w-4" />
                                Add New Customer
                            </CustomButton>
                        </div>

                        <div className="max-h-[calc(100vh-390px)] overflow-y-auto rounded-md border">
                            {data?.data.length > 0 ? (
                                data?.data.map((customer) => (
                                    <div
                                        key={customer.id}
                                        className={cn(
                                            "cursor-pointer border-b p-3 hover:bg-accent",
                                            selectedCustomer?.id === customer.id
                                                ? "bg-accent"
                                                : ""
                                        )}
                                        onClick={() =>
                                            handleSelectCustomer(customer)
                                        }
                                    >
                                        <p className="font-medium">
                                            {customer.name}
                                        </p>
                                        <div className="flex gap-3 text-sm text-gray-500">
                                            <p>{customer.email}</p>
                                            <p>{customer.phoneNumber}</p>
                                        </div>
                                        <p className="text-sm text-gray-500">
                                            {customer.address}
                                        </p>
                                    </div>
                                ))
                            ) : (
                                <div className="p-4 h-40 center text-lg text-center text-gray-500">
                                    No customers found
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <AddNewCustomerInCustomerStep
                        setSelectedCustomer={setSelectedCustomer}
                        setShowNewCustomerForm={setShowNewCustomerForm}
                        setActiveStep={setActiveStep}
                    />
                )}
            </CardContent>

            <CardFooter className="flex justify-end border-t pt-4 pb-0">
                <CustomButton
                    onClick={() => setActiveStep(OrderStepIndicator.PRODUCTS)}
                    disabled={!selectedCustomer}
                >
                    Continue to Products
                    <ChevronRight className="ml-2 h-4 w-4" />
                </CustomButton>
            </CardFooter>
        </Card>
    );
};
