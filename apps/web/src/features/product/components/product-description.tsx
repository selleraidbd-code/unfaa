import { memo } from "react";
import Image from "next/image";

import { HtmlRenderer } from "@/components/shared/html-renderer";

type Props = {
    description: string;
    imageTwo?: string;
    imageThree?: string;
    fullDescription: string;
};

export const ProductDescription = memo(function ProductDescription({
    description,
    imageTwo,
    imageThree,
    fullDescription,
}: Props) {
    return (
        <>
            <div className="mb-4 rounded-xl border-l-4 border-blue-500 bg-blue-50 p-5 lg:border-l-6">
                <h3 className="mb-3 text-xl font-bold text-blue-600">সংক্ষিপ্ত বিবরণ</h3>
                <HtmlRenderer html={description} />
            </div>
            {imageTwo && (
                <Image
                    src={imageTwo}
                    alt="Product"
                    className="mb-4 w-full rounded-xl shadow-md"
                    width={1000}
                    height={1000}
                />
            )}

            <div className="mb-4 rounded-xl border-l-4 border-gray-500 bg-gray-100 p-5 lg:border-l-6">
                <h3 className="mb-3 text-xl font-bold text-gray-700">বিস্তারিত বিবরণ</h3>
                <HtmlRenderer html={fullDescription} />
            </div>
            {imageThree && (
                <Image
                    src={imageThree}
                    alt="Product"
                    className="mb-4 w-full rounded-xl shadow-md"
                    width={1000}
                    height={1000}
                />
            )}
        </>
    );
});
