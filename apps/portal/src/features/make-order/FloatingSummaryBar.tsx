import { OrderItem } from "@/data/schema";
import { CheckCircle2, Save } from "lucide-react";

import { Button } from "@/components/ui/button";

interface FloatingSummaryBarProps {
    orderItems: OrderItem[];
    calculateTotal: () => number;
    handleSubmitOrder: () => void;
    canCompleteOrder: boolean;
}

const FloatingSummaryBar = ({
    orderItems,
    calculateTotal,
    handleSubmitOrder,
    canCompleteOrder,
}: FloatingSummaryBarProps) => {
    return (
        <div className="sticky bottom-0 border-t bg-white p-4 shadow-md">
            <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div>
                        <p className="text-sm text-gray-500">
                            Total Items: {orderItems.reduce((sum, item) => sum + item.quantity, 0)}
                        </p>
                        <p className="text-lg font-bold">${calculateTotal().toFixed(2)}</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline">
                        <Save className="mr-2 h-4 w-4" />
                        Save Draft
                    </Button>
                    <Button onClick={handleSubmitOrder} disabled={!canCompleteOrder}>
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Complete Order
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default FloatingSummaryBar;
