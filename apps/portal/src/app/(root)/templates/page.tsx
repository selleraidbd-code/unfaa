"use client";

import { CustomButton } from "@/components/ui/custom-button";
import { shopTypes } from "@/data/shop-data";
import { TemplateCard } from "@/features/templates/template-card";
import { useGetLandingPagesTemplateQuery } from "@/redux/api/landing-page-template-api";
import { CustomSearch } from "@workspace/ui/components/custom/custom-search";
import { CustomSelect } from "@workspace/ui/components/custom/custom-select";
import { Plus } from "lucide-react";
import { useState } from "react";

const Templates = () => {
    const [category, setCategory] = useState("");
    const { data: templatesData } = useGetLandingPagesTemplateQuery({
        category: category,
    });

    const categoryOptions = shopTypes.map((category) => ({
        value: category.value,
        label: category.label,
    }));

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

                <div className="flex items-end gap-4">
                    <CustomSearch placeholder="Search templates..." />

                    <CustomSelect
                        label="Template Category"
                        placeholder="Select Template category"
                        value={category}
                        onChange={setCategory}
                        options={categoryOptions}
                        className="max-w-48"
                    />

                    <CustomButton href="/templates/create">
                        <Plus />
                        Create Template
                    </CustomButton>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6 gap-4">
                {templatesData?.data.map((template) => (
                    <TemplateCard key={template.id} template={template} />
                ))}
            </div>
        </div>
    );
};

export default Templates;
