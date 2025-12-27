import { useState } from "react";

import { EditSectionDialog } from "@/features/manage-shop/website-customization/edit-section-dialog";
import { SelectProductDialog } from "@/features/manage-shop/website-customization/select-product-dialog";
import { WebCustomizationEmptyMessage } from "@/features/manage-shop/website-customization/web-customization-empty-message";
import { ProductSelectionCard } from "@/features/products/product-selection-card";
import { AlertType } from "@/providers/AlertProvider";
import {
    useUpdateShopSectionCoreMutation,
    useUpdateShopThemeSectionProductsMutation,
} from "@/redux/api/shop-theme-api";
import { Button } from "@workspace/ui/components/button";
import { Label } from "@workspace/ui/components/label";
import { toast } from "@workspace/ui/components/sonner";
import { Switch } from "@workspace/ui/components/switch";
import { ArrowDown, ArrowUp, Edit, Eye, EyeOff } from "lucide-react";

import { ShopSection } from "@/types/shop-type";
import { useAlert } from "@/hooks/useAlert";

export const ManageSection = ({ section, totalSections }: { section: ShopSection; totalSections: number }) => {
    const { fire } = useAlert();
    const [open, setOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [shouldShow, setShouldShow] = useState(section.shouldShow);
    const productIds = section.products.map((product) => product.product.id);

    const [updateShopThemeSectionProducts] = useUpdateShopThemeSectionProductsMutation();
    const [updateShopSectionCore] = useUpdateShopSectionCoreMutation();

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
                        toast.error(error.data.message || "Something went wrong");
                    });
            },
        });
    };

    const handleToggleVisibility = async (checked: boolean) => {
        fire({
            title: checked ? "Show Section" : "Hide Section",
            description: checked
                ? "Are you sure you want to make this section visible on your website?"
                : "Are you sure you want to hide this section from your website?",
            type: checked ? AlertType.INFO : AlertType.WARNING,
            onConfirm: async () => {
                setShouldShow(checked);
                await updateShopSectionCore({
                    sectionId: section.id,
                    payload: {
                        title: section.title,
                        description: section.description,
                        index: section.index,
                        shouldShow: checked,
                    },
                })
                    .unwrap()
                    .then(() => {
                        toast.success(
                            checked
                                ? "Section is now visible on your website"
                                : "Section is now hidden from your website"
                        );
                    })
                    .catch((error) => {
                        toast.error(error.data?.message || "Something went wrong");
                    });
            },
        });
    };

    const handleMoveSection = async (direction: "up" | "down") => {
        const isUp = direction === "up";
        const canMove = isUp ? section.index !== 0 : section.index < totalSections - 1;

        if (!canMove) return;

        const newIndex = isUp ? section.index - 1 : section.index + 1;
        const successMessage = `Section moved ${direction}`;

        fire({
            title: `Move Section ${direction === "up" ? "Up" : "Down"}`,
            description: `Are you sure you want to move this section ${direction}? This will change the order of sections on your website.`,
            type: AlertType.INFO,
            onConfirm: async () => {
                await updateShopSectionCore({
                    sectionId: section.id,
                    payload: {
                        index: newIndex,
                    },
                })
                    .unwrap()
                    .then(() => {
                        toast.success(successMessage);
                    })
                    .catch((error) => {
                        toast.error(error.data?.message || "Something went wrong");
                    });
            },
        });
    };

    return (
        <div className="flex w-full flex-col gap-2 rounded-sm border-2 border-dashed border-slate-300 p-4 sm:gap-3 sm:p-6 md:rounded-lg dark:border-slate-700">
            <div className="flex items-start justify-between gap-1 max-sm:flex-col">
                <div className="flex-1">
                    <h3 className="mb-1 text-lg font-semibold">{section.title}</h3>
                    <p className="text-muted-foreground text-sm">{section.description}</p>
                </div>
                <div className="flex items-center gap-2 max-sm:justify-between sm:gap-3">
                    <div className="flex items-center rounded-md border p-1 sm:gap-1">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 max-sm:h-7 max-sm:w-7"
                            onClick={() => handleMoveSection("up")}
                            disabled={section.index === 0}
                            title="Move section up"
                        >
                            <ArrowUp className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 max-sm:h-7 max-sm:w-7"
                            onClick={() => handleMoveSection("down")}
                            disabled={section.index === totalSections - 1}
                            title="Move section down"
                        >
                            <ArrowDown className="h-4 w-4" />
                        </Button>
                    </div>
                    <div className="flex items-center gap-2">
                        <Label
                            htmlFor={`section-visibility-${section.id}`}
                            className="flex cursor-pointer items-center gap-1.5 text-sm max-sm:hidden"
                        >
                            {shouldShow ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                            {shouldShow ? "Visible" : "Hidden"}
                        </Label>
                        <Switch
                            id={`section-visibility-${section.id}`}
                            checked={shouldShow}
                            onCheckedChange={handleToggleVisibility}
                        />
                    </div>
                    <Button variant="outline" size="sm" onClick={() => setEditOpen(true)} className="gap-2">
                        <Edit className="h-4 w-4" />
                        Edit
                    </Button>
                    <Button onClick={() => setOpen(true)}>Add Products</Button>
                </div>
            </div>

            {section.products.length === 0 ? (
                <WebCustomizationEmptyMessage
                    title="No products added yet"
                    description="Add products to create an engaging homepage experience for your customers."
                />
            ) : (
                <div className="mt-2 flex flex-wrap gap-2 sm:gap-3 lg:gap-5">
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

            {editOpen && <EditSectionDialog open={editOpen} setOpen={setEditOpen} section={section} />}
        </div>
    );
};
