export type Payment = {
    id: string;
    planId: string;
    landingPageLayoutId: string;
    paymentMethod: "korapay" | "bkash" | "other";
    createdAt: string;
    updatedAt: string;
};
