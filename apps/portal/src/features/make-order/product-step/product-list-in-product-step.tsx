import { Plus } from "lucide-react";

import { Product } from "@/types/product-type";
import { CustomErrorOrEmpty } from "@/components/ui/custom-error-or-empty";
import { CustomSearch } from "@workspace/ui/components/custom/custom-search";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";

type ProductListInProductStepProps = {
    products: Product[];
    onSearch: (value: string) => void;
    addProductToOrder: (product: Product) => void;
};

export const ProductListInProductStep = ({
    products,
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
                {products.length > 0 ? (
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
                                    <tr key={product.id} className="border-b">
                                        <td className="line-clamp-2 px-4 py-3 text-sm">
                                            {product.name}
                                        </td>
                                        <td className="px-4 py-3 text-right text-sm">
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
                                        <td className="px-4 py-3 text-right text-sm">
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
                    <CustomErrorOrEmpty description="No products found" />
                )}
            </div>
        </div>
    );
};
