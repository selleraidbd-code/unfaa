import { useRouter, useSearchParams } from "next/navigation";

import { User } from "@/features/auth/auth-type";
import { setTokens, setUser } from "@/redux/slices/auth-slice";
import { useAppDispatch } from "@/redux/store/hook";

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

        console.log("user", user);

        if (user) {
            dispatch(setUser(user));
        }

        setTimeout(() => {
            router.replace(path || callbackUrl);
        }, 0);
    };

    return onSuccess;
};
