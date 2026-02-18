"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { AboutSection } from "@/features/landing-builder/components/about-section";
import { BasicInfoSection } from "@/features/landing-builder/components/basic-info-section";
import { BuilderHeader } from "@/features/landing-builder/components/builder-header";
import { FAQSection } from "@/features/landing-builder/components/faq-section";
import { FeaturedProductsSection } from "@/features/landing-builder/components/featured-products-section";
import { FeaturedProductsSelectionDialog } from "@/features/landing-builder/components/featured-products-selection-dialog";
import { FeaturesSection } from "@/features/landing-builder/components/features-section";
import { PackageSection } from "@/features/landing-builder/components/package-section";
import { TestimonialsSection } from "@/features/landing-builder/components/testimonials-section";
import {
    defaultLandingPageFormValues,
    landingPageFormSchema,
    LandingPageFormValues,
} from "@/features/landing-builder/landing-page-form-schema";
import { useCreateLandingPageMutation } from "@/redux/api/landing-page-api";
import { useGetProductsQuery } from "@/redux/api/product-api";
import { useAppSelector } from "@/redux/store/hook";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@workspace/ui/components/button";
import { toast } from "@workspace/ui/components/sonner";
import { EComponentType, EPageType } from "@workspace/ui/landing/types";
import { FormProvider, useForm } from "react-hook-form";

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
    mode: EPageType;
    landingPage?: LandingPageDemo;
};

function getDefaultValuesFromLandingPage(landingPage?: LandingPageDemo): LandingPageFormValues {
    const base = { ...defaultLandingPageFormValues };

    if (!landingPage) return base;

    base.name = landingPage.name || "";

    const contactSection = landingPage.section?.find((s) => s.sectionType === EComponentType.CTA);
    if (contactSection) {
        base.contact = {
            whatsappNumber: contactSection.title || "",
            facebookPageId: contactSection.subTitle || "",
            specialNote: contactSection.buttonText || "",
        };
    }

    const faqSection = landingPage.section?.find((s) => s.sectionType === EComponentType.FAQ);
    if (faqSection?.sectionList?.length) {
        base.faq = {
            title: faqSection.title || "",
            subTitle: faqSection.subTitle || "",
            items: faqSection.sectionList.map((item, i) => ({
                id: item.id || `${Date.now()}-${i}`,
                question: item.title || "",
                answer: item.description || "",
            })),
        };
    } else {
        base.faq.items = [{ id: crypto.randomUUID?.() ?? Date.now().toString(), question: "", answer: "" }];
    }

    const featuresSection = landingPage.section?.find((s) => s.sectionType === EComponentType.FEATURES);
    if (featuresSection?.sectionList?.length) {
        base.features = {
            title: featuresSection.title || "",
            subTitle: featuresSection.subTitle || "",
            items: featuresSection.sectionList.map((item, i) => ({
                id: item.id || `${Date.now()}-${i}`,
                title: item.title || "",
                description: item.description || "",
            })),
        };
    }

    const testimonialsSection = landingPage.section?.find((s) => s.sectionType === EComponentType.TESTIMONIALS);
    if (testimonialsSection?.sectionList?.length) {
        const imageUrls = testimonialsSection.sectionList.map((item) => item.imgURL).filter(Boolean) as string[];
        if (imageUrls.length > 0) {
            base.testimonials = {
                title: testimonialsSection.title || "",
                subTitle: testimonialsSection.subTitle || "",
                images: imageUrls,
            };
        }
    }

    const aboutSection = landingPage.section?.find((s) => s.sectionType === EComponentType.HERO);
    if (aboutSection?.sectionList?.length) {
        base.about = {
            title: aboutSection.title || "",
            subTitle: aboutSection.subTitle || "",
            imgURL: aboutSection.imgURL || "",
            items: aboutSection.sectionList.map((item, i) => ({
                id: item.id || `${Date.now()}-${i}`,
                title: item.title || "",
                description: item.description || "",
            })),
        };
    }

    const featureProducts = (landingPage as { featureProducts?: { productId?: string; product?: { id: string } }[] })
        ?.featureProducts;
    if (featureProducts && Array.isArray(featureProducts)) {
        const ids = featureProducts
            .map((fp) => fp.productId || fp.product?.id)
            .filter((id): id is string => Boolean(id));
        if (ids.length > 0) base.selectedProductIds = ids;
    }

    return base;
}

export const EasyModeBuilder = ({ productId, mode, landingPage }: EasyModeBuilderProps) => {
    const router = useRouter();
    const user = useAppSelector((state) => state.auth.user);
    const shopId = user?.shop.id;

    const eligibleModes = [EPageType.EASY_LANDING_PAGE_2, EPageType.EASY_LANDING_PAGE_3];
    const isEligibleMode = eligibleModes.includes(mode as EPageType);

    const [isProductModalOpen, setIsProductModalOpen] = useState(false);

    const form = useForm<LandingPageFormValues>({
        resolver: zodResolver(landingPageFormSchema),
        defaultValues: getDefaultValuesFromLandingPage(landingPage),
    });

    const { watch, setValue, reset } = form;
    const selectedProductIds = watch("selectedProductIds");

    useEffect(() => {
        reset(getDefaultValuesFromLandingPage(landingPage));
    }, [landingPage, reset]);

    const [createLandingPage, { isLoading: isCreating }] = useCreateLandingPageMutation();

    const { data: productsData } = useGetProductsQuery({
        shopId: shopId || "",
        limit: 50,
    });

    const products = productsData?.data || [];
    const selectedProducts = products.filter((p) => selectedProductIds.includes(p.id));

    const handleRemoveProduct = (productId: string) => {
        setValue(
            "selectedProductIds",
            selectedProductIds.filter((id) => id !== productId)
        );
    };

    const handleProductSelectionChange = (ids: string[]) => {
        setValue("selectedProductIds", ids);
    };

    const onSubmit = async (values: LandingPageFormValues) => {
        if (!shopId) {
            toast.error("Please login to create a landing page");
            return;
        }

        const sections: CreateSectionPayload[] = [];
        let sectionIndex = 0;

        const hasContactData = values.contact.whatsappNumber.trim() || values.contact.facebookPageId.trim() || values.contact.specialNote.trim();
        if (hasContactData) {
            const whatsappNumber = formatPhoneNumber(values.contact.whatsappNumber);
            sections.push({
                index: sectionIndex++,
                componentName: "Contact",
                sectionType: EComponentType.CTA,
                title: whatsappNumber || undefined,
                subTitle: values.contact.facebookPageId.trim() || undefined,
                buttonText: values.contact.specialNote.trim() || undefined,
            });
        }

        const hasFaqData =
            values.faq.title.trim() ||
            values.faq.subTitle?.trim() ||
            values.faq.items.some((i) => i.question.trim() || i.answer.trim());
        if (hasFaqData) {
            const validFaqItems = values.faq.items.filter((i) => i.question.trim() && i.answer.trim());
            if (validFaqItems.length > 0) {
                const faqSectionList: CreateSectionListPayload[] = validFaqItems.map((item) => ({
                    title: item.question,
                    description: item.answer,
                }));
                sections.push({
                    index: sectionIndex++,
                    componentName: "FAQ",
                    sectionType: EComponentType.FAQ,
                    title: values.faq.title.trim() || undefined,
                    subTitle: values.faq.subTitle?.trim() || undefined,
                    sectionList: faqSectionList,
                });
            }
        }

        const hasFeaturesData =
            values.features.title.trim() ||
            values.features.subTitle?.trim() ||
            values.features.items.some((i) => i.title.trim() || i.description.trim());
        if (isEligibleMode && hasFeaturesData) {
            const validFeatureItems = values.features.items.filter((i) => i.title.trim() && i.description.trim());
            if (validFeatureItems.length > 0) {
                const featureSectionList: CreateSectionListPayload[] = validFeatureItems.map((item) => ({
                    title: item.title,
                    description: item.description,
                }));
                sections.push({
                    index: sectionIndex++,
                    componentName: "Features",
                    sectionType: EComponentType.FEATURES,
                    title: values.features.title.trim() || undefined,
                    subTitle: values.features.subTitle?.trim() || undefined,
                    sectionList: featureSectionList,
                });
            }
        }

        const hasTestimonialsData =
            values.testimonials.title.trim() ||
            values.testimonials.subTitle?.trim() ||
            (values.testimonials.images?.length ?? 0) > 0;
        if (isEligibleMode && hasTestimonialsData && values.testimonials.images?.length) {
            const testimonialSectionList: CreateSectionListPayload[] = values.testimonials.images.map((imgURL) => ({
                imgURL,
            }));
            sections.push({
                index: sectionIndex++,
                componentName: "Testimonials",
                sectionType: EComponentType.TESTIMONIALS,
                title: values.testimonials.title.trim() || undefined,
                subTitle: values.testimonials.subTitle?.trim() || undefined,
                sectionList: testimonialSectionList,
            });
        }

        const hasAboutData =
            values.about.title.trim() ||
            values.about.subTitle?.trim() ||
            values.about.imgURL?.trim() ||
            values.about.items.some((i) => i.title.trim() || i.description.trim());
        if (isEligibleMode && hasAboutData) {
            const validAboutItems = values.about.items.filter((i) => i.title.trim() && i.description.trim());
            if (validAboutItems.length > 0 || values.about.title.trim() || values.about.imgURL?.trim()) {
                const aboutSectionList: CreateSectionListPayload[] = validAboutItems.map((item) => ({
                    title: item.title,
                    description: item.description,
                }));
                sections.push({
                    index: sectionIndex++,
                    componentName: "About",
                    sectionType: EComponentType.HERO,
                    title: values.about.title.trim() || undefined,
                    subTitle: values.about.subTitle?.trim() || undefined,
                    imgURL: values.about.imgURL?.trim() || undefined,
                    sectionList: aboutSectionList,
                });
            }
        }

        const data: CreateLandingPagePayload = {
            name: values.name.trim(),
            productId,
            shopId,
            section: sections,
            featureProductIds: values.selectedProductIds,
            pageType: mode,
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
        <FormProvider {...form}>
            <div className="landing-width space-y-4 lg:space-y-6 lg:p-6">
                <BuilderHeader
                    title="Easy Landing Page Builder"
                    subtitle="Create your landing page in just a few simple steps"
                    onBack={() => router.push("/landing-page")}
                />

                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 lg:space-y-6">
                    <BasicInfoSection />

                    {isEligibleMode && (
                        <>
                            <AboutSection />
                            <FeaturesSection />
                            <TestimonialsSection />
                        </>
                    )}

                    <FAQSection landingPage={landingPage} />

                    {shopId && <PackageSection shopId={shopId} productId={productId} />}

                    <FeaturedProductsSection
                        selectedProducts={selectedProducts.map((p) => ({
                            id: p.id,
                            name: p.name,
                            photoURL: p.photoURL ?? null,
                        }))}
                        onOpenSelectModal={() => setIsProductModalOpen(true)}
                        onRemoveProduct={handleRemoveProduct}
                    />

                    <FeaturedProductsSelectionDialog
                        open={isProductModalOpen}
                        onOpenChange={setIsProductModalOpen}
                        selectedProductIds={selectedProductIds}
                        onSelectionChange={handleProductSelectionChange}
                        shopId={shopId || ""}
                    />

                    <div className="flex items-center justify-end gap-3 pt-4">
                        <CustomButton type="button" variant="outline" onClick={() => router.back()}>
                            Cancel
                        </CustomButton>
                        <Button type="submit" disabled={isCreating}>
                            {isCreating ? "Creating..." : "Create Landing Page"}
                        </Button>
                    </div>
                </form>
            </div>
        </FormProvider>
    );
};
