"use client";

import { memo } from "react";

export const CashOnDeliveryBanner = memo(function CashOnDeliveryBanner() {
    return (
        <div className="mb-6 rounded-xl bg-gradient-to-r from-red-600 to-red-400 p-2 text-center font-bold text-white md:p-6">
            <div className="text-lg leading-relaxed">
                🚚 আপনি রাইডারের সামনে প্রোডাক্ট চেক করে তারপরে রাইডারকে টাকা দিবেন।
                <br />
                💰 অগ্রীম এক টাকাও দেয়া লাগবে না!
            </div>
        </div>
    );
});
