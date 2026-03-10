import { OrderSection } from "@/features/product/components/order-section";
import { useOrderForm } from "@/features/product/hooks/use-order-form";
import { LandingFeaturedProducts } from "@/features/shop/landing-page/components/landing-featured-products";
import { LandingFooter } from "@/features/shop/landing-page/components/landing-footer";
import { cn } from "@workspace/ui/lib/utils";

import { LandingPage } from "@/types/landing-type";

type Props = {
    landingPage: LandingPage;
    domain: string;
    className?: string;
    children: React.ReactNode;
    theme: {
        primary: string;
        secondary: string;
    };
    specialNote?: string;
};

export const EasyLandingWrapper = ({ landingPage, domain, className, children, theme, specialNote }: Props) => {
    const product = landingPage.product;
    const featureProducts = landingPage.featureProducts;

    const {
        formData,
        errors,
        isSubmitting,
        selectedDeliveryZone,
        selectedVariants,
        selectedPackage,
        selectedPackageProductVariants,
        packages,
        totalAmount,
        handleInputChange,
        handleVariantChange,
        setSelectedDeliveryZone,
        handlePackageSelect,
        handlePackageProductVariantChange,
        handleSubmit,
    } = useOrderForm(product, domain);

    return (
        <div className={cn("font-hind-siliguri bg-gray-50", className)}>
            <style jsx global>{`
                :root {
                    --theme-primary: ${theme.primary};
                    --theme-secondary: ${theme.secondary};
                }
                @keyframes pulse-subtle {
                    0% {
                        transform: scale(1);
                        box-shadow: 0 0 0 0 ${theme.primary}66;
                    }
                    70% {
                        transform: scale(1.05);
                        box-shadow: 0 0 0 10px ${theme.primary}00;
                    }
                    100% {
                        transform: scale(1);
                        box-shadow: 0 0 0 0 ${theme.primary}00;
                    }
                }
                .animate-pulse-subtle {
                    animation: pulse-subtle 3s infinite;
                }
                @keyframes slide-loop {
                    0%,
                    45% {
                        transform: translateX(0);
                    }
                    50%,
                    95% {
                        transform: translateX(-50%);
                    }
                    100% {
                        transform: translateX(0);
                    }
                }
                @keyframes slowFade {
                    0%,
                    100% {
                        opacity: 0;
                        transform: translateX(5px);
                    }
                    30%,
                    70% {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
                .slider-wrapper {
                    animation: slide-loop 12s infinite ease-in-out;
                }
            `}</style>

            {children}

            {/* Order Section */}
            <OrderSection
                theme={{ primary: theme.primary, secondary: theme.secondary }}
                product={product}
                packages={packages}
                specialNote={specialNote}
                formData={formData}
                errors={errors}
                isSubmitting={isSubmitting}
                selectedDeliveryZone={selectedDeliveryZone}
                selectedVariants={selectedVariants}
                selectedPackage={selectedPackage}
                selectedPackageProductVariants={selectedPackageProductVariants}
                totalAmount={totalAmount}
                handleInputChange={handleInputChange}
                handleVariantChange={handleVariantChange}
                setSelectedDeliveryZone={setSelectedDeliveryZone}
                handlePackageSelect={handlePackageSelect}
                handlePackageProductVariantChange={handlePackageProductVariantChange}
                handleSubmit={handleSubmit}
            />

            <LandingFeaturedProducts featureProducts={featureProducts} shopSlug={domain} />

            <LandingFooter banglaName={product.banglaName} shopSlug={domain} />
        </div>
    );
};
