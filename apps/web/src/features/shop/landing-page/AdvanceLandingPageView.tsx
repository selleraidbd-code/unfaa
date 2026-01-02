import { allComponents } from "@workspace/ui/landing/index";
import { Section } from "@workspace/ui/landing/types";

type Props = {
    sections: Section[];
};

export const AdvanceLandingPageView = ({ sections }: Props) => {
    return (
        <section>
            {sections.map((section: Section, index: number) => {
                const findComponent = allComponents.find((single) => single.name === section.componentName);
                if (!findComponent) return <div key={index}>Component Not Found</div>;
                const Component = findComponent.component;
                return <Component key={index} data={section} />;
            })}
        </section>
    );
};
