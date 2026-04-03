import type { Section } from "@workspace/ui/landing/types";
import { FaCheckSquare } from "react-icons/fa";

type Props = {
    section: Section;
};

export const FeaturesListDisplay = ({ section }: Props) => {
    const hasContent = section.title || section.subTitle || (section.sectionList && section.sectionList.length > 0);

    if (!hasContent) return null;

    return (
        <div className="space-y-6 py-6">
            {(section.title || section.subTitle) && (
                <div className="space-y-1 text-center">
                    {section.title && (
                        <h3 className="text-3xl font-bold text-[var(--theme-primary)]">{section.title}</h3>
                    )}
                    {section.subTitle && <p className="text-base leading-relaxed text-gray-600">{section.subTitle}</p>}
                </div>
            )}

            {section.sectionList && section.sectionList.length > 0 && (
                <ul className="space-y-3">
                    {section.sectionList.map((item, index) => (
                        <li key={item.id ?? index} className="flex items-center gap-3">
                            <FaCheckSquare className="size-6 text-[var(--theme-primary)]" />
                            <span className="text-xl leading-snug font-bold text-gray-800 lg:text-2xl">
                                {item.title}
                            </span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};
