import { CustomerState } from "@/features/ai-order/types";
import { useCreateOrderbyAdminMutation } from "@/redux/api/order-api";
import { Button } from "@workspace/ui/components/button";
import { toast } from "@workspace/ui/components/sonner";
import { CheckCircle } from "lucide-react";
import { useAppSelector } from "@/redux/store/hook";
import {
    CreateOrder,
    OrderDetailsType,
    OrderItem,
    OrderStatus,
} from "@/types/order-type";
import { isValidId } from "@/features/ai-order/lib";

interface Props {
    onReset: () => void;
    customerInfo: CustomerState;
    orderItems: OrderItem[];
    orderDetails: OrderDetailsType;
}

export const AiPlaceOrder = ({
    onReset,
    customerInfo,
    orderItems,
    orderDetails,
}: Props) => {
    const [createOrder, { isLoading }] = useCreateOrderbyAdminMutation();
    const user = useAppSelector((state) => state.auth.user);

    const handlePlaceOrder = async (status: OrderStatus) => {
        if (!customerInfo || !Array.isArray(orderItems)) return;

        if (!user) {
            toast.error("You are not authorized to create an order");
            return;
        }

        // Validate required fields
        const missingFields = [];
        if (orderItems.length === 0) missingFields.push("At least one product");
        if (orderItems.some((p) => !p.id))
            missingFields.push("Product selection");

        if (missingFields.length > 0) {
            toast.error(`Please fill: ${missingFields.join(", ")}`);
            return;
        }

        const customerId = isValidId(customerInfo.customerId)
            ? customerInfo.customerId
            : "";

        // Build payload akin to make-order page
        const payload: CreateOrder = {
            shopId: user.shop.id,
            customerId,
            customerName: customerInfo.customerName,
            customerPhoneNumber: customerInfo.customerPhone,
            orderItems: orderItems.map((item) => {
                const extras = (item.selectedVariants ?? []).reduce(
                    (sum, sv) => sum + (Number(sv.extraPrice ?? 0) || 0),
                    0
                );
                const unitPrice = Number(item.price ?? 0) + extras;
                const orderItemVariant = (item.selectedVariants ?? []).map(
                    (sv) => ({
                        productVariantId: String(sv.variantId),
                        productVariantOptionId: String(sv.optionId),
                    })
                );

                return {
                    productId: String(item.id),
                    quantity: Number(item.quantity) || 1,
                    productPrice: unitPrice,
                    orderItemVariant,
                };
            }),
            customerAddress: customerInfo.customerAddress,
            orderStatus: status,
            notes: "",
            // Temporary delivery zone as requested
            deliveryZoneId: orderDetails.deliveryZoneId,
        } as const;

        try {
            await createOrder({ assignedTo: user.id, payload }).unwrap();
            toast.success("Order created successfully!");
            onReset();
        } catch (err: any) {
            const message = err?.data?.message || "Failed to create order";
            toast.error(message);
            // eslint-disable-next-line no-console
            console.log("Create order error :>> ", err);
        }
    };

    return (
        <div className="flex gap-4 justify-end">
            <Button variant="outline" onClick={onReset}>
                Cancel
            </Button>
            {/* <Button
                onClick={() => handlePlaceOrder(OrderStatus.CONFIRMED)}
                variant="secondary"
                className="min-w-40"
                disabled={isLoading}
            >
                <CheckCircle className="h-4 w-4" />
                {isLoading ? "Confirming..." : "Confirm Order"}
            </Button> */}
            <Button
                onClick={() => handlePlaceOrder(OrderStatus.PLACED)}
                className="min-w-40"
                disabled={isLoading}
            >
                <CheckCircle className="h-4 w-4" />
                {isLoading ? "Placing..." : "Place Order"}
            </Button>
        </div>
    );
};
