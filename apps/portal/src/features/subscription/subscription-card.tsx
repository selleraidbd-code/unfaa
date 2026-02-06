"use client";

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
    remainingDays?: number | null;
    expiryDateText?: string | null;
}

interface SubscriptionCardProps {
    plan: SubscriptionCardPlan;
    onClick?: () => void;
}

export const SubscriptionCard = ({ plan, onClick }: SubscriptionCardProps) => {
    const cardClassName = cn(
        "bg-card relative flex cursor-pointer flex-col transition-shadow hover:shadow-lg",
        plan.isActive && "border-primary ring-primary bg-primary/5 border ring-1"
    );

    const handleClick = () => {
        if (plan.isActive) return;
        onClick?.();
    };

    const showExpiryInfo = plan.isActive && plan.remainingDays != null && plan.expiryDateText;

    return (
        <Card className={cardClassName} onClick={handleClick}>
            <div className="absolute -top-3 left-1/2 flex -translate-x-1/2 gap-2">
                {plan.isActive && (
                    <Badge className="border-primary bg-primary text-primary-foreground shadow-sm">Active plan</Badge>
                )}
                {!plan.isActive && plan.popular && (
                    <Badge className="border-blue-200 bg-blue-50 text-blue-600 dark:border-blue-500 dark:bg-blue-500 dark:text-white">
                        Popular
                    </Badge>
                )}
            </div>

            <CardHeader className="space-y-2 pb-2">
                <div>
                    <h3 className="text-xl font-bold">{plan.name}</h3>
                    {plan.description && <p className="mt-2 text-sm text-blue-600">{plan.description}</p>}
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
                                <Check className="mt-0.5 size-5 shrink-0 text-green-600" />
                                <span className="text-sm">{feature}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {showExpiryInfo && (
                    <div className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
                        {plan.remainingDays} day{plan.remainingDays === 1 ? "" : "s"} left (expires on{" "}
                        {plan.expiryDateText})
                    </div>
                )}

                <Button
                    className={cn(
                        "w-full rounded-lg py-6 text-base font-medium",
                        plan.isActive
                            ? "bg-primary text-primary-foreground hover:bg-primary"
                            : "bg-blue-600 text-white hover:bg-blue-700"
                    )}
                    size="lg"
                    disabled={plan.isActive}
                >
                    {plan.isActive ? "Current plan" : "Get started"}
                    {!plan.isActive && <ArrowRight className="ml-2 size-5" />}
                </Button>
            </CardContent>
        </Card>
    );
};
