"use client";

import { ShopSubscriptionStatus } from "@/types/shop-subscription-type";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent, CardHeader } from "@workspace/ui/components/card";
import { cn } from "@workspace/ui/lib/utils";
import { ArrowRight, Check } from "lucide-react";

export interface SubscriptionCardPlan {
    id?: string;
    name: string;
    originalPrice: number;
    price: number;
    savings: number;
    description?: string;
    features: string[];
    isFree: boolean;
    isTrial: boolean;
    popular?: boolean;
    isActive?: boolean;
    /** When set, reflects the shop subscription row for this plan (active / under review / expired). */
    subscriptionStatus?: ShopSubscriptionStatus;
    remainingDays?: number | null;
    expiryDateText?: string | null;
}

interface SubscriptionCardProps {
    plan: SubscriptionCardPlan;
    onClick?: () => void;
}

export const SubscriptionCard = ({ plan, onClick }: SubscriptionCardProps) => {
    const status =
        plan.subscriptionStatus ??
        (plan.isActive ? ShopSubscriptionStatus.ACTIVE : undefined);

    const isActivePlan = status === ShopSubscriptionStatus.ACTIVE;
    const isPendingPlan = status === ShopSubscriptionStatus.UNDER_REVIEW;
    const isExpiredPlan = status === ShopSubscriptionStatus.EXPIRED;
    const hasShopSubscriptionState = isActivePlan || isPendingPlan || isExpiredPlan;

    const cardClassName = cn(
        "bg-card relative flex flex-col transition-shadow",
        !(isActivePlan || isPendingPlan) && "cursor-pointer hover:shadow-lg",
        (isActivePlan || isPendingPlan) && "cursor-default",
        isActivePlan && "border-primary ring-primary bg-primary/5 border ring-1",
        isPendingPlan &&
            "border-amber-300 bg-amber-50/40 ring-1 ring-amber-400/30 dark:border-amber-500/35 dark:bg-amber-950/25 dark:ring-amber-400/15",
        isExpiredPlan &&
            "border-muted-foreground/25 bg-muted/30 ring-1 ring-muted-foreground/10 dark:bg-muted/20"
    );

    const handleClick = () => {
        if (isActivePlan || isPendingPlan) return;
        onClick?.();
    };

    const showExpiryInfo = isActivePlan && plan.remainingDays != null && plan.expiryDateText;

    return (
        <Card className={cardClassName} onClick={handleClick}>
            <div className="absolute -top-3 left-1/2 flex -translate-x-1/2 flex-wrap justify-center gap-2">
                {isActivePlan && (
                    <Badge className="border-primary bg-primary text-primary-foreground shadow-sm">Active plan</Badge>
                )}
                {isPendingPlan && (
                    <Badge className="border-amber-300 bg-amber-100 text-amber-900 shadow-sm dark:border-amber-500/40 dark:bg-amber-950/60 dark:text-amber-100">
                        Under review
                    </Badge>
                )}
                {isExpiredPlan && (
                    <Badge variant="outline" className="border-red-300 bg-red-50 text-red-700 dark:border-red-500/40 dark:bg-red-950/40 dark:text-red-200">
                        Expired
                    </Badge>
                )}
                {!hasShopSubscriptionState && plan.popular && (
                    <Badge className="border-blue-200 bg-blue-50 text-blue-600 dark:border-blue-500 dark:bg-blue-500 dark:text-white">
                        Popular
                    </Badge>
                )}
            </div>

            <CardHeader className="space-y-2 pb-2">
                <div>
                    <h3 className="text-xl font-bold">{plan.name}</h3>
                    {plan.description && (
                        <p className="mt-2 text-sm text-blue-600 dark:text-blue-400">{plan.description}</p>
                    )}
                </div>

                <div className="space-y-1">
                    {plan.originalPrice > plan.price && (
                        <div className="text-muted-foreground text-sm line-through">
                            ৳{plan.originalPrice.toLocaleString()}
                        </div>
                    )}
                    <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-bold">৳{plan.price.toLocaleString()}</span>
                        {plan.savings > 0 && (
                            <span className="text-muted-foreground text-sm">save ৳{plan.savings.toLocaleString()}</span>
                        )}
                    </div>
                </div>
            </CardHeader>

            <CardContent className="flex flex-1 flex-col space-y-6">
                <div className="flex-1 space-y-3">
                    <h4 className="font-bold">FEATURES</h4>
                    <ul className="space-y-3">
                        {plan.features.map((feature, index) => (
                            <li key={index} className="flex gap-3">
                                <Check className="mt-0.5 size-5 shrink-0 text-green-600 dark:text-green-500" />
                                <span className="text-sm">{feature}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {showExpiryInfo && (
                    <div className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600 dark:bg-red-950/35 dark:text-red-300">
                        {plan.remainingDays} day{plan.remainingDays === 1 ? "" : "s"} left (expires on{" "}
                        {plan.expiryDateText})
                    </div>
                )}

                {isPendingPlan && (
                    <p className="text-muted-foreground text-center text-sm">
                        We’ll activate this plan after your payment is verified.
                    </p>
                )}

                <Button
                    className={cn(
                        "w-full rounded-lg py-6 text-base font-medium",
                        isActivePlan && "bg-primary text-primary-foreground hover:bg-primary",
                        isPendingPlan &&
                            "bg-amber-600 text-white hover:bg-amber-600 dark:bg-amber-600 dark:hover:bg-amber-600",
                        !isActivePlan &&
                            !isPendingPlan &&
                            "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400"
                    )}
                    size="lg"
                    disabled={isActivePlan || isPendingPlan}
                >
                    {isActivePlan ? "Current plan" : isPendingPlan ? "Pending approval" : "Get started"}
                    {!isActivePlan && !isPendingPlan && <ArrowRight className="ml-2 size-5" />}
                </Button>
            </CardContent>
        </Card>
    );
};
