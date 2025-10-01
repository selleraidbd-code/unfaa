"use client";

import { useRouter } from "next/navigation";

import { AddSectionComponent } from "@/features/landing-builder/components/add-section-component";
import {
    clearLandingPage,
    setEditing,
    setLandingPageData,
} from "@/redux/slices/landing-page-slice";
import { useAppDispatch, useAppSelector } from "@/redux/store/hook";
import { toast } from "@workspace/ui/components/sonner";

import { FileUpload } from "@/components/file-upload";
import { CustomButton } from "@/components/ui/custom-button";
import { shopTypes } from "@/data/shop-data";
import { ShowSelectedSection } from "@/features/landing-builder/components/show-selected-section";
import { useCreateLandingPageDemoWithSectionMutation } from "@/redux/api/landing-page-api";
import { SiteType } from "@/types/site-type";
import { Button } from "@workspace/ui/components/button";
import { CustomInput } from "@workspace/ui/components/custom/custom-input";
import { CustomSelect } from "@workspace/ui/components/custom/custom-select";
import { CustomTextarea } from "@workspace/ui/components/custom/custom-textarea";
import { Switch } from "@workspace/ui/components/switch";
import { useTheme } from "next-themes";

const CreateTemplate = () => {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { theme } = useTheme();
    const portfolioName = useAppSelector(
        (state) => state.landingPage.landingPageData.name
    );
    const portfolioKeyword = useAppSelector(
        (state) => state.landingPage.landingPageData.keyword
    );
    const portfolioImage = useAppSelector(
        (state) => state.landingPage.landingPageData.imgUrl
    );
    const portfolioCategory = useAppSelector(
        (state) => state.landingPage.landingPageData.category
    );

    const landingPageSections = useAppSelector(
        (state) => state.landingPage.landingPageSections
    );
    const isEditing = useAppSelector((state) => state.landingPage.isEditing);

    const [createLandingPageDemoWithSection, { isLoading }] =
        useCreateLandingPageDemoWithSectionMutation();

    const handleSave = async () => {
        if (isLoading) {
            toast.error("Please fill Name and Slug");
            return;
        }
        if (!portfolioName || !portfolioKeyword || !portfolioImage) {
            toast.error("Please fill Name and Keyword and Image");
            return;
        }
        const section = landingPageSections.map((single, i) => ({
            ...single.componentData,
            refaranceComponentId: single.componentInfo.id,
            componentName: single.componentInfo.name,
            sectionType: single.componentInfo.type,
            index: i,
        }));

        const data = {
            section,
            theme: `${theme}`,
            siteType: SiteType.TEMPLATE,
            name: portfolioName,
            keyword: portfolioKeyword,
            imgURL: portfolioImage,
        };

        console.log("save", data);
        await createLandingPageDemoWithSection(data)
            .unwrap()
            .then((res) => {
                if (res.data) {
                    dispatch(clearLandingPage());
                    toast.success("Template created successfully");
                    router.push(`/templates`);
                }
            })
            .catch((err) => {
                toast.error(err?.data?.message || "Something went wrong");
            });
    };

    const categoryOptions = shopTypes.map((category) => ({
        value: category.value,
        label: category.label,
    }));

    console.log(categoryOptions);

    return (
        <div className="grid gap-6">
            <div className="flex items-center gap-4">
                <h1 className="title">Template Builder</h1>

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
                    <Button type="button" onClick={handleSave}>
                        Save Template
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <CustomInput
                    label="Template Name"
                    placeholder="Template Name"
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
                <CustomSelect
                    label="Template Category"
                    placeholder="Template Category"
                    value={portfolioCategory}
                    options={categoryOptions}
                    onChange={(value) =>
                        dispatch(
                            setLandingPageData({
                                fieldName: "category",
                                value: String(value),
                            })
                        )
                    }
                />

                <CustomTextarea
                    className="col-span-2"
                    label="Template Keyword"
                    placeholder="Template Keyword"
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
                <FileUpload
                    className="col-span-2"
                    limit={1}
                    onFilesSelected={(value) => {
                        console.log(value);
                        dispatch(
                            setLandingPageData({
                                fieldName: "imgUrl",
                                value: value[0]?.url || "",
                            })
                        );
                    }}
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
                <Button onClick={handleSave}>Save Template</Button>
            </div>
        </div>
    );
};

export default CreateTemplate;
