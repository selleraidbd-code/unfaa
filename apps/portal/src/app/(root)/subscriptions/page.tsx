"use client";

import { useMemo, useState } from "react";

import { SubscriptionCard, type SubscriptionCardPlan } from "@/features/subscription/subscription-card";
import { SubscriptionLoadingCard } from "@/features/subscription/subscription-loading-card";
import { SubscriptionPurchaseModal } from "@/features/subscription/subscription-purchase-modal";
import { useGetShopSubscriptionsQuery } from "@/redux/api/shop-subscription-api";
import { useGetSubscriptionPlansQuery } from "@/redux/api/subscription-api";
import { useAppSelector } from "@/redux/store/hook";
import { formatDateWithTime } from "@workspace/ui/lib/formateDate";

import { ShopSubscriptionStatus, type ShopSubscription } from "@/types/shop-subscription-type";
import type { SubscriptionPlan } from "@/types/subscription-plan-type";

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

    const { data: shopSubscriptions } = useGetShopSubscriptionsQuery(
        {
            shopId,
            status: ShopSubscriptionStatus.ACTIVE,
        },
        { skip: !shopId }
    );

    const [selectedPlan, setSelectedPlan] = useState<SubscriptionCardPlan | null>(null);
    const [modalOpen, setModalOpen] = useState(false);

    const plansFromApi = data?.data ?? [];

    const activeSubscription = useMemo<ShopSubscription | null>(() => {
        const items = shopSubscriptions?.data ?? [];
        if (!items.length) return null;
        const latest = items.slice().sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))[0];
        return latest ?? null;
    }, [shopSubscriptions]);

    let highlightedPlanId: string | null = null;
    let remainingDays: number | null = null;
    let expiryDateText: string | null = null;

    if (activeSubscription && plansFromApi.length) {
        const matchedPlan = plansFromApi.find((p) => p.id === activeSubscription.subscriptionId);
        if (matchedPlan && matchedPlan.duration) {
            const createdAt = new Date(activeSubscription.createdAt);
            const expiryDate = new Date(createdAt);
            expiryDate.setDate(expiryDate.getDate() + matchedPlan.duration);

            const now = new Date();
            const diffMs = expiryDate.getTime() - now.getTime();
            remainingDays = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
            expiryDateText = formatDateWithTime(expiryDate.toISOString());
            highlightedPlanId = matchedPlan.id;
        }
    }

    const plans: SubscriptionCardPlan[] =
        plansFromApi.length > 0
            ? plansFromApi
                  .filter((p) => p.price > 0)
                  .map((p) => {
                      const base = planToCard({ ...p, discountPrice: p.discountPrice });
                      if (p.id && p.id === highlightedPlanId) {
                          return {
                              ...base,
                              isActive: true,
                              remainingDays,
                              expiryDateText,
                          };
                      }
                      return base;
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
