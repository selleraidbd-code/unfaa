"use client";

import { OrderInput } from "@/features/ai-order/order-input";
import useGetUser from "@/hooks/useGetUser";
import { useAiOrderGenerationMutation } from "@/redux/api/order-api";
import { AIOrderGenerationProductInfo } from "@/types/order-type";
import { toast } from "@workspace/ui/components/sonner";
import { useState } from "react";

import { AiPlaceOrder } from "@/features/ai-order/ai-place-order";
import { CustomerInfo } from "@/features/ai-order/customer-info";
import { FraudChecker } from "@/features/ai-order/fraud-checker";
import { GenerateSkeleton } from "@/features/ai-order/generate-skeleton";
import { ProductInfo } from "@/features/ai-order/product-info";
import { CustomerState, ProductState } from "@/features/ai-order/types";
import { useGetFraudCheckerDataMutation } from "@/redux/api/customer-api";
import { FraudCheckerData } from "@/types/customer-type";

const Page = () => {
    const user = useGetUser();

    const [aiOrderGeneration] = useAiOrderGenerationMutation();
    const [getFraudCheckerData] = useGetFraudCheckerDataMutation();

    const [orderText, setOrderText] = useState("");
    const [customerState, setCustomerState] = useState<CustomerState | null>(
        null
    );
    const [productState, setProductState] = useState<ProductState | null>(null);
    const [fraudState, setFraudState] = useState<FraudCheckerData | null>(null);
    const [isCheckingFraud, setIsCheckingFraud] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    const checkFraud = async (phoneNumber: string) => {
        setIsCheckingFraud(true);
        await getFraudCheckerData({ phoneNumber })
            .unwrap()
            .then((res) => {
                console.log(res);
                setFraudState(res.data);
            })
            .catch((error) => {
                console.log(error);
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
            shopId: user?.shop?.id || "",
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

                // Set product state
                const enhancedProductInfo = result.data.productInfo.map(
                    (product: AIOrderGenerationProductInfo) => ({
                        ...product,
                        productId: product.productId || "", // Convert null to empty string
                        selectedProductId: "",
                        selectedVariantId: "",
                        availableVariants: [],
                    })
                );
                setProductState({
                    productInfo: enhancedProductInfo,
                });
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
        setProductState(null);
        setFraudState(null);
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
                hasData={!!customerState || !!productState}
            />

            {/* Loading State */}
            {isProcessing && <GenerateSkeleton />}

            {/* Results Section */}
            {customerState && productState && (
                <div className="grid gap-6">
                    {/* Fraud Checker Section */}
                    {(fraudState || isCheckingFraud) && (
                        <FraudChecker
                            fraudState={fraudState}
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

                    {/* Product Information */}
                    <ProductInfo
                        productState={productState}
                        onProductStateChange={setProductState}
                    />

                    {/* Action Buttons */}
                    <AiPlaceOrder
                        onReset={resetForm}
                        customerState={customerState}
                        productState={productState}
                    />
                </div>
            )}
        </div>
    );
};

export default Page;
