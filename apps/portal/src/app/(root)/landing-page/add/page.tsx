"use client";

import { LandingPageCreator } from "@/features/landing-builder/components/LandingPageCreator";
import { ShowSelectedTemplate } from "@/features/landing-builder/components/ShowSelectedTemplate";
import { TemplateSelectableCard } from "@/features/templates/TemplateSelectableCard";
import { useGetLandingPageWithProductIdQuery } from "@/redux/api/landing-page-api";
import { useGetLandingPagesTemplateQuery } from "@/redux/api/landing-page-template-api";
import { useGetProductByIdQuery } from "@/redux/api/product-api";
import { LandingPageDemo } from "@/types/site-type";
import { Component } from "@workspace/ui/landing/types";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

const AddLandingPage = () => {
    const router = useSearchParams();
    const productId = router.get("productId");
    const [selectedTemplate, setSelectedTemplate] =
        useState<LandingPageDemo | null>(null);
    const { data, isLoading, isError } = useGetProductByIdQuery(
        {
            id: productId as string,
        },
        { skip: !productId }
    );
    const {
        data: landingPage,
        isLoading: landingPageLoading,
        isError: landingPageError,
    } = useGetLandingPageWithProductIdQuery(
        { productId: productId as string },
        { skip: !productId }
    );
    // get all templates
    const {
        data: templates,
        isLoading: templatesLoading,
        isError: templatesError,
    } = useGetLandingPagesTemplateQuery({});

    if (isLoading || templatesLoading || landingPageLoading)
        return <div>Loading...</div>;
    if (isError || templatesError || landingPageError) return <div>Error</div>;

    if (landingPage?.data) {
        const section = landingPage.data.section.map((section) => {
            const { refaranceComponent, ...rest } = section;
            return {
                componentData: rest,
                componentInfo: refaranceComponent as Component,
            };
        });
        return (
            <div>
                <LandingPageCreator
                    basicInfo={{
                        name: landingPage.data.name,
                        keyword: landingPage.data.keyword,
                    }}
                    info={section}
                    productId={productId as string}
                />
            </div>
        );
    }
    if (selectedTemplate) {
        return (
            <div>
                <h1>Selected Template</h1>
                {/* <LandingPageCreator /> */}
                <ShowSelectedTemplate
                    templateId={selectedTemplate.id}
                    productId={productId as string}
                />
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates?.data.map((template) => (
                <TemplateSelectableCard
                    key={template.id}
                    template={template}
                    onSelect={(template) => setSelectedTemplate(template)}
                />
            ))}
        </div>
    );
};

export default AddLandingPage;
