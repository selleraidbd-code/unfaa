"use client";

import { useMemo } from "react";
import Link from "next/link";

import OrdersPage from "@/features/orders/components/orders-page";
import { useGetShopSubscriptionsQuery } from "@/redux/api/shop-subscription-api";
import { useAppSelector } from "@/redux/store/hook";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent } from "@workspace/ui/components/card";
import { AlertCircle, Crown } from "lucide-react";

const Page = () => {
    const user = useAppSelector((state) => state.auth.user);
    const shopId = user?.shop?.id || "";

    const { data: shopSubscriptions, isLoading } = useGetShopSubscriptionsQuery(
        {
            shopId,
        },
        { skip: !shopId }
    );

    const hasActiveSubscription = useMemo(() => {
        const items = shopSubscriptions?.data ?? [];
        return items.length > 0;
    }, [shopSubscriptions]);

    if (isLoading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <div className="text-muted-foreground">Loading...</div>
            </div>
        );
    }

    if (!hasActiveSubscription) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center p-4">
                <Card className="w-full max-w-2xl border-orange-200 bg-orange-50/50 dark:border-orange-800 dark:bg-orange-950/20">
                    <CardContent className="space-y-6 p-8 text-center">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/30">
                            <Crown className="h-8 w-8 text-orange-600 dark:text-orange-400" />
                        </div>

                        <div className="space-y-2">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                Subscription Required
                            </h2>
                            <p className="text-muted-foreground text-base">
                                To access the orders page and manage your orders, you need an active subscription plan.
                            </p>
                        </div>

                        <div className="flex items-start gap-3 rounded-lg border border-orange-200 bg-white p-4 text-left dark:border-orange-800 dark:bg-orange-950/10">
                            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-orange-600 dark:text-orange-400" />
                            <div className="space-y-1 text-sm">
                                <p className="font-medium text-gray-900 dark:text-gray-100">
                                    Why do I need a subscription?
                                </p>
                                <p className="text-muted-foreground">
                                    Our subscription plans unlock powerful features including order management,
                                    analytics, customer insights, and more to help you grow your business.
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                            <Button asChild size="lg" className="bg-orange-600 hover:bg-orange-700">
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

    return <OrdersPage user={user} />;
};

export default Page;
