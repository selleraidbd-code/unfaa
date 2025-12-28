"use client";

import { memo } from "react";

type Props = {
    videoLink: string;
};

export const ProductVideo = memo(function ProductVideo({ videoLink }: Props) {
    return (
        <div className="mb-6">
            <h3 className="mb-3 text-xl font-bold text-gray-900">প্রোডাক্ট ভিডিও</h3>
            <div dangerouslySetInnerHTML={{ __html: videoLink }}></div>
        </div>
    );
});
