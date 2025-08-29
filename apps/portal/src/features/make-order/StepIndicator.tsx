import { CheckCircle2 } from "lucide-react";

import { OrderStepIndicator } from "@/types/order-type";
import { OrderItem } from "@/types/order-type copy";

type StepIndicatorProps = {
    orderItems: OrderItem[];
    activeStep: OrderStepIndicator;
    setActiveStep: (step: OrderStepIndicator) => void;
};

export const StepIndicator = ({
    orderItems,
    activeStep,
    // selectedCustomer,
    setActiveStep,
}: StepIndicatorProps) => {
    // const canProceedToPayment = orderItems.length > 0;

    return (
        <div className="border-b px-4 py-3">
            <div className="mx-auto flex max-w-3xl items-center justify-between">
                <StepIndicatorItem
                    number={1}
                    title="Customer"
                    active={activeStep === OrderStepIndicator.CUSTOMER}
                    completed={false}
                    onClick={() => setActiveStep(OrderStepIndicator.CUSTOMER)}
                />
                <StepConnector />
                <StepIndicatorItem
                    number={2}
                    title="Products"
                    active={activeStep === OrderStepIndicator.PRODUCTS}
                    // completed={orderItems.length > 0}
                    completed={false}
                    onClick={() => setActiveStep(OrderStepIndicator.PRODUCTS)}
                    // disabled={!selectedCustomer}
                    // onClick={() => selectedCustomer && setActiveStep(OrderStepIndicator.PRODUCTS)}
                />

                <StepConnector />
                <StepIndicatorItem
                    number={3}
                    title="Details"
                    active={activeStep === OrderStepIndicator.DETAILS}
                    completed={false}
                    onClick={() => setActiveStep(OrderStepIndicator.DETAILS)}
                />
            </div>
        </div>
    );
};

type StepConnectorProps = {
    className?: string;
};

export const StepConnector = ({ className }: StepConnectorProps) => {
    return <div className={`mx-2 h-0.5 flex-1 bg-gray-200 ${className}`} />;
};

type StepIndicatorItemProps = {
    number: number;
    title: string;
    active: boolean;
    completed: boolean;
    disabled?: boolean;
    onClick: () => void;
};

const StepIndicatorItem = ({
    number,
    title,
    active,
    completed,
    disabled,
    onClick,
}: StepIndicatorItemProps) => {
    return (
        <button
            className={`flex items-center ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
            onClick={onClick}
            disabled={disabled}
        >
            <div
                className={`mr-2 flex h-8 w-8 items-center justify-center rounded-full ${
                    active
                        ? "bg-orange-500 text-white"
                        : completed
                          ? "bg-green-500 text-white"
                          : "bg-gray-200 text-gray-700"
                }`}
            >
                {completed ? <CheckCircle2 className="h-5 w-5" /> : number}
            </div>
            <span
                className={`text-sm font-medium ${active ? "text-orange-900" : "text-gray-700"}`}
            >
                {title}
            </span>
        </button>
    );
};
