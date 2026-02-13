import { Section } from "@workspace/ui/landing/types";

type Props = {
    section: Section;
};

export const FAQ01 = ({ section }: Props) => {
    if (!section.sectionList || section.sectionList.length === 0) {
        return null;
    }

    // Extract title and question mark if present
    const titleText = section.title || "";
    const hasQuestionMark = titleText.includes("?");
    const titleWithoutMark = hasQuestionMark ? titleText.replace(/\?/g, "").trim() : titleText;

    return (
        <div className="space-y-4 py-2 sm:py-4">
            {(section.title || section.subTitle) && (
                <div className="mb-6 text-center">
                    {section.title && (
                        <h2 className="text-2xl font-bold md:text-[28px]">
                            <span className="text-green-600">{titleWithoutMark}</span>
                        </h2>
                    )}
                    {section.subTitle && <p className="mt-2 text-base text-gray-600 md:text-lg">{section.subTitle}</p>}
                </div>
            )}

            <div className="space-y-3">
                {section.sectionList.map((item, index) => (
                    <div key={item.id || index} className="rounded-lg bg-[#E8F5E9] p-4 shadow-sm">
                        {item.title && (
                            <h3 className="mb-2 text-base font-semibold text-gray-900 md:text-lg">{item.title}</h3>
                        )}
                        {item.description && (
                            <p className="text-sm leading-relaxed whitespace-pre-line text-gray-800 md:text-base">
                                {item.description}
                            </p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};
