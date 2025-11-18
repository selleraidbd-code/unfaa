"use client";

import { OrderInput } from "@/features/ai-order/order-input";
import { useAiOrderGenerationMutation } from "@/redux/api/order-api";
import {
    AIOrderGenerationProductInfo,
    OrderDetailsType,
} from "@/types/order-type";
import { toast } from "@workspace/ui/components/sonner";
import { useState } from "react";

import { CustomerInfo } from "@/features/ai-order/customer-info";
import { FraudChecker } from "@/features/ai-order/fraud-checker";
import { GenerateSkeleton } from "@/features/ai-order/generate-skeleton";
import { isValidBdPhoneNumber, isValidId } from "@/features/ai-order/lib";
import { OrderDetails } from "@/features/ai-order/order-details";
import { OrderInfo } from "@/features/ai-order/order-info";
import { ProductInfoOrder } from "@/features/ai-order/product-info-order";
import { CustomerState } from "@/features/ai-order/types";
import { useGetFraudCheckerDataMutation } from "@/redux/api/customer-api";
import { useAppSelector } from "@/redux/store/hook";
import { FraudCheckerData } from "@/types/customer-type";

const Page = () => {
    const user = useAppSelector((state) => state.auth.user);
    const shopId = user?.shop.id || "";

    const [aiOrderGeneration] = useAiOrderGenerationMutation();
    const [getFraudCheckerData] = useGetFraudCheckerDataMutation();

    const [orderText, setOrderText] = useState("");
    const [customerState, setCustomerState] = useState<CustomerState | null>(
        null
    );
    const [productInfo, setProductInfo] = useState<
        AIOrderGenerationProductInfo[] | null
    >(null);
    const [orderDetails, setOrderDetails] = useState<OrderDetailsType>({
        deliveryZoneId: "",
    });
    const [fraudState, setFraudState] = useState<FraudCheckerData | null>(null);
    const [fraudError, setFraudError] = useState<string | null>(null);
    const [isCheckingFraud, setIsCheckingFraud] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    const checkFraud = async (phoneNumber: string) => {
        // Phone number validation (Bangladesh format)
        if (!isValidBdPhoneNumber(phoneNumber)) {
            setFraudError(
                "Please provide a valid Bangladeshi phone number (e.g., 01XXXXXXXXX)"
            );
            setFraudState(null);
            return;
        }

        setIsCheckingFraud(true);
        setFraudError(null);
        const sanitizedPhone = phoneNumber.replace(/\D/g, "");
        await getFraudCheckerData({ phoneNumber: sanitizedPhone })
            .unwrap()
            .then((res) => {
                console.log(res);
                // Check if response contains error status
                const data = res.data as any;
                if (
                    data &&
                    typeof data === "object" &&
                    "status" in data &&
                    data.status === "error"
                ) {
                    setFraudError(
                        data.message || "Failed to check customer verification"
                    );
                    setFraudState(null);
                } else {
                    setFraudState(res.data as FraudCheckerData);
                    setFraudError(null);
                }
            })
            .catch((error) => {
                console.log(error);
                setFraudError(
                    error.data?.message ||
                        error.message ||
                        "Failed to check customer verification. Please try again."
                );
                setFraudState(null);
            })
            .finally(() => {
                setIsCheckingFraud(false);
            });
    };

    const handleAiOrderGeneration = async () => {
        if (!orderText.trim()) {
            toast.error("Please enter order information");
            return;
        }
        clearFormData();
        setIsProcessing(true);

        await aiOrderGeneration({
            shopId,
            info: orderText,
        })
            .unwrap()
            .then((res) => {
                console.log(res);

                const result = res.data.result;

                // Set customer state
                setCustomerState({
                    customerName: result.data.customerName || "",
                    customerPhone: result.data.customerPhone || "",
                    customerAddress: result.data.customerAddress || "",
                    customerId: result.data.customerId || "",
                });

                setProductInfo(result.data.productInfo);

                setIsProcessing(false);
                // Check fraud if phone number is available
                if (result.data.customerPhone) {
                    checkFraud(result.data.customerPhone);
                }
            })
            .catch((error) => {
                console.log(error);
                toast.error(error.data?.message || "Failed to generate order");
                setIsProcessing(false);
            });
    };

    const resetForm = () => {
        setOrderText("");
        setIsProcessing(false);
        clearFormData();
    };

    const clearFormData = () => {
        setCustomerState(null);
        setProductInfo(null);
        setFraudState(null);
        setFraudError(null);
        setIsCheckingFraud(false);
    };

    return (
        <div className="space-y-6 max-w-7xl">
            {/* Input Section */}
            <OrderInput
                orderText={orderText}
                setOrderText={setOrderText}
                onGenerate={handleAiOrderGeneration}
                isProcessing={isProcessing}
                onReset={resetForm}
                hasData={!!customerState || !!productInfo}
            />

            {/* Loading State */}
            {isProcessing && <GenerateSkeleton />}

            {/* Results Section */}
            {customerState && productInfo && (
                <div className="grid gap-6">
                    {/* Fraud Checker Section */}
                    {(fraudState || fraudError || isCheckingFraud) && (
                        <FraudChecker
                            fraudState={fraudState}
                            error={fraudError}
                            onCheckFraud={checkFraud}
                            customerPhone={customerState.customerPhone}
                            isChecking={isCheckingFraud}
                        />
                    )}

                    {/* Customer Information */}
                    <CustomerInfo
                        customerState={customerState}
                        onCustomerStateChange={setCustomerState}
                    />

                    {isValidId(customerState.customerId) && (
                        <OrderInfo customerId={customerState.customerId} />
                    )}

                    <OrderDetails
                        orderDetails={orderDetails}
                        setOrderDetails={setOrderDetails}
                    />

                    {/* Product Information */}
                    <ProductInfoOrder
                        customerInfo={customerState}
                        productInfo={productInfo}
                        onReset={resetForm}
                        orderDetails={orderDetails}
                    />
                </div>
            )}
        </div>
    );
};

export default Page;
