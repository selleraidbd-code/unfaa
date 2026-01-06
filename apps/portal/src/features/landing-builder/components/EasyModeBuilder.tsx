"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { ContactData, ContactSection } from "@/features/landing-builder/components/contact-section";
import { FAQData, FAQSection } from "@/features/landing-builder/components/faq-section";
import { FeaturedProductsSelectionDialog } from "@/features/landing-builder/components/featured-products-selection-dialog";
import { PackageSection } from "@/features/landing-builder/components/package-section";
import { useCreateLandingPageMutation } from "@/redux/api/landing-page-api";
import { useGetProductsQuery } from "@/redux/api/product-api";
import { useAppSelector } from "@/redux/store/hook";
import { Button } from "@workspace/ui/components/button";
import { CustomInput } from "@workspace/ui/components/custom/custom-input";
import { toast } from "@workspace/ui/components/sonner";
import { EComponentType, EPageType } from "@workspace/ui/landing/types";
import { ArrowLeft, Package, Plus, X } from "lucide-react";

import {
    CreateLandingPagePayload,
    CreateSectionListPayload,
    CreateSectionPayload,
    LandingPageDemo,
} from "@/types/landing-page-type";
import { formatPhoneNumber } from "@/lib/format-number-utils";
import { CustomButton } from "@/components/ui/custom-button";

type EasyModeBuilderProps = {
    productId: string;
    landingPage?: LandingPageDemo;
};

export const EasyModeBuilder = ({ productId, landingPage }: EasyModeBuilderProps) => {
    const router = useRouter();
    const user = useAppSelector((state) => state.auth.user);
    const shopId = user?.shop.id;
    const [name, setName] = useState("");
    const [contactData, setContactData] = useState<ContactData>({
        whatsappNumber: "",
        facebookPageId: "",
    });
    const [faqData, setFaqData] = useState<FAQData>({
        title: "",
        subTitle: "",
        items: [{ id: Date.now().toString(), question: "", answer: "" }],
    });
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

            // Extract Contact section if it exists
            const contactSection = landingPage.section?.find((section) => section.sectionType === EComponentType.CTA);

            if (contactSection) {
                // WhatsApp number is stored in title, Facebook page ID in subTitle
                setContactData({
                    whatsappNumber: contactSection.title || "",
                    facebookPageId: contactSection.subTitle || "",
                });
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

        // Build sections array
        const sections: CreateSectionPayload[] = [];
        let sectionIndex = 0;

        // Check if Contact section has any data
        const hasContactData = contactData.whatsappNumber.trim() || contactData.facebookPageId.trim();

        if (hasContactData) {
            const whatsappNumber = formatPhoneNumber(contactData.whatsappNumber);

            const contactSection: CreateSectionPayload = {
                index: sectionIndex++,
                componentName: "Contact",
                sectionType: EComponentType.CTA,
                title: whatsappNumber || undefined,
                subTitle: contactData.facebookPageId.trim() || undefined,
            };

            sections.push(contactSection);
        }

        // Check if FAQ section has any data
        const hasFaqData =
            faqData.title.trim() ||
            faqData.subTitle.trim() ||
            faqData.items.some((item) => item.question.trim() || item.answer.trim());

        if (hasFaqData) {
            // Filter out empty FAQ items
            const validFaqItems = faqData.items.filter((item) => item.question.trim() && item.answer.trim());

            if (validFaqItems.length > 0) {
                const faqSectionList: CreateSectionListPayload[] = validFaqItems.map((item) => ({
                    title: item.question,
                    description: item.answer,
                }));

                const faqSection: CreateSectionPayload = {
                    index: sectionIndex++,
                    componentName: "FAQ",
                    sectionType: EComponentType.FAQ,
                    title: faqData.title.trim() || undefined,
                    subTitle: faqData.subTitle.trim() || undefined,
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
        <div className="mx-auto max-w-3xl space-y-4 lg:space-y-6 lg:p-6">
            <div className="flex items-center gap-2 lg:gap-3">
                <div className="bg-primary/10 rounded-full p-1 lg:p-2">
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
                    <h1 className="title lg:text-2xl">Easy Landing Page Builder</h1>
                    <p className="text-muted-foreground text-sm max-sm:hidden">
                        Create your landing page in just a few simple steps
                    </p>
                </div>
            </div>

            <div className="bg-card space-y-4 rounded-lg border p-4 lg:space-y-6 lg:p-6">
                <CustomInput
                    label="Landing Page Title"
                    placeholder="Enter landing page title"
                    value={name}
                    onChange={(value) => setName(String(value))}
                    required
                />
            </div>

            {/* Contact Section */}
            <ContactSection
                whatsappNumber={contactData.whatsappNumber}
                facebookPageId={contactData.facebookPageId}
                onWhatsappNumberChange={(value) =>
                    setContactData((prev: ContactData) => ({ ...prev, whatsappNumber: value }))
                }
                onFacebookPageIdChange={(value) =>
                    setContactData((prev: ContactData) => ({ ...prev, facebookPageId: value }))
                }
            />

            {/* FAQ Section */}
            <FAQSection landingPage={landingPage} onDataChange={setFaqData} />

            {/* Package Section */}
            {shopId && <PackageSection shopId={shopId} productId={productId} />}

            {/* Featured Products Section */}
            <div className="bg-card space-y-4 rounded-lg border p-4 lg:space-y-6 lg:p-6">
                <div>
                    <h2 className="mb-2 text-lg font-semibold">Featured Products</h2>
                    <p className="text-muted-foreground text-sm max-sm:hidden">
                        Select products to feature on your landing page
                    </p>
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
