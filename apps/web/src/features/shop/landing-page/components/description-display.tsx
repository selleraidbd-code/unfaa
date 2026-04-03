import type { Section } from "@workspace/ui/landing/types";
import { FaCircleCheck } from "react-icons/fa6";

type Props = {
    section: Section;
};

export const DescriptionDisplay = ({ section }: Props) => {
    const hasContent = section.title || section.subTitle || (section.sectionList && section.sectionList.length > 0);

    if (!hasContent) return null;

    return (
        <div className="space-y-4 py-6">
            {(section.title || section.subTitle) && (
                <div className="space-y-1 text-center">
                    {section.title && <h3 className="text-2xl font-bold text-gray-800">{section.title}</h3>}
                    {section.subTitle && <p className="text-base leading-relaxed text-gray-600">{section.subTitle}</p>}
                </div>
            )}

            {section.sectionList && section.sectionList.length > 0 && (
                <ul className="space-y-3">
                    {section.sectionList.map((item, index) => (
                        <li
                            key={item.id ?? index}
                            className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-4 shadow-sm"
                        >
                            <FaCircleCheck className="size-5 text-[var(--theme-primary)]" />
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
