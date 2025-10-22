import { Hero } from "@/features/landing/hero";
import { Features } from "@/features/landing/features";
import { HowItWorks } from "@/features/landing/how-it-works";
import { Video } from "@/features/landing/video";
import { Testimonials } from "@/features/landing/testimonials";
import { Pricing } from "@/features/landing/pricing";
import { FAQ } from "@/features/landing/faq";
import { CTA } from "@/features/landing/cta";

const Page = () => {
    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
            <Hero />
            <Features />
            <HowItWorks />
            <Video />
            <Testimonials />
            <Pricing />
            <FAQ />
            <CTA />
        </div>
    );
};

export default Page;
