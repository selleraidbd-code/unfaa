"use client";

import { useEffect, useState } from "react";

import { Button } from "@workspace/ui/components/button";
import { CustomInput } from "@workspace/ui/components/custom/custom-input";
import { CustomTextarea } from "@workspace/ui/components/custom/custom-textarea";
import { EComponentType } from "@workspace/ui/landing/types";
import { Plus, Trash2 } from "lucide-react";

import { LandingPageDemo } from "@/types/landing-page-type";

export type FAQItem = {
    id: string;
    question: string;
    answer: string;
};

export type FAQData = {
    title: string;
    subTitle: string;
    items: FAQItem[];
};

type FAQSectionProps = {
    landingPage?: LandingPageDemo;
    onDataChange?: (data: FAQData) => void;
};

export const FAQSection = ({ landingPage, onDataChange }: FAQSectionProps) => {
    const [faqTitle, setFaqTitle] = useState("");
    const [faqSubTitle, setFaqSubTitle] = useState("");
    const [faqItems, setFaqItems] = useState<FAQItem[]>([{ id: Date.now().toString(), question: "", answer: "" }]);

    // Prepopulate form when landing page data exists
    useEffect(() => {
        if (landingPage) {
            // Extract FAQ section if it exists
            const faqSection = landingPage.section?.find((section) => section.sectionType === EComponentType.FAQ);

            if (faqSection) {
                setFaqTitle(faqSection.title || "");
                setFaqSubTitle(faqSection.subTitle || "");

                // Convert sectionList to FAQItems
                if (faqSection.sectionList && faqSection.sectionList.length > 0) {
                    const faqItemsData = faqSection.sectionList.map((item, index) => ({
                        id: item.id || Date.now().toString() + index,
                        question: item.title || "",
                        answer: item.description || "",
                    }));
                    setFaqItems(
                        faqItemsData.length > 0
                            ? faqItemsData
                            : [{ id: Date.now().toString(), question: "", answer: "" }]
                    );
                }
            }
        }
    }, [landingPage]);

    // Notify parent component when data changes
    useEffect(() => {
        if (onDataChange) {
            onDataChange({
                title: faqTitle,
                subTitle: faqSubTitle,
                items: faqItems,
            });
        }
    }, [faqTitle, faqSubTitle, faqItems, onDataChange]);

    const handleAddFAQItem = () => {
        setFaqItems([...faqItems, { id: Date.now().toString(), question: "", answer: "" }]);
    };

    const handleRemoveFAQItem = (id: string) => {
        if (faqItems.length > 1) {
            setFaqItems(faqItems.filter((item) => item.id !== id));
        }
    };

    const handleUpdateFAQItem = (id: string, field: "question" | "answer", value: string) => {
        setFaqItems(faqItems.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
    };

    return (
        <div className="bg-card space-y-4 rounded-lg border p-4 lg:space-y-6 lg:p-6">
            <div>
                <h2 className="mb-2 text-lg font-semibold">FAQ Section</h2>
                <p className="text-muted-foreground text-sm">Add frequently asked questions to your landing page</p>
            </div>

            <div className="space-y-4">
                <CustomInput
                    label="FAQ Section Title"
                    placeholder="e.g., Frequently Asked Questions"
                    value={faqTitle}
                    onChange={(value) => setFaqTitle(String(value))}
                />
                <CustomInput
                    label="FAQ Section Subtitle"
                    placeholder="e.g., Find answers to common questions"
                    value={faqSubTitle}
                    onChange={(value) => setFaqSubTitle(String(value))}
                />
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium">Questions & Answers</h3>
                    <Button type="button" variant="outline" size="sm" onClick={handleAddFAQItem} className="gap-2">
                        <Plus className="h-4 w-4" />
                        Add Question
                    </Button>
                </div>

                {faqItems.map((item, index) => (
                    <div key={item.id} className="space-y-3 rounded-lg border p-4">
                        <div className="flex items-center justify-between">
                            <span className="text-muted-foreground text-sm font-medium">Question {index + 1}</span>
                            {faqItems.length > 1 && (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleRemoveFAQItem(item.id)}
                                    className="text-destructive hover:text-destructive h-8 w-8 p-0"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            )}
                        </div>
                        <CustomInput
                            label="Question"
                            placeholder="Enter your question"
                            value={item.question}
                            onChange={(value) => handleUpdateFAQItem(item.id, "question", String(value))}
                        />
                        <CustomTextarea
                            label="Answer"
                            placeholder="Enter the answer"
                            value={item.answer}
                            onChange={(value) => handleUpdateFAQItem(item.id, "answer", value)}
                            rows={3}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};
