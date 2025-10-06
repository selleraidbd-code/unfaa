import { useGetUserQuery } from "@/redux/api/auth-api";
import { setUser } from "@/redux/slices/auth-slice";
import { useAppDispatch, useAppSelector } from "@/redux/store/hook";

const useGetUser = () => {
    const dispatch = useAppDispatch();
    const user = useAppSelector((state) => state.auth.user);

    const { data: userData } = useGetUserQuery(undefined, {
        skip: !!user?.shop?.id,
    });

    if (user?.shop?.id) {
        return user;
    }

    if (userData) {
        dispatch(setUser(userData.data));
        return userData.data;
    }

    return null;
};

export default useGetUser;
