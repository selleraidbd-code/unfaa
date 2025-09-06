"use client";

import { Editor } from "@/components/editor";
import { HeaderBackButton } from "@/components/ui/custom-back-button";
import { CustomButton } from "@/components/ui/custom-button";
import useGetUser from "@/hooks/useGetUser";
import {
    useCreateShopPolicyMutation,
    useGetShopPoliciesQuery,
} from "@/redux/api/shop-api";
import { ShopPolicyType } from "@/types/shop-type";
import { CustomCollapsible } from "@workspace/ui/components/custom/custom-collapsible";
import { CustomLoading } from "@workspace/ui/components/custom/custom-loading";
import { useState } from "react";
import { toast } from "sonner";

const ShopPolicy = () => {
    const user = useGetUser();
    const shopSlug = user?.shop.slug || "";
    const [termsAndConditions, setTermsAndConditions] = useState("");
    const [privacyPolicy, setPrivacyPolicy] = useState("");
    const [returnPolicy, setReturnPolicy] = useState("");
    const [refundPolicy, setRefundPolicy] = useState("");

    const { data, isLoading } = useGetShopPoliciesQuery({
        shopSlug,
        policyType: ShopPolicyType.TERMS_AND_CONDITIONS,
    });

    const [createShopPolicy, { isLoading: isCreatingPolicy }] =
        useCreateShopPolicyMutation();

    if (isLoading) {
        return <CustomLoading />;
    }

    const handleSaveTermsAndConditions = async () => {
        await createShopPolicy({
            shopSlug,
            policyType: ShopPolicyType.TERMS_AND_CONDITIONS,
            policy: termsAndConditions,
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
        await createShopPolicy({
            shopSlug,
            policyType: ShopPolicyType.PRIVACY_POLICY,
            policy: privacyPolicy,
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
        await createShopPolicy({
            shopSlug,
            policyType: ShopPolicyType.RETURN_POLICY,
            policy: returnPolicy,
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
        await createShopPolicy({
            shopSlug,
            policyType: ShopPolicyType.REFUND_POLICY,
            policy: refundPolicy,
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

            {JSON.stringify(data?.data)}

            <CustomCollapsible
                title="Terms and Conditions"
                content={
                    <div className="flex flex-col gap-6">
                        <Editor
                            content={data?.data.termsAndConditions || ""}
                            onChange={setTermsAndConditions}
                        />

                        <CustomButton
                            className="ms-auto"
                            onClick={handleSaveTermsAndConditions}
                            isLoading={isCreatingPolicy}
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
                            content={data?.data.privacyPolicy || ""}
                            onChange={setPrivacyPolicy}
                        />

                        <CustomButton
                            className="ms-auto"
                            onClick={handleSavePrivacyPolicy}
                            isLoading={isCreatingPolicy}
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
                            content={data?.data.returnPolicy || ""}
                            onChange={setReturnPolicy}
                        />

                        <CustomButton
                            className="ms-auto"
                            onClick={handleSaveReturnPolicy}
                            isLoading={isCreatingPolicy}
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
                            content={data?.data.refundPolicy || ""}
                            onChange={setRefundPolicy}
                        />

                        <CustomButton
                            className="ms-auto"
                            onClick={handleSaveRefundPolicy}
                            isLoading={isCreatingPolicy}
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
