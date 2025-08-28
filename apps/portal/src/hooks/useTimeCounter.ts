import { useCallback, useEffect, useState } from "react";

const useTimeCounter = (initialSeconds: number): { countingTime: number; isEnd: boolean; reset: () => void } => {
    const [countingTime, setCountingTime] = useState(initialSeconds);
    const [isEnd, setIsEnd] = useState(false);

    useEffect(() => {
        if (countingTime > 0 && !isEnd) {
            const interval = setInterval(() => {
                setCountingTime((prev) => {
                    if (prev === 1) {
                        setIsEnd(true);
                        clearInterval(interval);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [countingTime, isEnd]);

    const reset = useCallback(() => {
        setCountingTime(initialSeconds);
        setIsEnd(false);
    }, [initialSeconds]);

    return { countingTime, isEnd, reset };
};

export default useTimeCounter;
