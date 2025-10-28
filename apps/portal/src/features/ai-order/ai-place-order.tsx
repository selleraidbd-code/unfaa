import { CustomerState, ProductState } from "@/features/ai-order/types";
import { Button } from "@workspace/ui/components/button";
import { toast } from "@workspace/ui/components/sonner";
import { CheckCircle } from "lucide-react";

interface Props {
    onReset: () => void;
    customerState: CustomerState;
    productState: ProductState;
}

export const AiPlaceOrder = ({
    onReset,
    customerState,
    productState,
}: Props) => {
    const handlePlaceOrder = () => {
        if (!customerState || !productState) return;

        // Validate required fields
        const missingFields = [];
        if (!customerState.customerId) missingFields.push("Customer ID");
        if (productState.productInfo.some((p) => !p.selectedProductId))
            missingFields.push("Product selection");

        if (missingFields.length > 0) {
            toast.error(`Please fill: ${missingFields.join(", ")}`);
            return;
        }

        // Combine states for order creation
        const orderData = {
            ...customerState,
            productInfo: productState.productInfo,
        };

        // Here you would typically call the create order API
        toast.success("Order placed successfully!");
        console.log("Order data:", orderData);
    };

    return (
        <div className="flex gap-4 justify-end">
            <Button variant="outline" onClick={onReset}>
                Cancel
            </Button>
            <Button onClick={handlePlaceOrder} className="min-w-40">
                <CheckCircle className="h-4 w-4" />
                Place Order
            </Button>
        </div>
    );
};
