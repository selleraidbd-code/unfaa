import { useShop } from "@/contexts/shop-context";
import { CustomFormInput } from "@workspace/ui/components/custom/custom-form-input";
import { CustomRadioGroupCard } from "@workspace/ui/components/custom/custom-radio-group-card";
import { useFormContext } from "react-hook-form";

export const BillingDetails = () => {
    const { shop } = useShop();

    const deliveryZones =
        shop?.delivery[0]?.deliveryZones?.map((deliveryZone) => ({
            value: deliveryZone.id,
            label: deliveryZone.name,
        })) || [];

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
            <CustomRadioGroupCard
                name="deliveryZoneId"
                control={control}
                label="ডেলিভারি জোন নির্বাচন করুন"
                options={deliveryZones}
                columns={2}
            />
        </div>
    );
};
