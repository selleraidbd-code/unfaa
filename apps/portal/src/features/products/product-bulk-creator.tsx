"use client";

import { useState } from "react";

import productsData from "@/assets/products.json";
import { useCreateProductMutation, useDeleteProductMutation, useGetProductsQuery } from "@/redux/api/product-api";
import { useAppSelector } from "@/redux/store/hook";
import { Button } from "@workspace/ui/components/button";
import { toast } from "@workspace/ui/components/sonner";

import { ProductCeratePayload } from "@/types/product-type";

interface ProductJsonData {
    name: string;
    slug: string;
    price: number;
    compareAtPrice: number;
    cost: number;
    sku: string;
    stock: number;
    activeStatus: "active" | "inactive";
    categoryId: string;
    shopId: string;
    thumbnailImg: string;
    coverImg: string;
    images: string[];
    deliveryIds: string[];
    description: string;
    fullDescription: string;
    variants: Array<{ name: string; values: string[] }>;
}

export const ProductBulkCreator = () => {
    const user = useAppSelector((state) => state.auth.user);
    const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
    const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();
    const { data: productsDataResponse, refetch: refetchProducts } = useGetProductsQuery(
        {
            shopSlug: user?.shop.slug || "",
            limit: 1000,
            page: 1,
        },
        { skip: !user?.shop.slug }
    );
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isProcessing, setIsProcessing] = useState(false);
    const [deleteIndex, setDeleteIndex] = useState(0);
    const [isDeletingProducts, setIsDeletingProducts] = useState(false);
    const [totalProductsToDelete, setTotalProductsToDelete] = useState(0);

    const transformProductData = (product: ProductJsonData): ProductCeratePayload => {
        // Transform variants from JSON format to API format
        const productVariant = product.variants.map((variant) => ({
            name: variant.name,
            isRequired: true,
            productVariantOptions: variant.values.map((value) => ({
                name: value,
            })),
        }));

        // Prepare images array - include coverImg if different from thumbnail
        const images = product.images || [];
        if (product.coverImg && product.coverImg !== product.thumbnailImg) {
            images.push(product.coverImg);
        }

        return {
            name: product.name,
            banglaName: product.name, // Using same name as banglaName
            description: product.description || "",
            fullDescription: product.fullDescription || "",
            price: product.compareAtPrice || undefined, // Regular price
            discountPrice: product.price || undefined, // Current/discount price
            photoURL: product.thumbnailImg || "",
            images: images,
            keywords: product.name, // Using product name as keywords
            stock: product.stock,
            activeStatus: product.activeStatus,
            shopId: product.shopId,
            categoryIds: [product.categoryId],
            productVariant: productVariant,
            sku: product.sku,
            deliveryId: product.deliveryIds?.[0] || undefined,
        };
    };

    const handleCreateProducts = async () => {
        setIsProcessing(true);
        setCurrentIndex(0);
        let successCount = 0;

        for (let i = 0; i < productsData.length; i++) {
            try {
                const product = productsData[i] as ProductJsonData;
                const payload = transformProductData(product);

                setCurrentIndex(i + 1);
                await createProduct(payload).unwrap();

                successCount++;
                toast.success(`Product ${i + 1}/${productsData.length} created: ${product.name}`);
            } catch (error) {
                const productName = productsData[i]?.name || "Unknown";
                toast.error(`Failed to create product ${i + 1}: ${productName}`);
                console.error(`Error creating product ${i + 1}:`, error);
            }
        }

        setIsProcessing(false);
        toast.success(`All products processed! Successfully created ${successCount}/${productsData.length} products.`);
        setCurrentIndex(0);
    };

    const handleDeleteAllProducts = async () => {
        if (!user?.shop.slug) {
            toast.error("Shop information not available");
            return;
        }

        setIsDeletingProducts(true);
        setDeleteIndex(0);

        try {
            // Fetch all products with a high limit
            const { data: productsResponse } = await refetchProducts();

            const products = productsResponse?.data || [];
            let successCount = 0;

            if (products.length === 0) {
                toast.info("No products found to delete");
                setIsDeletingProducts(false);
                return;
            }

            setTotalProductsToDelete(products.length);

            for (let i = 0; i < products.length; i++) {
                const product = products[i];
                if (!product) continue;

                try {
                    setDeleteIndex(i + 1);
                    await deleteProduct({ id: product.id }).unwrap();

                    successCount++;
                    toast.success(`Product ${i + 1}/${products.length} deleted: ${product.name}`);
                } catch (error) {
                    const productName = product.name || "Unknown";
                    toast.error(`Failed to delete product ${i + 1}: ${productName}`);
                    console.error(`Error deleting product ${i + 1}:`, error);
                }
            }

            setIsDeletingProducts(false);
            toast.success(`All products processed! Successfully deleted ${successCount}/${products.length} products.`);
            setDeleteIndex(0);
        } catch (error) {
            setIsDeletingProducts(false);
            toast.error("Failed to fetch products for deletion");
            console.error("Error fetching products:", error);
        }
    };

    return (
        <div className="p-6">
            <h1 className="mb-4 text-2xl font-bold">Product Bulk Creator</h1>
            <div className="space-y-4">
                <p className="text-muted-foreground">
                    Click the button below to create all products from the JSON file one by one.
                </p>
                {isProcessing && (
                    <p className="text-muted-foreground text-sm">
                        Processing: {currentIndex}/{productsData.length} products
                    </p>
                )}
                <div className="flex gap-4">
                    <Button
                        onClick={handleCreateProducts}
                        disabled={isCreating || isProcessing || isDeletingProducts}
                        variant="default"
                    >
                        {isProcessing
                            ? `Creating Products... (${currentIndex}/${productsData.length})`
                            : `Create All Products (${productsData.length})`}
                    </Button>
                    <Button
                        onClick={handleDeleteAllProducts}
                        disabled={isDeleting || isDeletingProducts || isProcessing}
                        variant="destructive"
                    >
                        {isDeletingProducts
                            ? `Deleting Products... (${deleteIndex}/${totalProductsToDelete})`
                            : `Delete All Products${productsDataResponse?.data?.length ? ` (${productsDataResponse.data.length})` : ""}`}
                    </Button>
                </div>
            </div>
        </div>
    );
};
