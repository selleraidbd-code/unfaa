"use client";

import { Editor } from "@/components/editor";
import { HeaderBackButton } from "@/components/ui/custom-back-button";
import { CustomButton } from "@/components/ui/custom-button";
import useGetUser from "@/hooks/useGetUser";
import {
    useGetShopPoliciesQuery,
    useUpdateShopMutation,
} from "@/redux/api/shop-api";
import { ShopPolicyType } from "@/types/shop-type";
import { CustomCollapsible } from "@workspace/ui/components/custom/custom-collapsible";
import { CustomLoading } from "@workspace/ui/components/custom/custom-loading";
import { useState } from "react";
import { toast } from "sonner";

const ShopPolicy = () => {
    const user = useGetUser();
    const shopId = user?.shop.id || "";
    const shopSlug = user?.shop.slug || "";
    const [termsAndConditions, setTermsAndConditions] = useState("");
    const [privacyPolicy, setPrivacyPolicy] = useState("");
    const [returnPolicy, setReturnPolicy] = useState("");
    const [refundPolicy, setRefundPolicy] = useState("");

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
        isLoadingRefundPolicy
    ) {
        return <CustomLoading />;
    }

    const handleSaveTermsAndConditions = async () => {
        await updateShop({
            id: shopId,
            payload: {
                termsAndConditions,
            },
        })
            .unwrap()
            .then(() => {
                toast.success("Terms and Conditions saved successfully");
            })
            .catch((error) => {
                toast.error(
                    error.data.message || "Failed to save Terms and Conditions"
                );
            });
    };

    const handleSavePrivacyPolicy = async () => {
        await updateShop({
            id: shopId,
            payload: {
                privacyPolicy,
            },
        })
            .unwrap()
            .then(() => {
                toast.success("Privacy Policy saved successfully");
            })
            .catch((error) => {
                toast.error(
                    error.data.message || "Failed to save Privacy Policy"
                );
            });
    };

    const handleSaveReturnPolicy = async () => {
        await updateShop({
            id: shopId,
            payload: {
                returnPolicy,
            },
        })
            .unwrap()
            .then(() => {
                toast.success("Return Policy saved successfully");
            })
            .catch((error) => {
                toast.error(
                    error.data.message || "Failed to save Return Policy"
                );
            });
    };

    const handleSaveRefundPolicy = async () => {
        await updateShop({
            id: shopId,
            payload: {
                refundPolicy,
            },
        })
            .unwrap()
            .then(() => {
                toast.success("Refund Policy saved successfully");
            })
            .catch((error) => {
                toast.error(
                    error.data.message || "Failed to save Refund Policy"
                );
            });
    };

    return (
        <div className="space-y-6">
            <HeaderBackButton title="Shop Policy" href="/manage-shop" />

            <CustomCollapsible
                title="Terms and Conditions"
                content={
                    <div className="flex flex-col gap-6">
                        <Editor
                            content={
                                termsAndConditionsData?.data
                                    .termsAndConditions || ""
                            }
                            onChange={setTermsAndConditions}
                        />

                        <CustomButton
                            className="ms-auto"
                            onClick={handleSaveTermsAndConditions}
                            isLoading={isCreatingPolicy}
                            disabled={!termsAndConditions}
                        >
                            Save Terms and Conditions
                        </CustomButton>
                    </div>
                }
            />
            <CustomCollapsible
                title="Privacy Policy"
                content={
                    <div className="flex flex-col gap-6">
                        <Editor
                            content={
                                privacyPolicyData?.data.privacyPolicy || ""
                            }
                            onChange={setPrivacyPolicy}
                        />

                        <CustomButton
                            className="ms-auto"
                            onClick={handleSavePrivacyPolicy}
                            isLoading={isCreatingPolicy}
                            disabled={!privacyPolicy}
                        >
                            Save Privacy Policy
                        </CustomButton>
                    </div>
                }
            />
            <CustomCollapsible
                title="Return Policy"
                content={
                    <div className="flex flex-col gap-6">
                        <Editor
                            content={returnPolicyData?.data.returnPolicy || ""}
                            onChange={setReturnPolicy}
                        />

                        <CustomButton
                            className="ms-auto"
                            onClick={handleSaveReturnPolicy}
                            isLoading={isCreatingPolicy}
                            disabled={!returnPolicy}
                        >
                            Save Return Policy
                        </CustomButton>
                    </div>
                }
            />

            <CustomCollapsible
                title="Refund Policy"
                content={
                    <div className="flex flex-col gap-6">
                        <Editor
                            content={refundPolicyData?.data.refundPolicy || ""}
                            onChange={setRefundPolicy}
                        />

                        <CustomButton
                            className="ms-auto"
                            onClick={handleSaveRefundPolicy}
                            isLoading={isCreatingPolicy}
                            disabled={!refundPolicy}
                        >
                            Save Refund Policy
                        </CustomButton>
                    </div>
                }
            />
        </div>
    );
};

export default ShopPolicy;
