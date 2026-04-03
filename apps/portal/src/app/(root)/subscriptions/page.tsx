"use client";

import { useState } from "react";

import { SubscriptionCard, type SubscriptionCardPlan } from "@/features/subscription/subscription-card";
import { SubscriptionLoadingCard } from "@/features/subscription/subscription-loading-card";
import { SubscriptionPurchaseModal } from "@/features/subscription/subscription-purchase-modal";
import { useGetShopSubscriptionsQuery } from "@/redux/api/shop-subscription-api";
import { useGetSubscriptionPlansQuery } from "@/redux/api/subscription-api";
import { useAppSelector } from "@/redux/store/hook";
import { formatDateWithTime } from "@workspace/ui/lib/formateDate";

import { ShopSubscriptionStatus, type ShopSubscription } from "@/types/shop-subscription-type";
import type { SubscriptionPlan } from "@/types/subscription-plan-type";

function pickShopSubscriptionForPlan(items: ShopSubscription[], planId: string): ShopSubscription | null {
    const forPlan = items.filter((s) => s.subscriptionId === planId);
    if (!forPlan.length) return null;
    const byDate = (a: ShopSubscription, b: ShopSubscription) =>
        +new Date(b.createdAt) - +new Date(a.createdAt);
    const pickLatest = (status: ShopSubscriptionStatus) =>
        forPlan.filter((s) => s.status === status).sort(byDate)[0];
    return (
        pickLatest(ShopSubscriptionStatus.ACTIVE) ??
        pickLatest(ShopSubscriptionStatus.UNDER_REVIEW) ??
        pickLatest(ShopSubscriptionStatus.EXPIRED) ??
        null
    );
}

function planToCard(plan: SubscriptionPlan & { discountPrice?: number }): SubscriptionCardPlan {
    const originalPrice = plan.discountPrice ?? plan.price;
    const price = plan.price;
    const savings = Math.max(0, originalPrice - price);
    const isPopular = plan.duration === 90 || plan.duration === 365;
    return {
        id: "id" in plan ? (plan as SubscriptionPlan).id : undefined,
        name: plan.name,
        originalPrice,
        price,
        savings,
        description: plan.description,
        features: plan.features ?? [],
        isFree: plan.isFree,
        isTrial: plan.isTrial,
        popular: isPopular,
    };
}

const SubscriptionsPage = () => {
    const user = useAppSelector((state) => state.auth.user);
    const shopId = user?.shop?.id || "";

    const { data, isLoading, isError } = useGetSubscriptionPlansQuery({
        limit: 20,
        isActive: "true",
    });

    const { data: shopSubscriptions } = useGetShopSubscriptionsQuery({ shopId }, { skip: !shopId });

    const [selectedPlan, setSelectedPlan] = useState<SubscriptionCardPlan | null>(null);
    const [modalOpen, setModalOpen] = useState(false);

    const plansFromApi = data?.data ?? [];

    const shopSubItems = shopSubscriptions?.data ?? [];

    const plans: SubscriptionCardPlan[] =
        plansFromApi.length > 0
            ? plansFromApi
                  .filter((p) => p.price > 0)
                  .map((p) => {
                      const base = planToCard({ ...p, discountPrice: p.discountPrice });
                      if (!p.id) return base;

                      const matched = pickShopSubscriptionForPlan(shopSubItems, p.id);
                      if (!matched) return base;

                      const next: SubscriptionCardPlan = {
                          ...base,
                          subscriptionStatus: matched.status,
                          isActive: matched.status === ShopSubscriptionStatus.ACTIVE,
                      };

                      if (matched.status === ShopSubscriptionStatus.ACTIVE && p.duration) {
                          const createdAt = new Date(matched.createdAt);
                          const expiryDate = new Date(createdAt);
                          expiryDate.setDate(expiryDate.getDate() + p.duration);
                          const now = new Date();
                          const diffMs = expiryDate.getTime() - now.getTime();
                          next.remainingDays = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
                          next.expiryDateText = formatDateWithTime(expiryDate.toISOString());
                      }

                      return next;
                  })
            : [];

    const handleCardClick = (plan: SubscriptionCardPlan) => {
        setSelectedPlan(plan);
        setModalOpen(true);
    };

    return (
        <div className="mx-auto max-w-7xl px-4 py-4">
            <div className="mb-8 text-center">
                <h1 className="mb-1 text-xl font-bold tracking-tight sm:text-3xl md:text-4xl">
                    Choose The Plan To Grow Your Business
                </h1>
                <p className="text-muted-foreground text-sm md:text-lg">
                    No hidden fees. Flexible pricing. Try any plan free for 3 days.
                </p>
            </div>

            {isLoading ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {[1, 2, 3, 4].map((i) => (
                        <SubscriptionLoadingCard key={i} />
                    ))}
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {plans.map((plan) => (
                        <SubscriptionCard
                            key={plan.id ?? plan.name}
                            plan={plan}
                            onClick={() => handleCardClick(plan)}
                        />
                    ))}
                </div>
            )}

            {isError && plans.length === 0 && (
                <p className="text-muted-foreground text-center">Unable to load plans. Please try again later.</p>
            )}

            {selectedPlan && modalOpen && (
                <SubscriptionPurchaseModal open={modalOpen} onOpenChange={setModalOpen} plan={selectedPlan} />
            )}
        </div>
    );
};

export default SubscriptionsPage;
