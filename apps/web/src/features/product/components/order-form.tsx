"use client";

type Props = {
    formData: {
        name: string;
        address: string;
        phone: string;
    };
    errors: {
        name?: string;
        address?: string;
        phone?: string;
    };
    isSubmitting: boolean;
    totalAmount: number;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSubmit: () => void;
};

export const OrderForm = ({ formData, errors, isSubmitting, totalAmount, onInputChange, onSubmit }: Props) => {
    return (
        <div className="mb-6 space-y-4">
            <div>
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={onInputChange}
                    placeholder="আপনার নাম লিখুন"
                    className="w-full rounded-xl border-2 border-gray-300 px-4 py-4 text-lg transition-colors focus:border-green-600 focus:outline-none"
                />
                {errors.name && <p className="mt-2 text-sm font-semibold text-red-600">{errors.name}</p>}
            </div>

            <div>
                <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={onInputChange}
                    placeholder="সম্পূর্ণ ঠিকানা (জেলা, থানা ও গ্রামের নাম)"
                    className="w-full rounded-xl border-2 border-gray-300 px-4 py-4 text-lg transition-colors focus:border-green-600 focus:outline-none"
                />
                {errors.address && <p className="mt-2 text-sm font-semibold text-red-600">{errors.address}</p>}
            </div>

            <div>
                <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={onInputChange}
                    placeholder="সচল মোবাইল নাম্বার (০১XXXXXXXXX)"
                    className="w-full rounded-xl border-2 border-gray-300 px-4 py-4 text-lg transition-colors focus:border-green-600 focus:outline-none"
                />
                {errors.phone && <p className="mt-2 text-sm font-semibold text-red-600">{errors.phone}</p>}
            </div>

            <button
                onClick={onSubmit}
                disabled={isSubmitting}
                className="w-full rounded-xl bg-green-600 py-5 text-xl font-bold text-white shadow-lg transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-400"
            >
                {isSubmitting ? "অর্ডার করা হচ্ছে..." : `অর্ডার করুন (${totalAmount?.toLocaleString()} টাকা)`}
            </button>
        </div>
    );
};
