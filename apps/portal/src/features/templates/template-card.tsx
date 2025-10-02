"use client";

import { CustomButton } from "@/components/ui/custom-button";
import { useAlert } from "@/hooks/useAlert";
import { useDeleteLandingPageTemplateMutation } from "@/redux/api/landing-page-template-api";
import { LandingPageDemo } from "@/types/landing-page-type";
import { Badge } from "@workspace/ui/components/badge";
import { toast } from "@workspace/ui/components/sonner";
import { Eye, Trash2 } from "lucide-react";

interface TemplateCardProps {
    template: LandingPageDemo;
    isEditable?: boolean;
}

export const TemplateCard = ({
    template,
    isEditable = false,
}: TemplateCardProps) => {
    const { fire } = useAlert();

    const [deleteTemplate] = useDeleteLandingPageTemplateMutation();

    const handleDelete = async () => {
        fire({
            title: "Delete Template",
            description: "Are you sure you want to delete this template?",
            onConfirm: async () => {
                await deleteTemplate({ id: template.id })
                    .unwrap()
                    .then(() => {
                        toast.success("Template deleted successfully");
                    })
                    .catch((error) => {
                        toast.error(
                            error.data.message || "Failed to delete template"
                        );
                    });
            },
        });
    };

    return (
        <div className="border flex flex-col overflow-hidden items-center rounded-lg  h-[550px] w-full max-xl:w-[500px]">
            <div
                className="w-full h-full cursor-pointer bg-cover bg-no-repeat bg-top transition-all duration-[3s] ease-in-out hover:bg-center focus:bg-top"
                style={{
                    backgroundImage: `url(${template.imgURL})`,
                }}
            />

            {isEditable ? (
                <CustomButton className="my-4">View Landing Page</CustomButton>
            ) : (
                <div className="p-4">
                    <div className="flex items-start justify-between">
                        <h3 className="text-lg font-semibold">
                            {template.name}
                        </h3>
                        {/* <Badge
                        variant={template.isPublished ? "default" : "secondary"}
                        className="text-xs"
                    >
                        {template.isPublished ? "Published" : "Draft"}
                    </Badge> */}
                    </div>

                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {template.keyword || "No description available"}
                    </p>

                    <div className="flex gap-2 mt-3 flex-wrap">
                        <Badge variant="secondary" className="text-xs">
                            {template.theme}
                        </Badge>
                    </div>

                    <div className="flex items-center gap-4 mt-4">
                        <CustomButton
                            variant="outline"
                            size="sm"
                            href={`/site/${template.slug}`}
                        >
                            <Eye />
                            Preview
                        </CustomButton>

                        <CustomButton
                            size="sm"
                            href={`/templates/${template.id}`}
                        >
                            Use Template
                        </CustomButton>

                        <CustomButton
                            size="sm"
                            variant="destructiveOutline"
                            onClick={handleDelete}
                        >
                            <Trash2 />
                            Delete
                        </CustomButton>
                    </div>
                </div>
            )}
        </div>
    );
};
