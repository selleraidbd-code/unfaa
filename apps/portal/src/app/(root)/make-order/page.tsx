"use client";

import { useState } from "react";

import { CustomerInfo } from "@/features/ai-order/customer-info";
import { FraudChecker } from "@/features/ai-order/fraud-checker";
import { isValidBdPhoneNumber, isValidId } from "@/features/ai-order/lib";
import { OrderDetails } from "@/features/ai-order/order-details";
import { OrderInfo } from "@/features/ai-order/order-info";
import { OrderInput } from "@/features/ai-order/order-input";
import { ProductInfoOrder } from "@/features/ai-order/product-info-order";
import { CustomerState } from "@/features/ai-order/types";
import { useGetFraudCheckerDataMutation } from "@/redux/api/customer-api";
import { toast } from "@workspace/ui/components/sonner";

import { Customer, FraudCheckerData } from "@/types/customer-type";
import { AIOrderGenerationProductInfo, OrderDetailsType, OrderStatus } from "@/types/order-type";

export type OrderDetails = {
    orderNotes: string;
    deliveryAddress: string;
    orderStatus: OrderStatus;
    assignedTo: string;
    deliveryId: string;
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
        const sanitizedPhone = phoneNumber.replace(/\D/g, "");
        await getFraudCheckerData({ phoneNumber: sanitizedPhone })
            .unwrap()
            .then((res) => {
                console.log(res);
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
                console.log(error);
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
    const parseCustomerData = (text: string): Partial<Customer> | null => {
        if (!text.trim()) return null;

        const lines = text.split("\n");
        let customerName = "";
        let customerPhone = "";
        let customerAddress = "";

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
        }

        // Return parsed data if at least name or phone is found
        if (customerName || customerPhone) {
            return {
                name: customerName,
                phoneNumber: customerPhone,
                address: customerAddress,
                email: "", // Default empty email
                id: "", // ID will be generated on creation
                createdAt: "",
                updatedAt: "",
            };
        }

        return null;
    };

    // Handle Generate button click
    const handleGenerateOrder = () => {
        const parsedCustomer = parseCustomerData(orderText);

        if (parsedCustomer) {
            // Set the parsed customer data

            // Set customer state for the CustomerInfo component
            setCustomerState({
                customerName: parsedCustomer.name || "",
                customerPhone: parsedCustomer.phoneNumber || "",
                customerAddress: parsedCustomer.address || "",
                customerId: parsedCustomer.id || "",
            });

            // Initialize empty product info so users can add products manually
            setProductInfo([]);

            toast.success("Customer data extracted successfully!");

            // Check fraud if phone number is available
            if (parsedCustomer.phoneNumber) {
                checkFraud(parsedCustomer.phoneNumber);
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
            {customerState && isValidId(customerState.customerId) && (
                <OrderInfo customerId={customerState.customerId} />
            )}

            {/* Product Info */}
            {customerState && productInfo !== null && (
                <ProductInfoOrder
                    customerInfo={customerState}
                    productInfo={productInfo}
                    onReset={resetForm}
                    orderDetails={orderDetails}
                    setOrderDetails={setOrderDetails}
                    fraudState={fraudState}
                />
            )}
        </section>
    );
};

export default Page;
