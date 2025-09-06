import { SelectProductDialog } from "@/features/manage-shop/website-customization/select-product-dialog";
import { WebCustomizationEmptyMessage } from "@/features/manage-shop/website-customization/web-customization-empty-message";
import { WebCustomizationHeader } from "@/features/manage-shop/website-customization/web-customization-header";
import { useAlert } from "@/hooks/useAlert";
import { AlertType } from "@/providers/AlertProvider";
import { useUpdateShopThemeSectionProductsMutation } from "@/redux/api/shop-theme-api";
import { Product } from "@/types/product-type";
import { ShopSection } from "@/types/shop-type";
import { cn } from "@workspace/ui/lib/utils";
import { Button } from "@workspace/ui/components/button";
import { X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";

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
                        <SectionProductCard
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

export const SectionProductCard = ({
    product,
    onRemove,
    isSelected,
    onSelect,
}: {
    product: Product;
    onRemove?: (productId: string) => void;
    isSelected?: boolean;
    onSelect?: (productId: string) => void;
}) => {
    return (
        <div
            className={cn(
                "space-y-2 w-64 border rounded-md p-2 sm:p-4 relative",
                isSelected && "border-2 border-primary"
            )}
            onClick={() => onSelect?.(product.id)}
        >
            {onRemove && (
                <button
                    className="absolute -top-2.5 -right-2.5 bg-primary text-primary-foreground rounded-full p-1.5"
                    onClick={() => onRemove?.(product.id)}
                >
                    <X className="size-6" />
                </button>
            )}
            <Image
                src={"/placeholder.jpg"}
                alt={product.name}
                width={300}
                height={300}
                className="size-56"
            />
            <p className="text-sm font-medium text-center">{product.name}</p>
        </div>
    );
};
