"use client";

import { useState } from "react";

import { useCreateShopSubscriptionMutation } from "@/redux/api/shop-subscription-api";
import { useAppSelector } from "@/redux/store/hook";
import { Button } from "@workspace/ui/components/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@workspace/ui/components/dialog";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { RadioGroup, RadioGroupItem } from "@workspace/ui/components/radio-group";
import { toast } from "@workspace/ui/components/sonner";

import type { SubscriptionCardPlan } from "./subscription-card";

interface SubscriptionPurchaseModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    plan: SubscriptionCardPlan | null;
}

const PAYMENT_METHODS = [
    { value: "bkash", label: "Bkash" },
    { value: "nagad", label: "Nagad" },
    { value: "rocket", label: "Rocket" },
];

export const SubscriptionPurchaseModal = ({ open, onOpenChange, plan }: SubscriptionPurchaseModalProps) => {
    const [paymentMethod, setPaymentMethod] = useState<string>("bkash");
    const [transactionId, setTransactionId] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const user = useAppSelector((state) => state.auth.user);
    const [createShopSubscription] = useCreateShopSubscriptionMutation();

    const handleClose = () => {
        if (isSubmitting) return;
        onOpenChange(false);
        setTransactionId("");
        setPaymentMethod("bkash");
    };

    if (!plan) {
        return null;
    }

    const paymentLabelPrefix = paymentMethod === "bkash" ? "Bkash" : paymentMethod === "nagad" ? "Nagad" : "Rocket";

    const handleSubmit = async () => {
        if (!user?.shop?.id) {
            toast.error("Shop not found for the current user.");
            return;
        }

        if (!plan.id) {
            toast.error("Subscription plan ID is missing.");
            return;
        }

        if (!transactionId.trim()) {
            toast.error("Please enter the transaction ID.");
            return;
        }

        setIsSubmitting(true);

        await createShopSubscription({
            shopId: user.shop.id,
            subscriptionId: plan.id,
            refaranceId: paymentMethod + "-" + transactionId.trim(),
        })
            .unwrap()
            .then(() => {
                toast.success("Subscription request submitted successfully.");
                handleClose();
                setIsSubmitting(false);
            })
            .catch((error) => {
                toast.error(error.data.message || "Failed to submit subscription request.");
                setIsSubmitting(false);
            });
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Confirm Subscription</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    <div className="bg-muted rounded-md p-3 text-sm">
                        <div className="flex items-center justify-between">
                            <span className="font-semibold">{plan.name}</span>
                            {plan.price > 0 && (
                                <span className="text-base font-bold">৳{plan.price.toLocaleString()}</span>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-sm font-medium">Payment Method</Label>
                        <RadioGroup
                            value={paymentMethod}
                            onValueChange={setPaymentMethod}
                            className="grid grid-cols-3 gap-2"
                        >
                            {PAYMENT_METHODS.map((method) => (
                                <Label
                                    key={method.value}
                                    className="data-[state=checked]:border-primary data-[state=checked]:bg-primary/5 flex cursor-pointer items-center justify-center gap-2 rounded-md border px-3 py-2 text-sm font-medium"
                                >
                                    <RadioGroupItem value={method.value} />
                                    {method.label}
                                </Label>
                            ))}
                        </RadioGroup>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="transactionId">{paymentLabelPrefix} transaction ID</Label>
                        <Input
                            id="transactionId"
                            placeholder="Enter transaction ID"
                            value={transactionId}
                            onChange={(e) => setTransactionId(e.target.value)}
                        />
                        <p className="text-muted-foreground text-xs">
                            This will be sent as the <span className="font-semibold">refaranceId</span> in the request
                            payload.
                        </p>
                    </div>
                </div>

                <DialogFooter className="mt-4">
                    <Button variant="outline" onClick={handleClose} disabled={isSubmitting}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} disabled={isSubmitting}>
                        {isSubmitting ? "Submitting..." : "Submit Request"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
