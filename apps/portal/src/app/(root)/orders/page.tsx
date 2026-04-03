"use client";

import { useMemo } from "react";
import Link from "next/link";

import OrdersPage from "@/features/orders/components/orders-page";
import { useGetShopSubscriptionsQuery } from "@/redux/api/shop-subscription-api";
import { useAppSelector } from "@/redux/store/hook";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent } from "@workspace/ui/components/card";
import { AlertCircle, Clock, Crown } from "lucide-react";

import { ShopSubscriptionStatus } from "@/types/shop-subscription-type";

const Page = () => {
    const user = useAppSelector((state) => state.auth.user);
    const shopId = user?.shop?.id || "";

    const { data: shopSubscriptions, isLoading } = useGetShopSubscriptionsQuery(
        {
            shopId,
        },
        { skip: !shopId }
    );

    const hasShopSubscription = useMemo(() => {
        const items = shopSubscriptions?.data ?? [];
        return items.length > 0;
    }, [shopSubscriptions]);

    const isActiveSubscription = useMemo(() => {
        const items = shopSubscriptions?.data ?? [];
        return items.some((s) => s.status === ShopSubscriptionStatus.ACTIVE);
    }, [shopSubscriptions]);

    const inactiveSubscriptionKind = useMemo<"pending" | "expired" | "other" | null>(() => {
        const items = shopSubscriptions?.data ?? [];
        if (!items.length || items.some((s) => s.status === ShopSubscriptionStatus.ACTIVE)) {
            return null;
        }
        if (items.some((s) => s.status === ShopSubscriptionStatus.UNDER_REVIEW)) {
            return "pending";
        }
        if (items.some((s) => s.status === ShopSubscriptionStatus.EXPIRED)) {
            return "expired";
        }
        return "other";
    }, [shopSubscriptions]);

    if (isLoading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <div className="text-muted-foreground">Loading...</div>
            </div>
        );
    }

    if (!hasShopSubscription) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center p-4">
                <Card className="w-full max-w-2xl border-orange-200/90 bg-orange-50/60 shadow-sm dark:border-orange-500/25 dark:bg-orange-950/40 dark:shadow-lg dark:shadow-black/40 dark:ring-1 dark:ring-orange-400/10">
                    <CardContent className="space-y-6 p-8 text-center">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 shadow-inner dark:bg-orange-950/60 dark:shadow-none dark:ring-1 dark:ring-orange-400/20">
                            <Crown className="h-8 w-8 text-orange-600 dark:text-orange-300" />
                        </div>

                        <div className="space-y-2">
                            <h2 className="text-2xl font-bold text-foreground">Subscription Required</h2>
                            <p className="text-base text-muted-foreground">
                                To access the orders page and manage your orders, you need an active subscription plan.
                            </p>
                        </div>

                        <div className="flex items-start gap-3 rounded-lg border border-orange-200/90 bg-background/90 p-4 text-left backdrop-blur-sm dark:border-orange-500/20 dark:bg-muted/35">
                            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-orange-600 dark:text-orange-300" />
                            <div className="space-y-1 text-sm">
                                <p className="font-medium text-foreground">Why do I need a subscription?</p>
                                <p className="text-muted-foreground">
                                    Our subscription plans unlock powerful features including order management,
                                    analytics, customer insights, and more to help you grow your business.
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                            <Button
                                asChild
                                size="lg"
                                className="bg-orange-600 text-white hover:bg-orange-700 dark:bg-orange-500 dark:text-white dark:hover:bg-orange-400"
                            >
                                <Link href="/subscriptions">
                                    <Crown className="mr-2 h-4 w-4" />
                                    View Subscription Plans
                                </Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (!isActiveSubscription && inactiveSubscriptionKind) {
        const isPending = inactiveSubscriptionKind === "pending";
        const isExpired = inactiveSubscriptionKind === "expired";

        const title = isPending
            ? "Subscription pending activation"
            : isExpired
              ? "Subscription expired"
              : "Subscription not active";

        const description = isPending
            ? "You have a subscription request on file, but it is still under review. Order management will unlock once an administrator approves it."
            : isExpired
              ? "Your shop’s subscription is no longer active. Renew a plan to access orders and other subscription features."
              : "Your subscription is not active yet. Please check its status or choose a plan to continue.";

        const infoTitle = isPending ? "What happens next?" : isExpired ? "Renew to continue" : "Need help?";

        const infoBody = isPending
            ? "You will get access automatically after approval. If it has been a while, you can contact support or review your subscription from the plans page."
            : isExpired
              ? "Pick a new plan or extend your subscription so your shop stays fully enabled."
              : "Open subscription plans to see your options or the status of your current subscription.";

        return (
            <div className="flex min-h-[60vh] items-center justify-center p-4">
                <Card
                    className={
                        isPending
                            ? "w-full max-w-2xl border-amber-200/90 bg-amber-50/60 shadow-sm dark:border-amber-500/25 dark:bg-amber-950/40 dark:shadow-lg dark:shadow-black/40 dark:ring-1 dark:ring-amber-400/10"
                            : "w-full max-w-2xl border-orange-200/90 bg-orange-50/60 shadow-sm dark:border-orange-500/25 dark:bg-orange-950/40 dark:shadow-lg dark:shadow-black/40 dark:ring-1 dark:ring-orange-400/10"
                    }
                >
                    <CardContent className="space-y-6 p-8 text-center">
                        <div
                            className={
                                isPending
                                    ? "mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 shadow-inner dark:bg-amber-950/60 dark:shadow-none dark:ring-1 dark:ring-amber-400/25"
                                    : "mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 shadow-inner dark:bg-orange-950/60 dark:shadow-none dark:ring-1 dark:ring-orange-400/20"
                            }
                        >
                            {isPending ? (
                                <Clock className="h-8 w-8 text-amber-600 dark:text-amber-300" />
                            ) : (
                                <Crown className="h-8 w-8 text-orange-600 dark:text-orange-300" />
                            )}
                        </div>

                        <div className="space-y-2">
                            <h2 className="text-2xl font-bold text-foreground">{title}</h2>
                            <p className="text-base text-muted-foreground">{description}</p>
                        </div>

                        <div
                            className={
                                isPending
                                    ? "flex items-start gap-3 rounded-lg border border-amber-200/90 bg-background/90 p-4 text-left backdrop-blur-sm dark:border-amber-500/20 dark:bg-muted/35"
                                    : "flex items-start gap-3 rounded-lg border border-orange-200/90 bg-background/90 p-4 text-left backdrop-blur-sm dark:border-orange-500/20 dark:bg-muted/35"
                            }
                        >
                            <AlertCircle
                                className={
                                    isPending
                                        ? "mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-300"
                                        : "mt-0.5 h-5 w-5 shrink-0 text-orange-600 dark:text-orange-300"
                                }
                            />
                            <div className="space-y-1 text-sm">
                                <p className="font-medium text-foreground">{infoTitle}</p>
                                <p className="text-muted-foreground">{infoBody}</p>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                            <Button
                                asChild
                                size="lg"
                                className="bg-orange-600 text-white hover:bg-orange-700 dark:bg-orange-500 dark:text-white dark:hover:bg-orange-400"
                            >
                                <Link href="/subscriptions">
                                    <Crown className="mr-2 h-4 w-4" />
                                    {isPending ? "View subscription status" : "View subscription plans"}
                                </Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return <OrdersPage user={user} />;
};

export default Page;
