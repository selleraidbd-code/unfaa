export type Plan = {
    id: string;
    name: string;
    price: number;
    discountPrice: number;
    discountPercentage: number;
    isFree: boolean;
    status: "active" | "inactive";
    days: number;
};
