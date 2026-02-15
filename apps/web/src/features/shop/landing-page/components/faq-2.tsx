import { useState } from "react";

import { Section } from "@workspace/ui/landing/types";

type Props = {
    section: Section;
};

export const FAQ02 = ({ section }: Props) => {
    if (!section.sectionList || section.sectionList.length === 0) {
        return null;
    }
    const [activeFaqIndex, setActiveFaqIndex] = useState<number | null>(null);

    const toggleFaq = (index: number) => {
        setActiveFaqIndex(activeFaqIndex === index ? null : index);
    };

    // Extract title and question mark if present
    const titleText = section.title || "";
    const hasQuestionMark = titleText.includes("?");
    const titleWithoutMark = hasQuestionMark ? titleText.replace(/\?/g, "").trim() : titleText;

    return (
        <section className="bg-white py-12">
            <div className="landing-width space-y-4 py-2 sm:py-4">
                {(section.title || section.subTitle) && (
                    <div className="mb-6 text-center">
                        {section.title && (
                            <h2 className="mb-8 text-center text-2xl font-bold text-[var(--theme-primary)]">{titleWithoutMark}</h2>
                        )}
                        {section.subTitle && (
                            <p className="mt-2 text-base text-gray-600 md:text-lg">{section.subTitle}</p>
                        )}
                    </div>
                )}

                <div className="space-y-4">
                    {section.sectionList.map((faq, index) => (
                        <div
                            key={faq.id || index}
                            className="cursor-pointer rounded-lg border border-gray-200 p-4 hover:bg-gray-50"
                            onClick={() => toggleFaq(index)}
                        >
                            <div className="flex items-center justify-between font-bold text-gray-700">
                                <span>{faq.title}</span>
                                <span className="text-2xl">{activeFaqIndex === index ? "−" : "+"}</span>
                            </div>
                            {activeFaqIndex === index && (
                                <div className="mt-2 border-t border-gray-100 pt-4 text-sm leading-relaxed text-gray-500">
                                    {faq.description}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
