import { CheckCircle2 } from "lucide-react";

import { OrderDetails } from "@/app/(root)/make-order/page";
import { useGetEmployeesQuery } from "@/redux/api/employee-api";
import { OrderStepIndicator } from "@/types/order-type";
import { CustomInput } from "@workspace/ui/components/custom/custom-input";
import { CustomSelect } from "@workspace/ui/components/custom/custom-select";
import { CustomTextarea } from "@workspace/ui/components/custom/custom-textarea";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@workspace/ui/components/card";
import { useGetDeliveriesQuery } from "@/redux/api/delivery-api";
import { CustomButton } from "@/components/ui/custom-button";

export type Tag = {
    id: string;
    name: string;
    color: string;
};

interface OrderDetailsStepProps {
    orderDetails: OrderDetails;
    setOrderDetails: React.Dispatch<React.SetStateAction<OrderDetails>>;
    canCompleteOrder: boolean | null | string;
    handleSubmitOrder: () => void;
    setActiveStep: (step: OrderStepIndicator) => void;
    isLoading: boolean;
}

export const OrderDetailsStep = ({
    orderDetails,
    setOrderDetails,
    canCompleteOrder,
    handleSubmitOrder,
    setActiveStep,
    isLoading,
}: OrderDetailsStepProps) => {
    // const orderStatusOptions = [
    //     {
    //         label: "Placed",
    //         value: OrderStatus.PLACED,
    //     },
    //     {
    //         label: "Confirmed",
    //         value: OrderStatus.CONFIRMED,
    //     },
    //     {
    //         label: "Cancelled",
    //         value: OrderStatus.CANCELLED,
    //     },
    //     {
    //         label: "Incomplete",
    //         value: OrderStatus.INCOMPLETE,
    //     },
    //     {
    //         label: "Send",
    //         value: OrderStatus.SEND,
    //     },
    //     {
    //         label: "Hold",
    //         value: OrderStatus.HOLD,
    //     },
    //     {
    //         label: "Waiting",
    //         value: OrderStatus.WAITING,
    //     },
    //     {
    //         label: "Received",
    //         value: OrderStatus.RECEIVED,
    //     },
    //     {
    //         label: "Processing",
    //         value: OrderStatus.PROCESSING,
    //     },
    //     {
    //         label: "NZC",
    //         value: OrderStatus.NZC,
    //     },
    //     {
    //         label: "Return",
    //         value: OrderStatus.RETURN,
    //     },
    // ];

    const { data } = useGetEmployeesQuery({
        page: 1,
        limit: 100,
    });

    console.log("data", data);

    const employeeOptions = data?.data.map((employee) => ({
        label: employee.user.name,
        value: employee.userId,
    }));

    const { data: deliveryData } = useGetDeliveriesQuery({
        page: 1,
        limit: 100,
    });

    const deliveryOptions = deliveryData?.data?.[0]?.deliveryZones?.map(
        (delivery) => ({
            label: delivery.name,
            value: delivery.id,
        })
    );

    return (
        <Card className="mx-auto mt-4 max-w-6xl">
            <CardHeader>
                <CardTitle>Additional Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <CustomInput
                    label="Delivery Address"
                    value={orderDetails.deliveryAddress}
                    onChange={(e) =>
                        setOrderDetails({
                            ...orderDetails,
                            deliveryAddress: e.toString(),
                        })
                    }
                    placeholder="Enter delivery address"
                />

                <CustomTextarea
                    label="Order Notes"
                    value={orderDetails.orderNotes}
                    onChange={(e) =>
                        setOrderDetails({
                            ...orderDetails,
                            orderNotes: e.toString(),
                        })
                    }
                    placeholder="Enter order notes"
                />

                {/* <CustomSelect
                    label="Order Status"
                    value={orderDetails.orderStatus}
                    onChange={(e) =>
                        setOrderDetails({
                            ...orderDetails,
                            orderStatus: e as unknown as OrderStatus,
                        })
                    }
                    options={orderStatusOptions}
                /> */}

                <CustomSelect
                    label="Assign to"
                    options={employeeOptions || []}
                    value={orderDetails.assignedTo?.toString() || ""}
                    onChange={(e) =>
                        setOrderDetails({
                            ...orderDetails,
                            assignedTo: e as unknown as string,
                        })
                    }
                    placeholder="Select employee"
                />

                <CustomSelect
                    label="Delivery"
                    options={deliveryOptions || []}
                    value={orderDetails.deliveryId?.toString() || ""}
                    onChange={(e) =>
                        setOrderDetails({
                            ...orderDetails,
                            deliveryId: e as unknown as string,
                        })
                    }
                    placeholder="Select delivery"
                />
            </CardContent>

            <CardFooter className="flex justify-between border-t pt-4">
                <CustomButton
                    variant="outline"
                    onClick={() => setActiveStep(OrderStepIndicator.PRODUCTS)}
                >
                    Back to Products
                </CustomButton>
                <CustomButton
                    onClick={handleSubmitOrder}
                    disabled={!canCompleteOrder}
                    isLoading={isLoading}
                >
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Complete Order
                </CustomButton>
            </CardFooter>
        </Card>
    );
};
