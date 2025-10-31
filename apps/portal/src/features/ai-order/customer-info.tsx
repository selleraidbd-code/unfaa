"use client";

import { CustomerState } from "@/features/ai-order/types";
import { Customer } from "@/types/customer-type";
import { Button } from "@workspace/ui/components/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@workspace/ui/components/card";
import { CustomInput } from "@workspace/ui/components/custom/custom-input";
import { CustomTextarea } from "@workspace/ui/components/custom/custom-textarea";
import { User, Users } from "lucide-react";
import { useState } from "react";
import { CustomerSelectionModal } from "./customer-selection-modal";
import { isValidBdPhoneNumber } from "./lib";
import { cn } from "@workspace/ui/lib/utils";

type Props = {
    customerState: CustomerState;
    onCustomerStateChange: (newState: CustomerState) => void;
};

export const CustomerInfo = ({
    customerState,
    onCustomerStateChange,
}: Props) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleFieldChange = (field: keyof CustomerState, value: string) => {
        if (!customerState) return;

        const newState = {
            ...customerState,
            [field]: value,
        };
        onCustomerStateChange(newState);
    };

    const handleSelectCustomer = (customer: Customer) => {
        const newState: CustomerState = {
            customerName: customer.name,
            customerPhone: customer.phoneNumber,
            customerAddress: customer.address || "",
            customerId: customer.id,
        };
        onCustomerStateChange(newState);
    };

    const isInvalidPhoneNumber = !isValidBdPhoneNumber(
        customerState.customerPhone
    );

    return (
        <Card className={cn(isInvalidPhoneNumber && "border-destructive")}>
            <CardHeader className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Customer Information
                </CardTitle>

                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2"
                >
                    <Users className="h-4 w-4" />
                    Change Customer
                </Button>
            </CardHeader>
            <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                    <CustomInput
                        label="Customer Name"
                        placeholder="Enter customer name"
                        value={customerState.customerName}
                        onChange={(value) =>
                            handleFieldChange("customerName", value.toString())
                        }
                    />
                    <CustomInput
                        label="Phone Number"
                        placeholder="Enter phone number"
                        value={customerState.customerPhone}
                        onChange={(value) =>
                            handleFieldChange("customerPhone", value.toString())
                        }
                        invalid={isInvalidPhoneNumber}
                    />
                    <CustomTextarea
                        label="Address"
                        placeholder="Enter address"
                        value={customerState.customerAddress}
                        onChange={(value) =>
                            handleFieldChange(
                                "customerAddress",
                                value.toString()
                            )
                        }
                        className="col-span-2"
                    />
                </div>
            </CardContent>

            {isModalOpen && (
                <CustomerSelectionModal
                    open={isModalOpen}
                    onOpenChange={setIsModalOpen}
                    onSelectCustomer={handleSelectCustomer}
                    currentCustomerPhone={customerState.customerPhone}
                />
            )}
        </Card>
    );
};
