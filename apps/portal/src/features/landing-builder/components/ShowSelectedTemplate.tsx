import { LandingPageCreator } from "@/features/landing-builder/components/LandingPageCreator";
import { useGetLandingPageTemplateQuery } from "@/redux/api/landing-page-template-api";
import { Component } from "@workspace/ui/landing/types";

type Props = {
    templateId: string;
    productId: string;
};

export const ShowSelectedTemplate = (props: Props) => {
    const {
        data: template,
        isLoading: templateLoading,
        isError: templateError,
    } = useGetLandingPageTemplateQuery(
        { sub_domain: props.templateId },
        { skip: !props.templateId }
    );
    if (templateLoading) return <div>Loading...</div>;
    if (templateError) return <div>Error</div>;
    if (!template?.data) {
        return <div>Template not found</div>;
    }

    const mainInfo = template.data;
    // re generate the section in a manner that it can be used in LandingPageCreator
    const section = mainInfo.section.map((section) => {
        const { refaranceComponent, ...rest } = section;
        return {
            componentData: rest,
            componentInfo: refaranceComponent as Component,
        };
    });

    return (
        <LandingPageCreator
            basicInfo={{ name: "", keyword: "" }}
            info={section}
            productId={props.productId}
        />
    );
};
