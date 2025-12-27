import Image from "next/image";

import { UploadBannerDialog } from "@/features/manage-shop/website-customization/upload-banner-dialog";
import { WebCustomizationEmptyMessage } from "@/features/manage-shop/website-customization/web-customization-empty-message";
import { WebCustomizationHeader } from "@/features/manage-shop/website-customization/web-customization-header";
import { useUpdateCoreThemeMutation } from "@/redux/api/shop-theme-api";
import { Button } from "@workspace/ui/components/button";
import { toast } from "@workspace/ui/components/sonner";
import { Trash2 } from "lucide-react";

import { ShopTheme } from "@/types/shop-type";
import { useAlert } from "@/hooks/useAlert";

export const ManageBanner = ({ theme }: { theme: ShopTheme }) => {
    const bannerImg = theme.bannerImg || [];
    const { fire } = useAlert();

    const [updateCoreTheme, { isLoading }] = useUpdateCoreThemeMutation();

    const handleDeleteBanner = (imgUrl: string) => {
        fire({
            title: "Delete Banner",
            description: "Are you sure you want to delete this banner?",
            onConfirm: async () => {
                await updateCoreTheme({
                    id: theme.id,
                    payload: {
                        bannerImg: bannerImg.filter((img) => img !== imgUrl),
                    },
                })
                    .unwrap()
                    .then(() => {
                        toast.success("Banner deleted successfully");
                    })
                    .catch((error) => {
                        toast.error(error.data.message || "Something went wrong");
                    });
            },
        });
    };

    return (
        <div className="flex w-full flex-col gap-2 rounded-sm border-2 border-dashed border-slate-300 p-4 md:gap-3 md:rounded-lg md:p-6 dark:border-slate-700">
            <WebCustomizationHeader
                title="Homepage Banners"
                description="Select upto 5 items to get a better visual impact on your
                website"
                button={<UploadBannerDialog bannerImg={bannerImg} themeId={theme.id} />}
            />

            {bannerImg.length === 0 ? (
                <WebCustomizationEmptyMessage
                    title="No banners uploaded yet"
                    description="Upload up to 5 banner images to create an engaging homepage experience for your customers."
                />
            ) : (
                <div className="grid grid-cols-2 gap-2 sm:gap-4 lg:grid-cols-3 xl:grid-cols-5">
                    {bannerImg.map((img) => (
                        <div key={img} className="relative w-full">
                            <Image src={img} alt="banner" className="h-auto w-full" width={800} height={400} />
                            <Button
                                variant="destructive"
                                size="icon"
                                className="absolute top-1 right-1 md:top-3 md:right-3"
                                onClick={() => handleDeleteBanner(img)}
                                disabled={isLoading}
                            >
                                <Trash2 className="max-sm:size-4" />
                            </Button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
