import { useGetComponentsQuery } from "@/redux/api/component-api";
import { setComponents } from "@/redux/slices/components-slice";
import { useAppDispatch, useAppSelector } from "@/redux/store/hook";

export const useComponents = () => {
    const dispatch = useAppDispatch();
    const components = useAppSelector((state) => state.components.components);

    const skip = components?.length > 0 ? true : false;

    const { data } = useGetComponentsQuery({ limit: 500 }, { skip });

    if (components?.length) {
        return components;
    }

    if (data && data.data) {
        dispatch(setComponents(data.data));
        return data.data;
    }

    return [];
};
