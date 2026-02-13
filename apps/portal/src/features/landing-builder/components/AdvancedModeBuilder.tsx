"use client";

import { useState } from "react";

import { LandingPageCreator } from "@/features/landing-builder/components/LandingPageCreator";
import { ShowSelectedTemplate } from "@/features/landing-builder/components/ShowSelectedTemplate";
import { TemplateSelectableCard } from "@/features/templates/TemplateSelectableCard";
import { useGetLandingPagesTemplateQuery } from "@/redux/api/landing-page-template-api";
import { Component } from "@workspace/ui/landing/types";
import { Settings } from "lucide-react";

import { LandingPageDemo } from "@/types/landing-page-type";
import { DataStateHandler } from "@/components/shared/data-state-handler";

type AdvancedModeBuilderProps = {
    productId: string;
    landingPage?: LandingPageDemo;
};

export const AdvancedModeBuilder = ({ productId, landingPage }: AdvancedModeBuilderProps) => {
    const [selectedTemplate, setSelectedTemplate] = useState<LandingPageDemo | null>(null);
    console.log("landingPage", landingPage);

    const {
        data: templates,
        isLoading: templatesLoading,
        isError: templatesError,
    } = useGetLandingPagesTemplateQuery({});

    if (landingPage) {
        const section = landingPage.section.map((section) => {
            const { refaranceComponent, ...rest } = section;
            return {
                componentData: rest,
                componentInfo: refaranceComponent as Component,
            };
        });
        return (
            <LandingPageCreator
                basicInfo={{
                    name: landingPage.name,
                    keyword: landingPage.keyword,
                }}
                info={section}
                productId={productId as string}
            />
        );
    }

    if (selectedTemplate) {
        return <ShowSelectedTemplate templateId={selectedTemplate.id as string} productId={productId} />;
    }

    return (
        <div className="space-y-6 p-6">
            <div className="flex items-center gap-3">
                <div className="bg-primary/10 rounded-full p-2">
                    <Settings className="text-primary h-5 w-5" />
                </div>
                <div>
                    <h1 className="title text-2xl">Advanced Mode Builder</h1>
                    <p className="text-muted-foreground text-sm">Select a template to customize with full control</p>
                </div>
            </div>

            <DataStateHandler
                data={templates?.data}
                isLoading={templatesLoading}
                isError={templatesError}
                isEmpty={templates?.data.length === 0}
            >
                {(templatesData) => (
                    <div className="rounded-md border p-4 text-center">
                        <h2 className="title text-primary pb-1">Select a template</h2>
                        <p className="text-muted-foreground pb-6">Select a template to create a landing page</p>
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {templatesData.map((template) => (
                                <TemplateSelectableCard
                                    key={template.id}
                                    template={template}
                                    onSelect={(template) => setSelectedTemplate(template)}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </DataStateHandler>
        </div>
    );
};
