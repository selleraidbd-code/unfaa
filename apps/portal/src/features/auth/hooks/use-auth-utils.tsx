import { useRouter, useSearchParams } from "next/navigation";

import { setTokens, setUser } from "@/redux/slices/auth-slice";
import { useAppDispatch } from "@/redux/store/hook";
import { User } from "@/features/auth/auth-type";

export const useAuthSuccess = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl") || "/";
    const dispatch = useAppDispatch();

    const onSuccess = ({
        accessToken,
        refreshToken,
        user,
        path,
    }: {
        accessToken: string;
        refreshToken: string;
        user: User | null;
        path?: string;
    }) => {
        dispatch(setTokens({ accessToken, refreshToken }));

        if (user) {
            dispatch(setUser(user));
        }

        setTimeout(() => {
            router.push(path || callbackUrl);
        }, 0);
    };

    return onSuccess;
};
