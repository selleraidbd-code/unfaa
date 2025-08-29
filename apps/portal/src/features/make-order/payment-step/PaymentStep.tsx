import { ChevronRight } from "lucide-react";

import { OrderStepIndicator } from "@/types/order-type";
import { Button } from "@repo/ui/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@repo/ui/components/ui/card";

interface PaymentStepProps {
    setActiveStep: (step: OrderStepIndicator) => void;
    calculateTotal: () => number;
}

const PaymentStep = ({ setActiveStep, calculateTotal }: PaymentStepProps) => {
    return (
        <Card className="mx-auto mt-4 max-w-5xl">
            <CardHeader>
                <CardTitle>Payment Information</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    {/* Order summary */}
                    <div className="rounded-md border bg-gray-50 p-4">
                        <h3 className="mb-3 font-medium">Order Summary</h3>
                        <div className="space-y-2">
                            <div className="flex justify-between font-bold">
                                <span>Total</span>
                                <span>${calculateTotal().toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>

            <CardFooter className="flex justify-between border-t pt-4">
                <Button
                    variant="outline"
                    onClick={() => setActiveStep(OrderStepIndicator.PRODUCTS)}
                >
                    Back to Products
                </Button>
                <Button
                    onClick={() => setActiveStep(OrderStepIndicator.DETAILS)}
                >
                    Continue to Details
                    <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
            </CardFooter>
        </Card>
    );
};

export default PaymentStep;
