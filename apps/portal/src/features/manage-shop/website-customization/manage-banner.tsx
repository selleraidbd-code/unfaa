import { Button } from "@workspace/ui/components/button";
import { CustomFormImages } from "@/components/ui/custom-form-images";
import { ShopTheme } from "@/features/manage-shop/types";
import { UseFormReturn } from "react-hook-form";

export const ManageBanner = ({
  theme,
  form,
}: {
  theme: ShopTheme;
  form: UseFormReturn<{
    bannerImg: string[];
    categories: string[];
  }>;
}) => {
  return (
    <div className="w-full flex flex-col border-2 border-dashed border-slate-300 rounded-lg p-6">
      <div className="flex justify-between w-full flex-wrap">
        <div>
          <h2 className="text-lg font-semibold">Homepage Banners</h2>
          <p className="text-sm font-normal text-gray-500 mt-1 max-w-[600px] text-wrap">
            Select upto 5 items to get a better visual impact on your website
          </p>
        </div>
        <Button>Upload Banner(0/5)</Button>
      </div>

      <br />

      {theme.bannerImg.length === 0 ? (
        <div className="text-center text-sm text-gray-500">
          ***No items selected****
        </div>
      ) : (
        <CustomFormImages
          name="bannerImg"
          control={form.control}
          label="Banner Image"
          className="w-full"
          limit={5}
        />
      )}
    </div>
  );
};
