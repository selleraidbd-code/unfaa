"use client";

import { useRouter } from "next/navigation";

import AddSectionComponent from "@/features/landing-builder/components/add-section-component";
import {
    clearLandingPage,
    setEditing,
} from "@/redux/slices/landing-page-slice";
import { useAppDispatch, useAppSelector } from "@/redux/store/hook";
import { toast } from "sonner";

import { FileUpload } from "@/components/file-upload";
import { CustomButton } from "@/components/ui/custom-button";
import { ShowSelectedSection } from "@/features/landing-builder/components/show-selected-section";
import { useCreateLandingPageMutation } from "@/redux/api/landing-page-api";
import { SiteType } from "@/types/site-type";
import { Button } from "@workspace/ui/components/button";
import { Switch } from "@workspace/ui/components/switch";
import { useTheme } from "next-themes";
import { shopTypes } from "@/data/shop-data";

const CreateTemplate = () => {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { theme } = useTheme();

    const landingPageSections = useAppSelector(
        (state) => state.landingPage.landingPageSections
    );
    const isEditing = useAppSelector((state) => state.landingPage.isEditing);

    const [createLandingPage, { isLoading }] = useCreateLandingPageMutation();

    const handleSave = async () => {
        if (isLoading) {
            toast.error("Please fill Name and Slug");
            return;
        }
        const section = landingPageSections.map((single, i) => ({
            ...single.componentData,
            componentName: single.componentInfo.name,
            sectionType: single.componentInfo.type,
            index: i,
        }));

        const data = {
            section,
            theme: `${theme}`,
            siteType: SiteType.TEMPLATE,
        };

        console.log("save", section);
        await createLandingPage(data)
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
                    <CustomButton type="button" onClick={handleSave}>
                        Save Template
                    </CustomButton>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                {/* <CustomInput
                    label="Template Name"
                    placeholder="Template Name"
                    value={portfolioName}
                    onChange={(value) =>
                        dispatch(setLandingPageName(String(value)))
                    }
                /> */}

                {/* <CustomSelect
                    label="Template Category"
                    placeholder="Select Category"
                    options={categoryOptions || []}
                    value={portfolioCategory}
                    onChange={(value: string) =>
                        dispatch(setLandingPageCategory(String(value)))
                    }
                /> */}

                {/* <CustomTextarea
                    className="col-span-2"
                    label="Template Keyword"
                    placeholder="Template Keyword"
                    value={portfolioKeyword}
                    onChange={(value) =>
                        dispatch(setLandingPageKeyword(String(value)))
                    }
                /> */}
                <FileUpload
                    className="col-span-2"
                    limit={1}
                    onFilesSelected={(value) => {
                        console.log(value);
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
