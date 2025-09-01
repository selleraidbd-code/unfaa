"use client";

import { HeaderBackButton } from "@/components/ui/custom-back-button";
import { ManageBanner } from "@/features/manage-shop/website-customization/manage-banner";
import { ManageCategories } from "@/features/manage-shop/website-customization/manage-categories";
import useGetUser from "@/hooks/useGetUser";
import {
  useCreateShopThemeMutation,
  useGetShopThemeQuery,
} from "@/redux/api/shop-theme-api";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@workspace/ui/components/button";
import { Form } from "@workspace/ui/components/form";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  bannerImg: z.array(z.string()),
  categories: z.array(z.string()).min(8, "Please select at least 8 categories"),
});

const WebsiteCustomization = () => {
  const user = useGetUser();
  const shopId = user?.shop?.id as string;
  const { data, isLoading: isLoadingTheme } = useGetShopThemeQuery({
    shopId,
  });
  const theme = data?.data;

  const [createShopTheme, { isLoading: isCreating }] =
    useCreateShopThemeMutation();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      bannerImg: [],
      categories: [],
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    if (!user?.shop?.id) return toast.error("Shop not found");

    console.log("data :>> ", data);

    // const payload: ShopTheme = {
    //     shopId: user?.shop?.id,
    //     shopThemeType: shopThemeType.MINIMAL,
    //     bannerImg: data.bannerImg,
    //     categories: data.categories,
    // };

    // await createShopTheme(payload)
    //     .unwrap()
    //     .then(() => {
    //         toast.success("Shop theme created successfully");
    //     })
    //     .catch((error) => {
    //         toast.error(error.data.message);
    //     });
  };

  const formData = form.watch();
  const selectedCategoriesCount = formData.categories?.length || 0;
  const minRequired = 8;

  if (isLoadingTheme) {
    return <div>Loading...</div>;
  }

  if (!theme) {
    return <div>Theme not found</div>;
  }

  return (
    <div className="space-y-6">
      <HeaderBackButton title="Website Customization" href="/manage-shop" />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {theme && <ManageBanner theme={theme} />}

          <ManageCategories form={form} theme={theme} />

          <div className="flex items-center justify-end">
            <Button
              type="submit"
              disabled={isCreating || selectedCategoriesCount < minRequired}
            >
              {isCreating ? "Creating..." : "Create Theme"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default WebsiteCustomization;
