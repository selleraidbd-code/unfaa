"use client";

import { useCallback } from "react";

import { formatPhoneNumber } from "@/lib/format-number-utils";

const ORDER_LIMIT_PER_DAY = 5;
const ORDER_LIMIT_STORAGE_KEY = "order_limit_tracker";
const CHECKOUT_FORM_STORAGE_KEY = "checkout_form";

interface OrderLimitEntry {
    phone: string;
    date: string; // YYYY-MM-DD format
    count: number;
}

interface OrderLimitData {
    entries: OrderLimitEntry[];
}

interface CheckoutFormData {
    name: string;
    address: string;
    phone: string;
}

/**
 * Hook to manage checkout-related functionality:
 * - Daily order limits per phone number (5 orders per day)
 * - Checkout form data persistence
 */
export const useOrderDataManageLocally = () => {
    /**
     * Get today's date in YYYY-MM-DD format (local timezone)
     */
    const getTodayDate = useCallback((): string => {
        const today = new Date();
        // Use local timezone to get the correct date
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, "0");
        const day = String(today.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    }, []);

    /**
     * Clean up old entries (older than today)
     */
    const cleanupOldEntries = useCallback(
        (data: OrderLimitData): OrderLimitData => {
            const today = getTodayDate();
            return {
                entries: data.entries.filter((entry) => entry.date === today),
            };
        },
        [getTodayDate]
    );

    /**
     * Get current order limit data from localStorage
     * Automatically cleans up old entries and saves the cleaned data back
     */
    const getOrderLimitData = useCallback((): OrderLimitData => {
        try {
            const stored = localStorage.getItem(ORDER_LIMIT_STORAGE_KEY);
            if (!stored) {
                return { entries: [] };
            }
            const data: OrderLimitData = JSON.parse(stored);
            // Clean up old entries
            const cleanedData = cleanupOldEntries(data);
            // Save cleaned data back to localStorage to remove old entries
            if (cleanedData.entries.length !== data.entries.length) {
                localStorage.setItem(ORDER_LIMIT_STORAGE_KEY, JSON.stringify(cleanedData));
            }
            return cleanedData;
        } catch (error) {
            console.error("Error reading order limit data:", error);
            return { entries: [] };
        }
    }, [cleanupOldEntries]);

    /**
     * Save order limit data to localStorage
     */
    const saveOrderLimitData = useCallback(
        (data: OrderLimitData) => {
            try {
                const cleanedData = cleanupOldEntries(data);
                localStorage.setItem(ORDER_LIMIT_STORAGE_KEY, JSON.stringify(cleanedData));
            } catch (error) {
                console.error("Error saving order limit data:", error);
            }
        },
        [cleanupOldEntries]
    );

    /**
     * Check if a phone number has reached the daily order limit
     * @param phoneNumber - Phone number to check (can be in any format)
     * @returns Object with `isLimitReached` boolean and `remainingOrders` number
     */
    const checkOrderLimit = useCallback(
        (phoneNumber: string): { isLimitReached: boolean; remainingOrders: number; currentCount: number } => {
            if (!phoneNumber) {
                return { isLimitReached: false, remainingOrders: ORDER_LIMIT_PER_DAY, currentCount: 0 };
            }

            const normalizedPhone = formatPhoneNumber(phoneNumber);
            if (!normalizedPhone) {
                return { isLimitReached: false, remainingOrders: ORDER_LIMIT_PER_DAY, currentCount: 0 };
            }

            const data = getOrderLimitData();
            const today = getTodayDate();

            // Find entry for this phone number and today
            const entry = data.entries.find((e) => e.phone === normalizedPhone && e.date === today);

            const currentCount = entry?.count || 0;
            const remainingOrders = Math.max(0, ORDER_LIMIT_PER_DAY - currentCount);
            const isLimitReached = currentCount >= ORDER_LIMIT_PER_DAY;

            return { isLimitReached, remainingOrders, currentCount };
        },
        [getOrderLimitData, getTodayDate]
    );

    /**
     * Increment order count for a phone number
     * Should be called after a successful order
     * @param phoneNumber - Phone number to increment count for
     */
    const incrementOrderCount = useCallback(
        (phoneNumber: string) => {
            if (!phoneNumber) {
                return;
            }

            const normalizedPhone = formatPhoneNumber(phoneNumber);
            if (!normalizedPhone) {
                return;
            }

            const data = getOrderLimitData();
            const today = getTodayDate();

            // Find existing entry
            const entryIndex = data.entries.findIndex((e) => e.phone === normalizedPhone && e.date === today);

            if (entryIndex >= 0) {
                // Increment existing entry
                const entry = data.entries[entryIndex];
                if (entry) {
                    entry.count += 1;
                }
            } else {
                // Create new entry
                data.entries.push({
                    phone: normalizedPhone,
                    date: today,
                    count: 1,
                });
            }

            saveOrderLimitData(data);
        },
        [getOrderLimitData, getTodayDate, saveOrderLimitData]
    );

    /**
     * Get the error message to display when order limit is reached
     */
    const getLimitErrorMessage = useCallback((): string => {
        return "আমরা সত্যিই দুঃখিত, কিন্তু আপনার ফোন নম্বর দিয়ে আজকের দিনে সর্বোচ্চ ৫টি অর্ডার করা যাবে। অনুগ্রহ করে আগামীকাল আবার চেষ্টা করুন।";
    }, []);

    /**
     * Get saved checkout form data from localStorage
     */
    const getCheckoutFormData = useCallback((): CheckoutFormData | null => {
        try {
            const stored = localStorage.getItem(CHECKOUT_FORM_STORAGE_KEY);
            if (!stored) {
                return null;
            }
            const data: CheckoutFormData = JSON.parse(stored);
            return data;
        } catch (error) {
            console.error("Error reading checkout form data:", error);
            return null;
        }
    }, []);

    /**
     * Save checkout form data to localStorage
     */
    const saveCheckoutFormData = useCallback((formData: CheckoutFormData) => {
        try {
            localStorage.setItem(CHECKOUT_FORM_STORAGE_KEY, JSON.stringify(formData));
        } catch (error) {
            console.error("Error saving checkout form data:", error);
        }
    }, []);

    return {
        checkOrderLimit,
        incrementOrderCount,
        getLimitErrorMessage,
        getCheckoutFormData,
        saveCheckoutFormData,
        ORDER_LIMIT_PER_DAY,
    };
};
