import { SelectProductDialog } from "@/features/manage-shop/website-customization/select-product-dialog";
import { WebCustomizationEmptyMessage } from "@/features/manage-shop/website-customization/web-customization-empty-message";
import { WebCustomizationHeader } from "@/features/manage-shop/website-customization/web-customization-header";
import { ProductSelectionCard } from "@/features/products/product-selection-card";
import { useAlert } from "@/hooks/useAlert";
import { AlertType } from "@/providers/AlertProvider";
import { useUpdateShopThemeSectionProductsMutation } from "@/redux/api/shop-theme-api";
import { ShopSection } from "@/types/shop-type";
import { Button } from "@workspace/ui/components/button";
import { useState } from "react";
import { toast } from "@workspace/ui/components/sonner";

export const ManageSection = ({ section }: { section: ShopSection }) => {
    const { fire } = useAlert();
    const [open, setOpen] = useState(false);
    const productIds = section.products.map((product) => product.product.id);

    const [updateShopThemeSectionProducts] =
        useUpdateShopThemeSectionProductsMutation();

    const handleRemoveProduct = (productId: string) => {
        fire({
            title: "Remove Product",
            description: "Are you sure you want to remove this product?",
            type: AlertType.WARNING,
            onConfirm: async () => {
                await updateShopThemeSectionProducts({
                    shopThemeId: section.shopThemeId,
                    shopSectionId: section.id,
                    productIds: productIds.filter((id) => id !== productId),
                })
                    .unwrap()
                    .then(() => {
                        toast.success("Product removed successfully");
                    })
                    .catch((error) => {
                        toast.error(
                            error.data.message || "Something went wrong"
                        );
                    });
            },
        });
    };

    return (
        <div className="w-full flex flex-col border-2 border-dashed border-slate-300 rounded-lg p-6">
            <WebCustomizationHeader
                title={section.title}
                description="Select at least 6 products (more is better) for better visual impact."
                button={
                    <Button onClick={() => setOpen(true)}>Add Products</Button>
                }
            />

            {section.products.length === 0 ? (
                <WebCustomizationEmptyMessage
                    title="No products added yet"
                    description="Add products to create an engaging homepage experience for your customers."
                />
            ) : (
                <div className="flex flex-wrap mt-6 gap-5">
                    {section.products.map((product) => (
                        <ProductSelectionCard
                            key={product.id}
                            product={product.product}
                            onRemove={handleRemoveProduct}
                        />
                    ))}
                </div>
            )}

            {open && (
                <SelectProductDialog
                    open={open}
                    setOpen={setOpen}
                    shopThemeId={section.shopThemeId}
                    shopSectionId={section.id}
                    productIds={productIds}
                />
            )}
        </div>
    );
};
