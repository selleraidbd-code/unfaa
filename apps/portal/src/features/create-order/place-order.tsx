import { isValidId } from "@/features/create-order/lib";
import { CustomerState } from "@/features/create-order/types";
import { useCreateOrderbyAdminMutation } from "@/redux/api/order-api";
import { useAppSelector } from "@/redux/store/hook";
import { Button } from "@workspace/ui/components/button";
import { toast } from "@workspace/ui/components/sonner";
import { CheckCircle } from "lucide-react";

import { FraudCheckerData } from "@/types/customer-type";
import { CreateOrder, OrderDetailsType, OrderItem, OrderSource, OrderStatus } from "@/types/order-type";
import { formatPhoneNumber } from "@/lib/format-number-utils";

interface Props {
    onReset: () => void;
    customerInfo: CustomerState;
    orderItems: OrderItem[];
    orderDetails: OrderDetailsType;
    setOrderDetails: (orderDetails: OrderDetailsType) => void;
    fraudState?: FraudCheckerData | null;
    orderSource: OrderSource;
}

export const PlaceOrder = ({
    onReset,
    customerInfo,
    orderItems,
    orderDetails,
    setOrderDetails,
    fraudState,
    orderSource,
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
        if (orderItems.some((p) => !p.productId)) missingFields.push("Product selection");

        if (missingFields.length > 0) {
            toast.error(`Please fill: ${missingFields.join(", ")}`);
            return;
        }

        const grandTotal = orderItems.reduce((sum, item) => {
            const basePrice = Number(item.price ?? 0);
            const extras = (item.selectedVariants ?? []).reduce(
                (acc, sv) => acc + (Number(sv.extraPrice ?? 0) || 0),
                0
            );
            const unitPrice = basePrice + extras;
            const quantity = Number(item.quantity ?? 1) || 1;
            return sum + unitPrice * quantity;
        }, 0);

        const customerId = isValidId(customerInfo.customerId) ? customerInfo.customerId : "";

        // if (orderDetails.discountedPrice && orderDetails.discountedPrice > grandTotal) {
        //     toast.error("Discount amount cannot be greater than total");
        //     return;
        // }

        // Map fraudchecker data to order payload
        const customerTotalConfirmOrder = fraudState?.total_delivered ?? 0;
        const customerTotalCancelOrder = fraudState?.total_cancel ?? 0;

        const phoneNumber = formatPhoneNumber(customerInfo.customerPhone);

        // Build payload akin to make-order page
        const payload: CreateOrder = {
            shopId: user.shop.id,
            customerId,
            customerName: customerInfo.customerName,
            customerPhoneNumber: phoneNumber,
            orderItems: orderItems.map((item) => {
                const extras = (item.selectedVariants ?? []).reduce(
                    (sum, sv) => sum + (Number(sv.extraPrice ?? 0) || 0),
                    0
                );
                const unitPrice = Number(item.price ?? 0) + extras;
                const orderItemVariant = (item.selectedVariants ?? []).map((sv) => ({
                    productVariantId: String(sv.variantId),
                    productVariantOptionId: String(sv.optionId),
                }));

                return {
                    productId: String(item.productId),
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
            discountedPrice: orderDetails.discountedPrice ?? undefined,
            customerTotalConfirmOrder,
            customerTotalCancelOrder,
            orderSource,
        } as const;

        await createOrder({ assignedTo: user.id, payload })
            .unwrap()
            .then(() => {
                toast.success("Order created successfully!");
                onReset();
                setOrderDetails({
                    deliveryZoneId: "",
                    discountedPrice: undefined,
                });
            })
            .catch((err) => {
                toast.error(err.data?.message || "Failed to create order");
            });
    };

    return (
        <div className="flex justify-end gap-4">
            <Button variant="outline" onClick={onReset}>
                Cancel
            </Button>

            <Button
                onClick={() => handlePlaceOrder(OrderStatus.PLACED)}
                className="min-w-60 max-sm:flex-1"
                disabled={isLoading}
            >
                <CheckCircle className="h-4 w-4" />
                {isLoading ? "Placing..." : "Place Order"}
            </Button>
        </div>
    );
};
