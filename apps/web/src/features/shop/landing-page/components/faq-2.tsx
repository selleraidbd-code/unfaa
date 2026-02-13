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

    {
        /* <section className="py-12 bg-white">
                <div className="container mx-auto max-w-2xl px-6">
                    <h2 className="text-2xl font-bold mb-8 text-blue-600 text-center">
                        সচরাচর জিজ্ঞাসা
                    </h2>
                    <div className="space-y-4">
                        {landingPageData.faqs.map((faq, index) => (
                            <div
                                key={index}
                                className="border border-gray-200 rounded-lg p-4 cursor-pointer hover:bg-gray-50"
                                onClick={() => toggleFaq(index)}
                            >
                                <div className="flex justify-between items-center font-bold text-gray-700">
                                    <span>{faq.question}</span>
                                    <span className="text-2xl">
                                        {activeFaqIndex === index ? "−" : "+"}
                                    </span>
                                </div>
                                {activeFaqIndex === index && (
                                    <div className="text-gray-500 pt-4 text-sm leading-relaxed border-t border-gray-100 mt-2">
                                        {faq.answer}
                                    </div>
                                )}
                            </div>
                        ))} */
    }

    return (
        <section className="bg-white py-12">
            <div className="landing-width space-y-4 py-2 sm:py-4">
                {(section.title || section.subTitle) && (
                    <div className="mb-6 text-center">
                        {section.title && (
                            <h2 className="mb-8 text-center text-2xl font-bold text-blue-600">{titleWithoutMark}</h2>
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
