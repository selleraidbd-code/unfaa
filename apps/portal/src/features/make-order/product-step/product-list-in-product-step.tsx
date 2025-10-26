import { Plus } from "lucide-react";

import { CustomErrorOrEmpty } from "@/components/ui/custom-error-or-empty";
import { Product } from "@/types/product-type";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { CustomSearch } from "@workspace/ui/components/custom/custom-search";
import { Skeleton } from "@workspace/ui/components/skeleton";

type ProductListInProductStepProps = {
    products: Product[];
    isLoading: boolean;
    onSearch: (value: string) => void;
    addProductToOrder: (product: Product) => void;
};

export const ProductListInProductStep = ({
    products,
    isLoading,
    onSearch,
    addProductToOrder,
}: ProductListInProductStepProps) => {
    return (
        <div className="col-span-5 space-y-4 py-4">
            <h2 className="sub-title">Products</h2>

            <div className="space-y-6">
                <CustomSearch
                    onSearch={onSearch}
                    placeholder="Search products by name or SKU..."
                    className="md:w-full"
                />

                {/* Product list */}
                {isLoading ? (
                    <div className="grid gap-3">
                        {[...Array(10)].map((_, i) => (
                            <Skeleton
                                key={i}
                                className="h-10 w-full rounded-md"
                            />
                        ))}
                    </div>
                ) : products.length > 0 ? (
                    <div className="max-h-[calc(100vh-324px)] overflow-y-auto rounded-md border">
                        <table className="w-full">
                            <thead className="sticky top-0 bg-gray-50">
                                <tr className="border-b">
                                    <th className="px-4 py-3 text-left text-sm font-medium">
                                        Product
                                    </th>

                                    <th className="px-4 py-3 text-right text-sm font-medium">
                                        Stock
                                    </th>
                                    <th className="px-4 py-3 text-right text-sm font-medium">
                                        Action
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {products.map((product) => (
                                    <tr
                                        key={product.id}
                                        className="border-b h-14"
                                    >
                                        <td className="line-clamp-2 py-1 text-sm px-4">
                                            {product.name}
                                        </td>
                                        <td className="text-right text-sm px-4">
                                            <Badge
                                                variant={
                                                    product.stock > 10
                                                        ? "outline"
                                                        : product.stock > 0
                                                          ? "secondary"
                                                          : "destructive"
                                                }
                                            >
                                                {product.stock}
                                            </Badge>
                                        </td>
                                        <td className="text-right text-sm px-4">
                                            <Button
                                                size="sm"
                                                onClick={() =>
                                                    addProductToOrder(product)
                                                }
                                                disabled={product.stock === 0}
                                            >
                                                <Plus className="mr-1 h-4 w-4" />
                                                Add
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <CustomErrorOrEmpty
                        title="No products found"
                        href="/products/create"
                        buttonText="Add Products"
                    />
                )}
            </div>
        </div>
    );
};
