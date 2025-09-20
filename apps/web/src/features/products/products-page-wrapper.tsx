"use client";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@workspace/ui/components/accordion";
import { Checkbox } from "@workspace/ui/components/checkbox";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@workspace/ui/components/select";
import { HomeIcon } from "lucide-react";

import { Brand, Category } from "@/types/shop-type";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@workspace/ui/components/breadcrumb";
import { Button } from "@workspace/ui/components/button";
import { Label } from "@workspace/ui/components/label";
import { Separator } from "@workspace/ui/components/separator";
import { Slider } from "@workspace/ui/components/slider";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

type ProductsPageWrapperProps = {
    totalProducts: number;
    categories?: Category[];
    brands?: Brand[];
    minPrice: number;
    maxPrice: number;
    children: React.ReactNode;
};
export const ProductsPageWrapper = ({
    totalProducts,
    categories = [],
    brands = [],
    minPrice,
    maxPrice,
    children,
}: ProductsPageWrapperProps) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [selectedSort, setSelectedSort] = useState("High to Low");

    const handleSortChange = (sort: string) => {
        setSelectedSort(sort);
    };

    const [priceRange, setPriceRange] = useState<[number, number]>([
        minPrice,
        maxPrice,
    ]);

    const updatePriceRangeInURL = (newRange: [number, number]) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("minPrice", newRange[0].toString());
        params.set("maxPrice", newRange[1].toString());
        console.log("params", params.toString());
        router.push(`?${params.toString()}`, { scroll: false });
    };

    const clearFilters = () => {
        router.push(`/products`, { scroll: false });
    };

    // Check if any filters are active
    const hasActiveFilters = () => {
        const params = new URLSearchParams(searchParams.toString());
        return (
            params.has("minPrice") ||
            params.has("maxPrice") ||
            params.has("category") ||
            params.has("brand") ||
            params.has("search") ||
            params.has("sort")
        );
    };

    useEffect(() => {
        if (minPrice && maxPrice) {
            setPriceRange([minPrice, maxPrice]);
        }
    }, [minPrice, maxPrice]);

    return (
        <div className="container space-y-5 py-6 pb-12">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink
                            href="/"
                            className="flex items-center gap-2"
                        >
                            <HomeIcon className="w-4 h-4" />
                            Home
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Products</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <div className="grid lg:grid-cols-[250px_1fr] gap-10">
                {/* Sidebar */}
                <aside className="max-lg:hidden">
                    <Accordion type="multiple" defaultValue={["category"]}>
                        <AccordionItem value="category" className="space-y-4">
                            <AccordionTrigger className="text-base font-semibold py-1">
                                Category
                            </AccordionTrigger>
                            <AccordionContent className="space-y-4">
                                {categories.map((category) => (
                                    <div
                                        key={category.id}
                                        className="flex items-center space-x-2"
                                    >
                                        <Checkbox
                                            className="border-muted-foreground"
                                            id={category.id}
                                        />
                                        <label
                                            htmlFor={category.id}
                                            className="text-base cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                        >
                                            {category.name}
                                        </label>
                                    </div>
                                ))}
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>

                    <Separator className="my-4 border-muted-foreground" />

                    <Accordion type="multiple" defaultValue={["brand"]}>
                        <AccordionItem value="brand" className="space-y-4">
                            <AccordionTrigger className="text-base font-semibold py-1">
                                Brand
                            </AccordionTrigger>
                            <AccordionContent className="space-y-4">
                                {brands.map((brand) => (
                                    <div
                                        key={brand.id}
                                        className="flex items-center space-x-2"
                                    >
                                        <Checkbox
                                            className="border-muted-foreground"
                                            id={brand.id}
                                        />
                                        <label
                                            htmlFor={brand.id}
                                            className="text-base cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                        >
                                            {brand.name}
                                        </label>
                                    </div>
                                ))}
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>

                    <Separator className="my-4 border-muted-foreground" />

                    <Accordion type="multiple" defaultValue={["price"]}>
                        <AccordionItem value="price" className="space-y-4">
                            <AccordionTrigger className="text-base font-semibold py-1">
                                Price Range
                            </AccordionTrigger>
                            <AccordionContent className="space-y-4">
                                <div className="space-y-4">
                                    <div className="space-y-3">
                                        <Label className="text-sm font-medium">
                                            Price:{" "}
                                            <span>৳ {priceRange[0]}</span> -{" "}
                                            <span>৳ {priceRange[1]}</span>
                                        </Label>
                                        <Slider
                                            value={priceRange}
                                            onValueChange={(value) => {
                                                const newRange = value as [
                                                    number,
                                                    number,
                                                ];
                                                setPriceRange(newRange);
                                                updatePriceRangeInURL(newRange);
                                            }}
                                            min={0}
                                            max={1000}
                                            step={1}
                                            className="w-full"
                                        />
                                    </div>
                                    <div className="flex justify-between text-sm text-muted-foreground">
                                        <span>৳ {0}</span>
                                        <span>৳ {1000}</span>
                                    </div>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>

                    {hasActiveFilters() && (
                        <Button
                            variant="outline"
                            className="w-full"
                            onClick={clearFilters}
                        >
                            Clear Filters
                        </Button>
                    )}
                </aside>

                {/* Main Content */}
                <main className="space-y-4">
                    <div className="flex items-center justify-between">
                        <span>Total Products: {totalProducts}</span>

                        <div className="flex items-center gap-2">
                            <span>Sort By:</span>
                            <Select
                                value={selectedSort}
                                onValueChange={handleSortChange}
                            >
                                <SelectTrigger className="w-40 h-8 text-sm">
                                    <SelectValue placeholder="Sort" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Low to High">
                                        Low to High
                                    </SelectItem>
                                    <SelectItem value="High to Low">
                                        High to Low
                                    </SelectItem>
                                    <SelectItem value="Newest Arrivals">
                                        Newest Arrivals
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {children}
                </main>
            </div>
        </div>
    );
};
