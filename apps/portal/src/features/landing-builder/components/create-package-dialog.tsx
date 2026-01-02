"use client";

import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";

import { ProductSelectionDialog } from "@/features/landing-builder/components/product-selection-dialog";
import { useCreatePackageMutation } from "@/redux/api/package-api";
import { Button } from "@workspace/ui/components/button";
import { CustomInput } from "@workspace/ui/components/custom/custom-input";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@workspace/ui/components/dialog";
import { toast } from "@workspace/ui/components/sonner";
import { Package as PackageIcon, Plus, Trash2 } from "lucide-react";

import { CreatePackagePayload, PackageProduct } from "@/types/package-type";
import { Product } from "@/types/product-type";
import { CustomButton } from "@/components/ui/custom-button";
import { FileUpload } from "@/components/file-upload";

type PackageProductWithDetails = PackageProduct & {
    product?: Product;
};

type CreatePackageDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    shopId: string;
    productId: string;
    onSuccess?: () => void;
};

// Memoized product item component to prevent unnecessary re-renders
type ProductItemProps = {
    pkgProduct: PackageProductWithDetails;
    onUpdateQuantity: (productId: string, quantity: number) => void;
    onSelectVariant: (productId: string, variantId: string, optionId: string) => void;
    onRemove: (productId: string) => void;
};

const ProductItem = memo(({ pkgProduct, onUpdateQuantity, onSelectVariant, onRemove }: ProductItemProps) => {
    const product = pkgProduct.product;
    if (!product) return null;

    // Create a map for faster variant option lookups
    const selectedVariantMap = useMemo(() => {
        const map = new Map<string, string>();
        pkgProduct.variants.forEach((v) => map.set(v.productVariantId, v.productVariantOptionId));
        return map;
    }, [pkgProduct.variants]);

    return (
        <div className="rounded-lg border p-4">
            <div className="flex items-start justify-between">
                <div className="flex flex-1 gap-4">
                    <div className="bg-muted relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md">
                        <Image
                            src={product.photoURL || "/placeholder.jpg"}
                            alt={product.name}
                            fill
                            className="object-cover"
                            sizes="80px"
                        />
                    </div>
                    <div className="flex-1">
                        <h4 className="font-medium">{product.name}</h4>
                        <div className="mt-2 space-y-2">
                            <div className="flex items-center gap-2">
                                <label className="text-sm">Quantity:</label>
                                <div className="flex items-center gap-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => onUpdateQuantity(pkgProduct.productId, pkgProduct.quantity - 1)}
                                    >
                                        -
                                    </Button>
                                    <span className="w-12 text-center text-sm">{pkgProduct.quantity}</span>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => onUpdateQuantity(pkgProduct.productId, pkgProduct.quantity + 1)}
                                    >
                                        +
                                    </Button>
                                </div>
                            </div>

                            {product.productVariant.length > 0 && (
                                <div className="space-y-2">
                                    {product.productVariant.map((variant) => {
                                        const selectedOptionId = selectedVariantMap.get(variant.id);

                                        return (
                                            <div key={variant.id}>
                                                <label className="text-sm font-medium">
                                                    {variant.name}
                                                    {variant.isRequired && <span className="text-destructive"> *</span>}
                                                </label>
                                                <div className="mt-1 flex flex-wrap gap-2">
                                                    {variant.options.map((option, optionIndex) => {
                                                        const optionId = option.id || `option-${optionIndex}`;
                                                        const isSelected =
                                                            String(optionId) === String(selectedOptionId);
                                                        return (
                                                            <Button
                                                                key={optionId}
                                                                type="button"
                                                                size="sm"
                                                                variant={isSelected ? "default" : "outline"}
                                                                onClick={() =>
                                                                    onSelectVariant(
                                                                        pkgProduct.productId,
                                                                        variant.id,
                                                                        optionId
                                                                    )
                                                                }
                                                            >
                                                                {option.name}
                                                            </Button>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemove(pkgProduct.productId)}
                    className="text-destructive hover:text-destructive"
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
});

ProductItem.displayName = "ProductItem";

export const CreatePackageDialog = ({ open, onOpenChange, shopId, productId, onSuccess }: CreatePackageDialogProps) => {
    const [packageTitle, setPackageTitle] = useState("");
    const [packageImg, setPackageImg] = useState("");
    const [codAmount, setCodAmount] = useState<number>(0);
    const [saveAmount, setSaveAmount] = useState<number>(0);
    const [selectedProducts, setSelectedProducts] = useState<PackageProductWithDetails[]>([]);
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);

    const [createPackage, { isLoading: isCreating }] = useCreatePackageMutation();

    // Create variant lookup maps for faster price calculations
    const productVariantMaps = useMemo(() => {
        const maps = new Map<string, Map<string, Map<string, number>>>();
        selectedProducts.forEach((pkgProduct) => {
            const product = pkgProduct.product;
            if (!product) return;

            const variantMap = new Map<string, Map<string, number>>();
            product.productVariant.forEach((variant) => {
                const optionMap = new Map<string, number>();
                variant.options.forEach((option) => {
                    optionMap.set(String(option.id), Number(option?.extraPrice ?? 0) || 0);
                });
                variantMap.set(variant.id, optionMap);
            });
            maps.set(pkgProduct.productId, variantMap);
        });
        return maps;
    }, [selectedProducts]);

    // Calculate total regular price (optimized with maps)
    const calculateTotalRegularPrice = useMemo(() => {
        return selectedProducts.reduce((total, pkgProduct) => {
            const product = pkgProduct.product;
            if (!product) return total;

            // Get base price (use discountPrice if available, otherwise price)
            const basePrice = Number(product.discountPrice ?? product.price ?? 0);

            // Calculate variant extra prices using pre-built maps
            const variantMap = productVariantMaps.get(pkgProduct.productId);
            let variantExtraPrice = 0;
            if (variantMap) {
                variantExtraPrice = pkgProduct.variants.reduce((sum, variant) => {
                    const optionMap = variantMap.get(variant.productVariantId);
                    if (!optionMap) return sum;
                    return sum + (optionMap.get(String(variant.productVariantOptionId)) || 0);
                }, 0);
            }

            // Unit price = base price + variant extras
            const unitPrice = basePrice + variantExtraPrice;

            // Total for this product = unit price * quantity
            return total + unitPrice * pkgProduct.quantity;
        }, 0);
    }, [selectedProducts, productVariantMaps]);

    // Track previous regular total to detect changes
    const prevRegularTotalRef = useRef<number>(0);
    const isManualCodUpdateRef = useRef<boolean>(false);

    // Auto-calculate COD and Save amounts when products change (fixed circular dependency)
    useEffect(() => {
        const regularTotal = calculateTotalRegularPrice;

        // If this is the first calculation or regular total changed significantly, auto-update COD
        if (prevRegularTotalRef.current === 0 || Math.abs(prevRegularTotalRef.current - regularTotal) > 0.01) {
            // Only auto-update COD if it's currently 0 or matches the previous regular total (and not manually set)
            if (
                !isManualCodUpdateRef.current &&
                (codAmount === 0 || Math.abs(codAmount - prevRegularTotalRef.current) < 0.01)
            ) {
                setCodAmount(regularTotal);
            }
            prevRegularTotalRef.current = regularTotal;
        }
    }, [calculateTotalRegularPrice]); // Removed codAmount from dependencies to prevent circular updates

    // Recalculate save amount whenever COD or regular total changes
    useEffect(() => {
        const calculatedSaveAmount = Math.max(0, calculateTotalRegularPrice - codAmount);
        setSaveAmount(calculatedSaveAmount);
    }, [calculateTotalRegularPrice, codAmount]);

    const handleAddProduct = useCallback((product: Product) => {
        setSelectedProducts((prev) => {
            const newPackageProduct: PackageProductWithDetails = {
                productId: product.id,
                quantity: 1,
                variants: [],
                product,
            };
            return [...prev, newPackageProduct];
        });
        setIsProductModalOpen(false);
    }, []);

    const handleRemoveProduct = useCallback((productId: string) => {
        setSelectedProducts((prev) => prev.filter((p) => p.productId !== productId));
    }, []);

    const handleUpdateQuantity = useCallback((productId: string, quantity: number) => {
        setSelectedProducts((prev) =>
            prev.map((p) => (p.productId === productId ? { ...p, quantity: Math.max(1, quantity) } : p))
        );
    }, []);

    const handleSelectVariant = useCallback((productId: string, variantId: string, optionId: string) => {
        setSelectedProducts((prev) =>
            prev.map((p) => {
                if (p.productId !== productId) return p;

                const existingVariantIndex = p.variants.findIndex((v) => v.productVariantId === variantId);

                const newVariant = {
                    productVariantId: variantId,
                    productVariantOptionId: optionId,
                };

                if (existingVariantIndex >= 0) {
                    // Update existing variant
                    const updatedVariants = [...p.variants];
                    updatedVariants[existingVariantIndex] = newVariant;
                    return { ...p, variants: updatedVariants };
                } else {
                    // Add new variant
                    return { ...p, variants: [...p.variants, newVariant] };
                }
            })
        );
    }, []);

    const handleCreatePackage = useCallback(async () => {
        if (!packageTitle.trim()) {
            toast.error("Please enter a package title");
            return;
        }

        if (!packageImg.trim()) {
            toast.error("Please select a package image");
            return;
        }

        if (selectedProducts.length === 0) {
            toast.error("Please add at least one product to the package");
            return;
        }

        // Validate required variants
        for (const pkgProduct of selectedProducts) {
            const product = pkgProduct.product;
            if (product) {
                const requiredVariants = product.productVariant.filter((v) => v.isRequired);
                const selectedVariantIds = new Set(pkgProduct.variants.map((v) => v.productVariantId));
                const missingRequired = requiredVariants.some((v) => !selectedVariantIds.has(v.id));

                if (missingRequired) {
                    toast.error(`Please select all required variants for ${product.name}`);
                    return;
                }
            }
        }

        const payload: CreatePackagePayload = {
            title: packageTitle,
            img: packageImg,
            codAmount,
            saveAmount,
            shopId,
            productId,
            packageProducts: selectedProducts.map((p) => ({
                productId: p.productId,
                quantity: p.quantity,
                variants: p.variants,
            })),
        };

        await createPackage(payload)
            .unwrap()
            .then(() => {
                toast.success("Package created successfully");
                onOpenChange(false);
                resetForm();
                onSuccess?.();
            })
            .catch((err) => {
                toast.error(err?.data?.message || "Failed to create package");
            });
    }, [
        packageTitle,
        packageImg,
        selectedProducts,
        codAmount,
        saveAmount,
        shopId,
        productId,
        createPackage,
        onOpenChange,
        onSuccess,
    ]);

    const resetForm = useCallback(() => {
        setPackageTitle("");
        setPackageImg("");
        setCodAmount(0);
        setSaveAmount(0);
        setSelectedProducts([]);
        prevRegularTotalRef.current = 0;
        isManualCodUpdateRef.current = false;
    }, []);

    const handleClose = useCallback(
        (open: boolean) => {
            onOpenChange(open);
            if (!open) {
                resetForm();
            }
        },
        [onOpenChange, resetForm]
    );

    // Memoize excludeProductIds to prevent unnecessary recalculations
    const excludeProductIds = useMemo(() => selectedProducts.map((p) => p.productId), [selectedProducts]);

    return (
        <>
            <Dialog open={open} onOpenChange={handleClose}>
                <DialogContent className="flex max-h-[90vh] flex-col overflow-y-auto lg:max-w-3xl">
                    <DialogHeader>
                        <DialogTitle>Create Package</DialogTitle>
                        <DialogDescription>
                            Create a new product package with multiple products and variants
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-6">
                        <CustomInput
                            label="Package Title"
                            placeholder="e.g., Summer Sale Package"
                            value={packageTitle}
                            onChange={(value) => setPackageTitle(String(value))}
                            required
                        />

                        <FileUpload
                            label="Package Image"
                            limit={1}
                            initialFiles={packageImg ? [packageImg] : []}
                            onFilesSelected={(files) => {
                                if (files.length > 0) {
                                    setPackageImg(files[0]?.url || "");
                                } else {
                                    setPackageImg("");
                                }
                            }}
                        />

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-medium">Package Products</h3>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setIsProductModalOpen(true)}
                                >
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Product
                                </Button>
                            </div>

                            {selectedProducts.length === 0 ? (
                                <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 text-center">
                                    <PackageIcon className="text-muted-foreground mb-2 h-8 w-8" />
                                    <p className="text-muted-foreground text-sm">
                                        No products added yet. Click "Add Product" to get started.
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {selectedProducts.map((pkgProduct) => (
                                        <ProductItem
                                            key={pkgProduct.productId}
                                            pkgProduct={pkgProduct}
                                            onUpdateQuantity={handleUpdateQuantity}
                                            onSelectVariant={handleSelectVariant}
                                            onRemove={handleRemoveProduct}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="space-y-4">
                            <div className="bg-muted/50 rounded-lg border p-4">
                                <div className="mb-2 flex items-center justify-between">
                                    <span className="text-sm font-medium">Regular Total:</span>
                                    <span className="text-sm font-semibold">
                                        {calculateTotalRegularPrice.toLocaleString()} ৳
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">Save Amount:</span>
                                    <span className="text-sm font-semibold text-green-600">
                                        {saveAmount.toLocaleString()} ৳
                                    </span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <CustomInput
                                    label="COD Amount"
                                    placeholder="0"
                                    type="number"
                                    value={codAmount}
                                    onChange={(value) => {
                                        const newCodAmount = Number(value) || 0;
                                        isManualCodUpdateRef.current = true;
                                        setCodAmount(newCodAmount);
                                        // Recalculate save amount when COD changes
                                        const calculatedSaveAmount = Math.max(
                                            0,
                                            calculateTotalRegularPrice - newCodAmount
                                        );
                                        setSaveAmount(calculatedSaveAmount);
                                    }}
                                />
                                <CustomInput
                                    label="Save Amount"
                                    placeholder="0"
                                    type="number"
                                    value={saveAmount}
                                    onChange={(value) => {
                                        const newSaveAmount = Number(value) || 0;
                                        setSaveAmount(newSaveAmount);
                                        // Recalculate COD amount when save amount changes
                                        const calculatedCodAmount = Math.max(
                                            0,
                                            calculateTotalRegularPrice - newSaveAmount
                                        );
                                        isManualCodUpdateRef.current = true;
                                        setCodAmount(calculatedCodAmount);
                                    }}
                                    disabled={false}
                                />
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <CustomButton variant="outline" onClick={() => handleClose(false)}>
                            Cancel
                        </CustomButton>
                        <CustomButton onClick={handleCreatePackage} disabled={isCreating}>
                            {isCreating ? "Creating..." : "Create Package"}
                        </CustomButton>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Product Selection Dialog */}
            <ProductSelectionDialog
                open={isProductModalOpen}
                onOpenChange={setIsProductModalOpen}
                shopId={shopId}
                title="Select Product"
                description="Choose a product to add to the package"
                onSelect={handleAddProduct}
                excludeProductIds={excludeProductIds}
            />
        </>
    );
};
