"use client";

import { useState } from "react";

import { CustomerInfo } from "@/features/create-order/customer-info";
import { FraudChecker } from "@/features/create-order/fraud-checker";
import { isValidBdPhoneNumber } from "@/features/create-order/lib";
import { OrderDetails } from "@/features/create-order/order-details";
import { OrderInfo } from "@/features/create-order/order-info";
import { OrderInput } from "@/features/create-order/order-input";
import { ProductInfoOrder } from "@/features/create-order/product-info-order";
import { CustomerState } from "@/features/create-order/types";
import { useGetFraudCheckerDataMutation } from "@/redux/api/customer-api";
import { toast } from "@workspace/ui/components/sonner";

import { FraudCheckerData } from "@/types/customer-type";
import { AIOrderGenerationProductInfo, OrderDetailsType, OrderSource, OrderStatus } from "@/types/order-type";
import { formatPhoneNumber } from "@/lib/format-number-utils";

export type OrderDetails = {
    orderNotes: string;
    deliveryAddress: string;
    orderStatus: OrderStatus;
    assignedTo: string;
    deliveryId: string;
};

type parsedCustomerData = {
    customerName: string;
    customerPhone: string;
    customerAddress: string;
    CODAmount: string;
};

const Page = () => {
    const [orderText, setOrderText] = useState("");
    const [customerState, setCustomerState] = useState<CustomerState | null>(null);
    const [productInfo, setProductInfo] = useState<AIOrderGenerationProductInfo[] | null>(null);
    const [orderDetails, setOrderDetails] = useState<OrderDetailsType>({
        deliveryZoneId: "",
        discountedPrice: undefined,
    });
    const [fraudState, setFraudState] = useState<FraudCheckerData | null>(null);
    const [fraudError, setFraudError] = useState<string | null>(null);
    const [isCheckingFraud, setIsCheckingFraud] = useState(false);

    const [getFraudCheckerData] = useGetFraudCheckerDataMutation();

    // Handle customer state changes (including from CustomerInfo component)
    const handleCustomerStateChange = (newState: CustomerState) => {
        const oldPhone = customerState?.customerPhone;
        setCustomerState(newState);

        // Trigger fraud check if phone number changed and is valid
        if (newState.customerPhone && newState.customerPhone !== oldPhone) {
            checkFraud(newState.customerPhone);
        }
    };

    // Check fraud for customer phone number
    const checkFraud = async (phoneNumber: string) => {
        // Phone number validation (Bangladesh format)
        if (!isValidBdPhoneNumber(phoneNumber)) {
            setFraudError("Please provide a valid Bangladeshi phone number (e.g., 01XXXXXXXXX)");
            setFraudState(null);
            return;
        }

        setIsCheckingFraud(true);
        setFraudError(null);
        const sanitizedPhone = formatPhoneNumber(phoneNumber);
        await getFraudCheckerData({ phoneNumber: sanitizedPhone })
            .unwrap()
            .then((res) => {
                // Check if response contains error status
                const data = res.data as any;
                if (data && typeof data === "object" && "status" in data && data.status === "error") {
                    setFraudError(data.message || "Failed to check customer verification");
                    setFraudState(null);
                } else {
                    setFraudState(res.data as FraudCheckerData);
                    setFraudError(null);
                }
            })
            .catch((error) => {
                console.warn(error);
                setFraudError(
                    error.data?.message || error.message || "Failed to check customer verification. Please try again."
                );
                setFraudState(null);
            })
            .finally(() => {
                setIsCheckingFraud(false);
            });
    };

    // Parse customer data from order text
    const parseCustomerData = (text: string): parsedCustomerData | null => {
        if (!text.trim()) return null;

        const lines = text.split("\n");
        let customerName = "";
        let customerPhone = "";
        let customerAddress = "";
        let CODAmount = "";

        for (const line of lines) {
            const lowerLine = line.toLowerCase().trim();

            // Extract Name
            if (lowerLine.startsWith("name:")) {
                customerName = line.substring(line.indexOf(":") + 1).trim();
            }
            // Extract Phone
            else if (lowerLine.startsWith("phone:")) {
                customerPhone = line.substring(line.indexOf(":") + 1).trim();
            }
            // Extract Address
            else if (lowerLine.startsWith("address:") || lowerLine.startsWith("adress:")) {
                customerAddress = line.substring(line.indexOf(":") + 1).trim();
            }

            // Extract Price
            else if (lowerLine.startsWith("price:")) {
                CODAmount = line.substring(line.indexOf(":") + 1).trim();
            }
        }

        // Return parsed data if at least name or phone is found
        if (customerName || customerPhone) {
            return {
                customerName: customerName,
                customerPhone: customerPhone,
                customerAddress: customerAddress,
                CODAmount: CODAmount,
            };
        }

        return null;
    };

    // Handle Generate button click
    const handleGenerateOrder = () => {
        const parsedCustomer = parseCustomerData(orderText);

        if (parsedCustomer) {
            setCustomerState({
                customerName: parsedCustomer.customerName || "",
                customerPhone: parsedCustomer.customerPhone || "",
                customerAddress: parsedCustomer.customerAddress || "",
                customerId: "",
            });

            setOrderDetails({
                deliveryZoneId: "",
                discountedPrice: parseFloat(parsedCustomer.CODAmount) || 0,
            });

            // Initialize empty product info so users can add products manually
            setProductInfo([]);

            toast.success("Customer data extracted successfully!");

            // Check fraud if phone number is available
            if (parsedCustomer.customerPhone) {
                checkFraud(parsedCustomer.customerPhone);
            }
        } else {
            toast.error(
                "Could not extract customer data. Please use format: Name: [name], Phone: [phone], Address: [address]"
            );
        }
    };

    const resetForm = () => {
        setOrderText("");
        setCustomerState(null);
        setProductInfo(null);
        setOrderDetails({
            deliveryZoneId: "",
            discountedPrice: undefined,
        });
        setFraudState(null);
        setFraudError(null);
        setIsCheckingFraud(false);
    };

    return (
        <section className="max-w-7xl space-y-6">
            <OrderInput
                orderText={orderText}
                setOrderText={setOrderText}
                onGenerate={handleGenerateOrder}
                isProcessing={false}
                onReset={resetForm}
                hasData={Boolean(customerState || productInfo)}
            />

            {/* Fraud Checker Section */}
            {customerState && (fraudState || fraudError || isCheckingFraud) && (
                <FraudChecker
                    fraudState={fraudState}
                    error={fraudError}
                    onCheckFraud={checkFraud}
                    customerPhone={customerState.customerPhone}
                    isChecking={isCheckingFraud}
                />
            )}

            {/* customer info  */}
            {customerState && (
                <CustomerInfo customerState={customerState} onCustomerStateChange={handleCustomerStateChange} />
            )}

            {/* Order Details */}
            {customerState && productInfo !== null && (
                <OrderDetails orderDetails={orderDetails} setOrderDetails={setOrderDetails} />
            )}

            {/* Order History */}
            {customerState && <OrderInfo customerPhoneNumber={customerState.customerPhone} />}

            {/* Product Info */}
            {customerState && productInfo !== null && (
                <ProductInfoOrder
                    customerInfo={customerState}
                    productInfo={productInfo}
                    onReset={resetForm}
                    orderDetails={orderDetails}
                    setOrderDetails={setOrderDetails}
                    fraudState={fraudState}
                    orderSource={OrderSource.MANUAL_ORDER}
                />
            )}
        </section>
    );
};

export default Page;
