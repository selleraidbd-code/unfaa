import { useShop } from "@/contexts/shop-context";
import { CustomFormInput } from "@workspace/ui/components/custom/custom-form-input";
import { CustomFormSelect } from "@workspace/ui/components/custom/custom-form-select";
import { useFormContext } from "react-hook-form";

// Mock delivery zones - in a real app, this would come from an API
const MOCK_DELIVERY_ZONES = [
    {
        value: "ae5255f5-49d9-492b-94d0-80d937c1260d",
        label: "ঢাকা সিটি (ফ্রি)",
    },
    {
        value: "be5255f5-49d9-492b-94d0-80d937c1260e",
        label: "ঢাকা মেট্রো (৳50)",
    },
    {
        value: "ce5255f5-49d9-492b-94d0-80d937c1260f",
        label: "চট্টগ্রাম (৳100)",
    },
    {
        value: "de5255f5-49d9-492b-94d0-80d937c1260g",
        label: "সিলেট (৳150)",
    },
];

const BillingDetails = () => {
    const { shop } = useShop();
    console.log("shop", shop);
    const { control } = useFormContext();

    return (
        <div className="space-y-4 py-4 lg:space-y-6 lg:py-6">
            <CustomFormInput
                name="name"
                control={control}
                label="আপনার সম্পূর্ণ নাম লিখুন"
                placeholder="নাম লিখুন"
                required
            />
            <CustomFormInput
                name="address"
                control={control}
                label="সম্পূর্ণ ঠিকানা পূরণ করুন"
                placeholder="ঠিকানা লিখুন"
                required
            />
            <CustomFormInput
                name="phone"
                control={control}
                label="আপনার ফোন নাম্বার"
                placeholder="ফোন নাম্বার লিখুন"
                type="text"
                required
            />
            <CustomFormSelect
                name="deliveryZoneId"
                control={control}
                label="ডেলিভারি জোন নির্বাচন করুন"
                placeholder="ডেলিভারি জোন বেছে নিন"
                options={MOCK_DELIVERY_ZONES}
                required
            />
        </div>
    );
};

export default BillingDetails;
