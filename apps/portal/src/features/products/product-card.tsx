"use client";

import { ProductViewDialog } from "@/features/products/product-view-dialog";
import { Product, ProductActiveStatus } from "@/types/product-type";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { Edit, Trash2, Eye } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface Props {
    product: Product;
    onDelete: (id: string) => void;
}

export const ProductCard = ({ product, onDelete }: Props) => {
    const router = useRouter();
    const [viewDialogOpen, setViewDialogOpen] = useState(false);

    const displayPrice = product.discountPrice || product.price;
    const hasDiscount =
        product.discountPrice && product.discountPrice < (product.price || 0);

    return (
        <>
            <div className="overflow-hidden rounded-lg border bg-card text-card-foreground hover:shadow-md transition-shadow">
                <div className="relative aspect-square w-full overflow-hidden bg-gray-100">
                    <Image
                        src={product.photoURL}
                        alt={product.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <div className="absolute top-1.5 right-1.5">
                        <Badge
                            variant={
                                product.activeStatus ===
                                ProductActiveStatus.ACTIVE
                                    ? "default"
                                    : "destructive"
                            }
                            className="text-xs"
                        >
                            {product.activeStatus === ProductActiveStatus.ACTIVE
                                ? "Active"
                                : "Inactive"}
                        </Badge>
                    </div>
                </div>

                <div className="p-3 space-y-2">
                    <h3 className="font-semibold text-sm line-clamp-1">
                        {product.banglaName || product.name}
                    </h3>

                    <div className="flex items-center justify-between">
                        <div className="flex items-baseline gap-1.5">
                            <span className="text-base font-bold">
                                ৳{displayPrice?.toLocaleString() || "N/A"}
                            </span>
                            {hasDiscount && (
                                <span className="text-xs text-muted-foreground line-through">
                                    ৳{product.price?.toLocaleString()}
                                </span>
                            )}
                        </div>

                        <Badge
                            variant={
                                product.stock < 10 ? "destructive" : "secondary"
                            }
                            className="text-xs"
                        >
                            Stock: {product.stock}
                        </Badge>
                    </div>

                    <div className="flex gap-1.5 items-center">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setViewDialogOpen(true)}
                        >
                            <Eye className="size-3.5" />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() =>
                                router.push(`/products/${product.id}`)
                            }
                        >
                            <Edit className="size-3.5" />
                        </Button>
                        <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => onDelete(product.id)}
                        >
                            <Trash2 className="size-3.5" />
                        </Button>
                    </div>
                </div>
            </div>

            <ProductViewDialog
                product={product}
                open={viewDialogOpen}
                onOpenChange={setViewDialogOpen}
            />
        </>
    );
};
