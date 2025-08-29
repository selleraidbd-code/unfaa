"use client";

import { MonthlyTargetGauge } from "@/features/dashboard/Monthly-target-gauge";
import { SaleAndPaidStats } from "@/features/dashboard/SaleAndPaidStats";
import { StatsCard } from "@/features/dashboard/StatsCard";
import { TopCategories } from "@/features/dashboard/TopCategories";
import { BadgeDollarSign, HandCoins, ShoppingCart } from "lucide-react";

const TopStats = () => {
    return (
        <div className="grid grid-cols-4 grid-rows-3 gap-6">
            <StatsCard
                title="Total Sales"
                value={70231}
                icon={<BadgeDollarSign />}
            />

            <StatsCard
                title="Total Paid"
                value={55231}
                icon={<ShoppingCart />}
                isAmount={false}
            />
            <StatsCard title="Total Debt" value={15231} icon={<HandCoins />} />

            <TopCategories />

            <SaleAndPaidStats />

            <MonthlyTargetGauge />
        </div>
    );
};

export default TopStats;
