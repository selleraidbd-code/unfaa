import { memo } from "react";

type Props = {
    price: number;
    discountPrice: number;
};

export const ProductPricing = memo(function ProductPricing({ price, discountPrice }: Props) {
    return (
        <div className="mb-6 rounded-xl bg-green-600 p-6 text-center font-bold text-white">
            <div className="mb-2 text-lg text-red-100 line-through">নিয়মিত মূল্য: ৳{price.toLocaleString()} টাকা</div>
            {discountPrice && (
                <div className="text-2xl">💥 অফার মূল্য: মাত্র ৳{discountPrice.toLocaleString()} টাকা!</div>
            )}
        </div>
    );
});
