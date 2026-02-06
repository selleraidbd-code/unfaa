"use client";

import { useState } from "react";

import { User } from "@/features/auth/auth-type";
import {
    useCreateShopSubscriptionMutation,
    useUpdateShopSubscriptionStatusMutation,
} from "@/redux/api/shop-subscription-api";
import { useGetSubscriptionPlansQuery } from "@/redux/api/subscription-api";
import { Button } from "@workspace/ui/components/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@workspace/ui/components/dialog";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { RadioGroup, RadioGroupItem } from "@workspace/ui/components/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@workspace/ui/components/select";
import { toast } from "@workspace/ui/components/sonner";

import { ShopSubscriptionStatus } from "@/types/shop-subscription-type";

const PAYMENT_METHODS = [
    { value: "bkash", label: "Bkash" },
    { value: "nagad", label: "Nagad" },
    { value: "rocket", label: "Rocket" },
];

const STATUS_OPTIONS = [
    { value: ShopSubscriptionStatus.UNDER_REVIEW, label: "Under Review" },
    { value: ShopSubscriptionStatus.ACTIVE, label: "Active" },
];

interface AssignSubscriptionModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    seller: User | null;
    onSuccess?: () => void;
}

export const AssignSubscriptionModal = ({ open, onOpenChange, seller, onSuccess }: AssignSubscriptionModalProps) => {
    const [planId, setPlanId] = useState<string>("");
    const [status, setStatus] = useState<ShopSubscriptionStatus>(ShopSubscriptionStatus.UNDER_REVIEW);
    const [paymentMethod, setPaymentMethod] = useState<string>("bkash");
    const [transactionId, setTransactionId] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { data: plansData } = useGetSubscriptionPlansQuery({ limit: 50 });
    const [createShopSubscription] = useCreateShopSubscriptionMutation();
    const [updateStatus] = useUpdateShopSubscriptionStatusMutation();

    const plans = plansData?.data ?? [];

    const handleClose = () => {
        if (isSubmitting) return;
        onOpenChange(false);
        setPlanId("");
        setStatus(ShopSubscriptionStatus.UNDER_REVIEW);
        setTransactionId("");
        setPaymentMethod("bkash");
    };

    const handleSubmit = async () => {
        if (!seller?.shop?.id) {
            toast.error("This seller has no shop.");
            return;
        }
        if (!planId.trim()) {
            toast.error("Please select a plan.");
            return;
        }

        const refaranceId = transactionId.trim() ? `${paymentMethod}-${transactionId.trim()}` : "admin-assigned";

        try {
            setIsSubmitting(true);

            const result = await createShopSubscription({
                shopId: seller.shop.id,
                subscriptionId: planId,
                refaranceId,
                status,
            }).unwrap();

            const created = result?.data;

            if (status === ShopSubscriptionStatus.ACTIVE && created?.id && created.shopId && created.subscriptionId) {
                await updateStatus({
                    id: created.id,
                    shopId: created.shopId,
                    subscriptionId: created.subscriptionId,
                    status: ShopSubscriptionStatus.ACTIVE,
                }).unwrap();
            }

            toast.success(
                status === ShopSubscriptionStatus.ACTIVE
                    ? "Subscription assigned and activated."
                    : "Subscription assigned. It will appear under review."
            );
            onSuccess?.();
            handleClose();
        } catch {
            toast.error("Failed to assign subscription.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!seller) return null;

    const paymentLabelPrefix = paymentMethod === "bkash" ? "Bkash" : paymentMethod === "nagad" ? "Nagad" : "Rocket";

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Assign Subscription</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    <p className="text-muted-foreground text-sm">
                        Assign a subscription plan to <strong>{seller.name}</strong> ({seller.email}). Shop:{" "}
                        {seller.shop?.name ?? seller.shop?.id ?? "—"}
                    </p>

                    <div className="space-y-2">
                        <Label>Plan</Label>
                        <Select value={planId} onValueChange={setPlanId}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a plan" />
                            </SelectTrigger>
                            <SelectContent>
                                {plans.map((plan) => (
                                    <SelectItem key={plan.id} value={plan.id}>
                                        {plan.name} — ৳{plan.price.toLocaleString()}
                                        {plan.durationName ? ` (${plan.durationName})` : ""}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Status</Label>
                        <Select value={status} onValueChange={(v) => setStatus(v as ShopSubscriptionStatus)}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {STATUS_OPTIONS.map((opt) => (
                                    <SelectItem key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-sm font-medium">Payment Method (optional)</Label>
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
                        <Label htmlFor="assign-txn-id">{paymentLabelPrefix} transaction ID (optional)</Label>
                        <Input
                            id="assign-txn-id"
                            placeholder="Leave empty for admin-assigned"
                            value={transactionId}
                            onChange={(e) => setTransactionId(e.target.value)}
                        />
                        <p className="text-muted-foreground text-xs">
                            Reference will be saved as <span className="font-semibold">refaranceId</span>. Use
                            &quot;admin-assigned&quot; if left empty.
                        </p>
                    </div>
                </div>

                <DialogFooter className="mt-4">
                    <Button variant="outline" onClick={handleClose} disabled={isSubmitting}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} disabled={isSubmitting}>
                        {isSubmitting ? "Assigning..." : "Assign Subscription"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
