import { memo } from "react";

import { Shield } from "lucide-react";

type Props = {
    warranty: string;
};

export const ProductWarranty = memo(function ProductWarranty({ warranty }: Props) {
    return (
        <div className="mb-6 flex items-center gap-2 rounded-xl bg-blue-50 p-4">
            <Shield className="h-6 w-6 flex-shrink-0 text-blue-600" />
            <div>
                <div className="text-xs text-gray-600">ওয়ারেন্টি</div>
                <div className="text-sm font-bold text-gray-800">{warranty}</div>
            </div>
        </div>
    );
});
