"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { FeaturedProductsSelectionDialog } from "@/features/landing-builder/components/featured-products-selection-dialog";
import { PackageSection } from "@/features/landing-builder/components/package-section";
import { useCreateLandingPageMutation } from "@/redux/api/landing-page-api";
import { useGetProductsQuery } from "@/redux/api/product-api";
import { useAppSelector } from "@/redux/store/hook";
import { Button } from "@workspace/ui/components/button";
import { CustomInput } from "@workspace/ui/components/custom/custom-input";
import { CustomTextarea } from "@workspace/ui/components/custom/custom-textarea";
import { toast } from "@workspace/ui/components/sonner";
import { EComponentType, EPageType } from "@workspace/ui/landing/types";
import { ArrowLeft, Package, Plus, Sparkles, Trash2, X } from "lucide-react";

import {
    CreateLandingPagePayload,
    CreateSectionListPayload,
    CreateSectionPayload,
    LandingPageDemo,
} from "@/types/landing-page-type";
import { CustomButton } from "@/components/ui/custom-button";

type EasyModeBuilderProps = {
    productId: string;
    landingPage?: LandingPageDemo;
};

type FAQItem = {
    id: string;
    question: string;
    answer: string;
};

export const EasyModeBuilder = ({ productId, landingPage }: EasyModeBuilderProps) => {
    const router = useRouter();
    const user = useAppSelector((state) => state.auth.user);
    const shopId = user?.shop.id;
    const [name, setName] = useState("");
    const [faqTitle, setFaqTitle] = useState("");
    const [faqSubTitle, setFaqSubTitle] = useState("");
    const [faqItems, setFaqItems] = useState<FAQItem[]>([{ id: Date.now().toString(), question: "", answer: "" }]);
    const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);

    const [createLandingPage, { isLoading: isCreating }] = useCreateLandingPageMutation();

    const { data: productsData } = useGetProductsQuery({
        shopId: shopId || "",
        limit: 50,
    });

    const products = productsData?.data || [];
    const selectedProducts = products.filter((p) => selectedProductIds.includes(p.id));

    // Prepopulate form when landing page data exists
    useEffect(() => {
        if (landingPage) {
            // Set landing page name
            setName(landingPage.name || "");

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

            // Extract feature product IDs if available
            // Note: LandingPageDemo type doesn't include featureProducts, but API might return it
            const featureProducts = (landingPage as any)?.featureProducts;
            if (featureProducts && Array.isArray(featureProducts)) {
                const productIds = featureProducts.map((fp: any) => fp.productId || fp.product?.id).filter(Boolean);
                if (productIds.length > 0) {
                    setSelectedProductIds(productIds);
                }
            }
        }
    }, [landingPage]);

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

    const handleRemoveProduct = (productId: string) => {
        setSelectedProductIds(selectedProductIds.filter((id) => id !== productId));
    };

    const handleProductSelectionChange = (productIds: string[]) => {
        setSelectedProductIds(productIds);
    };

    const handleCreateLandingPage = async () => {
        if (!name.trim()) {
            toast.error("Please enter a landing page name");
            return;
        }

        if (!shopId) {
            toast.error("Please login to create a landing page");
            return;
        }

        // Build FAQ section if user has entered FAQ data
        const sections: CreateSectionPayload[] = [];

        // Check if FAQ section has any data
        const hasFaqData =
            faqTitle.trim() ||
            faqSubTitle.trim() ||
            faqItems.some((item) => item.question.trim() || item.answer.trim());

        if (hasFaqData) {
            // Filter out empty FAQ items
            const validFaqItems = faqItems.filter((item) => item.question.trim() && item.answer.trim());

            if (validFaqItems.length > 0) {
                const faqSectionList: CreateSectionListPayload[] = validFaqItems.map((item, index) => ({
                    title: item.question,
                    description: item.answer,
                }));

                const faqSection: CreateSectionPayload = {
                    index: 0,
                    componentName: "FAQ",
                    sectionType: EComponentType.FAQ,
                    title: faqTitle.trim() || undefined,
                    subTitle: faqSubTitle.trim() || undefined,
                    sectionList: faqSectionList,
                };

                sections.push(faqSection);
            }
        }

        const data: CreateLandingPagePayload = {
            name,
            productId,
            shopId,
            section: sections,
            featureProductIds: selectedProductIds,
            pageType: EPageType.EASY_WITH_FAQ,
        };

        await createLandingPage(data)
            .unwrap()
            .then(() => {
                toast.success("Landing page created successfully");
                router.push(`/landing-page`);
            })
            .catch((err) => {
                toast.error(err?.data?.message || "Something went wrong");
            });
    };

    return (
        <div className="mx-auto max-w-3xl space-y-6 p-6">
            <div className="flex items-center gap-3">
                <div className="bg-primary/10 rounded-full p-2">
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => router.push("/landing-page")}
                        className="h-9 w-9"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                </div>
                <div>
                    <h1 className="title text-2xl">Easy Landing Page Builder</h1>
                    <p className="text-muted-foreground text-sm">Create your landing page in just a few simple steps</p>
                </div>
            </div>

            <div className="bg-card space-y-6 rounded-lg border p-6">
                <CustomInput
                    label="Landing Page Title"
                    placeholder="Enter landing page title"
                    value={name}
                    onChange={(value) => setName(String(value))}
                    required
                />
            </div>

            {/* FAQ Section */}
            <div className="bg-card space-y-6 rounded-lg border p-6">
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

            {/* Package Section */}
            {shopId && <PackageSection shopId={shopId} productId={productId} />}

            {/* Featured Products Section */}
            <div className="bg-card space-y-6 rounded-lg border p-6">
                <div>
                    <h2 className="mb-2 text-lg font-semibold">Featured Products</h2>
                    <p className="text-muted-foreground text-sm">Select products to feature on your landing page</p>
                </div>

                {selectedProducts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 text-center">
                        <div className="bg-muted mb-4 rounded-full p-4">
                            <Package className="text-muted-foreground h-8 w-8" />
                        </div>
                        <h3 className="mb-2 text-lg font-semibold">No featured products</h3>
                        <p className="text-muted-foreground mb-4 text-sm">
                            Add products to showcase on your landing page
                        </p>
                        <Button type="button" variant="outline" onClick={() => setIsProductModalOpen(true)}>
                            <Plus className="mr-2 h-4 w-4" />
                            Select Products
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <p className="text-muted-foreground text-sm">
                                {selectedProducts.length} product{selectedProducts.length !== 1 ? "s" : ""} selected
                            </p>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => setIsProductModalOpen(true)}
                            >
                                <Plus className="mr-2 h-4 w-4" />
                                Add More
                            </Button>
                        </div>
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                            {selectedProducts.map((product) => (
                                <div key={product.id} className="relative rounded-lg border p-3">
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveProduct(product.id)}
                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90 absolute -top-2 -right-2 rounded-full p-1"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                    <div className="bg-muted relative mb-2 aspect-square w-full overflow-hidden rounded-md">
                                        <Image
                                            src={product.photoURL || "/placeholder.jpg"}
                                            alt={product.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <p className="line-clamp-2 text-sm font-medium">{product.name}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Product Selection Modal */}
            <FeaturedProductsSelectionDialog
                open={isProductModalOpen}
                onOpenChange={setIsProductModalOpen}
                selectedProductIds={selectedProductIds}
                onSelectionChange={handleProductSelectionChange}
                shopId={shopId || ""}
            />

            <div className="flex items-center justify-end gap-3 pt-4">
                <CustomButton variant="outline" onClick={() => router.back()}>
                    Cancel
                </CustomButton>
                <Button onClick={handleCreateLandingPage} disabled={isCreating}>
                    {isCreating ? "Creating..." : "Create Landing Page"}
                </Button>
            </div>
        </div>
    );
};
