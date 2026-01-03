import { useCallback, useEffect, useState } from "react";

import { useReCheckCourierStatusMutation } from "@/redux/api/couriar-api";

const STORAGE_KEY = "last_courier_status_update";
const ONE_HOUR_MS = 60 * 60 * 1000; // 1 hour in milliseconds

interface UseUpdateCourierStatusProps {
    shopId: string | undefined;
}

interface UseUpdateCourierStatusReturn {
    isButtonEnabled: boolean;
    isUpdating: boolean;
    timeRemaining: number | null; // seconds remaining
    updateAllStatuses: () => Promise<void>;
}

export const useUpdateCourierStatus = ({ shopId }: UseUpdateCourierStatusProps): UseUpdateCourierStatusReturn => {
    const [isUpdating, setIsUpdating] = useState(false);
    const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
    const [reCheckCourierStatus] = useReCheckCourierStatusMutation();

    // Check if button should be enabled based on localStorage
    const checkButtonState = useCallback(() => {
        if (typeof window === "undefined") return false;

        const lastUpdateTime = localStorage.getItem(STORAGE_KEY);
        if (!lastUpdateTime) return true; // Never updated, button enabled

        const lastUpdate = parseInt(lastUpdateTime, 10);
        const now = Date.now();
        const timeSinceLastUpdate = now - lastUpdate;

        if (timeSinceLastUpdate >= ONE_HOUR_MS) {
            setTimeRemaining(null);
            return true; // 1 hour has passed, button enabled
        }

        // Calculate remaining time
        const remaining = Math.ceil((ONE_HOUR_MS - timeSinceLastUpdate) / 1000);
        setTimeRemaining(remaining);
        return false; // Less than 1 hour, button disabled
    }, []);

    const [isButtonEnabled, setIsButtonEnabled] = useState(() => checkButtonState());

    // Update button state and countdown timer
    useEffect(() => {
        const updateState = () => {
            const enabled = checkButtonState();
            setIsButtonEnabled(enabled);
        };

        // Initial check
        updateState();

        // Update every second to show countdown
        const interval = setInterval(() => {
            updateState();
        }, 1000);

        return () => clearInterval(interval);
    }, [checkButtonState]);

    // Update all courier statuses with a single API call
    const updateAllStatuses = useCallback(async () => {
        if (!shopId || isUpdating) {
            return;
        }

        setIsUpdating(true);

        try {
            // Make a single API call with shopId
            await reCheckCourierStatus({ shopId }).unwrap();

            // Store the update time in localStorage
            if (typeof window !== "undefined") {
                localStorage.setItem(STORAGE_KEY, Date.now().toString());
            }

            // Reset button state
            setIsButtonEnabled(false);
            setTimeRemaining(ONE_HOUR_MS / 1000);
        } catch (error) {
            console.error("Error updating courier statuses:", error);
        } finally {
            setIsUpdating(false);
        }
    }, [shopId, isUpdating, reCheckCourierStatus]);

    return {
        isButtonEnabled,
        isUpdating,
        timeRemaining,
        updateAllStatuses,
    };
};
