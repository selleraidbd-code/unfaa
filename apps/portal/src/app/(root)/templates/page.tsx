"use client";

import { TemplateCard } from "@/features/templates/template-card";
import { useGetLandingPagesQuery } from "@/redux/api/landing-page-api";
import { useGetSiteCategoriesQuery } from "@/redux/api/site-category-api";
import { SiteType } from "@/types/site-type";
import { CustomSearch } from "@repo/ui/components/custom-ui/custom-search";
import { Button } from "@repo/ui/components/ui/button";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@repo/ui/components/ui/tabs";
import { Plus, SlidersHorizontal } from "lucide-react";

const Templates = () => {
    const { data: categoryData } = useGetSiteCategoriesQuery({
        limit: 200,
    });

    const { data } = useGetLandingPagesQuery({
        siteType: SiteType.PORTFOLIO,
    });

    const templates = data?.data || [];

    console.log(data);

    return (
        <div>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="title">Templates</h1>
                    <p className="text-muted-foreground mt-1">
                        Browse our collection of professionally designed
                        templates
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    <CustomSearch placeholder="Search templates..." />

                    <Button href="/templates/create">
                        <Plus />
                        Create Template
                    </Button>
                </div>
            </div>

            <div className="mb-8">
                <Tabs defaultValue="all">
                    <div className="flex items-center justify-between">
                        <TabsList>
                            <TabsTrigger value="all">All</TabsTrigger>
                            {categoryData?.data.map((category) => (
                                <TabsTrigger
                                    key={category.id}
                                    value={category.id}
                                >
                                    {category.name}
                                </TabsTrigger>
                            ))}
                        </TabsList>

                        <Button variant="outline" size="sm">
                            <SlidersHorizontal className="h-4 w-4 mr-2" />
                            Filters
                        </Button>
                    </div>

                    <TabsContent value="all" className="mt-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {templates.map((template) => (
                                <TemplateCard
                                    key={template.id}
                                    template={template}
                                />
                            ))}
                        </div>
                    </TabsContent>

                    {categoryData?.data.map((category) => (
                        <TabsContent
                            key={category.id}
                            value={category.id}
                            className="mt-6"
                        >
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {templates
                                    .filter(
                                        (template) =>
                                            template.siteCategoryId ===
                                            category.id
                                    )
                                    .map((template) => (
                                        <TemplateCard
                                            key={template.id}
                                            template={template}
                                        />
                                    ))}
                            </div>
                        </TabsContent>
                    ))}
                </Tabs>
            </div>
        </div>
    );
};

export default Templates;
