"use client";

import { HeaderBackButton } from "@/components/ui/custom-back-button";
import useGetUser from "@/hooks/useGetUser";
import {
    useGetShopPoliciesQuery,
    useUpdateShopMutation,
} from "@/redux/api/shop-api";
import { ShopPolicyType } from "@/types/shop-type";
import { AboutUsPolicy } from "@/features/manage-shop/shop-policy/about-us-policy";

import { TermsConditionsPolicy } from "@/features/manage-shop/shop-policy/terms-conditions-policy";
import { PrivacyPolicy } from "@/features/manage-shop/shop-policy/privacy-policy";
import { ReturnPolicy } from "@/features/manage-shop/shop-policy/return-policy";
import { RefundPolicy } from "@/features/manage-shop/shop-policy/refund-policy";
import { ShopPolicySkeleton } from "@/features/manage-shop/shop-policy/shop-policy-skeleton";

const ShopPolicy = () => {
    const user = useGetUser();
    const shopId = user?.shop.id || "";
    const shopSlug = user?.shop.slug || "";

    const { data: aboutUsData, isLoading: isLoadingAboutUs } =
        useGetShopPoliciesQuery({
            shopSlug,
            policyType: ShopPolicyType.ABOUT_US,
        });

    const {
        data: termsAndConditionsData,
        isLoading: isLoadingTermsAndConditions,
    } = useGetShopPoliciesQuery({
        shopSlug,
        policyType: ShopPolicyType.TERMS_AND_CONDITIONS,
    });
    const { data: privacyPolicyData, isLoading: isLoadingPrivacyPolicy } =
        useGetShopPoliciesQuery({
            shopSlug,
            policyType: ShopPolicyType.PRIVACY_POLICY,
        });
    const { data: returnPolicyData, isLoading: isLoadingReturnPolicy } =
        useGetShopPoliciesQuery({
            shopSlug,
            policyType: ShopPolicyType.RETURN_POLICY,
        });
    const { data: refundPolicyData, isLoading: isLoadingRefundPolicy } =
        useGetShopPoliciesQuery({
            shopSlug,
            policyType: ShopPolicyType.REFUND_POLICY,
        });

    const [updateShop, { isLoading: isCreatingPolicy }] =
        useUpdateShopMutation();

    if (
        isLoadingTermsAndConditions ||
        isLoadingPrivacyPolicy ||
        isLoadingReturnPolicy ||
        isLoadingRefundPolicy ||
        isLoadingAboutUs
    ) {
        return <ShopPolicySkeleton />;
    }

    const createSaveHandler = (field: string) => async (content: string) => {
        await updateShop({
            id: shopId,
            payload: {
                [field]: content,
            },
        }).unwrap();
    };

    return (
        <div className="space-y-6">
            <HeaderBackButton title="Shop Policy" href="/manage-shop" />

            <AboutUsPolicy
                initialContent={aboutUsData?.data.aboutUs || ""}
                onSave={createSaveHandler("aboutUs")}
                isSaving={isCreatingPolicy}
            />

            <TermsConditionsPolicy
                initialContent={
                    termsAndConditionsData?.data.termsAndConditions || ""
                }
                onSave={createSaveHandler("termsAndConditions")}
                isSaving={isCreatingPolicy}
            />

            <PrivacyPolicy
                initialContent={privacyPolicyData?.data.privacyPolicy || ""}
                onSave={createSaveHandler("privacyPolicy")}
                isSaving={isCreatingPolicy}
            />

            <ReturnPolicy
                initialContent={returnPolicyData?.data.returnPolicy || ""}
                onSave={createSaveHandler("returnPolicy")}
                isSaving={isCreatingPolicy}
            />

            <RefundPolicy
                initialContent={refundPolicyData?.data.refundPolicy || ""}
                onSave={createSaveHandler("refundPolicy")}
                isSaving={isCreatingPolicy}
            />
        </div>
    );
};

export default ShopPolicy;
