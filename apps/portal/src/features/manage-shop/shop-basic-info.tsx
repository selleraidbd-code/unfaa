"use client";

import { shopCategories } from "@/data/shop-data";
import { CustomCollapsible } from "@workspace/ui/components/custom/custom-collapsible";
import { CustomFormInput } from "@workspace/ui/components/custom/custom-form-input";
import { CustomFormSearchSelect } from "@workspace/ui/components/custom/custom-form-search-select";
import { CustomFormSwitch } from "@workspace/ui/components/custom/custom-form-switch";
import { CustomFormTextarea } from "@workspace/ui/components/custom/custom-form-textarea";
import { Button } from "@workspace/ui/components/button";
import { Form } from "@workspace/ui/components/form";
import { cn } from "@workspace/ui/lib/utils";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const shopInfoSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  description: z.string().min(1),
  phoneNumber: z.string().min(1),
  address: z.string().min(1),
  topBarMessage: z.string().min(1),
  shopType: z.string().min(1),
  vat: z.number().min(1),
  orderNote: z.string().min(1),
  maintainStockQuantity: z.boolean(),
  showProductSoldCount: z.boolean(),
});

export const ShopBasicInfo = ({ className }: { className?: string }) => {
  const form = useForm<z.infer<typeof shopInfoSchema>>({
    resolver: zodResolver(shopInfoSchema),
    defaultValues: {
      name: "",
      email: "",
      phoneNumber: "",
      description: "",
      address: "",
      topBarMessage: "",
      shopType: "",
      vat: 0,
      orderNote: "",
      maintainStockQuantity: true,
      showProductSoldCount: false,
    },
  });

  const onSubmit = (data: z.infer<typeof shopInfoSchema>) => {
    console.log(data);
  };

  return (
    <div className={cn("space-y-6", className)}>
      <CustomCollapsible
        title="Shop Basic Info"
        content={
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid grid-cols-2 gap-4 pt-2">
                <CustomFormInput
                  label="Shop Name"
                  name="name"
                  placeholder="Enter Shop Name"
                  control={form.control}
                />
                <CustomFormSearchSelect
                  label="Shop Type"
                  name="shopType"
                  options={shopCategories}
                  placeholder="Select Shop Type"
                  control={form.control}
                />
                <CustomFormInput
                  label="Shop Email"
                  name="email"
                  type="email"
                  placeholder="Enter Shop Email"
                  control={form.control}
                />
                <CustomFormInput
                  label="Shop Phone Number"
                  name="phoneNumber"
                  placeholder="Enter Shop Phone Number"
                  control={form.control}
                />
                <CustomFormTextarea
                  label="Shop Address"
                  name="address"
                  placeholder="Enter Shop Address"
                  control={form.control}
                  className="col-span-2"
                />
                <CustomFormTextarea
                  label="Shop Details (SEO & Data Feed)"
                  name="description"
                  placeholder="Enter Shop Description"
                  control={form.control}
                  className="col-span-2"
                />

                <CustomFormTextarea
                  label="Topbar Announcement Message"
                  name="topBarMessage"
                  className="col-span-2"
                  placeholder="Enter Top Bar Message"
                  control={form.control}
                />

                <div className="col-span-2 space-y-4">
                  <CustomFormSwitch
                    label="Maintain Stock Quantity"
                    name="maintainStockQuantity"
                    description="Enabling this option ensures that products with zero stock will be marked as 'Out of Stock' on the website."
                    control={form.control}
                    labelClassName="text-base"
                    className="flex-col gap-3"
                    descriptionClassName="text-base"
                    parentClassName="justify-between"
                  />
                  <CustomFormSwitch
                    label="Show Product Sold Count"
                    name="showProductSoldCount"
                    description="Enabling this option ensures that products will show sold count on your website."
                    control={form.control}
                    labelClassName="text-base"
                    className="flex-col gap-3"
                    descriptionClassName="text-base"
                    parentClassName="justify-between"
                  />
                </div>
                <CustomFormInput
                  label="VAT / Tax Percentage"
                  name="vat"
                  type="number"
                  placeholder="Enter VAT / Tax Percentage"
                  control={form.control}
                  min={0}
                  max={100}
                />
                <CustomFormTextarea
                  label="Order Process Message Note"
                  name="orderNote"
                  placeholder="Enter Order Process Message Note"
                  control={form.control}
                  className="col-span-2"
                />
              </div>

              <div className="flex justify-end pt-4">
                <Button type="submit">Update Shop Info</Button>
              </div>
            </form>
          </Form>
        }
      />
    </div>
  );
};
