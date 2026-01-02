"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { AddSectionComponent } from "@/features/landing-builder/components/add-section-component";
import { ShowSelectedSection } from "@/features/landing-builder/components/show-selected-section";
import { useCreateLandingPageMutation } from "@/redux/api/landing-page-api";
import { useGetShopCategoriesQuery } from "@/redux/api/shop-api";
import { setEditing, setLandingPageData, setLandingPageSection } from "@/redux/slices/landing-page-slice";
import { useAppDispatch, useAppSelector } from "@/redux/store/hook";
import { Button } from "@workspace/ui/components/button";
import { CustomInput } from "@workspace/ui/components/custom/custom-input";
import { CustomTextarea } from "@workspace/ui/components/custom/custom-textarea";
import { toast } from "@workspace/ui/components/sonner";
import { Switch } from "@workspace/ui/components/switch";
import { Component, EPageType, Section } from "@workspace/ui/landing/types";
import { useTheme } from "next-themes";

import { CreateLandingPagePayload, CreateSectionPayload, SiteType } from "@/types/landing-page-type";
// import MyForm from "@repo/ui/components/test/MyForm";
import { CustomButton } from "@/components/ui/custom-button";

export const LandingPageCreator = ({
    basicInfo,
    info,
    productId,
}: {
    basicInfo: { name: string; keyword: string };
    info: { componentData: Section; componentInfo: Component }[];
    productId: string;
}) => {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const user = useAppSelector((state) => state.auth.user);
    const shopId = user?.shop.id;

    useEffect(() => {
        dispatch(setLandingPageSection(info));
        dispatch(setLandingPageData({ fieldName: "name", value: basicInfo.name }));
        dispatch(
            setLandingPageData({
                fieldName: "keyword",
                value: basicInfo.keyword,
            })
        );
    }, [info]);

    const portfolioName = useAppSelector((state) => state.landingPage.landingPageData.name);
    const portfolioKeyword = useAppSelector((state) => state.landingPage.landingPageData.keyword);

    const landingPageSections = useAppSelector((state) => state.landingPage.landingPageSections);
    const isEditing = useAppSelector((state) => state.landingPage.isEditing);

    const [createLandingPage, { isLoading }] = useCreateLandingPageMutation();

    const handleSave = async () => {
        if (isLoading) {
            toast.error("Please wait for saving");
            return;
        }
        if (!portfolioName || !portfolioKeyword || !shopId) {
            toast.error("Please fill Name and Keyword");
            return;
        }
        const section: CreateSectionPayload[] = landingPageSections.map((single, i) => ({
            ...single.componentData,
            componentName: single.componentInfo.name,
            sectionType: single.componentInfo.type,
            index: i,
            refaranceComponentId: single.componentInfo.id,
        }));

        const data: CreateLandingPagePayload = {
            section,
            shopId,
            productId,
            name: portfolioName,
            keyword: portfolioKeyword,
            pageType: EPageType.TEMPLATE,
        };

        console.log("save", data);
        await createLandingPage(data)
            .unwrap()
            .then((res) => {
                toast.success("Landing page created successfully");
                router.push(`/landing-page`);
            })
            .catch((err) => {
                toast.error(err?.data?.message || "Something went wrong");
            });
    };

    return (
        <div className="grid gap-6">
            <div className="flex items-center gap-4">
                <h1 className="title">Page Builder</h1>

                <div className="hidden items-center gap-2 md:ml-auto md:flex">
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-bold">Editing</span>
                        <Switch
                            checked={isEditing}
                            onCheckedChange={(value) => {
                                console.log({ value });
                                dispatch(setEditing(Boolean(value)));
                            }}
                        ></Switch>
                    </div>
                    <CustomButton variant="outline" href="/templates">
                        Discard
                    </CustomButton>
                    {isLoading ? (
                        <Button disabled> Saving... </Button>
                    ) : (
                        <Button onClick={handleSave}>Save Template </Button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <CustomInput
                    label="Template Name"
                    placeholder="Template Name"
                    // defaultValue={basicInfo.name}
                    value={portfolioName}
                    onChange={(value) =>
                        dispatch(
                            setLandingPageData({
                                fieldName: "name",
                                value: String(value),
                            })
                        )
                    }
                />

                <CustomTextarea
                    className="col-span-2"
                    label="Template Keyword"
                    placeholder="Template Keyword"
                    // defaultValue={basicInfo.keyword}
                    value={portfolioKeyword}
                    onChange={(value) =>
                        dispatch(
                            setLandingPageData({
                                fieldName: "keyword",
                                value: String(value),
                            })
                        )
                    }
                />
            </div>

            {landingPageSections.map((single, i) => (
                <ShowSelectedSection
                    index={i}
                    key={i}
                    componentData={single.componentData}
                    componentInfo={single.componentInfo}
                />
            ))}

            {isEditing && <AddSectionComponent />}

            <div className="flex items-center justify-end gap-2 md:hidden">
                <CustomButton variant="outline" href="/templates">
                    Discard
                </CustomButton>
                {isLoading ? (
                    <Button disabled> Saving... </Button>
                ) : (
                    <Button onClick={handleSave}>Save Template </Button>
                )}
            </div>
        </div>
    );
};
