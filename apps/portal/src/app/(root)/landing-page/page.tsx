"use client";

import { CustomButton } from "@/components/ui/custom-button";
import { ProductSelectDialogForLandingPage } from "@/features/landing-builder/components/product-select-dialog-for-landing-page";
import { useState } from "react";

const landingPages = [
    {
        id: 1,
        name: "Landing Page 1",
        url: "https://evotechbd.info/wp-content/uploads/2025/06/screencapture-dev-evo-tech-pantheonsite-io-step-three-peace-2025-01-15-19_43_29-scaled-1.webp",
    },
    {
        id: 2,
        name: "Landing Page 2",
        url: "https://evotechbd.info/wp-content/uploads/2025/06/screencapture-dev-evo-tech-pantheonsite-io-step-mustard-oil-2025-01-15-19_44_31-scaled-1.webp",
    },
    {
        id: 3,
        name: "Landing Page 3",
        url: "https://evotechbd.info/wp-content/uploads/2025/06/screencapture-dev-evo-tech-pantheonsite-io-step-mustard-oil-2025-01-15-19_44_31-scaled-1.webp",
    },
];

const Page = () => {
    const [productSelectModalOpen, setProductSelectModalOpen] = useState(false);

    return (
        <>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-semibold tracking-tight">
                            Landing Pages
                        </h2>
                        <p className="text-muted-foreground">
                            Here&apos;s a list of your Landing Pages!
                        </p>
                    </div>

                    <CustomButton
                        onClick={() => setProductSelectModalOpen(true)}
                    >
                        Add Landing Page
                    </CustomButton>
                </div>

                <div className="max-xl:flex xl:grid xl:grid-cols-3 flex-wrap gap-6 max-xl:justify-center">
                    {landingPages.map((landingPage) => (
                        <div
                            key={landingPage.id}
                            className="border flex flex-col items-center gap-4 rounded-lg p-4 h-[700px] w-full max-xl:w-[500px]"
                        >
                            <div
                                className="w-full h-full cursor-pointer bg-cover bg-no-repeat bg-top transition-all duration-[3s] ease-in-out hover:bg-center focus:bg-top"
                                style={{
                                    backgroundImage: `url(${landingPage.url})`,
                                }}
                            />

                            <CustomButton>View Landing Page</CustomButton>
                        </div>
                    ))}
                </div>
            </div>

            {productSelectModalOpen && (
                <ProductSelectDialogForLandingPage
                    open={productSelectModalOpen}
                    onClose={() => setProductSelectModalOpen(false)}
                />
            )}
        </>
    );
};

export default Page;
