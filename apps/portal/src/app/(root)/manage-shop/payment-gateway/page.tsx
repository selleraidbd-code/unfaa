"use client";

import { ArrowBackButton } from "@/components/ui/custom-back-button";
import { Button } from "@workspace/ui/components/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@workspace/ui/components/card";
import { Checkbox } from "@workspace/ui/components/checkbox";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import {
    RadioGroup,
    RadioGroupItem,
} from "@workspace/ui/components/radio-group";
import { Textarea } from "@workspace/ui/components/textarea";
import { Check, Shield } from "lucide-react";
import { useState } from "react";

export default function PaymentGateway() {
    const [selectedMethod, setSelectedMethod] = useState("aamarpay");
    const [acceptTerms, setAcceptTerms] = useState(false);
    const [advancePayment, setAdvancePayment] = useState("full-payment");

    const paymentMethods = [
        {
            id: "zatiq",
            label: "Zatiq Secure Purchase",
            variant: "outline" as const,
        },
        { id: "cash", label: "Cash On Delivery", variant: "outline" as const },
        { id: "aamarpay", label: "AamarPay", variant: "default" as const },
        { id: "bkash", label: "bKash", variant: "outline" as const },
    ];

    const renderContent = () => {
        switch (selectedMethod) {
            case "zatiq":
                return (
                    <div className="space-y-6">
                        <Card>
                            <CardContent className="pt-6">
                                <div className="text-center space-y-4">
                                    <div className="flex justify-center">
                                        <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
                                            <Shield className="w-8 h-8 text-white" />
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold text-blue-600">
                                            Welcome to Zatiq
                                        </h3>
                                        <h2 className="text-2xl font-bold text-blue-600">
                                            Zatiq Secure Purchase
                                        </h2>
                                    </div>
                                    <p className="text-sm text-gray-600 max-w-md mx-auto">
                                        Zatiq Secure Purchase allows your
                                        customers to pay online, easily and
                                        securely using Unfaas payment framework.
                                        Activating this will make you a zatiqs
                                        vendor.
                                    </p>
                                    <Button className="w-full max-w-sm bg-blue-600 hover:bg-blue-700">
                                        Apply Now
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                        <AdvancePaymentSection
                            advancePayment={advancePayment}
                            setAdvancePayment={setAdvancePayment}
                        />
                    </div>
                );

            case "cash":
                return (
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="message">
                                Payment process message note
                            </Label>
                            <Textarea
                                id="message"
                                placeholder="Enter payment process message..."
                                className="min-h-[100px]"
                            />
                        </div>
                    </div>
                );

            case "aamarpay":
                return (
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">
                                    Configure AamarPay
                                </CardTitle>
                                <p className="text-sm text-gray-600">
                                    To get online payment please configure
                                    AamarPay. Don`&apos;`t have aamarpay
                                    account?{" "}
                                    <a
                                        href="#"
                                        className="text-blue-600 hover:underline"
                                    >
                                        Apply Now
                                    </a>
                                </p>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="store-id">
                                            Merchant Store Id
                                        </Label>
                                        <Input
                                            id="store-id"
                                            placeholder="Enter store ID"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="secret-key">
                                            Merchant Secret Key
                                        </Label>
                                        <Input
                                            id="secret-key"
                                            placeholder="Enter secret key"
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-end">
                                    <Button
                                        size="sm"
                                        className="bg-purple-600 hover:bg-purple-700"
                                    >
                                        Add <span className="ml-1">+</span>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                        <AdvancePaymentSection
                            advancePayment={advancePayment}
                            setAdvancePayment={setAdvancePayment}
                        />
                    </div>
                );

            case "bkash":
                return (
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">
                                    Configure bKash
                                </CardTitle>
                                <p className="text-sm text-gray-600">
                                    To get online payment please configure bKash
                                    merchant. Don`&apos;`t have bKash merchant
                                    account?{" "}
                                    <a
                                        href="#"
                                        className="text-blue-600 hover:underline"
                                    >
                                        Apply Now
                                    </a>
                                </p>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="app-key">
                                            Merchant App Key
                                        </Label>
                                        <Input
                                            id="app-key"
                                            placeholder="Enter app key"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="bkash-secret">
                                            Merchant Secret Key
                                        </Label>
                                        <Input
                                            id="bkash-secret"
                                            placeholder="Enter secret key"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="username">
                                            Merchant Username
                                        </Label>
                                        <Input
                                            id="username"
                                            placeholder="Enter username"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="password">
                                            Merchant Password
                                        </Label>
                                        <Input
                                            id="password"
                                            type="password"
                                            placeholder="Enter password"
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-end">
                                    <Button
                                        size="sm"
                                        className="bg-purple-600 hover:bg-purple-700"
                                    >
                                        Add <span className="ml-1">+</span>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                        <AdvancePaymentSection
                            advancePayment={advancePayment}
                            setAdvancePayment={setAdvancePayment}
                        />
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3">
                <ArrowBackButton
                    href="/manage-shop"
                    className="bg-blue-500/10 hover:bg-blue-500/20 border-blue-200 hover:border-blue-300 text-blue-600"
                />
                <h1 className="text-xl font-semibold">Payment Gateway</h1>
            </div>

            {/* Payment Methods */}
            <div className="space-y-4 ">
                <h2 className="text-lg font-medium">
                    Integrate Payment Methods
                </h2>
                <div className="flex flex-wrap gap-2">
                    {paymentMethods.map((method) => (
                        <Button
                            key={method.id}
                            variant={
                                selectedMethod === method.id
                                    ? "default"
                                    : "outline"
                            }
                            size="sm"
                            onClick={() => setSelectedMethod(method.id)}
                            className={`${
                                selectedMethod === method.id
                                    ? method.id === "aamarpay"
                                        ? "bg-purple-600 hover:bg-purple-700"
                                        : method.id === "bkash"
                                          ? "bg-pink-600 hover:bg-pink-700"
                                          : method.id === "zatiq"
                                            ? "bg-blue-600 hover:bg-blue-700"
                                            : "bg-purple-600 hover:bg-purple-700"
                                    : ""
                            }`}
                        >
                            {selectedMethod === method.id && (
                                <Check className="w-4 h-4 mr-1" />
                            )}
                            {method.label}
                        </Button>
                    ))}
                </div>
            </div>

            {/* Dynamic Content */}
            {renderContent()}

            {/* Terms and Conditions */}
            {selectedMethod !== "zatiq" && (
                <div className="space-y-4">
                    {selectedMethod !== "cash" && (
                        <div className="space-y-2">
                            <Label htmlFor="message-note">
                                Payment process message note
                            </Label>
                            <Textarea
                                id="message-note"
                                placeholder="Enter payment process message..."
                                className="min-h-[100px]"
                            />
                        </div>
                    )}

                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="terms"
                            checked={acceptTerms}
                            onCheckedChange={(checked) =>
                                setAcceptTerms(checked as boolean)
                            }
                        />
                        <Label htmlFor="terms" className="text-sm">
                            Make sure you accept all of our{" "}
                            <a
                                href="#"
                                className="text-blue-600 hover:underline"
                            >
                                terms and conditions
                            </a>
                            .
                        </Label>
                    </div>

                    <div className="flex justify-end">
                        <Button className="bg-purple-600 hover:bg-purple-700">
                            Update Payment Info
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}

function AdvancePaymentSection({
    advancePayment,
    setAdvancePayment,
}: {
    advancePayment: string;
    setAdvancePayment: (value: string) => void;
}) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg">
                    Set your advance payment
                </CardTitle>
                <p className="text-sm text-gray-600">
                    Select how much amount you want to get advance from
                    customer.
                </p>
            </CardHeader>
            <CardContent>
                <RadioGroup
                    value={advancePayment}
                    onValueChange={setAdvancePayment}
                >
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem
                            value="full-payment"
                            id="full-payment"
                        />
                        <Label htmlFor="full-payment">Full Payment</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem
                            value="delivery-charge"
                            id="delivery-charge"
                        />
                        <Label htmlFor="delivery-charge">
                            Delivery Charge Only
                        </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="percentage" id="percentage" />
                        <Label htmlFor="percentage">Percentage</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem
                            value="fixed-amount"
                            id="fixed-amount"
                        />
                        <Label htmlFor="fixed-amount">Fixed Amount</Label>
                    </div>
                </RadioGroup>
                {advancePayment === "fixed-amount" && (
                    <div className="mt-4">
                        <Input placeholder="0" className="w-32" />
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
